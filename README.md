# CRM Lead Management Backend

## Project Overview

This is the backend API for a full-stack CRM Lead Management System. The backend handles user authentication, lead management, dashboard statistics, and lead notes.

The system is designed for a small sales team to manage customer leads, track their sales pipeline status, add follow-up notes, and view basic CRM statistics.

## Tech Stack Used

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- mysql2
- dotenv
- cors
- PM2
- Nginx
- AWS EC2
- GitHub Actions CI/CD

## Features Implemented

- User login with JWT authentication
- Password hashing using bcryptjs
- Protected backend routes using middleware
- Create leads
- View all leads
- View single lead details
- Edit leads
- Delete leads
- Update lead status
- Add notes to a lead
- View notes for a lead
- Delete notes
- Dashboard statistics
- Search leads
- Filter leads by status and lead source
- Pagination for lead list
- MySQL database integration
- Deployed backend with Nginx reverse proxy and PM2
- CI/CD deployment using GitHub Actions

## Folder Structure

```txt
CRM-Application-backend/
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   ├── leadController.js
│   └── noteController.js
├── db/
│   └── db.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   └── leadRoutes.js
├── .env.example
├── .gitignore
├── database.sql
├── index.js
├── package.json
├── package-lock.json
├── seedAdmin.js
└── README.md
```

## Environment Variables

Create a `.env` file in the backend root folder.

Copy the example environment file:

```bash
cp .env.example .env
```

Then update `.env` with your local MySQL password and JWT secret.

The `.env.example` file is included in this repository. The actual `.env` file is not included for security reasons.

## Database Setup

This project uses MySQL.

The database setup queries are included in:

```txt
database.sql
```

This file creates:

- `crm_lead_management` database
- `users` table
- `leads` table
- `lead_notes` table
- Required foreign key relationships
- Required unique key for duplicate lead prevention

### Run database setup

From the backend root folder, run:

```bash
mysql -u root -p < database.sql
```

Or login to MySQL manually:

```bash
mysql -u root -p
```

Then run:

```sql
SOURCE database.sql;
```

## Seed Admin User

After creating the database and tables, run the admin seed file:

```bash
node seedAdmin.js
```

The `seedAdmin.js` file creates the default admin user with a hashed password.

## Test Login Credentials

```txt
Email: admin@gmail.com
Password: admin123
```

## How to Run Locally

### 1. Clone the repository

```bash
git clone YOUR_BACKEND_REPOSITORY_LINK
cd CRM-Application-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
cp .env.example .env
```

Update the `.env` file with your MySQL password and JWT secret.

### 4. Create database and tables

```bash
mysql -u root -p < database.sql
```

### 5. Seed admin user

```bash
node seedAdmin.js
```

### 6. Start backend server

```bash
node index.js
```

The backend will run on:

```txt
http://localhost:3000
```

## API Base URL

Local:

```txt
http://localhost:3000/api
```

Deployed:

```txt
https://crmbackend.pasindujayarathna.me/api
```

## API Endpoints

### Authentication

```txt
POST /api/auth/login
```

### Dashboard

```txt
GET /api/dashboard
```

### Leads

```txt
POST /api/leads
GET /api/leads
GET /api/leads/:id
PUT /api/leads/:id
PUT /api/leads/:id/status
DELETE /api/leads/:id
```

### Lead Notes

```txt
POST /api/leads/:leadId/notes
GET /api/leads/:leadId/notes
DELETE /api/leads/notes/:noteId
```

## Deployment

The backend was deployed on an AWS EC2 Ubuntu server.

Deployment tools used:

- Nginx reverse proxy
- PM2 process manager
- Cloudflare DNS
- GitHub Actions CI/CD

Backend deployed URL:

```txt
https://crmbackend.pasindujayarathna.me
```

## CI/CD

GitHub Actions is used to automatically deploy the backend when changes are pushed to the `main` branch.

Deployment process:

```txt
1. Checkout latest code
2. Upload backend files to EC2
3. Create .env file on the server
4. Install dependencies
5. Restart backend using PM2
```

## Deployment Availability Note

This project was deployed on AWS EC2. However, because AWS credits are limited, the EC2 server may be stopped when not being reviewed.

If the deployed backend link is not accessible, the application can be shown by starting the EC2 server again. The full source code, setup instructions, database setup, and demo video are included in the submission.

## Known Limitations

- The system currently uses one main admin user.
- Role-based access control is basic.
- Notes can be added and deleted, but note editing is not implemented.
- Email notifications are not implemented.
- Advanced sales analytics are not implemented.
- File upload support is not included.

## Reflection

While building this backend, I learned how to create a REST API using Node.js, Express, and MySQL. I implemented JWT authentication, protected routes, CRUD operations, dashboard statistics, pagination, filtering, and note management.

The most challenging part was deploying the backend to AWS EC2 and configuring Nginx, PM2, Cloudflare DNS, and GitHub Actions CI/CD. This helped me improve my understanding of backend deployment, environment variables, database relationships, server debugging, and production setup.

If I had more time, I would improve the backend by adding role-based permissions, note editing, email reminders, advanced reports, and better activity tracking.

## Related Links

Frontend Repository:

```txt
PASTE_FRONTEND_REPOSITORY_LINK_HERE
```

Demo Video:

```txt
PASTE_DEMO_VIDEO_LINK_HERE
```

Deployed Frontend:

```txt
https://crm.pasindujayarathna.me
```

Deployed Backend:

```txt
https://crmbackend.pasindujayarathna.me
```