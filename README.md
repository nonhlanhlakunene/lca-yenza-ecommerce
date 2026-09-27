# Yenza E-commerce

A full-stack marketplace connecting customers with verified local handymen across South Africa. Yenza allows customers to browse trusted professionals, book services, and submit reviews, while giving handymen a platform to offer their skills and get paid for their work.

---
# About the Name

**Yenza** is a Nguni word meaning *"do it"* or *"make it happen."* It's a call to action — for customers, to finally book that service they've been putting off, for handymen, to get to work and get paid. The name captures the spirit of the platform: turning intention into action.

---
## Tech Stack

### Frontend
- **Vue 3** with Composition API
- **Vite** for build tooling and dev server
- **Vue Router** for client-side routing
- **SweetAlert2** for alerts, confirmations, and user feedback
- **Lucide Vue** for icons
- **Axios** for HTTP requests

### Backend
- **Node.js** with ES modules
- **Express** for the HTTP server
- **MySQL** via `mysql2/promise`
- **JSON Web Tokens (JWT)** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads (ID, proof of address, police clearance)
- **Nodemailer** (Gmail SMTP) for email OTP delivery

### Third-party Services
- **Formspree** for the contact form
- **Gmail SMTP** for transactional verification emails

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- A Gmail account with an App Password generated

### 1. Clone the Repository

```bash
git clone https://github.com/nonhlanhlakunene/lca-yenza-ecommerce.git
cd lca-yenza-ecommerce
```

---

### 2. Set Up the Database

Open MySQL:

```bash
mysql -u root -p
```

Then, inside the MySQL shell, run:

```sql
SOURCE database/yenza_db.sql;
```

This creates the `yenza_db` database with all required tables and seed data, including users, services, bookings, reviews, payments, and verification data.

---

### 3. Set Up the Backend

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder.

Add the environment variables listed in the **Environment Variables** section below.

Start the backend server:

```bash
node index.js
```

You should see:

```text
Server is running smoothly on port 3000
```

---

### 4. Set Up the Frontend

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Open this address in your browser.

---

## Environment Variables

Create the following file:

```text
backend/.env
```

Add:

```env
DB_HOST=localhost
DB_PORT=your_mysql_port_number
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=yenza_db

PORT=3000

JWT_SECRET=your_long_random_secret

GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_16_char_gmail_app_password
```

### Environment Variable Notes

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL server host |
| `DB_PORT` | MySQL server port, normally `3306` |
| `DB_USER` | Your MySQL username |
| `DB_PASSWORD` | Your MySQL password |
| `DB_NAME` | YENZA database name |
| `PORT` | Backend server port |
| `JWT_SECRET` | Long random string used to sign authentication tokens |
| `GMAIL_USER` | Gmail address used to send verification emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password used by Nodemailer |

### Gmail App Password

A Gmail App Password can be generated from:

https://myaccount.google.com/apppasswords

You must have **2-Step Verification** enabled on the Google account first.

When adding the App Password to `.env`, remove the spaces between the characters.

> **Important:** Never commit your `.env` file to GitHub. It is included in `.gitignore`, and each developer should create their own local `.env` file.


# Test User Credentials

The following accounts can be used to test the YENZA! application.

> **Note:** These should only be demo/test credentials. Never add real passwords or sensitive production credentials to a public repository.

## Customer Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| Aphiwe | `aphiwe@yenza.co.za` | `aphiwe123` | Customer |

## Worker Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| Sarah | `sarah@yenza.co.za` | `sarah123` | Worker |

## Admin Account

| Email | Password | Role |
|---|---|---|
| `admin@yenza.co.za` | `yenzaadmin123$` | Administrator |

### Testing Notes

Use the demo accounts to test:

- User registration and login
- Browsing services
- Worker profiles
- Bookings
- Payments
- Reviews
- Reports
- Administrative functionality

These credentials are intended for **development and demonstration purposes only**.

Production credentials must be stored securely using environment variables or a secrets manager.

## Database Schema
Table	Purpose
users          	All accounts (customers, professionals, admin)
professionals 	Worker-specific data linked to users
services      	Service categories (Plumber, Electrician, etc.)
bookings	      Customer bookings for a service
payments	      Payment records
customer_addresses	     Saved customer addresses
phone_verifications	    OTP codes sent by email
verification_documents 	Uploaded ID, address, and police clearance files
worker_experience	      Skills and experience submitted by workers
reports       	Reports filed against users or bookings
reviews	        Ratings and comments left after bookings
handymen	      Legacy seed table for the initial profile data

# Features
- Authentication & Registration
- Customer signup, login, and email OTP verification
- Worker signup with full identity verification flow
- Worker login with status-based redirect (verified / pending / rejected)
- Admin login via the standard login page
- Password visibility toggles on all auth forms

## Worker Verification
- Multi-step verification: email OTP, ID upload, proof of address, police clearance, skills & experience

- Files stored server-side and metadata recorded in verification_documents
- Admin approval workflow with document review and status updates
- Live status polling on the pending verification page

 ## Bookings
- Customers can browse professionals and book a service
- Completed bookings can be reviewed and reported
- Booking history with current, upcoming, and past bookings

## Reports & Reviews
- Customers can file reports against completed bookings
- Reviews with star ratings and comments
- Admin moderation panel with status control (pending, under review, resolved, dismissed)

## Full report details accessible via a modal in the admin dashboard

## Admin Dashboard
- Platform-wide statistics (workers, customers, bookings, revenue)
- Pending verification queue with document viewer

## Worker management (view profile, delete)
- Analytics: booking activity, workers by service, booking status distribution

## Reports moderation and summary counts

## Contact Form
- Integrated with Web3Forms for direct email delivery

- SweetAlert2 confirmation on submission

### Project Structure
```lca-yenza-ecommerce/
│
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # JWT authentication and admin checks
│   ├── models/          # Database queries
│   ├── routes/          # API route definitions
│   ├── uploads/         # Uploaded verification documents (gitignored)
│   └── index.js         # Express app entry point
│
├── frontend/
│   ├── public/
│   │
│   └── src/
│       ├── api/         # Axios API wrappers
│       ├── assets/      # Images and fonts
│       ├── components/  # Reusable Vue components
│       ├── router/      # Vue Router configuration
│       ├── views/       # Page-level components
│       └── main.js      # Vue application entry point
│
├── database/
│   └── yenza_db.sql     # Full database schema and seed data
│
└── README.md            # Project documentation
```
## Challenges We Faced
1. Email OTP delivery
Free-tier providers such as Resend restrict delivery to the account owner's email address, which made testing with teammates difficult. We pivoted to Nodemailer with Gmail SMTP to allow sending to any recipient. This required generating a Gmail App Password, which is blocked when an account is under Google Family Link supervision — an unexpected constraint we had to work around.

2. File uploads
Adding verification document uploads required integrating multer on the backend, handling multipart/form-data on the frontend, storing files locally, and keeping only metadata in the database. Balancing security (who can view a document) with simplicity in the time available was a real trade-off.

3. Hardcoded IDs during development
Early reports and reviews used a hardcoded reporterId: 1 because authentication wasn't yet wired up. Once real logins worked, every submission showed the wrong user. This required a targeted refactor to read the logged-in user from localStorage and update both report and review submission flows.

4. Merge conflicts across branches
Multiple merges from develop into individual branches caused duplicate imports, missing dependencies (bcrypt, jsonwebtoken), and conflicts in router/index.js, Admin.vue, and NavBar.vue. Resolving these taught us the value of small, focused branches and testing before pushing.

5. Certificate errors with Gmail SMTP
Local antivirus tools intercept outgoing TLS connections, causing self-signed certificate in certificate chain errors. This is resolved during local development by setting tls: { rejectUnauthorized: false } in the Nodemailer transport configuration. In production, this option should be removed and the connection should be trusted.

6. Role-based access and verification gating
Designing a flow where unverified workers cannot access the dashboard or receive jobs required coordination across the database schema, backend middleware, frontend route guards, and a live-status polling page on the pending screen.

7. Coordinating across a shared branch
Working with multiple contributors on a single develop branch introduced moments where teammate code was merged into individual branches without warning, causing confusion. We resolved this by pulling frequently, resolving conflicts quickly, and using clear commit messages.

## Future Improvements
Short-term
- Real bookings data — replace the hardcoded bookings array with a live API fetch per logged-in user
- Address sync — ensure updates to customer_addresses are reflected when a user edits their profile
- Full settings sync — write both the users and role-specific tables when a user saves their details
- Booking status notifications — email alerts when a booking is confirmed or completed
- Improved mobile experience — refine responsive layouts for smaller screens

Medium-term
- Domain verification — use a custom domain for outgoing emails (via GitHub Student Pack or similar) to remove free-tier restrictions
- Authenticated document access — serve uploaded files only through signed, time-limited URLs
- Admin roles — allow multiple admins with granular permissions
- Real-time updates — WebSockets for live booking and verification status changes
- Search and filters — filter professionals by service, location, and rating

## Long-term
- Payment integration — connect PayFast or Ozow for real transactions
- Mobile app — React Native or Flutter wrapper for iOS and Android
- Geolocation — match customers with nearby professionals using maps
- Ratings-driven ranking — surface top-rated workers automatically
- Audit log — track all admin actions (approvals, rejections, deletions)
- Multi-language support — offer the platform in multiple South African languages

## Team
Built as part of the Module 3 Core Project at Life Choices Academy

Name	              Role
Angela Solomons   	Project Manager, bookings and payments
Nonhlanhla Kunene	  Verification, reports, reviews, admin dashboard, contact form
Elijah Letigan    	Worker and customer signups and logins
Ishma-iel Gray    	Services, Dashboard for workers, map feautures
