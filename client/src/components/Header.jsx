import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ title, subtitle }) {
  const location = useLocation();
  
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
