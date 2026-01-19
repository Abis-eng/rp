# Authentication Troubleshooting Guide

## Common Login/Registration Issues

### Issue: "Invalid credentials" after registration

**Possible Causes:**
1. Email case sensitivity
2. Password hashing issue
3. JWT_SECRET not set
4. MongoDB connection issue

**Solutions:**

1. **Check your `.env` file:**
   ```env
   JWT_SECRET=your_secret_key_here
   MONGODB_URI=mongodb://localhost:27017/recipe-app
   ```
   Make sure JWT_SECRET is set (not empty)

2. **Check MongoDB is running:**
   - Local: Ensure MongoDB service is started
   - Atlas: Verify connection string is correct

3. **Clear browser data:**
   - Clear localStorage
   - Clear cookies
   - Try in incognito/private window

4. **Check email format:**
   - Use lowercase email
   - No extra spaces
   - Valid email format (e.g., user@example.com)

5. **Verify password:**
   - Minimum 6 characters
   - No extra spaces before/after

### Issue: Can't login after registering

**Check:**
1. Check browser console for errors (F12 → Console)
2. Check backend terminal for error messages
3. Verify the user was created in MongoDB:
   ```bash
   # Connect to MongoDB
   mongo
   # OR
   mongosh
   
   # Use database
   use recipe-app
   
   # Check users
   db.users.find()
   ```

### Issue: "Token is not valid" error

**Solutions:**
1. Clear localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   ```
2. Logout and login again
3. Check JWT_SECRET in `.env` matches what was used during registration

### Issue: Page redirects to login immediately after login

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify token is being saved:
   ```javascript
   // In browser console
   localStorage.getItem('token')
   ```
3. Check network tab (F12 → Network) to see if API calls are successful

## Testing Authentication

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

## Debug Steps

1. **Check Backend Logs:**
   - Look for error messages in terminal where backend is running
   - Check for MongoDB connection errors
   - Check for JWT errors

2. **Check Frontend Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab to see API requests/responses

3. **Verify Environment:**
   - Backend `.env` file exists
   - All required variables are set
   - No typos in variable names

4. **Test API Directly:**
   - Use Postman or curl to test API endpoints
   - Verify backend is responding correctly

## Still Having Issues?

1. **Delete and recreate user:**
   - Clear MongoDB users collection
   - Try registering again

2. **Restart servers:**
   - Stop both backend and frontend
   - Start backend first, then frontend

3. **Check for updates:**
   - Make sure all dependencies are installed
   - Run `npm install` in both folders

4. **Check MongoDB:**
   - Verify database exists
   - Check if users collection is created
   - Verify data is being saved

