#!/usr/bin/env python3

"""
Pro Exam Image Upload to Azure Blob Storage
Uploads generated SVG/PNG images to Azure Blob Storage

Requirements:
    pip install azure-storage-blob

Environment Variables:
    AZURE_STORAGE_CONNECTION_STRING - Azure Storage connection string
    
Usage:
    python scripts/upload_pro_exam_images.py
"""

import os
import json
import sys
from pathlib import Path

try:
    from azure.storage.blob import BlobServiceClient
except ImportError:
    print("❌ Error: azure-storage-blob not installed")
    print("   Install with: pip install azure-storage-blob")
    sys.exit(1)


def upload_images_to_azure():
    """Upload generated SVG/PNG files to Azure Blob Storage"""
    
    # Configuration
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    if not connection_string:
        print("❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable not set")
        print("   Set it with: export AZURE_STORAGE_CONNECTION_STRING='your-connection-string'")
        sys.exit(1)
    
    container_name = 'pro-exam-images'
    assets_dir = Path(__file__).parent.parent / 'assets' / 'pro-exam'
    
    if not assets_dir.exists():
        print(f"❌ Error: Assets directory not found: {assets_dir}")
        sys.exit(1)
    
    # Connect to Azure
    print("🔗 Connecting to Azure Blob Storage...")
    try:
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)
        print(f"✓ Connected to container: {container_name}\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)
    
    # Upload files
    print("📤 Uploading images...\n")
    image_files = sorted(assets_dir.glob('q*.svg')) + sorted(assets_dir.glob('q*.png'))
    
    uploaded = []
    failed = []
    
    for image_file in image_files:
        try:
            print(f"Uploading {image_file.name}...", end=' ')
            
            with open(image_file, 'rb') as data:
                blob_client = container_client.get_blob_client(image_file.name)
                blob_client.upload_blob(data, overwrite=True)
            
            url = f"https://claudecertstore.blob.core.windows.net/{container_name}/{image_file.name}"
            uploaded.append({
                'filename': image_file.name,
                'url': url,
                'size': image_file.stat().st_size
            })
            print("✓")
            
        except Exception as e:
            failed.append({
                'filename': image_file.name,
                'error': str(e)
            })
            print(f"✗ ({e})")
    
    # Report
    print(f"\n📊 Upload Summary")
    print(f"   Successful: {len(uploaded)}")
    print(f"   Failed: {len(failed)}")
    
    if uploaded:
        print(f"\n✅ Uploaded Images:")
        for item in uploaded:
            print(f"   {item['filename']}: {item['url']}")
    
    if failed:
        print(f"\n❌ Failed Uploads:")
        for item in failed:
            print(f"   {item['filename']}: {item['error']}")
    
    # Save manifest
    manifest = {
        'uploaded': len(uploaded),
        'failed': len(failed),
        'timestamp': str(Path(__file__).resolve().stat().st_mtime),
        'files': uploaded,
        'errors': failed
    }
    
    manifest_path = assets_dir / 'upload_manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n📋 Manifest saved: {manifest_path}")
    
    return len(failed) == 0


if __name__ == '__main__':
    success = upload_images_to_azure()
    sys.exit(0 if success else 1)
