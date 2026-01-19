import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useFavorites } from '../hooks/useFavorites';
import { useCamps } from '../hooks/useCamps';
import { getCampId } from '../context/FavoritesContext';
import './Admin.css';

function Admin() {
  const { favorites, clearFavorites, removeFavorite } = useFavorites();
  const { camps: communityCamps } = useCamps('/api/camps');
  const { camps: districtCamps } = useCamps('/api/school-districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCamp, setEditingCamp] = useState(null);
  const [campNotes, setCampNotes] = useState({});

  // Load notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('summercamp_admin_notes');
      if (stored) {
        setCampNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, []);

  // Save notes to localStorage
  const saveNote = (campId, note) => {
    const newNotes = { ...campNotes, [campId]: note };
    setCampNotes(newNotes);
    try {
      localStorage.setItem('summercamp_admin_notes', JSON.stringify(newNotes));
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Get all camps and find favorites
  const allCamps = useMemo(() => [...communityCamps, ...districtCamps], [communityCamps, districtCamps]);

  const favoriteCamps = useMemo(() => {
    return allCamps
      .filter(camp => {
        const campId = getCampId(camp);
        return favorites.includes(campId);
      })
      .map(camp => {
        const campId = getCampId(camp);
        return {
          ...camp,
          id: campId,
          note: campNotes[campId] || '',
        };
      })
      .filter(camp => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          camp.name.toLowerCase().includes(searchLower) ||
          (camp.type && camp.type.toLowerCase().includes(searchLower)) ||
          (camp.location && camp.location.toLowerCase().includes(searchLower)) ||
          (camp.note && camp.note.toLowerCase().includes(searchLower))
        );
      });
  }, [favorites, allCamps, searchTerm, campNotes]);

  const handleDelete = (camp) => {
    if (window.confirm(`Are you sure you want to remove "${camp.name}" from your saved camps?`)) {
      removeFavorite(camp);
      // Also remove note
      const newNotes = { ...campNotes };
      delete newNotes[camp.id];
      setCampNotes(newNotes);
      try {
        localStorage.setItem('summercamp_admin_notes', JSON.stringify(newNotes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  };

  const handleSaveNote = (camp) => {
    saveNote(camp.id, editingCamp.note);
    setEditingCamp(null);
  };

  return (
    <>
      <Header
        title="📋 My Saved Camps"
        subtitle="Manage your saved summer camps"
      />
      <main className="container admin-container">
        <div className="admin-header">
          <div className="admin-stats">
            <h2>{favoriteCamps.length} Saved {favoriteCamps.length === 1 ? 'Camp' : 'Camps'}</h2>
            {favorites.length > favoriteCamps.length && (
              <p className="admin-note">
                {favorites.length - favoriteCamps.length} camp(s) not found in current data
              </p>
            )}
          </div>
          <div className="admin-actions">
            <input
              type="text"
              placeholder="Search saved camps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search"
            />
            {favorites.length > 0 && (
              <button
                className="clear-all-btn"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all saved camps? This cannot be undone.')) {
                    clearFavorites();
                    setCampNotes({});
                    try {
                      localStorage.removeItem('summercamp_admin_notes');
                    } catch (error) {
                      console.error('Error clearing notes:', error);
                    }
                  }
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {favoriteCamps.length === 0 ? (
          <div className="no-saved-camps">
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                {searchTerm ? 'No camps match your search' : 'No saved camps yet'}
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                {searchTerm 
                  ? 'Try a different search term'
                  : 'Start exploring camps and click the heart icon to save your favorites!'}
              </p>
              {!searchTerm && (
                <Link
                  to="/"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Browse Camps →
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-camps-grid">
            {favoriteCamps.map((camp) => (
              <div key={camp.id} className="admin-camp-card">
                <div className="admin-camp-header">
                  <h3>{camp.name}</h3>
                  <div className="admin-camp-actions">
                    <button
                      className="edit-note-btn"
                      onClick={() => setEditingCamp({ ...camp, note: campNotes[camp.id] || '' })}
                      title="Add/Edit Note"
                    >
                      📝
                    </button>
                    <button
                      className="delete-camp-btn"
                      onClick={() => handleDelete(camp)}
                      title="Remove from saved"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="admin-camp-info">
                  {camp.website && (
                    <div className="info-row">
                      <strong>Website:</strong>
                      <a href={camp.website.startsWith('http') ? camp.website : `https://${camp.website}`} 
                         target="_blank" 
                         rel="noopener noreferrer">
                        Visit Site →
                      </a>
                    </div>
                  )}
                  {camp.ages && (
                    <div className="info-row">
                      <strong>Ages:</strong>
                      <span>{camp.ages}</span>
                    </div>
                  )}
                  {camp.dates && (
                    <div className="info-row">
                      <strong>Dates:</strong>
                      <span>{camp.dates}</span>
                    </div>
                  )}
                  {camp.cost && (
                    <div className="info-row">
                      <strong>Cost:</strong>
                      <span>{camp.cost}</span>
                    </div>
                  )}
                  {camp.location && (
                    <div className="info-row">
                      <strong>Location:</strong>
                      <span>{camp.location}</span>
                    </div>
                  )}
                  {camp.type && (
                    <div className="info-row">
                      <strong>Type:</strong>
                      <span>{camp.type}</span>
                    </div>
                  )}
                  {camp.district && (
                    <div className="info-row">
                      <strong>District:</strong>
                      <span>{camp.district}</span>
                    </div>
                  )}
                </div>

                {camp.note && (
                  <div className="admin-camp-note">
                    <strong>📝 My Note:</strong>
                    <p>{camp.note}</p>
                  </div>
                )}

                {camp.notes && (
                  <div className="admin-camp-notes">
                    <strong>ℹ️ Additional Info:</strong>
                    <p>{camp.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editingCamp && (
          <div className="note-editor-modal" onClick={() => setEditingCamp(null)}>
            <div className="note-editor-content" onClick={(e) => e.stopPropagation()}>
              <div className="note-editor-header">
                <h3>Add Note for {editingCamp.name}</h3>
                <button className="close-btn" onClick={() => setEditingCamp(null)}>×</button>
              </div>
              <textarea
                value={editingCamp.note}
                onChange={(e) => setEditingCamp({ ...editingCamp, note: e.target.value })}
                placeholder="Add your personal notes about this camp..."
                rows="6"
                maxLength={500}
                className="note-textarea"
              />
              <div className="note-editor-footer">
                <div className="char-count">{editingCamp.note.length}/500</div>
                <div className="note-editor-actions">
                  <button className="cancel-btn" onClick={() => setEditingCamp(null)}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={() => handleSaveNote(editingCamp)}>
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer>
        <div className="container">
          <p>Email: <a href="mailto:camelgirl.summercamp@gmail.com">camelgirl.summercamp@gmail.com</a></p>
          <p>Last updated: January 2026</p>
        </div>
      </footer>
    </>
  );
}

export default Admin;
