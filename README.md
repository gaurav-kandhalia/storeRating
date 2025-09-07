🏪 Store Rating System

A full-stack project where Users, Store Owners, and Admins can interact with stores and ratings.
Built with Node.js, Express, Prisma ORM, and PostgreSQL (Supabase).

🚀 Features
👤 Normal User

Sign up / Login / Logout

Update password

View all stores (filter by name, address)

Rate a store (1–5 stars)

Update their submitted rating

🏪 Store Owner

Login / Logout

Update password

View all users who rated their stores

🛠 Admin

Login / Logout

Create Users & Store Owners

Add new Stores

View all Users (with filters)

View all Stores (with filters, including owner details)

📦 Tech Stack

Backend: Node.js, Express

Database: PostgreSQL (Supabase)

ORM: Prisma

Authentication: JWT + bcrypt

⚡ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/your-username/store-rating-system.git
cd store-rating-system

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file in the root:

PORT=5000

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Supabase connection string (Direct URL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?schema=public&sslmode=require"

🗂 Database Setup (Supabase + Prisma)

Create a project on Supabase
.

Get your connection string from:
Database → Connection pooling → Connection string.

Paste it in .env as DATABASE_URL.

Run migrations:

npx prisma generate
npx prisma migrate dev --name init


Seed the database with the default Admin account:

npx prisma db seed


Default Admin credentials:

{
  "email": "admin@example.com",
  "password": "Admin@123"
}

▶️ Run the Project
npm run dev


Server will start at:
👉 https://storerating-1beb.onrender.com

📡 API Endpoints
🔑 Auth
1. Register

POST /api/v1/user/signUp

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "12345678",
  "address": "Delhi"
}

2. Login

POST /api/v1/user/login

{
  "email": "alice@example.com",
  "password": "12345678"
}

3. Logout

POST /api/v1/user/logout

4. Update Password

POST /api/v1/user/updatePassword

{
  "oldPassword": "12345678",
  "newPassword": "newPass123"
}

⭐ User
1. Rate a Store

POST /api/v1/user/rateStore

{
  "storeId": 1,
  "value": 5
}

2. Update Rating

PUT /api/v1/user/updateRating

{
  "storeId": 1,
  "value": 4
}

3. Get All Stores

GET /api/v1/user/getAllStores?name=KFC&address=Delhi

🏪 Store Owner
Get Users Who Rated Store

GET /api/v1/storeOwner/userRatedStore?storeId=1

Response example:

{
  "success": true,
  "users": [
    { "id": 10, "name": "Alice", "email": "alice@example.com", "rating": 5 },
    { "id": 12, "name": "Charlie", "email": "charlie@example.com", "rating": 3 }
  ]
}

🛠 Admin
1. Create User

POST /api/v1/admin/createUser

{
  "name": "Eve",
  "email": "eve@example.com",
  "password": "12345678",
  "address": "Mumbai",
  "role": "USER"
}

2. Create Store Owner

POST /api/v1/admin/createStore

{
  "name": "Bob",
  "email": "bob@example.com",
  "password": "12345678",
  "address": "Kolkata",
  "role": "STORE_OWNER"
}

3. Add Store

POST /api/v1/admin/addStore

{
  "name": "KFC",
  "address": "Connaught Place, Delhi",
  "ownerId": 2
}

4. Get All Users

GET /api/v1/admin/getAllUser?role=USER&name=Alice

5. Get All Stores

GET /api/v1/admin/getAllStores?name=KFC&address=Delhi

🐛 Troubleshooting

Error: P1001 (Can't reach database)
→ Ensure Supabase project is running and .env contains session pooling connection if you want to deploy it other direct connection will also work

Password contains @
→ Encode @ as %40 in the connection string, or reset password in Supabase.



⚠️ Frontend Status

Currently, the frontend part is pending due to:

Database deployment and connection issues that consumed extra time during setup.

Strict submission deadlines, which required prioritizing the backend implementation (APIs, authentication, role-based access, Prisma + PostgreSQL setup).

Focus on ensuring that the backend is fully functional, production-ready, and tested via Postman before moving to the frontend.

All APIs are working and can be tested using Postman / Thunder Client. Once deployment is stable, the frontend will be built and connected to this backend.
