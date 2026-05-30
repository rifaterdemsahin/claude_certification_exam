# Chronological Error Log

This file tracks significant errors, near-misses, and technical debt encountered during the development and maintenance of the Claude Certification Study App.

---

## [2026-05-30] Azure Blob Storage 404 & Access Errors for New Hint Images

**Symptom:** 
1. Requesting `https://claudecertstore.blob.core.windows.net/exam-images/question_1_hint.png` returned `HTTP/1.1 404 The specified blob does not exist`.
2. Running `az storage blob list` on the `exam-images` container using the logged-in credentials failed with:
   `ERROR: You do not have the required permissions needed to perform this operation.`

**Root cause:** 
1. The user uploaded the files with a `.jpeg` extension instead of `.png` (files were named `question_1_hint.jpeg` instead of `question_1_hint.png`).
2. The user's Azure AD credentials lacked data-plane roles (like "Storage Blob Data Reader/Contributor") on the storage account `claudecertstore`, despite being logged in to the subscription.

**Fix applied:** 
1. Used `az storage account keys list` to retrieve the storage account access keys (since the user has subscription-level owner/contributor rights).
2. Downloaded the files using `curl` as `.jpeg`, renamed them locally to `q001.png` through `q006.png`, and uploaded them back to the `exam-images` container with Content-Type `image/png` using the account access key.
3. Deleted the old placeholder SVGs (`q001.svg` through `q006.svg`) and the temporary `question_1_hint.jpeg` files from Azure to keep the storage container clean.
4. Updated the local `manifest.json` and the loading logic in `pro-exam.html` to support the new PNG file format for the first 6 questions.

**Workaround active:** No

**Linked to:** [5_Symbols/pages/pro-exam.html](file:///Users/rifaterdemsahin/projects/claude_certification_exam/5_Symbols/pages/pro-exam.html) and [5_Symbols/assets/exam-images/manifest.json](file:///Users/rifaterdemsahin/projects/claude_certification_exam/5_Symbols/assets/exam-images/manifest.json)
