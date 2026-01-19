# Complete Setup & Run Guide

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js** installed (v14+) - [Download](https://nodejs.org/)
- [ ] **MongoDB** installed locally OR MongoDB Atlas account
- [ ] **Spoonacular API Key** - [Get Free Key](https://spoonacular.com/food-api)
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Terminal/Command Prompt** access

## 🚀 Complete Setup Process

### Part 1: Get Spoonacular API Key

1. Visit https://spoonacular.com/food-api
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Copy your API key from the dashboard
5. **Note:** Free tier allows 150 requests per day

### Part 2: Setup MongoDB

**Option A: Local MongoDB**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Verify it's running:
   ```bash
   # Windows
   # Check Services app or run:
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   # OR
   brew services start mongodb-community
   ```

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/recipe-app`)
5. Copy the connection string

### Part 3: Backend Setup

1. **Open Terminal/Command Prompt**

2. **Navigate to project:**
   ```bash
   cd path/to/rp
   cd backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   Wait for installation to complete (may take 1-2 minutes)

4. **Create `.env` file:**
   
   **Windows (Command Prompt):**
   ```bash
   copy env.template .env
   ```
   
   **Windows (PowerShell):**
   ```powershell
   Copy-Item env.template .env
   ```
   
   **Mac/Linux:**
   ```bash
   cp env.template .env
   ```
   
   OR manually create `.env` file in `backend` folder

5. **Edit `.env` file:**
   
   Open `.env` in a text editor and update:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipe-app
   # OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/recipe-app
   
   JWT_SECRET=change_this_to_any_random_long_string_like_mySecret123456789
   
   SPOONACULAR_API_KEY=paste_your_actual_api_key_here
   ```
   
   **Important:**
   - Replace `JWT_SECRET` with any random string (keep it secret!)
   - Replace `SPOONACULAR_API_KEY` with your actual key
   - If using Atlas, replace `MONGODB_URI` with your connection string

6. **Start MongoDB** (if using local):
   - Make sure MongoDB service is running
   - Check Windows Services or run `mongod` command

7. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   
   **Success indicators:**
   ```
   MongoDB Connected
   Server running on port 5000
   ```
   
   ✅ Keep this terminal window open!

### Part 4: Frontend Setup

1. **Open a NEW Terminal/Command Prompt window**
   (Keep the backend terminal running!)

2. **Navigate to frontend:**
   ```bash
   cd path/to/rp
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   Wait for installation (may take 2-3 minutes)

4. **Start React App:**
   ```bash
   npm start
   ```
   
   **What happens:**
   - Browser should automatically open at `http://localhost:3000`
   - If not, manually visit: http://localhost:3000
   - You'll see the login page

## ✅ Verify Everything is Working

### Check Backend:
- Terminal shows: "Server running on port 5000"
- No error messages about MongoDB connection
- Visit http://localhost:5000 in browser (should see nothing or error - that's OK)

### Check Frontend:
- Browser opened at http://localhost:3000
- Login page is visible
- No console errors

## 🎯 First Time Using the App

1. **Register:**
   - Click "Register here" link
   - Enter:
     - Name: Your name
     - Email: your@email.com
     - Password: (min 6 characters)
   - Click "Register"
   - You'll be automatically logged in

2. **Generate Recipes:**
   - On home page, enter ingredients: `chicken, tomatoes, onions`
   - Click "Generate Recipes"
   - Wait a few seconds for recipes to load

3. **View Recipe:**
   - Click "View Recipe" on any recipe card
   - See full details, ingredients, instructions

4. **Save Favorite:**
   - On recipe details page, click heart icon
   - Go to "My Favorites" in navbar
   - See your saved recipes

## 📝 Running the Project Daily

Every time you want to run the project:

1. **Start MongoDB** (if local):
   ```bash
   # Windows: Usually auto-starts, or check Services
   # Mac/Linux:
   sudo systemctl start mongod
   ```

2. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. **Open browser:** http://localhost:3000

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # Mac/Linux
# OR
rmdir /s node_modules  # Windows
del package-lock.json  # Windows

npm install
```

### Issue: "Port 5000 already in use"
**Solution:**
- Find and close the process using port 5000
- OR change PORT in `.env` to another number (e.g., 5001)

### Issue: "MongoDB connection error"
**Solution:**
- **Local:** Ensure MongoDB service is running
- **Atlas:** Check connection string, whitelist your IP in Atlas dashboard

### Issue: "API key invalid"
**Solution:**
- Verify API key in `.env` file
- Check if you've exceeded 150 requests/day limit
- Get a new key from Spoonacular dashboard

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on port 5000
- Check `proxy` setting in `frontend/package.json` (should be `"proxy": "http://localhost:5000"`)
- Clear browser cache

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Spoonacular API Docs](https://spoonacular.com/food-api/docs)

## 🎉 You're All Set!

Your MERN stack recipe app is ready to use. Happy cooking! 🍳

