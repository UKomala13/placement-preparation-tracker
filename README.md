#  Placement Preparation Tracker

A full-stack web application that helps students organize and track their placement preparation efficiently.

The application allows users to securely register and log in, manage their preparation topics, monitor progress, search topics instantly, and filter topics by category. Each user's data is protected using JWT Authentication.

---

# Features

##  Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Logout
- User-specific Topic Management

---

##  Topic Management

- Add new preparation topics
- View all topics
- Update existing topics
- Delete topics with confirmation

---

##  Search

- Live topic search
- Case-insensitive filtering

---

##  Category Filtering

- Dynamic category dropdown
- Automatically updates when new categories are added
- Search and category filters work together

---

##  User Experience

- Loading states during API requests
- Success and error notifications
- Edit mode with auto-filled form
- Responsive card-based layout
- Empty state when no topics are available
- Session expiration handling

---

#  Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Authentication

- JSON Web Token (JWT)
- bcrypt

## Tools

- Git
- GitHub
- VS Code
- Postman

---

#  Project Structure

```
Placement-Preparation-Tracker/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── node_modules/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   ├── login.js
│   ├── register.js
│   └── style.css
│
├── .gitignore
├── .env.example
└── README.md
```

---

#  Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/placement-preparation-tracker.git
```

## 2. Navigate to the project

```bash
cd placement-preparation-tracker
```

## 3. Install dependencies

```bash
npm install
```

---

## 4. Create MySQL Database

Create a database named

```
placement_tracker
```

Import the SQL schema into MySQL.

---

## 5. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

You can copy `.env.example` or create it manually.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=placement_tracker

JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own credentials.

---

## 6. Start the Backend Server

```bash
node server.js
```

or

```bash
nodemon server.js
```

---

## 7. Run the Frontend

Open the project using **Live Server** or any local development server.

Navigate to:

```
login.html
```

Register a new account and start using the application.

---

#  Authentication Flow

1. User registers with Name, Email and Password.
2. Password is securely hashed using **bcrypt**.
3. User logs in using registered credentials.
4. Backend generates a **JWT Token**.
5. Token is stored in **localStorage**.
6. Protected API requests send the token using:

```http
Authorization: Bearer <token>
```

7. Backend verifies the token before processing requests.
8. Users can access only their own topics.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register a new user |
| POST | /login | Login user |

### Topics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /topics | Get all topics of logged-in user |
| POST | /topics | Add a new topic |
| PUT | /topics/:id | Update a topic |
| DELETE | /topics/:id | Delete a topic |

---

## Database Schema

### users

| Column | Type |
|---------|------|
| id | INT (Primary Key) |
| name | VARCHAR |
| email | VARCHAR (Unique) |
| password | VARCHAR |

### topics

| Column | Type |
|---------|------|
| id | INT (Primary Key) |
| category | VARCHAR |
| topic_name | VARCHAR |
| status | VARCHAR |
| questions_solved | INT |
| user_id | INT (Foreign Key → users.id) |

---

#  Key Learning Outcomes

This project helped in understanding:

- REST API Development
- CRUD Operations
- Express.js Routing
- MySQL Integration
- JWT Authentication
- Password Hashing using bcrypt
- Middleware
- Protected Routes
- Fetch API
- Async/Await
- DOM Manipulation
- Search & Filter Implementation
- Frontend-Backend Communication

---
