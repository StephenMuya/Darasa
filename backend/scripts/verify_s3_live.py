"""
Live S3 Storage Verification Script
Validates connectivity, lists blueprints in S3, and tests pre-signed URL generation
against the live AWS S3 bucket: darasa-curriculum-blueprints-store.
"""
import asyncio
from pathlib import Path
import sys

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.core.config import get_settings
from app.services.s3_storage_service import S3StorageService


async def verify_s3_live():
    settings = get_settings()
    print("=" * 65)
    print("Darasa AWS S3 Storage Service - Live Verification")
    print("=" * 65)
    print(f"Bucket Name: {settings.S3_BUCKET_NAME}")
    print(f"Region:      {settings.AWS_REGION}")
    print(f"Access Key:  {settings.AWS_ACCESS_KEY_ID[:8]}...")
    print("-" * 65)

    storage = S3StorageService()

    # 1. List objects under curriculum-raw/
    print("[*] Listing objects under 'curriculum-raw/'...")
    files = await storage.list_files(prefix="curriculum-raw/")
    print(f"[OK] Found {len(files)} blueprint objects:")
    for f in files:
        size_kb = f.size_bytes / 1024
        print(f"  • {f.key} ({size_kb:.1f} KB, ETag: {f.etag})")

    if files:
        sample_key = files[0].key
        print("-" * 65)
        # 2. Test pre-signed download URL generation
        print(f"[*] Generating 60-min pre-signed download URL for '{sample_key}'...")
        download_url = await storage.generate_presigned_download_url(sample_key, expires_in=3600)
        print(f"[OK] Generated Pre-signed URL:")
        print(f"     {download_url[:90]}...")

        # 3. Test metadata retrieval
        print(f"[*] Fetching metadata for '{sample_key}'...")
        meta = await storage.get_metadata(sample_key)
        print(f"[OK] Content-Type: {meta.content_type}, Size: {meta.size_bytes} bytes")

    print("=" * 65)
    print("[SUCCESS] AWS S3 Storage Service is 100% operational!")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(verify_s3_live())
