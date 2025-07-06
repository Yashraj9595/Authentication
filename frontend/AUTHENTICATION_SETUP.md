# Authentication Setup Guide

This guide explains how the frontend authentication pages are connected to the backend API.

## Overview

The authentication system consists of:
- **Frontend**: Next.js with React components for auth screens
- **Backend**: Express.js API with authentication endpoints
- **Database**: MongoDB for user storage
- **Email Service**: For OTP verification and password reset

## Backend API Endpoints

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset with OTP
- `POST /api/auth/resend-otp` - Resend verification OTP

### Protected Endpoints
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password

## Frontend Authentication Flow

### 1. Registration Flow
```
Welcome → Register (Role Selection) → Register (Form) → OTP Verification → Auto Login → Dashboard
```

### 2. Login Flow
```
Welcome → Login → Dashboard
```

### 3. Password Reset Flow
```
Login → Forgot Password → OTP Verification → Reset Password → Login
```

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
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

## Key Components

### Auth Context (`contexts/auth-context.tsx`)
- Manages authentication state
- Handles API calls to backend
- Provides auth functions to components
- Stores JWT token in localStorage

### Authentication Screens
- `welcome-screen.tsx` - Landing page
- `register-screen.tsx` - User registration
- `login-screen.tsx` - User login
- `otp-verification-screen.tsx` - OTP verification
- `forgot-password-screen.tsx` - Password reset request
- `reset-password-screen.tsx` - Password reset

## API Integration Details

### Error Handling
The frontend handles different error formats from the backend:
- Field-specific errors (e.g., "email: Invalid email format")
- General errors (e.g., "User not found")
- Rate limiting errors

### Token Management
- JWT tokens are stored in localStorage
- Automatic token refresh on API calls
- Automatic logout on token expiration

### Form Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Real-time password strength indicators

## Security Features

### Frontend
- Password strength validation
- Rate limiting on forms
- Secure token storage
- Input sanitization

### Backend
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting on sensitive endpoints
- Email verification required
- OTP expiration (5 minutes)

## Testing the Connection

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend:
```bash
npm run dev
```

3. Test the API connection:
```bash
node test-api.js
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend `.env`
   - Check that frontend is running on the expected port

2. **Email Not Sending**
   - Verify email configuration in backend `.env`
   - Check email service credentials
   - Ensure port 587 is not blocked

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check `MONGODB_URI` in backend `.env`
   - Ensure database exists

4. **JWT Token Issues**
   - Verify `JWT_SECRET` is set in backend `.env`
   - Check token expiration settings
   - Clear localStorage if needed

### Debug Mode

Enable debug logging in the backend by setting:
```env
NODE_ENV=development
DEBUG=true
```

## Development Workflow

1. **Backend Development**
   - API endpoints are in `backend/routes/authRoutes.js`
   - Controllers in `backend/controllers/authController.js`
   - Models in `backend/models/User.js`

2. **Frontend Development**
   - Auth context manages all API calls
   - Components use `useAuth()` hook
   - Form validation and error handling built-in

3. **Testing**
   - Use `test-api.js` to verify backend connection
   - Test all authentication flows manually
   - Check error handling scenarios

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production email service
- Set up production MongoDB

### Security Checklist
- [ ] HTTPS enabled
- [ ] Strong JWT secrets
- [ ] Rate limiting configured
- [ ] Email verification required
- [ ] Password policies enforced
- [ ] CORS properly configured

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "resolution": "How to fix"
  }
}
```

## Rate Limiting

The backend implements rate limiting on sensitive endpoints:
- Registration: 5 requests per minute
- Login: 10 requests per 15 minutes
- OTP verification: 5 requests per minute
- Password reset: 5 requests per minute

This prevents abuse and ensures system security. 