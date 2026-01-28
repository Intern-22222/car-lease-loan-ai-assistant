"""
Database Viewer Utility
View and query OCR results stored in the SQLite database.
"""

import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from backend.app.database import (
    get_all_ocr_results,
    get_ocr_result,
    DEFAULT_DB_PATH
)


def format_timestamp(timestamp_str: str) -> str:
    """Format timestamp for display."""
    try:
        dt = datetime.fromisoformat(timestamp_str)
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except:
        return timestamp_str


def display_all_records(db_path: str = None):
    """Display all OCR results in the database."""
    print("=" * 100)
    print("📊 OCR RESULTS DATABASE")
    print("=" * 100)
    
    if db_path:
        print(f"Database: {db_path}")
    else:
        print(f"Database: {DEFAULT_DB_PATH}")
    
    print()
    
    try:
        results = get_all_ocr_results(db_path)
        
        if not results:
            print("❌ No records found in database.")
            print("\n💡 Tip: Run `python -m pytest -s tests/test_ocr.py` to populate the database.")
            return
        
        print(f"✅ Found {len(results)} record(s)\n")
        
        for i, record in enumerate(results, 1):
            print(f"{'─' * 100}")
            print(f"Record #{i}")
            print(f"{'─' * 100}")
            print(f"  ID:              {record['id']}")
            print(f"  Source File:     {record['source_file']}")
            print(f"  Page Count:      {record.get('page_count', 'N/A')}")
            print(f"  Character Count: {record.get('character_count', 'N/A')}")
            print(f"  Created At:      {format_timestamp(record['created_at'])}")
            print(f"  Text Preview:    {record['extracted_text'][:200]}...")
            print()
        
        print("=" * 100)
        print(f"Total Records: {len(results)}")
        print("=" * 100)
        
    except Exception as e:
        print(f"❌ Error reading database: {e}")
        import traceback
        traceback.print_exc()


def display_record_by_id(record_id: int, db_path: str = None):
    """Display a specific OCR result by ID."""
    try:
        record = get_ocr_result(record_id, db_path)
        
        if not record:
            print(f"❌ Record with ID {record_id} not found.")
            return
        
        print("=" * 100)
        print(f"📄 OCR RESULT DETAILS (ID: {record_id})")
        print("=" * 100)
        print(f"  Source File:     {record['source_file']}")
        print(f"  Page Count:      {record.get('page_count', 'N/A')}")
        print(f"  Character Count: {record.get('character_count', 'N/A')}")
        print(f"  Created At:      {format_timestamp(record['created_at'])}")
        print()
        print("─" * 100)
        print("EXTRACTED TEXT:")
        print("─" * 100)
        print(record['extracted_text'])
        print("=" * 100)
        
    except Exception as e:
        print(f"❌ Error reading record: {e}")


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="View OCR results stored in the database",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python check_db.py                    # View all records
  python check_db.py --id 1             # View record with ID 1
  python check_db.py --db custom.db     # Use custom database file
        """
    )
    
    parser.add_argument(
        '--id',
        type=int,
        help='Show specific record by ID'
    )
    
    parser.add_argument(
        '--db',
        type=str,
        help='Path to database file (default: data/ocr_results.db)'
    )
    
    args = parser.parse_args()
    
    if args.id:
        display_record_by_id(args.id, args.db)
    else:
        display_all_records(args.db)


if __name__ == "__main__":
    main()
