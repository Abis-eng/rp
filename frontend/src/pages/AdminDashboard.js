import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const emptyRecipe = {
  title: '',
  image: '',
  cookingTime: 30,
  difficulty: 'Easy',
  servings: 2,
  cuisine: '',
  dietType: '',
  ingredientsText: '',
  instructionsText: ''
};

function toIngredientsArray(text) {
  // one per line: "name | amount | unit" OR "name"
  return String(text || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map(p => p.trim());
      const [name, amount = '', unit = ''] = parts;
      return { name, amount, unit };
    });
}

function toInstructionsArray(text) {
  // one step per line
  const lines = String(text || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  return lines.map((instruction, idx) => ({ step: idx + 1, instruction }));
}

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyRecipe);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/recipes?source=admin');
      setRecipes(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        title: form.title,
        image: form.image,
        cookingTime: Number(form.cookingTime),
        difficulty: form.difficulty,
        servings: Number(form.servings),
        cuisine: form.cuisine,
        dietType: form.dietType
          ? form.dietType.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        ingredients: toIngredientsArray(form.ingredientsText),
        instructions: toInstructionsArray(form.instructionsText)
      };
      const res = await axios.post('/api/admin/recipes', payload);
      setSuccess('Recipe added!');
      setForm(emptyRecipe);
      setRecipes([res.data, ...recipes]);
    } catch (e2) {
      setError(e2.response?.data?.message || 'Failed to create recipe');
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Delete this recipe?')) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/api/admin/recipes/${recipeId}`);
      setRecipes(recipes.filter(r => r.recipeId !== recipeId));
      setSuccess('Deleted');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="card">
          <h2>Admin Only</h2>
          <p>You must login as admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Add recipes here. Users will match/generate recipes from these.</p>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h2>Add Recipe</h2>
          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
          <form onSubmit={handleCreate} className="admin-form">
            <label>Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

            <label>Image URL (optional)</label>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

            <div className="admin-row">
              <div>
                <label>Cooking Time (minutes)</label>
                <input className="input" type="number" value={form.cookingTime} onChange={(e) => setForm({ ...form, cookingTime: e.target.value })} required />
              </div>
              <div>
                <label>Servings</label>
                <input className="input" type="number" value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} required />
              </div>
              <div>
                <label>Difficulty</label>
                <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <label>Cuisine (optional)</label>
            <input className="input" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} />

            <label>Diet types (comma separated, optional)</label>
            <input className="input" value={form.dietType} onChange={(e) => setForm({ ...form, dietType: e.target.value })} placeholder="vegetarian, vegan, gluten-free" />

            <label>Ingredients (one per line)</label>
            <textarea
              className="input"
              rows={6}
              value={form.ingredientsText}
              onChange={(e) => setForm({ ...form, ingredientsText: e.target.value })}
              placeholder={"Example:\nchicken | 200 | g\ntomato | 2 | pcs\nonion"}
              required
            />

            <label>Instructions (one step per line)</label>
            <textarea
              className="input"
              rows={6}
              value={form.instructionsText}
              onChange={(e) => setForm({ ...form, instructionsText: e.target.value })}
              placeholder={"Example:\nCut onions\nCook chicken\nAdd tomatoes\nServe"}
              required
            />

            <button className="btn btn-primary btn-block" type="submit">Add Recipe</button>
          </form>
        </div>

        <div className="card">
          <h2>Admin Recipes</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recipes.length === 0 ? (
            <p>No admin recipes yet. Add your first recipe on the left.</p>
          ) : (
            <div className="admin-list">
              {recipes.map((r) => (
                <div key={r.recipeId} className="admin-item">
                  <div className="admin-item-main">
                    <div className="admin-item-title">{r.title}</div>
                    <div className="admin-item-meta">
                      ⏱️ {r.cookingTime} min · 👥 {r.servings} · {r.difficulty} · {r.cuisine || '—'}
                    </div>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDelete(r.recipeId)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


