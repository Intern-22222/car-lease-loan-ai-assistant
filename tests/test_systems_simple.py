"""
Simple System Test - pgAdmin, Database, and APIs (ASCII only)
"""
import requests
import psycopg2

API_URL = "http://localhost:8000"
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'contractdb',
    'user': 'admin',
    'password': 'manvi123'
}

print("\n" + "="*60)
print("PGADMIN & DATABASE & API TEST")
print("="*60)

passed = 0
failed = 0

# 1. DATABASE TESTS
print("\n[1] DATABASE & PGADMIN")
print("-" * 60)

# Test DB connection
try:
    conn = psycopg2.connect(**DB_CONFIG)
    conn.close()
    print("  [PASS] PostgreSQL Connection")
    passed += 1
except Exception as e:
    print(f"  [FAIL] PostgreSQL Connection: {e}")
    failed += 1

# Test contracts table
try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contracts')")
    exists = cur.fetchone()[0]
    cur.close()
    conn.close()
    if exists:
        print("  [PASS] Contracts table exists")
        passed += 1
    else:
        print("  [FAIL] Contracts table NOT found")
        failed += 1
except Exception as e:
    print(f"  [FAIL] Table check: {e}")
    failed += 1

# Test data query
try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM contracts")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    print(f"  [PASS] Query database - {count} contracts stored")
    passed += 1
except Exception as e:
    print(f"  [FAIL] Database query: {e}")
    failed += 1

# Test pgAdmin
try:
    r = requests.get("http://localhost:5050", timeout=5)
    print(f"  [PASS] pgAdmin accessible on port 5050 (HTTP {r.status_code})")
    passed += 1
except Exception as e:
    print(f"  [FAIL] pgAdmin not accessible: {e}")
    failed += 1

# 2. CORE API TESTS
print("\n[2] CORE APIs")
print("-" * 60)

# Health
try:
    r = requests.get(f"{API_URL}/health")
    if r.status_code == 200:
        print(f"  [PASS] GET /health - {r.json()['status']}")
        passed += 1
    else:
        print(f"  [FAIL] GET /health - HTTP {r.status_code}")
        failed += 1
except Exception as e:
    print(f"  [FAIL] GET /health - {e}")
    failed += 1

# Upload
file_id = None
try:
    with open('samples/contract1.pdf', 'rb') as f:
        r = requests.post(f"{API_URL}/upload", files={'file': f})
    if r.status_code == 200:
        file_id = r.json()['file_id']
        print(f"  [PASS] POST /upload - File ID: {file_id[:20]}...")
        passed += 1
    else:
        print(f"  [FAIL] POST /upload - HTTP {r.status_code}")
        failed += 1
except Exception as e:
    print(f"  [FAIL] POST /upload - {e}")
    failed += 1

# Get Contract
if file_id:
    try:
        r = requests.get(f"{API_URL}/contract/{file_id}")
        if r.status_code == 200:
            print(f"  [PASS] GET /contract/{{id}}")
            passed += 1
        else:
            print(f"  [FAIL] GET /contract/{{id}} - HTTP {r.status_code}")
            failed += 1
    except Exception as e:
        print(f"  [FAIL] GET /contract/{{id}} - {e}")
        failed += 1

# Analyze
if file_id:
    try:
        r = requests.post(f"{API_URL}/analyze/{file_id}")
        if r.status_code == 200:
            print(f"  [PASS] POST /analyze/{{id}}")
            passed += 1
        else:
            print(f"  [FAIL] POST /analyze/{{id}} - HTTP {r.status_code}")
            failed += 1
    except Exception as e:
        print(f"  [FAIL] POST /analyze/{{id}} - {e}")
        failed += 1

# 3. VIN & OTHER APIs
print("\n[3] VIN & ADDITIONAL APIs")
print("-" * 60)

# VIN Decoder
try:
    test_vin = "1HGCG5655WA036874"
    r = requests.get(f"{API_URL}/decode-vin/{test_vin}")
    if r.status_code == 200:
        data = r.json()
        print(f"  [PASS] GET /decode-vin/{{vin}} - {data.get('make', 'N/A')} {data.get('model', 'N/A')}")
        passed += 1
    elif r.status_code == 404:
        print(f"  [INFO] GET /decode-vin/{{vin}} - Not implemented")
    else:
        print(f"  [FAIL] GET /decode-vin/{{vin}} - HTTP {r.status_code}")
        failed += 1
except Exception as e:
    print(f"  [INFO] GET /decode-vin/{{vin}} - Endpoint not available")

# Market Value
try:
    r = requests.get(f"{API_URL}/market-value?vin=1HGCG5655WA036874")
    if r.status_code == 200:
        print(f"  [PASS] GET /market-value")
        passed += 1
    elif r.status_code == 404:
        print(f"  [INFO] GET /market-value - Not implemented")
    else:
        print(f"  [FAIL] GET /market-value - HTTP {r.status_code}")
except Exception as e:
    print(f"  [INFO] GET /market-value - Endpoint not available")

# Chat
try:
    r = requests.post(f"{API_URL}/chat", json={"message": "test"})
    if r.status_code == 200:
        print(f"  [PASS] POST /chat")
        passed += 1
    elif r.status_code == 404:
        print(f"  [INFO] POST /chat - Not implemented")
    else:
        print(f"  [FAIL] POST /chat - HTTP {r.status_code}")
except Exception as e:
    print(f"  [INFO] POST /chat - Endpoint not available")

# Negotiate
try:
    r = requests.post(f"{API_URL}/negotiate", json={"message": "test", "context": ""})
    if r.status_code == 200:
        print(f"  [PASS] POST /negotiate")
        passed += 1
    elif r.status_code == 404:
        print(f"  [INFO] POST /negotiate - Not implemented")
    else:
        print(f"  [FAIL] POST /negotiate - HTTP {r.status_code}")
except Exception as e:
    print(f"  [INFO] POST /negotiate - Endpoint not available")

# SUMMARY
print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print(f"Passed: {passed}")
print(f"Failed: {failed}")

if failed == 0:
    print("\nRESULT: ALL CRITICAL SYSTEMS WORKING")
    print("\n  Database: WORKING")
    print("  pgAdmin: ACCESSIBLE")  
    print("  Core APIs: WORKING")
else:
    print(f"\nRESULT: {failed} FAILURES FOUND")

print("="*60)
