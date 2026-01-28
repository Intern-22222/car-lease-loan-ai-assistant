"""
Comprehensive Smoke Test for OCR Pipeline
Tests all sample PDF files to verify upload and text extraction
"""
import requests
import os
import glob
from datetime import datetime

BASE_URL = "http://localhost:8000"
SAMPLES_DIR = "samples"

def test_all_samples():
    """Run smoke test on all sample PDFs"""
    
    print("\n" + "="*80)
    print("🔥 SMOKE TEST: OCR Pipeline - All Sample Files")
    print("="*80)
    
    # Get all PDF files
    pdf_files = glob.glob(os.path.join(SAMPLES_DIR, "*.pdf"))
    
    if not pdf_files:
        print("❌ No PDF files found in samples/ directory")
        return
    
    print(f"\nFound {len(pdf_files)} PDF files to test\n")
    
    results = {
        'passed': [],
        'failed': [],
        'total': len(pdf_files)
    }
    
    # Test each PDF
    for i, pdf_path in enumerate(pdf_files, 1):
        filename = os.path.basename(pdf_path)
        file_size = os.path.getsize(pdf_path) / 1024  # KB
        
        print(f"[{i}/{len(pdf_files)}] Testing: {filename} ({file_size:.1f} KB)")
        print("-" * 80)
        
        try:
            # Upload file
            with open(pdf_path, 'rb') as f:
                files = {'file': (filename, f, 'application/pdf')}
                response = requests.post(f"{BASE_URL}/upload", files=files, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                file_id = data.get('file_id')
                text_length = data.get('text_length', 0)
                
                print(f"  ✅ Upload: SUCCESS")
                print(f"  📄 File ID: {file_id}")
                print(f"  📝 Text extracted: {text_length} characters")
                
                # Verify we can retrieve the contract
                get_response = requests.get(f"{BASE_URL}/contract/{file_id}", timeout=10)
                if get_response.status_code == 200:
                    print(f"  ✅ Retrieval: SUCCESS")
                    results['passed'].append(filename)
                else:
                    print(f"  ⚠️  Retrieval: FAILED (status {get_response.status_code})")
                    results['failed'].append(filename)
            else:
                print(f"  ❌ Upload: FAILED (status {response.status_code})")
                print(f"  Error: {response.text[:200]}")
                results['failed'].append(filename)
                
        except requests.exceptions.Timeout:
            print(f"  ❌ TIMEOUT: Request took too long (>30s)")
            results['failed'].append(filename)
        except Exception as e:
            print(f"  ❌ ERROR: {str(e)[:200]}")
            results['failed'].append(filename)
        
        print()
    
    # Summary
    print("="*80)
    print("📊 SMOKE TEST SUMMARY")
    print("="*80)
    print(f"Total Files Tested: {results['total']}")
    print(f"✅ Passed: {len(results['passed'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print(f"Success Rate: {(len(results['passed']) / results['total'] * 100):.1f}%")
    
    if results['failed']:
        print(f"\n❌ Failed Files:")
        for f in results['failed']:
            print(f"  - {f}")
    
    print("\n" + "="*80)
    
    # Check database
    print("\n📊 Database Verification")
    print("-"*80)
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            user="admin",
            password="manvi123",
            database="contractdb"
        )
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM contracts;")
        count = cur.fetchone()[0]
        print(f"✅ Database connected")
        print(f"📝 Total contracts in database: {count}")
        
        # Get sample records
        cur.execute("SELECT id, file_path, LENGTH(extracted_text) as text_len FROM contracts ORDER BY ingested_at DESC LIMIT 5;")
        records = cur.fetchall()
        print(f"\n📄 Recent uploads:")
        for record in records:
            file_id, path, text_len = record
            filename = os.path.basename(path) if path else "N/A"
            print(f"  - {filename[:40]:40} | {text_len:,} chars | ID: {file_id[:8]}...")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"⚠️  Could not connect to database: {str(e)[:200]}")
    
    print("\n" + "="*80)
    print(f"Smoke test completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80 + "\n")
    
    return results

if __name__ == "__main__":
    test_all_samples()
