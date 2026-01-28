"""
View Contracts Table - Quick Script
Shows all contracts in the database with formatted output
"""
import psycopg2
from tabulate import tabulate
import os

# Connect to database
try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="admin",
        password="manvi123",
        database="contractdb"
    )
    
    cur = conn.cursor()
    
    # Get contracts with formatted data
    cur.execute("""
        SELECT 
            SUBSTRING(id, 1, 8) as short_id,
            file_path,
            analysis_status,
            LENGTH(extracted_text) as text_chars,
            ingested_at
        FROM contracts 
        ORDER BY ingested_at DESC;
    """)
    
    contracts = cur.fetchall()
    
    # Format for display - extract just filename from path
    formatted_contracts = []
    for contract in contracts:
        short_id, full_path, status, text_len, timestamp = contract
        # Extract filename from path (handle both forward and backslash)
        filename = full_path.split('\\')[-1].split('/')[-1] if full_path else "N/A"
        formatted_contracts.append([
            short_id,
            filename,
            status,
            f"{text_len:,}",
            str(timestamp)
        ])
    
    print("\n" + "="*100)
    print(f"CONTRACTS TABLE - Total Records: {len(contracts)}")
    print("="*100 + "\n")
    
    # Display as table
    headers = ["ID (Short)", "Filename", "Status", "Text Length", "Uploaded At"]
    print(tabulate(formatted_contracts, headers=headers, tablefmt="grid"))
    
    print("\n" + "="*100)
    print(f"✅ Database connection successful")
    print(f"📊 Showing all {len(contracts)} contracts")
    print("="*100 + "\n")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error connecting to database: {e}")
    print("\nMake sure Docker containers are running:")
    print("  docker ps | findstr lease_assistant_db")
