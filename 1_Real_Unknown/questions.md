# ❓ Open Questions

These are the primary architectural, content-related, and technical questions guiding our implementation.

---

## 🏗️ Architectural Questions
* **Q1: Cookie Storage Limits**
  * *Question:* Standard browser cookies have a size limit of 4KB. If we store question IDs, mastery status, and notes, will we exceed this limit for 100 questions?
  * *Investigation:* We store progress as a minimal JSON string containing only mastered question IDs (e.g., `{"1":1,"2":1}`). We need to measure if this scales comfortably under 4KB (approximately 1,000 characters).
* **Q2: Offline Capability**
  * *Question:* Can we achieve true offline capability (Progressive Web App / Service Worker) within the single-file React architecture without introducing build tools?
  * *Investigation:* Researching CDN-served Service Worker registrations or inline base64 assets.

---

## 📚 Content-Related Questions
* **Q3: Syllabus Weighting Alignment**
  * *Question:* Does our 100-question database precisely reflect the official weights specified in the Claude Developer Certification guide?
  * *Investigation:* Conduct periodic reviews of `5_Symbols/data/exam.json` to verify the item count per category matches target percentages.
* **Q4: Spaced Repetition Mappings**
  * *Question:* How can we best map card-to-card relationships inside the mindmap to guide a candidate's review flow (i.e. if a candidate fails Q28, which related concepts should they be prompted to read first)?

---

## 🛠️ Technical Questions
* **Q5: JSDOM Cookie Testing**
  * *Question:* How do we test cookie-based progress saving in a Node.js testing environment (JSDOM) without a running server?
  * *Resolution:* Resolved by configuring the JSDOM instance with `url: "http://localhost/"` to bypass browser security blocks on file URLs.
* **Q6: Azure API Fallbacks**
  * *Question:* What happens to the memory card features if the Azure Function App API is unreachable or rate-limited?
  * *Investigation:* Design local storage/local JSON caches to gracefully degrade to local questions if the Azure Blob Storage fetch fails.
