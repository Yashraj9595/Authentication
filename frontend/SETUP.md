# MessHub Setup Guide

This guide will help you set up the MessHub application with the frontend connected to the backend.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Email service (Gmail, SendGrid, etc.)

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Configure environment variables in `backend/.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mess-app
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to the root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env.local
   ```

4. **Configure environment variables in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Email Configuration

For email functionality (OTP verification, password reset), you need to configure an email service:

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

### Alternative Email Services
- SendGrid
- Mailgun
- AWS SES

## Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/mess-app` as `MONGODB_URI`

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Replace `MONGODB_URI` with your Atlas connection string

## Testing the Connection

1. **Start both servers:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Visit the frontend:**
   - Navigate to `http://localhost:3000`
   - You should be redirected to the auth page

3. **Test registration:**
   - Click "Create Account"
   - Fill in the registration form
   - Check your email for OTP
   - Verify your email

4. **Test login:**
   - Use your registered email and password
   - You should be redirected to the dashboard

## API Endpoints

The backend provides the following authentication endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get user profile (protected)
- `PUT /api/auth/me` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` is correctly set in backend `.env`
   - Check that the frontend is running on the expected port

2. **Email Not Sending:**
   - Verify email credentials in backend `.env`
   - Check email service settings
   - Ensure 2FA is enabled for Gmail

3. **Database Connection Issues:**
   - Verify MongoDB is running
   - Check `MONGODB_URI` format
   - Ensure network access for cloud databases

4. **Frontend Not Connecting:**
   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check that backend is running
   - Clear browser cache

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend `.env` file.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use secure JWT secrets
3. Configure production database
4. Set up proper email service
5. Configure CORS for production domain
6. Use HTTPS for both frontend and backend

## Support

If you encounter issues, check:
1. Console logs in browser
2. Backend server logs
3. Network tab for API calls
4. Environment variable configuration 