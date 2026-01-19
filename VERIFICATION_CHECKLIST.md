# ✅ Complete Verification Checklist

## Pre-Run Checklist

Before starting the app, verify:

- [ ] Node.js installed (v14+)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` file created with:
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI` (local or Atlas)
  - [ ] `JWT_SECRET` (any random string)
  - [ ] `SPOONACULAR_API_KEY` (get from spoonacular.com)

## Startup Verification

### Backend
```bash
cd backend
npm install  # First time only
npm run dev
```

**Expected Output:**
```
MongoDB Connected
Server running on port 5000
```

✅ If you see this, backend is working!

### Frontend
```bash
cd frontend
npm install  # First time only
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view recipe-app-frontend in the browser.
  Local:            http://localhost:3000
```

✅ Browser should open automatically at http://localhost:3000

## Feature Verification

### ✅ 1. Registration Flow
- [ ] Visit http://localhost:3000
- [ ] See login page
- [ ] Click "Register here"
- [ ] Fill form (name, email, password)
- [ ] Click "Register"
- [ ] **VERIFY:** Automatically redirected to Home page
- [ ] **VERIFY:** Navbar shows "Welcome, [Your Name]"
- [ ] **VERIFY:** Home page shows welcome message

### ✅ 2. Login Flow
- [ ] Click "Logout" in navbar
- [ ] See login page
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] **VERIFY:** Redirected to Home page
- [ ] **VERIFY:** Navbar shows your name

### ✅ 3. Recipe Generation
- [ ] On Home page, enter: `chicken, tomatoes, onions`
- [ ] Click "Generate Recipes"
- [ ] **VERIFY:** Shows "Loading recipes..." message
- [ ] **VERIFY:** Recipe cards appear with:
  - Recipe image
  - Recipe title
  - Cooking time
  - Servings
  - Difficulty badge
  - "View Recipe" button

### ✅ 4. Recipe Search
- [ ] Enter search: "pasta"
- [ ] Click "Search"
- [ ] **VERIFY:** Shows matching recipes
- [ ] Try with filters:
  - [ ] Cooking time filter works
  - [ ] Difficulty filter works
  - [ ] Diet type filter works

### ✅ 5. Recipe Details
- [ ] Click "View Recipe" on any recipe
- [ ] **VERIFY:** Recipe details page shows:
  - [ ] Recipe image (large)
  - [ ] Recipe title
  - [ ] Cooking time
  - [ ] Servings
  - [ ] Difficulty level
  - [ ] Cuisine type
  - [ ] Ingredients list (with amounts)
  - [ ] Step-by-step instructions
  - [ ] Heart icon (favorite button)
  - [ ] "Back" button

### ✅ 6. Favorites
- [ ] On recipe details page, click heart icon
- [ ] **VERIFY:** Heart fills (becomes red/filled)
- [ ] **VERIFY:** Button text changes to "Remove from Favorites"
- [ ] Click "My Favorites" in navbar
- [ ] **VERIFY:** Recipe appears in favorites list
- [ ] Click "Remove" button
- [ ] **VERIFY:** Recipe removed from list

### ✅ 7. Navigation
- [ ] **VERIFY:** Navbar shows:
  - [ ] "Recipe App" logo (links to home)
  - [ ] "Home" link
  - [ ] "My Favorites" link
  - [ ] Welcome message with name
  - [ ] "Logout" button
- [ ] Click "Home" - goes to home page
- [ ] Click "My Favorites" - goes to favorites
- [ ] Click "Logout" - goes to login page

### ✅ 8. Protected Routes
- [ ] While logged out, try to visit:
  - [ ] http://localhost:3000/ → Redirects to /login ✅
  - [ ] http://localhost:3000/favorites → Redirects to /login ✅
  - [ ] http://localhost:3000/recipe/123 → Redirects to /login ✅

### ✅ 9. Error Handling
- [ ] Try registering with existing email → Shows error ✅
- [ ] Try login with wrong password → Shows error ✅
- [ ] Try generating recipes without ingredients → Shows alert ✅
- [ ] Try search without query → No action (expected) ✅

### ✅ 10. Persistence
- [ ] Login to app
- [ ] Refresh page (F5)
- [ ] **VERIFY:** Still logged in
- [ ] **VERIFY:** User name still in navbar
- [ ] Close browser and reopen
- [ ] **VERIFY:** Still logged in (if cookies/localStorage enabled)

## All Tests Passing? 🎉

If all checkboxes are checked, your app is **FULLY WORKING**! 🚀

## Common Issues & Quick Fixes

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check port 5000 is not in use

### Frontend won't start
- Check backend is running first
- Verify port 3000 is not in use
- Try `npm install` again

### Can't generate recipes
- Check Spoonacular API key in `.env`
- Verify API key is valid
- Check API quota (150/day free tier)

### Can't login after registration
- Check browser console for errors
- Verify JWT_SECRET is set in `.env`
- Clear browser localStorage and try again

### Recipes not showing
- Check network tab in browser DevTools
- Verify API calls are successful
- Check backend terminal for errors

## Success Indicators

✅ **Everything Working:**
- Can register and login
- Home page shows after login
- Can generate recipes from ingredients
- Can search recipes
- Can view recipe details
- Can save/remove favorites
- Navigation works
- Protected routes work
- Errors are handled gracefully

🎯 **Your app is production-ready!**

