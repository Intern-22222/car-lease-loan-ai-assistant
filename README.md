# Car Lease/Loan Contract Review AI Assistant

## 📌 Project Overview
An AI-powered assistant designed to review car lease and loan contracts, extract key terms (SLA), and compare them with market standards.

---

## ✅ Milestone 1: Backend Implementation
**Status:** Completed
**Focus:** Setting up the core environment, API server, and containerization.

### Key Achievements:
* **Environment Setup:** Configured Python virtual environment and VS Code workspace.
* **FastAPI Server:**
  - Created `backend/main.py`.
  - Implemented root endpoint (`/`) to test server status.
* **Docker Integration:**
  - Created `infra/docker-compose.yml` to orchestrate services.
  - Configured **PostgreSQL** container with persistent volume storage (`postgres_data`).
  - Configured **pgAdmin** container for database management.
* **Dependency Management:** Created `requirements.txt` with essential libraries (`fastapi`, `uvicorn`, `psycopg2-binary`).

---

## ✅ Milestone 2: Design Phase
**Status:** Completed
**Focus:** Database Schema Design and System Architecture.

### Key Achievements:
* **Database Schema:**
  - Designed `contracts` table with support for JSONB data storage.
  - Wrote SQL creation script in `infra/db_schema.sql`.
* **System Design:**
  - Created `design_doc.md` detailing API endpoints and Data Flow.
  - Defined the logic for the `/upload` endpoint.

---

## 🛠️ How to Run the Project
1. **Start the containers:**
   ```bash
   docker-compose -f infra/docker-compose.yml up -d