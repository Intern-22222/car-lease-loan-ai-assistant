# car-lease-loan-ai-assistant
Car Lease/Loan Contract Review and Negotiation AI Assistant
<br>
AI assistant to review car lease/loan contracts, extract key terms, compare market prices &amp; assist with negotiation using LLMs and public vehicle data.

🟢 Milestone 1: Backend API & Storage Setup

Focus: FastAPI endpoints, file upload, storage, database schema
Created FastAPI backend application
Implemented API to upload PDF/Image files
Stored uploaded files in local storage
Designed PostgreSQL database schema for contracts
Added health check endpoint for backend status

🟢 Milestone 2: Database Integration & Testing

Focus: Database connectivity and record insertion
Connected FastAPI backend with PostgreSQL database
Inserted uploaded contract details into database
Stored processing status and timestamps
Tested upload and database insertion flow
Verified stored data using pgAdmin

🟢 Milestone 3: Message Threading Feature

Focus: Dealer conversation simulation and UI
Designed structured JSON data model for chat threads
Implemented message threading logic
Built chat interface with:
Sidebar for conversation threads
Chat window for messages
Styled UI similar to a modern chat application
Added JavaScript functionality to:
Switch between threads

Send new messages

Simulate dealer replies
