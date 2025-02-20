import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/items/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setItems(sortedData);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    const trimmedItem = newItem.trim();
    if (!trimmedItem) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedItem }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewItem('');
      fetchItems();
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/items/${id}/`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id) => {
    const trimmedText = editText.trim();
    if (!trimmedText) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/items/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedText }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingItem(null);
      setEditText('');
      fetchItems();
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addItem();
    }
  };

  return (
    <div className="container">
      <h1>Item List</h1>
      <div className="input-group">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          onKeyDown={handleKeyDown}
        />
        <button onClick={addItem} disabled={loading}>
          {loading ? "Adding..." : "+"}
        </button>
      </div>

      {loading && <p className="loading-message">Loading items...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {items.length === 0 && !loading && !error && (
        <p className="empty-message">No items available.</p>
      )}

      {items.length > 0 && (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item">
              {editingItem === item.id ? (
                <div className="edit-item">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => updateItem(item.id)} disabled={loading}>
                    Guardar
                  </button>
                  <button className="cancel" onClick={() => setEditingItem(null)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="item-content">
                  <span className="item-name">{item.name}</span>
                  <div className="item-actions">
                    <button className="edit" onClick={() => { setEditingItem(item.id); setEditText(item.name); }}>
                      Editar
                    </button>
                    <button className="delete" onClick={() => deleteItem(item.id)} disabled={loading}>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;