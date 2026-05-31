# 🔊 Kokoro TTS — Local Docker Setup

Kokoro FastAPI runs locally in Docker and exposes an OpenAI-compatible `/v1/audio/speech` endpoint. Audio files are generated locally, uploaded to Azure Blob Storage (`memory-audio` container), and referenced by `data.js` so `remember.html` can stream them.

---

## 🐳 Docker

```bash
# Pull and run (CPU build — no GPU required)
docker run -d \
  --name kokoro-tts \
  -p 8880:8880 \
  ghcr.io/remsky/kokoro-fastapi-cpu:latest

# Check it is ready
curl http://localhost:8880/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"model":"kokoro","input":"Hello","voice":"af_heart","response_format":"mp3"}' \
  --output test.mp3

# Stop / remove
docker stop kokoro-tts && docker rm kokoro-tts
```

---

## 🎙️ API Reference

| Field | Value |
|-------|-------|
| URL | `http://localhost:8880/v1/audio/speech` |
| Method | `POST` |
| Content-Type | `application/json` |
| `model` | `kokoro` |
| `voice` | `af_heart` (warm female) — alternatives: `af_sky`, `am_adam`, `bf_emma` |
| `response_format` | `mp3` |
| `speed` | `0.9` (slightly slower is better for study) |

---

## 📦 Azure Blob Container

| Container | Naming | Access |
|-----------|--------|--------|
| `memory-audio` | `AUD-Q{padId}.mp3` (e.g. `AUD-Q001.mp3`) | Public Read |

Create container (one-time):
```bash
az storage container create \
  --name memory-audio \
  --account-name claudecertstore \
  --public-access blob
```

---

## 🚀 Generate & Upload All Audio

```bash
# Prerequisites
pip install azure-storage-blob requests

# Set connection string
export AZURE_STORAGE_CONNECTION_STRING='<your-connection-string>'

# Run the generator
cd 5_Symbols/scripts
python generate_audio.py
```

The script:
1. Verifies the Kokoro container is reachable on port 8880
2. Reads all 100 questions from `5_Symbols/data/questions.json`
3. Generates `AUD-Q{padId}.mp3` for each (skips if already uploaded)
4. Uploads to the `memory-audio` container with `audio/mpeg` content-type
5. Writes updated `audioUrl` values back to `questions.json`

---

## 🔗 Audio URL Pattern

```
https://claudecertstore.blob.core.windows.net/memory-audio/AUD-Q{padId}.mp3
```

This is also baked into `data.js` so the play button appears immediately in `remember.html` even before `questions.json` is re-synced.
