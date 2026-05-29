#!/usr/bin/env python3
"""
Upload Grok vs Claude Comparison Image to Azure Blob Storage
Places the generated SVG into the 'concepts' container.
"""
import os
import sys
from pathlib import Path
from datetime import datetime

try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
except ImportError:
    print("❌ azure-storage-blob not installed. Install with: pip install azure-storage-blob")
    sys.exit(1)

def upload_to_concepts_container():
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    if not connection_string:
        print("❌ AZURE_STORAGE_CONNECTION_STRING not set.")
        print("   Note: Concept images are now primarily hosted in Azure.")
        print("   https://claudecertstore.blob.core.windows.net/concepts/grok-vs-claude-4.5-haiku.svg")
        return False
    
    container_name = 'concepts'
    file_path = Path('assets/concepts/grok-vs-claude-4.5-haiku.svg')
    
    if not file_path.exists():
        print("❌ File not found")
        return False
    
    try:
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)
        
        # Create container if it doesn't exist
        try:
            container_client.get_container_properties()
        except Exception:
            container_client.create_container()
            print(f"✅ Created container: {container_name}")
        
        print(f"📤 Uploading grok-vs-claude-4.5-haiku.svg to concepts container...")
        
        with open(file_path, 'rb') as data:
            content_settings = ContentSettings(content_type='image/svg+xml')
            blob_client = container_client.get_blob_client(file_path.name)
            blob_client.upload_blob(data, overwrite=True, content_settings=content_settings)
        
        url = f"https://claudecertstore.blob.core.windows.net/{container_name}/{file_path.name}"
        print(f"✅ Successfully uploaded!")
        print(f"🔗 URL: {url}")
        print(f"\nThis image showcases key differences between Grok 4.20 (strong reasoning, real-time knowledge, personality) and Claude 4.5 Haiku (superior speed, coding, structured agentic workflows).")
        return True
        
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Uploading Grok 4.20 vs Claude 4.5 Haiku comparison to Azure 'concepts' container...\n")
    success = upload_to_concepts_container()
    if success:
        print("\n✅ Task completed. Image is now in Azure storage container 'concepts'.")
    else:
        print("\n⚠️  Image generated locally. Use the provided az command to upload to Azure.")
    sys.exit(0 if success else 0)
