# 🔊 Kokoro TTS — Environment Setup

Kokoro FastAPI runs locally in Docker on port 8880, exposing an OpenAI-compatible `/v1/audio/speech` endpoint. No GPU required — the CPU build is used.

---

## 🐳 Docker Image

```
ghcr.io/remsky/kokoro-fastapi-cpu:latest
```

---

## Start / Stop

```bash
# Start (detached, persists across terminal sessions)
docker run -d \
  --name kokoro-tts \
  --restart unless-stopped \
  -p 8880:8880 \
  ghcr.io/remsky/kokoro-fastapi-cpu:latest

# Check it is ready
curl http://localhost:8880/v1/models

# Verify with a test audio file
curl -s -X POST http://localhost:8880/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"model":"kokoro","input":"Hello, this is a test.","voice":"af_heart","response_format":"mp3","speed":0.9}' \
  --output /tmp/test.mp3 && open /tmp/test.mp3

# Stop
docker stop kokoro-tts

# Remove
docker rm kokoro-tts
```

---

## API Reference

| Field | Value | Notes |
|-------|-------|-------|
| Endpoint | `http://localhost:8880/v1/audio/speech` | OpenAI-compatible |
| Method | `POST` | |
| `model` | `kokoro` | Only value supported |
| `voice` | `af_heart` | Warm female — used for study cards |
| `response_format` | `mp3` | Also supports `wav`, `ogg` |
| `speed` | `0.9` | Slightly slower aids retention |

### Available Voices

| Voice ID | Style |
|----------|-------|
| `af_heart` | Warm female (default — used for this project) |
| `af_sky` | Bright female |
| `am_adam` | Male |
| `bf_emma` | British female |

---

## Health Check

```bash
curl http://localhost:8880/v1/models
# Expected: { "data": [{ "id": "kokoro", ... }] }
```

---

## Generate Audio for Study Cards

```bash
# 1. Ensure Kokoro is running (see Start above)

# 2. Set Azure connection string
export AZURE_STORAGE_CONNECTION_STRING='<from Key Vault: AzureWebJobsStorage>'

# Retrieve from Key Vault:
# az keyvault secret show --vault-name dp-kv-deliverypilot --name AzureWebJobsStorage --query "value" -o tsv

# 3. Install dependencies
pip install azure-storage-blob requests

# 4. Run full pipeline (skips already-uploaded files)
cd 5_Symbols/scripts
python generate_audio.py

# 5. Single card (e.g. Q42 only)
python generate_audio.py --start-id 42 --end-id 42

# 6. Dry-run (generates MP3 locally, no upload)
python generate_audio.py --dry-run
```

---

## Azure Blob Storage

| Setting | Value |
|---------|-------|
| Account | `claudecertstore` |
| Container | `memory-audio` |
| Access | Public blob read |
| URL pattern | `https://claudecertstore.blob.core.windows.net/memory-audio/AUD-Q{padId}.mp3` |
| Portal link | [📂 memory-audio container](https://portal.azure.com/#view/Microsoft_Azure_Storage/BlobContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2Fb85b029d-9f7c-4c5a-8939-819480780c5d%2FresourceGroups%2Fclaude-certificate-training%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fclaudecertstore/containerName/memory-audio) |
| Sample file | [▶ AUD-Q001.mp3](https://claudecertstore.blob.core.windows.net/memory-audio/AUD-Q001.mp3) |

Create container (one-time):
```bash
az storage container create \
  --name memory-audio \
  --account-name claudecertstore \
  --public-access blob
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Connection refused` on port 8880 | Run `docker start kokoro-tts` or start fresh with `docker run ...` |
| `AZURE_STORAGE_CONNECTION_STRING not set` | `export` the var or retrieve from Key Vault (see above) |
| Audio sounds too fast | Lower `speed` in `generate_audio.py` (default 0.9) |
| Container not found | Run the `az storage container create` command above |
| Blob already exists warning | Normal — skip logic prevents duplicate uploads |
