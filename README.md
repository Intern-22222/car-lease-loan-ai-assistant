# car-lease-loan-ai-assistant
Car Lease/Loan Contract Review and Negotiation AI Assistant
<br>
AI assistant to review car lease/loan contracts, extract key terms, compare market prices &amp; assist with negotiation using LLMs and public vehicle data.

🟢 Milestone 1: Backend API & Storage Setup

• Created FastAPI backend application

• Implemented API to upload PDF/Image files

• Stored uploaded files in local storage

• Designed PostgreSQL database schema for contracts

• Added health check endpoint for backend status

🟢 Milestone 2: Database Integration & Testing

• Connected FastAPI backend with PostgreSQL database

• Inserted uploaded contract details into database

• Stored processing status and timestamps

• Tested upload and database insertion flow

• Verified stored data using pgAdmin

🟢 Milestone 3: Message Threading Feature

• Designed structured JSON data model for chat threads

• Implemented message threading logic

• Built chat interface with:

• Sidebar for conversation threads

• Chat window for messages

• Styled UI similar to a modern chat application

• Added JavaScript functionality to:

• Switch between threads

• Send new messages

• Simulate dealer replies

🟢 Milestone 4: UI Integration & Documentation

• Displayed Fairness Score in the UI for contract evaluation

• Added price comparison view (contract price vs market price)

• Integrated negotiation email output into the frontend

• Connected frontend UI with backend analysis results (prototype/static data)
