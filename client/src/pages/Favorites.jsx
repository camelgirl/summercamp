import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CampCard from '../components/CampCard';
import { useFavorites } from '../hooks/useFavorites';
import { useCamps } from '../hooks/useCamps';
import '../styles.css';

function Favorites() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();
  const { camps: communityCamps } = useCamps('/api/camps');
  const { camps: districtCamps } = useCamps('/api/school-districts');
  
  const [searchTerm, setSearchTerm] = useState('');

  // Get all camps and find favorites
  const allCamps = [...communityCamps, ...districtCamps];
  
  const favoriteCamps = useMemo(() => {
    return allCamps.filter(camp => {
      const campId = camp.name + (camp.category || camp.district ? `_${camp.category || camp.district}` : '');
      const isFav = favorites.includes(campId);
      
      // Also filter by search term if provided
      if (searchTerm && isFav) {
        const searchLower = searchTerm.toLowerCase();
        return (
          camp.name.toLowerCase().includes(searchLower) ||
          (camp.type && camp.type.toLowerCase().includes(searchLower)) ||
          (camp.location && camp.location.toLowerCase().includes(searchLower))
        );
      }
      
      return isFav;
    });
  }, [favorites, allCamps, searchTerm]);

  return (
    <>
      <Header 
        title="❤️ My Favorite Camps" 
        subtitle="Your saved summer camps" 
      />
      <main className="container">
        {favoritesCount === 0 ? (
          <div className="no-results">
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
              <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                No favorites yet
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                Start exploring camps and click the heart icon to save your favorites!
              </p>
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
            </div>
          </div>
        ) : (
          <>
            <div className="favorites-header">
              <div className="favorites-stats">
                <h2>{favoritesCount} {favoritesCount === 1 ? 'Camp' : 'Camps'} Saved</h2>
                {favoriteCamps.length < favoritesCount && (
                  <p className="search-note">
                    {favoritesCount - favoriteCamps.length} favorite(s) not found in current data
                  </p>
                )}
              </div>
              <div className="favorites-actions">
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="favorites-search"
                />
                <button 
                  className="clear-favorites-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all favorites?')) {
                      clearFavorites();
                    }
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {favoriteCamps.length === 0 && searchTerm ? (
              <div className="no-results">
                <p>No favorites match your search. Try a different term.</p>
              </div>
            ) : (
              <div className="camps-grid">
                {favoriteCamps.map((camp, index) => (
                  <CampCard key={index} camp={camp} />
                ))}
              </div>
            )}
          </>
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

export default Favorites;
