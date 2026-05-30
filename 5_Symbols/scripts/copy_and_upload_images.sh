#!/bin/bash
set -e

# Account info
ACCOUNT_NAME="claudecertstore"
CONTAINER_NAME="exam-images"

if [ -z "$AZURE_STORAGE_KEY" ]; then
  echo "Error: AZURE_STORAGE_KEY environment variable is not set."
  echo "Please set it using: export AZURE_STORAGE_KEY='your_key_here'"
  exit 1
fi
ACCOUNT_KEY="$AZURE_STORAGE_KEY"


# Ensure target directories exist
mkdir -p 5_Symbols/assets/exam-images

# List of folders to search
SEARCH_FOLDERS=(
  "/Users/rifaterdemsahin/.gemini/antigravity-cli/brain/4da76f69-b205-4a64-b9f8-04a9d111ee7f"
  "/Users/rifaterdemsahin/.gemini/antigravity-cli/brain/4e9531b6-ac5f-4904-995e-87e04e9a115d"
)

# Process questions 49 to 58 (if generated)
for q_num in {49..58}; do
  # Format Q ID
  q_id=$(printf "q%03d" "$q_num")
  
  # Search for the generated file
  src_file=""
  for folder in "${SEARCH_FOLDERS[@]}"; do
    found=$(find "$folder" -name "${q_id}_*.png" 2>/dev/null | head -n 1)
    if [ -n "$found" ]; then
      src_file="$found"
      break
    fi
  done
  
  if [ -n "$src_file" ]; then
    dest_file="5_Symbols/assets/exam-images/${q_id}.png"
    echo "Processing $q_id:"
    echo "  Found generated image: $src_file"
    cp "$src_file" "$dest_file"
    echo "  Copied to $dest_file"
    
    # Upload to Azure
    echo "  Uploading to Azure Storage..."
    az storage blob upload \
      --container-name "$CONTAINER_NAME" \
      --name "${q_id}.png" \
      --file "$dest_file" \
      --account-name "$ACCOUNT_NAME" \
      --account-key "$ACCOUNT_KEY" \
      --content-type image/png \
      --overwrite
    echo "  Successfully uploaded $q_id.png to Azure Storage."
  else
    echo "No generated file found for $q_id. Skipping."
  fi
done
