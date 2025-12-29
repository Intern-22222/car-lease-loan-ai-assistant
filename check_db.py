import sqlite3

# Connect to the database file
conn = sqlite3.connect("ocr_data.db")
cursor = conn.cursor()

try:
    # SQL command to grab everything from the 'contracts' table
    cursor.execute("SELECT id, filename, extracted_text FROM contracts")
    rows = cursor.fetchall()

    if not rows:
        print("❌ Database is empty. Run your tests first!")
    else:
        print(f"✅ Found {len(rows)} record(s) in the database:\n")
        for row in rows:
            print(f"ID: {row[0]}")
            print(f"Filename: {row[1]}")
            # Print just the first 100 characters of the text to keep it clean
            print(f"Text Preview: {row[2][:100]}...") 
            print("-" * 30)

except sqlite3.OperationalError:
    print("❌ Could not find the table. Did you run the OCR code yet?")

conn.close()