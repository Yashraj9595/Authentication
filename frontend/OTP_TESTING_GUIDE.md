# 🔢 OTP Testing Guide

## **How to Test Registration & OTP in Development Mode**

### **✅ What's Fixed:**
- ✅ **Email bypass** - OTP codes now show in console instead of email
- ✅ **Development mode** - No more email sending errors
- ✅ **Console logging** - OTP codes are clearly displayed

### **📋 Testing Steps:**

#### **1. Start Both Servers**
```bash
# Terminal 1 - Backend (already running)
cd backend
npm start

# Terminal 2 - Frontend
cd ..
npm run dev
```

#### **2. Register a New User**
1. Go to `http://localhost:3001`
2. Click "Register" or "Sign Up"
3. Fill in the registration form with a **new email address**
4. Click "Create Account"

#### **3. Get the OTP Code**
- **Check your backend terminal** (where you ran `npm start`)
- You'll see something like:
  ```
  🔢 OTP Code for testing: 123456
  📧 Email would be sent to: your-email@example.com
  🚀 DEVELOPMENT MODE: Skipping email sending
  ```

#### **4. Verify OTP**
1. Copy the OTP code from the console
2. Go to the OTP verification screen
3. Enter the 6-digit code
4. Click "Verify"

#### **5. Complete Registration**
- After verification, you'll be automatically logged in
- You'll see a success message

### **🔍 Troubleshooting:**

#### **If you don't see OTP in console:**
1. Make sure backend is running (`npm start` in backend folder)
2. Check that `NODE_ENV=development` is in your `.env` file
3. Try registering with a completely new email address

#### **If registration fails:**
1. Check the backend terminal for error messages
2. Make sure MongoDB is connected
3. Try a different email address

#### **If OTP verification fails:**
1. Make sure you're using the exact OTP from the console
2. Check that the email matches what you registered with
3. OTP expires after 1 minute, so enter it quickly

### **📱 For Production:**
When you're ready for production:
1. Set up proper email credentials in `.env`
2. Change `NODE_ENV=production`
3. Remove `SKIP_EMAIL=true`

### **🎯 Expected Console Output:**
```
📧 Attempting to send registrationOTP email to: test@example.com
🔢 OTP Code for testing: 123456
📧 Email would be sent to: test@example.com
🚀 DEVELOPMENT MODE: Skipping email sending
✅ Registration successful! Check console for OTP code.
```

**Now try registering with a new email and check your backend console for the OTP code!** 