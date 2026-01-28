"""
Intern D Comprehensive Workflow Test Suite
Tests all endpoints, performs OCR quality checks, and validates end-to-end user flows.
"""
import requests
import os
import json
from datetime import datetime
from typing import Dict, List, Tuple
import glob

BASE_URL = "http://localhost:8000"
SAMPLES_DIR = "samples"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_header(title: str):
    """Print formatted section header"""
    print(f"\n{'='*80}")
    print(f"{Colors.BLUE}{title}{Colors.RESET}")
    print(f"{'='*80}\n")

def print_success(msg: str):
    """Print success message"""
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def print_error(msg: str):
    """Print error message"""
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def print_warning(msg: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")

def print_info(msg: str):
    """Print info message"""
    print(f"  ℹ️  {msg}")

# ==============================================
# TASK 1: Test Workflow - Endpoint Documentation
# ==============================================

def test_endpoint_documentation():
    """Test and document all available API endpoints"""
    print_header("TASK 1: Endpoint Documentation & Workflow Testing")
    
    endpoints = [
        ("GET", "/health", None, "Health check"),
        ("POST", "/upload", "multipart/form-data", "Upload contract PDF/image"),
        ("GET", "/contract/{file_id}", None, "Get contract details"),
        ("POST", "/analyze/{file_id}", None, "Analyze contract"),
        ("POST", "/generate_script/{file_id}", None, "Generate negotiation script"),
        ("POST", "/chat/{file_id}", "JSON", "Chat with AI assistant"),
        ("POST", "/counter_offer", "JSON", "Create counter offer"),
        ("DELETE", "/cache/{file_id}", None, "Clear cache"),
    ]
    
    results = {"passed": 0, "failed": 0, "warnings": 0}
    endpoint_status = []
    
    print("Testing endpoint availability...\n")
    
    for method, path, content_type, description in endpoints:
        try:
            # Test health endpoint first
            if path == "/health":
                response = requests.get(f"{BASE_URL}{path}", timeout=5)
                if response.status_code == 200:
                    print_success(f"{method:6} {path:30} - {description}")
                    results["passed"] += 1
                    endpoint_status.append((path, "OK", response.status_code))
                else:
                    print_error(f"{method:6} {path:30} - Failed (Status: {response.status_code})")
                    results["failed"] += 1
                    endpoint_status.append((path, "FAILED", response.status_code))
            else:
                # For other endpoints, just document them (they need parameters)
                print_info(f"{method:6} {path:30} - {description} ({content_type or 'N/A'})")
                endpoint_status.append((path, "DOCUMENTED", "N/A"))
                
        except Exception as e:
            print_error(f"{method:6} {path:30} - Error: {str(e)[:50]}")
            results["failed"] += 1
            endpoint_status.append((path, "ERROR", str(e)[:50]))
    
    print(f"\n📊 Endpoint Summary: {results['passed']} working, {results['failed']} failed\n")
    return endpoint_status

# ==============================================
# TASK 1: Smoke Test - Full Upload Flow
# ==============================================

def smoke_test_upload_flow() -> Dict:
    """Test complete upload → extract → analyze flow"""
    print_header("TASK 1: Smoke Test - Upload to Analysis Pipeline")
    
    test_file = os.path.join(SAMPLES_DIR, "contract1.pdf")
    
    if not os.path.exists(test_file):
        print_error(f"Test file not found: {test_file}")
        return {"success": False, "error": "Missing test file"}
    
    print(f"Testing with: {test_file}\n")
    
    try:
        # Step 1: Upload
        print("Step 1: Uploading contract...")
        with open(test_file, 'rb') as f:
            files = {'file': (os.path.basename(test_file), f, 'application/pdf')}
            upload_response = requests.post(f"{BASE_URL}/upload", files=files, timeout=30)
        
        if upload_response.status_code != 200:
            print_error(f"Upload failed: {upload_response.status_code}")
            return {"success": False, "error": upload_response.text}
        
        upload_data = upload_response.json()
        file_id = upload_data.get('file_id')
        text_length = upload_data.get('text_length', 0)
        
        print_success(f"Upload successful - File ID: {file_id}")
        print_info(f"Extracted text: {text_length:,} characters")
        
        # Step 2: Retrieve contract
        print("\nStep 2: Retrieving contract data...")
        get_response = requests.get(f"{BASE_URL}/contract/{file_id}", timeout=10)
        
        if get_response.status_code != 200:
            print_error(f"Retrieval failed: {get_response.status_code}")
            return {"success": False, "file_id": file_id, "error": "Retrieval failed"}
        
        contract_data = get_response.json()
        print_success("Contract retrieved successfully")
        print_info(f"Contract filename: {contract_data.get('filename', 'N/A')}")
        
        # Step 3: Analyze contract
        print("\nStep 3: Analyzing contract...")
        analyze_response = requests.post(f"{BASE_URL}/analyze/{file_id}", timeout=60)
        
        if analyze_response.status_code != 200:
            print_warning(f"Analysis returned status: {analyze_response.status_code}")
            analysis_data = {}
        else:
            analysis_data = analyze_response.json()
            print_success("Analysis completed")
            
            # Check for key analysis components
            if 'fairness_score' in analysis_data:
                print_info(f"Fairness score: {analysis_data['fairness_score']}")
            if 'extracted_terms' in analysis_data:
                terms = analysis_data['extracted_terms']
                print_info(f"Extracted terms: {len(terms)} items found")
        
        return {
            "success": True,
            "file_id": file_id,
            "upload_data": upload_data,
            "contract_data": contract_data,
            "analysis_data": analysis_data
        }
        
    except Exception as e:
        print_error(f"Smoke test failed: {str(e)}")
        return {"success": False, "error": str(e)}

# ==============================================
# TASK 2: OCR Quality Check
# ==============================================

def ocr_quality_check() -> Dict:
    """Test OCR accuracy across all sample PDFs and identify issues"""
    print_header("TASK 2: OCR Quality Check - Testing All Sample PDFs")
    
    pdf_files = glob.glob(os.path.join(SAMPLES_DIR, "*.pdf"))
    
    if not pdf_files:
        print_error("No PDF files found in samples/ directory")
        return {"error": "No samples found"}
    
    print(f"Testing OCR on {len(pdf_files)} PDF files...\n")
    
    results = []
    bugs_found = []
    
    for i, pdf_path in enumerate(pdf_files, 1):
        filename = os.path.basename(pdf_path)
        file_size = os.path.getsize(pdf_path) / 1024  # KB
        
        print(f"[{i}/{len(pdf_files)}] {filename} ({file_size:.1f} KB)")
        
        try:
            with open(pdf_path, 'rb') as f:
                files = {'file': (filename, f, 'application/pdf')}
                response = requests.post(f"{BASE_URL}/upload", files=files, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                text_length = data.get('text_length', 0)
                file_id = data.get('file_id')
                
                # Quality checks
                quality_issues = []
                
                if text_length == 0:
                    quality_issues.append("NO_TEXT_EXTRACTED")
                    bugs_found.append({
                        "file": filename,
                        "issue": "No text extracted",
                        "severity": "HIGH"
                    })
                elif text_length < 100:
                    quality_issues.append("LOW_TEXT_EXTRACTION")
                    bugs_found.append({
                        "file": filename,
                        "issue": f"Very low text extraction ({text_length} chars)",
                        "severity": "MEDIUM"
                    })
                
                if quality_issues:
                    print_warning(f"  Issues: {', '.join(quality_issues)}")
                    status = "ISSUES"
                else:
                    print_success(f"  OCR extracted {text_length:,} characters")
                    status = "OK"
                
                results.append({
                    "filename": filename,
                    "status": status,
                    "text_length": text_length,
                    "file_id": file_id,
                    "issues": quality_issues
                })
            else:
                print_error(f"  Upload failed: {response.status_code}")
                bugs_found.append({
                    "file": filename,
                    "issue": f"Upload failed with status {response.status_code}",
                    "severity": "HIGH"
                })
                results.append({
                    "filename": filename,
                    "status": "FAILED",
                    "error": response.status_code
                })
                
        except Exception as e:
            print_error(f"  Error: {str(e)[:80]}")
            bugs_found.append({
                "file": filename,
                "issue": str(e)[:100],
                "severity": "HIGH"
            })
            results.append({
                "filename": filename,
                "status": "ERROR",
                "error": str(e)[:100]
            })
    
    # Summary
    print(f"\n{'='*80}")
    print("OCR Quality Summary")
    print(f"{'='*80}\n")
    
    ok_count = sum(1 for r in results if r.get('status') == 'OK')
    issue_count = sum(1 for r in results if r.get('status') == 'ISSUES')
    failed_count = sum(1 for r in results if r.get('status') in ['FAILED', 'ERROR'])
    
    print(f"✅ Passed: {ok_count}/{len(results)}")
    print(f"⚠️  With Issues: {issue_count}/{len(results)}")
    print(f"❌ Failed: {failed_count}/{len(results)}")
    
    if bugs_found:
        print(f"\n🐛 Bugs Found: {len(bugs_found)}")
        for bug in bugs_found[:10]:  # Show first 10 bugs
            print(f"  [{bug['severity']}] {bug['file']}: {bug['issue']}")
    
    return {
        "total_files": len(results),
        "passed": ok_count,
        "with_issues": issue_count,
        "failed": failed_count,
        "bugs": bugs_found,
        "details": results
    }

# ==============================================
# TASK 2: End-to-End User Flow Testing
# ==============================================

def test_user_flows() -> Dict:
    """Test complete user journeys from upload to results"""
    print_header("TASK 2: End-to-End User Flow Testing")
    
    flows = []
    
    # Flow 1: Basic Upload and View
    print("Flow 1: Upload → View Contract\n")
    try:
        test_file = os.path.join(SAMPLES_DIR, "contract2.pdf")
        with open(test_file, 'rb') as f:
            files = {'file': ('contract2.pdf', f, 'application/pdf')}
            upload = requests.post(f"{BASE_URL}/upload", files=files, timeout=30)
        
        if upload.status_code == 200:
            file_id = upload.json()['file_id']
            retrieve = requests.get(f"{BASE_URL}/contract/{file_id}", timeout=10)
            
            if retrieve.status_code == 200:
                print_success("Flow 1: PASSED")
                flows.append({"flow": "Upload → View", "status": "PASSED"})
            else:
                print_error("Flow 1: Retrieval failed")
                flows.append({"flow": "Upload → View", "status": "FAILED", "step": "retrieve"})
        else:
            print_error("Flow 1: Upload failed")
            flows.append({"flow": "Upload → View", "status": "FAILED", "step": "upload"})
    except Exception as e:
        print_error(f"Flow 1: {str(e)[:80]}")
        flows.append({"flow": "Upload → View", "status": "ERROR", "error": str(e)[:80]})
    
    # Flow 2: Upload → Analyze → Generate Script
    print("\nFlow 2: Upload → Analyze → Generate Negotiation Script\n")
    try:
        test_file = os.path.join(SAMPLES_DIR, "contract3.pdf")
        with open(test_file, 'rb') as f:
            files = {'file': ('contract3.pdf', f, 'application/pdf')}
            upload = requests.post(f"{BASE_URL}/upload", files=files, timeout=30)
        
        if upload.status_code == 200:
            file_id = upload.json()['file_id']
            
            # Analyze
            analyze = requests.post(f"{BASE_URL}/analyze/{file_id}", timeout=60)
            if analyze.status_code == 200:
                # Generate script
                script = requests.post(f"{BASE_URL}/generate_script/{file_id}", timeout=30)
                if script.status_code == 200:
                    print_success("Flow 2: PASSED")
                    flows.append({"flow": "Upload → Analyze → Script", "status": "PASSED"})
                else:
                    print_warning(f"Flow 2: Script generation returned {script.status_code}")
                    flows.append({"flow": "Upload → Analyze → Script", "status": "PARTIAL"})
            else:
                print_warning(f"Flow 2: Analysis returned {analyze.status_code}")
                flows.append({"flow": "Upload → Analyze → Script", "status": "PARTIAL"})
        else:
            print_error("Flow 2: Upload failed")
            flows.append({"flow": "Upload → Analyze → Script", "status": "FAILED"})
    except Exception as e:
        print_error(f"Flow 2: {str(e)[:80]}")
        flows.append({"flow": "Upload → Analyze → Script", "status": "ERROR"})
    
    print(f"\n{'='*80}")
    passed = sum(1 for f in flows if f['status'] == 'PASSED')
    print(f"User Flow Summary: {passed}/{len(flows)} flows passed completely\n")
    
    return {"flows": flows, "total": len(flows), "passed": passed}

# ==============================================
# Main Test Runner
# ==============================================

def main():
    """Run all Intern D testing tasks"""
    print("\n" + "="*80)
    print(f"{Colors.BLUE}🧪 INTERN D - COMPREHENSIVE TESTING SUITE{Colors.RESET}")
    print("="*80)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Backend URL: {BASE_URL}")
    print("="*80)
    
    results = {}
    
    # Task 1: Endpoint Documentation & Smoke Test
    results['endpoints'] = test_endpoint_documentation()
    results['smoke_test'] = smoke_test_upload_flow()
    
    # Task 2: OCR Quality Check & User Flows
    results['ocr_quality'] = ocr_quality_check()
    results['user_flows'] = test_user_flows()
    
    # Final Report
    print_header("📋 FINAL TEST REPORT")
    
    print("TASK 1 - Workflow Testing:")
    if results['smoke_test'].get('success'):
        print_success("Smoke test passed")
    else:
        print_error(f"Smoke test failed: {results['smoke_test'].get('error', 'Unknown')}")
    
    print("\nTASK 2 - OCR Quality Check:")
    ocr = results['ocr_quality']
    print(f"  Total files tested: {ocr['total_files']}")
    print(f"  Passed: {ocr['passed']}")
    print(f"  Issues found: {ocr['with_issues']}")
    print(f"  Failed: {ocr['failed']}")
    print(f"  Bugs reported: {len(ocr['bugs'])}")
    
    print("\nTASK 2 - User Flow Testing:")
    flows = results['user_flows']
    print(f"  Total flows tested: {flows['total']}")
    print(f"  Passed: {flows['passed']}")
    
    # Save detailed results to JSON
    report_file = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📄 Detailed report saved to: {report_file}")
    print("\n" + "="*80)
    print(f"Testing completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80 + "\n")
    
    return results

if __name__ == "__main__":
    main()
