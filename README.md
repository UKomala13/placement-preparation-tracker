#  Placement Preparation Tracker

A full-stack web application that helps students organize and track their placement preparation progress.

This project allows users to manage topics, monitor completion status, search topics instantly, and organize preparation efficiently.

---

##  Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or later recommended)
- npm
- MySQL Server
- Git
- VS Code (recommended)

##  Features

###  Topic Management

* Add new preparation topics
* View all topics
* Update existing topics
* Delete topics with confirmation

###  Search

* Live topic search
* Case-insensitive filtering

###  Category Filtering

* Dynamic category dropdown
* Automatically updates when new categories are added
* Multiple filters can be combined

###  User Experience

* Success and error notifications
* Edit mode with auto-filled form
* Responsive card-based interface
* Empty state when no topics are found

---

##  Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Tools

* Git
* GitHub
* VS Code


---

##  Project Structure

```
Placement-Preparation-Tracker/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
├── .env.example
└── README.md
```

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/placement-preparation-tracker.git
```

### 2. Navigate to the project

```bash
cd placement-preparation-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a MySQL database

Create a database named:

```
placement_tracker
```

Import the required SQL tables.

### 5. Configure environment variables

Create a file named .env inside the backend folder.

You can copy the example file:

cp ../.env.example .env

Or create it manually with the following variables:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=placement_tracker
PORT=3000

Replace the placeholder values with your own MySQL credentials.
```

### 6. Start the backend server

```bash
node server.js
```

or

```bash
nodemon server.js
```

### 7. Open the frontend

Open `index.html` using Live Server or your preferred local development server.

---

##  Future Improvements

### Stage 2

* User Registration
* User Login
* JWT Authentication
* Password Hashing (bcrypt)
* User-specific Topics
* Profile Page
* Protected Routes

