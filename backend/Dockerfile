FROM python:3.11-slim

WORKDIR /app

# Copy requirements from your root directory
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the contents of the backend folder into the current directory (/app)
COPY backend/ .

# Run the FastAPI app using uvicorn
# Since main.py is now directly in /app, the module is just 'main'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]