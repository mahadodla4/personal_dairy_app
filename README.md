# Personal Journal Application

A secure personal journal application that allows you to create, view, search, and delete journal entries with backend storage and user authentication.
**Webiste Link: ** https://personal-dairy-app.onrender.com/

## Features

1. **User Authentication**
   - Secure signup and login with JWT authentication
   - Password encryption using bcrypt
   - Protected routes for personal data

2. **Add New Journal Entry**
   - Enter date, title, and select day type
   - Write your journal content
   - Save entries securely to your personal account

3. **View Your Journal**
   - See a list of all your journal entries
   - Entries are sorted by date (newest first)
   - Click on any entry to view its full content
   - Only you can see your entries

4. **Search Your Journal**
   - Use the calendar to find entries by date
   - Filter by day type (happy, sad, important)
   - Quickly access specific journal pages

5. **Delete Journal Entries**
   - Remove entries you no longer want to keep
   - Delete buttons available in both the list view and detail view

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) and bcrypt
- **API**: RESTful API with protected routes

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas account)

### Setup Instructions
1. Clone the repository or download the source code
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Access the application:
   - Open your browser and navigate to `http://localhost:5000`
