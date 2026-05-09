# 🧳 Barbershop Booking System

A production-ready full-stack web application for managing barbershop appointments. Built with modern technologies demonstrating strong backend architecture, secure authentication, and clean UI/UX.

## 🏗️ Project Structure

```
barbershop-booking/
├── backend/                  # Express.js + Prisma backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── utils/            # JWT, password, validation, errors
│   │   └── index.ts          # Main server file
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                 # Next.js 14 App Router frontend
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── bookings/        # Customer bookings
│   │   ├── dashboard/       # Barber dashboard
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   ├── lib/                 # API client, stores (Zustand)
│   ├── styles/              # Tailwind CSS globals
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md               # This file
```

## 🎯 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Authentication**: JWT
- **Security**: bcrypt (password hashing)
- **Validation**: Zod

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Zustand
- **UI Colors**: Black/White/Yellow (#F7DF1E)

## 🎨 Design Theme

- **Background**: Black (`#000000`)
- **Text**: White (`#FFFFFF`)
- **Accent**: Yellow (`#F7DF1E`) - JavaScript yellow for inspiration
- **Style**: Minimal, modern, high-contrast
- **Effects**: Smooth hover transitions

## ⚙️ Core Features

### 1. Authentication
- User signup with email/password
- User login with JWT tokens
- Password hashing with bcrypt
- Protected API routes with middleware
- Role-based access control (CUSTOMER, BARBER)

### 2. Booking System
- ✅ **Conflict Prevention**: Unique constraint on barber + date prevents double booking
- View available barbers
- View available time slots (9 AM - 6 PM, 30-min intervals)
- Create appointments with conflict checking
- Cancel appointments
- Customer can view their bookings
- Barber can view all appointments

### 3. Dashboards
**Customer Dashboard** (`/bookings`):
- View upcoming appointments
- Cancel appointments
- See appointment details (barber, time, notes)

**Barber Dashboard** (`/dashboard`):
- View all appointments
- See today's schedule summary
- View appointment statistics
- Cancel appointments if needed

### 4. Database Design

```prisma
User {
  id, name, email, password, role (CUSTOMER|BARBER)
  relationships: appointments as customer, barber appointments
}

Appointment {
  id, customerId, barberId, date, duration, status, notes
  unique constraint: [barberId, date] - prevents double booking
  relationships: customer (User), barber (User)
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your PostgreSQL URL and JWT secret

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL if backend is on different URL

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
```
POST /auth/register
Body: { name, email, password, role? }
Returns: { user, token }

POST /auth/login
Body: { email, password }
Returns: { user, token }
```

### Appointments (All require JWT token)
```
GET /appointments/barbers
Returns: { barbers: [...] }

GET /appointments/available-slots?barberId=<id>&date=<date>
Returns: { slots: [...ISO strings] }

POST /appointments
Body: { barberId, date, duration?, notes? }
Returns: { appointment }

GET /appointments
Returns: { appointments: [...] }

DELETE /appointments/:appointmentId
Returns: { message, appointment }
```

## 🔐 Security Features

- ✅ JWT-based stateless authentication
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Protected routes with middleware
- ✅ Input validation with Zod
- ✅ CORS enabled
- ✅ Error handling with proper HTTP status codes
- ✅ No sensitive data in responses
- ✅ Token refresh ready architecture

## 🏗️ Architecture Patterns

### Backend
- **Clean Architecture**: Routes → Controllers → Services → Database
- **Middleware Chain**: Auth → Validation → Business Logic
- **Error Handling**: Centralized error middleware with custom AppError class
- **Service Layer**: Business logic separated from controllers
- **Async/Await**: Modern async patterns with proper error handling

### Frontend
- **Component Architecture**: Reusable UI components
- **State Management**: Zustand for auth and appointments
- **API Abstraction**: Axios client with interceptors
- **Type Safety**: Full TypeScript coverage
- **Protected Routes**: Role-based route protection
- **Client-side Validation**: Form validation before submission

## 📊 Database Constraints

- **Unique Email**: No duplicate user emails
- **Unique Appointment**: Each barber can have only one appointment per date
- **Cascade Delete**: Deleting a customer deletes their appointments
- **Restrict Delete**: Cannot delete a barber if they have appointments

## 🧪 Testing (Ready to Implement)

1. **Create test user (CUSTOMER)**:
   - POST /auth/register with role=CUSTOMER

2. **Create test barber (BARBER)**:
   - POST /auth/register with role=BARBER

3. **Get available barbers**:
   - GET /appointments/barbers

4. **Check available slots**:
   - GET /appointments/available-slots?barberId=<id>&date=2024-04-25

5. **Book appointment**:
   - POST /appointments with valid data

6. **View bookings**:
   - GET /appointments (with auth token)

7. **Cancel appointment**:
   - DELETE /appointments/:id

## 🎓 Key Implementation Details

### Double-Booking Prevention
```
The system uses a unique constraint: @@unique([barberId, date])
This ensures each barber can have only one appointment per date.
The service layer also performs additional checking with isSlotAvailable()
before creating appointments.
```

### JWT Implementation
- Tokens are generated at login/register
- Stored in localStorage (client)
- Attached to all requests via axios interceptor
- Extracted and verified on protected routes
- 24-hour expiration (configurable)

### Available Slots Algorithm
```
- Business hours: 9 AM - 6 PM
- Interval: 30 minutes
- Generates slots for the entire day
- Filters out booked time slots
- Returns available ISO datetime strings
```

## 📚 Project Dependencies

### Backend
- express (web framework)
- prisma (ORM)
- jsonwebtoken (JWT)
- bcrypt (password hashing)
- zod (validation)
- cors (cross-origin requests)

### Frontend
- next (framework)
- react (UI library)
- axios (HTTP client)
- zustand (state management)
- tailwindcss (styling)
- typescript (type safety)

## 🚢 Deployment Ready

The project structure is designed for easy deployment:

### Backend
- TypeScript compiled to JavaScript
- Environment variable configuration
- Database migrations with Prisma
- Error handling and logging
- Can be deployed to: Heroku, Railway, Render, AWS, etc.

### Frontend
- Next.js static export or server deployment
- Environment variables for different environments
- Optimized production build
- Can be deployed to: Vercel, Netlify, AWS, etc.

## 📝 Development Notes

### Adding New Features
1. Add database model to `prisma/schema.prisma`
2. Run migrations: `npm run prisma:migrate`
3. Create service layer
4. Add controller/routes
5. Create frontend components
6. Add API calls to store