#!/usr/bin/env python3

"""
Upload Pro Exam Images to Azure Blob Storage
Reads generated SVG files and uploads them to Azure

Requirements:
    pip install azure-storage-blob

Environment Variables:
    AZURE_STORAGE_CONNECTION_STRING - Azure Storage connection string
    
Usage:
    python scripts/upload_pro_exam_images_to_azure.py
"""

import os
import json
import sys
import glob
from pathlib import Path
from datetime import datetime

try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
except ImportError:
    print("❌ Error: azure-storage-blob not installed")
    print("   Install with: pip install azure-storage-blob")
    sys.exit(1)


def upload_images_to_azure():
    """Upload all generated SVG files to Azure Blob Storage"""
    
    # Configuration
    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    if not connection_string:
        print("❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable not set")
        print("   Set it with: export AZURE_STORAGE_CONNECTION_STRING='your-connection-string'")
        sys.exit(1)
    
    container_name = 'pro-exam-images'
    assets_dir = Path(__file__).parent.parent / 'assets' / 'pro-exam-images'
    
    if not assets_dir.exists():
        print(f"❌ Error: Assets directory not found: {assets_dir}")
        sys.exit(1)
    
    # Connect to Azure
    print("🔗 Connecting to Azure Blob Storage...")
    try:
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        
        # Try to get container, create if doesn't exist
        try:
            container_client = blob_service_client.get_container_client(container_name)
            container_client.get_container_properties()
            print(f"✓ Connected to existing container: {container_name}\n")
        except Exception:
            print(f"📝 Creating new container: {container_name}...")
            container_client = blob_service_client.create_container(container_name)
            print(f"✓ Created container: {container_name}\n")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)
    
    # Get all SVG files
    svg_files = sorted(glob.glob(str(assets_dir / 'q*.svg')))
    
    if not svg_files:
        print(f"❌ No SVG files found in: {assets_dir}")
        sys.exit(1)
    
    print(f"📤 Uploading {len(svg_files)} images...\n")
    
    uploaded = []
    failed = []
    
    for idx, svg_file in enumerate(svg_files, 1):
        try:
            filename = Path(svg_file).name
            filesize = Path(svg_file).stat().st_size
            
            # Progress
            progress = f"[{idx}/{len(svg_files)}]"
            print(f"{progress} Uploading {filename}...", end=' ', flush=True)
            
            # Read file
            with open(svg_file, 'rb') as data:
                # Set content type for SVG
                content_settings = ContentSettings(content_type='image/svg+xml')
                
                # Upload blob
                blob_client = container_client.get_blob_client(filename)
                blob_client.upload_blob(data, overwrite=True, content_settings=content_settings)
            
            url = f"https://claudecertstore.blob.core.windows.net/{container_name}/{filename}"
            uploaded.append({
                'filename': filename,
                'url': url,
                'size': filesize
            })
            print("✓")
            
        except Exception as e:
            failed.append({
                'filename': Path(svg_file).name,
                'error': str(e)
            })
            print(f"✗ ({e})")
    
    # Report
    print(f"\n{'='*60}")
    print(f"📊 Upload Summary")
    print(f"{'='*60}")
    print(f"✓ Successful:  {len(uploaded)}/{len(svg_files)}")
    print(f"✗ Failed:      {len(failed)}/{len(svg_files)}")
    print(f"Success Rate:  {(len(uploaded)/len(svg_files)*100):.1f}%\n")
    
    if uploaded:
        print(f"✅ Uploaded URLs (first 5):")
        for item in uploaded[:5]:
            print(f"   {item['filename']}: {item['url']}")
        if len(uploaded) > 5:
            print(f"   ... and {len(uploaded) - 5} more")
    
    if failed:
        print(f"\n❌ Failed Uploads:")
        for item in failed:
            print(f"   {item['filename']}: {item['error']}")
    
    # Create manifest
    manifest = {
        'uploaded_at': datetime.now().isoformat(),
        'total_files': len(svg_files),
        'successful': len(uploaded),
        'failed': len(failed),
        'success_rate': f"{(len(uploaded)/len(svg_files)*100):.1f}%",
        'container': container_name,
        'storage_account': 'claudecertstore',
        'files': uploaded,
        'errors': failed
    }
    
    manifest_path = assets_dir / 'upload_manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n📋 Manifest saved: {manifest_path}")
    
    # Create URL list file for easy reference
    urls_file = assets_dir / 'azure_urls.txt'
    with open(urls_file, 'w') as f:
        f.write(f"Pro Exam Images - Azure URLs\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"Container: {container_name}\n")
        f.write(f"Total: {len(uploaded)} images\n")
        f.write(f"\n{'='*60}\n\n")
        for item in uploaded:
            f.write(f"{item['filename']}\n")
            f.write(f"{item['url']}\n\n")
    
    print(f"🔗 URLs list saved: {urls_file}")
    
    return len(failed) == 0, uploaded


def main():
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║  📤 Pro Exam Images - Azure Blob Storage Uploader              ║")
    print("╚════════════════════════════════════════════════════════════════╝\n")
    
    success, uploaded = upload_images_to_azure()
    
    print(f"\n{'='*60}")
    if success:
        print("✅ All files uploaded successfully!")
    else:
        print("⚠️  Some files failed to upload. Check logs above.")
    print(f"{'='*60}\n")
    
    if uploaded:
        print("💡 Pro Exam Images are now accessible at:")
        print(f"   https://claudecertstore.blob.core.windows.net/pro-exam-images/q001.svg")
        print(f"   https://claudecertstore.blob.core.windows.net/pro-exam-images/q002.svg")
        print(f"   ... etc\n")
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
