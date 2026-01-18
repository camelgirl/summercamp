import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import './Header.css';

function Header({ title, subtitle }) {
  const location = useLocation();
  const { favoritesCount } = useFavorites();
  
  return (
    <header>
      <div className="container">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Community Camps
          </Link>
          <Link 
            to="/school-districts" 
            className={`nav-link ${location.pathname === '/school-districts' ? 'active' : ''}`}
          >
            School Districts
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
            onClick={(e) => {
              // Ensure navigation works
              console.log('Navigating to favorites, count:', favoritesCount);
            }}
          >
            <span>❤️ Favorites</span>
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
