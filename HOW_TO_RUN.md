# 🚀 How to Run the Recipe App

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

1. In `backend` folder, create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-app
JWT_SECRET=your_random_secret_key_here
SPOONACULAR_API_KEY=your_api_key_here
```

2. Get Spoonacular API key: https://spoonacular.com/food-api

### Step 3: Start MongoDB

**Local MongoDB:**
- Start MongoDB service (Windows: Services app, Mac/Linux: `sudo systemctl start mongod`)

**OR MongoDB Atlas:**
- Use your Atlas connection string in `MONGODB_URI`

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Open Browser

Visit: **http://localhost:3000**

---

## Detailed Instructions

### Prerequisites

- ✅ Node.js (v14+) installed
- ✅ MongoDB installed or Atlas account
- ✅ Spoonacular API key

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install packages:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   - Copy `env.template` to `.env`
   - OR create new `.env` file
   - Add your configuration:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/recipe-app
     JWT_SECRET=change_this_to_random_string
     SPOONACULAR_API_KEY=your_key_here
     ```

4. **Start MongoDB** (if local):
   - Windows: Check Services or run `mongod`
   - Mac/Linux: `sudo systemctl start mongod`

5. **Start backend:**
   ```bash
   npm run dev
   ```
   
   ✅ Should see: "Server running on port 5000"

### Frontend Setup

1. **Open NEW terminal** (keep backend running)

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Install packages:**
   ```bash
   npm install
   ```

4. **Start React app:**
   ```bash
   npm start
   ```
   
   ✅ Browser opens at http://localhost:3000

## Using the App

1. **Register** → Create account
2. **Login** → Use your credentials
3. **Generate Recipes** → Enter ingredients (e.g., "chicken, tomatoes")
4. **Search Recipes** → Use search bar with filters
5. **View Details** → Click any recipe
6. **Save Favorites** → Click heart icon
7. **View Favorites** → Go to "My Favorites" page

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in `.env` or close other process |
| MongoDB error | Start MongoDB service or check connection string |
| API errors | Verify Spoonacular API key is correct |
| Module not found | Run `npm install` in backend/frontend |
| Frontend can't connect | Ensure backend is running on port 5000 |

## Need Help?

- Check `SETUP.md` for detailed setup guide
- Check `README.md` for project overview
- Verify all prerequisites are installed
- Ensure both terminals are running (backend + frontend)

---

**Happy Cooking! 🍳**


