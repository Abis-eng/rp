# Recipe App - MERN Stack

A full-stack recipe application built with MongoDB, Express, React, and Node.js. Users can generate recipes based on ingredients, search for recipes, and save their favorites.

## 📖 Documentation

- **[HOW_TO_RUN.md](HOW_TO_RUN.md)** - Quick start guide (5 minutes)
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[README.md](README.md)** - This file (project overview)

## Features

- **User Authentication**: Register and login functionality
- **Ingredient-Based Recipe Generation**: Input your ingredients to get recipe suggestions
- **Recipe Search**: Search recipes by name with filters (cooking time, difficulty, diet type)
- **Recipe Details**: View complete recipe information including:
  - Ingredients list
  - Step-by-step cooking instructions
  - Cooking time
  - Difficulty level (Easy/Medium/Hard)
  - Servings
  - Cuisine type
- **Favorites**: Save and manage your favorite recipes
- **My Favorites Page**: View all your saved recipes in one place

## Project Structure

```
rp/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Recipe.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── recipes.js
│   │   └── favorites.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md
```

## How to Run the Project

### Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation - [Download here](https://www.mongodb.com/try/download/community)
  - OR MongoDB Atlas account (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Spoonacular API Key** - [Get free API key](https://spoonacular.com/food-api)

### Step-by-Step Guide

#### Step 1: Clone/Navigate to Project
```bash
cd rp
```

#### Step 2: Setup Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   - Copy `env.template` to `.env` OR create a new `.env` file in the `backend` folder
   - Add the following content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipe-app
   JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string
   SPOONACULAR_API_KEY=your_spoonacular_api_key_here
   ```
   
   **Important:**
   - Replace `JWT_SECRET` with a random long string (e.g., `mySecretKey123456789`)
   - Replace `SPOONACULAR_API_KEY` with your actual API key from [Spoonacular](https://spoonacular.com/food-api)
   - If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string

4. **Start MongoDB:**
   - **Local MongoDB:** Make sure MongoDB service is running
     - Windows: Check Services or run `mongod`
     - Mac/Linux: Run `sudo systemctl start mongod` or `brew services start mongodb-community`
   - **MongoDB Atlas:** No action needed, just use your connection string

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

#### Step 3: Setup Frontend

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the React app:**
   ```bash
   npm start
   ```
   
   The browser should automatically open at `http://localhost:3000`

#### Step 4: Use the Application

1. **Register a new account:**
   - Click "Register here" on the login page
   - Fill in name, email, and password (min 6 characters)
   - Click Register

2. **Login:**
   - Use your registered email and password
   - Click Login

3. **Generate recipes from ingredients:**
   - Enter ingredients separated by commas (e.g., `chicken, tomatoes, onions, garlic`)
   - Click "Generate Recipes"

4. **Search recipes:**
   - Enter a recipe name in the search bar
   - Use filters (cooking time, difficulty, diet type) if needed
   - Click "Search"

5. **View recipe details:**
   - Click "View Recipe" on any recipe card
   - See ingredients, instructions, cooking time, difficulty, etc.

6. **Save favorites:**
   - Click the heart icon on recipe details page
   - View all favorites in "My Favorites" page

### Running Both Servers

You need **TWO terminal windows** running simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### Quick Commands Reference

```bash
# Backend
cd backend
npm install          # First time only
npm run dev          # Start backend (port 5000)

# Frontend  
cd frontend
npm install          # First time only
npm start            # Start frontend (port 3000)
```

### Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is already in use

**Frontend won't start:**
- Make sure backend is running first
- Check if port 3000 is already in use
- Try clearing cache: `npm cache clean --force`

**MongoDB Connection Error:**
- Local: Ensure MongoDB service is running
- Atlas: Check connection string and network access settings

**API Errors:**
- Verify Spoonacular API key is correct
- Check if you've exceeded free tier limit (150 requests/day)
- Ensure you have internet connection

**"Cannot find module" errors:**
- Run `npm install` in both backend and frontend folders
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Recipes
- `POST /api/recipes/generate` - Generate recipes from ingredients
- `GET /api/recipes/search` - Search recipes with filters
- `GET /api/recipes/:id` - Get recipe by ID
- `GET /api/recipes` - Get all recipes

### Favorites
- `GET /api/favorites` - Get user's favorite recipes
- `POST /api/favorites/:recipeId` - Add recipe to favorites
- `DELETE /api/favorites/:recipeId` - Remove recipe from favorites
- `GET /api/favorites/check/:recipeId` - Check if recipe is favorited

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Axios
- **Frontend**: React, React Router, Axios, React Icons
- **API**: Spoonacular API for recipe data

## Notes

- Make sure MongoDB is running before starting the backend
- You need a Spoonacular API key for recipe generation (free tier available)
- The app uses JWT for authentication
- All recipe routes require authentication except for public recipe viewing

# rp
