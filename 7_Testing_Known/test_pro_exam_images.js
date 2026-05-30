const fs = require('fs');
const path = require('path');

console.log("=== Running Pro Exam Image File Verification Tests ===");

try {
    const manifestPath = path.join(__dirname, '..', '5_Symbols', 'assets', 'exam-images', 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    console.log("Test 1: Verifying manifest structure...");
    if (!manifest.images || !Array.isArray(manifest.images)) {
        throw new Error("manifest.json must contain an images array");
    }
    console.log("✓ PASS: manifest.json has valid structure.");

    console.log("Test 2: Verifying image filenames and URLs in manifest...");
    manifest.images.forEach(img => {
        const qNum = img.questionNumber;
        const ext = qNum <= 17 ? 'png' : 'svg';
        
        // Verify filename
        const expectedFilename = `q${String(qNum).padStart(3, '0')}.${ext}`;
        if (img.filename !== expectedFilename) {
            throw new Error(`Question ${qNum}: Expected filename "${expectedFilename}", found "${img.filename}"`);
        }

        // Verify Azure URL
        const expectedUrl = `https://claudecertstore.blob.core.windows.net/exam-images/${expectedFilename}`;
        if (img.azureUrl !== expectedUrl) {
            throw new Error(`Question ${qNum}: Expected azureUrl "${expectedUrl}", found "${img.azureUrl}"`);
        }
    });
    console.log("✓ PASS: Filenames and Azure URLs match expected types (.png for 1-17, .svg for others).");

    console.log("Test 3: Checking that files exist on local disk...");
    for (let i = 1; i <= 17; i++) {
        const filePath = path.join(__dirname, '..', '5_Symbols', 'assets', 'exam-images', `q${String(i).padStart(3, '0')}.png`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Local file not found: ${filePath}`);
        }
    }
    console.log("✓ PASS: Local PNG files for questions 1 to 17 exist on disk.");

    console.log("\n--- All Pro Exam Image Tests Passed Successfully! ---");
    process.exit(0);

} catch (error) {
    console.error("\n✗ TEST FAILURE:", error.message);
    process.exit(1);
}
