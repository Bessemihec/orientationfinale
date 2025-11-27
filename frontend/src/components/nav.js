import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/nav.css';
import logo from '../images/holmena.png';

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching user data, token exists:', !!token);
    
    if (!token) {
      setIsLoggedIn(false);
      setUsername('');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data fetched successfully:', data.etudiant.username);
        setUsername(data.etudiant.username);
        setIsLoggedIn(true);
      } else {
        console.log('Failed to fetch user data, response not ok');
        setIsLoggedIn(false);
        setUsername('');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  useEffect(() => {
    fetchUserData();

    // Listen for auth state changes
    const handleAuthChange = () => {
      console.log('Auth state change event received in navbar');
      setTimeout(() => fetchUserData(), 50);
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Also check for token changes on route changes
  useEffect(() => {
    fetchUserData();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setIsMobileMenuOpen(false);
    navigate('/auth');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).catch(err => console.error("Language change failed:", err));
    setShowLanguageDropdown(false);
  };

  const getCurrentLanguageLabel = () => {
    switch(i18n.language) {
      case 'en': return 'EN';
      case 'fr': return 'FR';
      case 'ar': return 'AR';
      default: return 'EN';
    }
  };

  const getNavLinks = () => {
    let links = [];

    if (!isLoggedIn) {
      links = [
        { to: '/', label: t('nav.home') },
        { to: '/score', label: t('nav.calculate_score') }
      ];
    } else {
      // Si l'utilisateur est admin
      if (username === 'admin') {
        links = [
          { to: '/', label: t('nav.home') },
          { to: '/etudiants', label: t('nav.students_list') },
          { to: '/dashboard', label: t('nav.dashboard') }
        ];
      } else {
        // Si c'est un utilisateur normal
        links = [
          { to: '/', label: t('nav.home') },
          { to: '/profile', label: t('nav.profile') },
          { to: '/myorientation', label: t('nav.my_orientations') },
          { to: '/speciality', label: t('nav.my_specialities') },
          { to: '/orientation-dashboard', label: t('nav.orientation_dashboard') }
        ];
      }
    }

    const orderedLinks = i18n.language === 'ar' ? [...links].reverse() : links;

    return orderedLinks.map((link, index) => (
      <Link 
        key={index} 
        to={link.to}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {link.label}
      </Link>
    ));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="main-nav" dir={i18n.dir()}>
      <div className="nav-left">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logo} alt="FindX Logo" className="nav-logo" />
        </Link>

        <div className="nav-links desktop-links">
          {getNavLinks()}
        </div>
      </div>

      <div className="nav-right">
        {isLoggedIn && username && (
          <span className="username-display">
            {username}
          </span>
        )}
        
        <div className="language-selector">
          <div 
            className="language-trigger"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          >
            {getCurrentLanguageLabel()}
          </div>
          
          {showLanguageDropdown && (
            <div className="language-dropdown">
              <div 
                className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN English
              </div>
              <div 
                className={`language-option ${i18n.language === 'fr' ? 'active' : ''}`}
                onClick={() => changeLanguage('fr')}
              >
                FR French
              </div>
              <div 
                className={`language-option ${i18n.language === 'ar' ? 'active' : ''}`}
                onClick={() => changeLanguage('ar')}
              >
                AR Arabic
              </div>
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <Link to="/auth" className="login-link" onClick={() => setIsMobileMenuOpen(false)}>
            {t('nav.login')}
          </Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            {t('nav.logout')}
          </button>
        )}

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
           onClick={() => setIsMobileMenuOpen(false)}>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          {isLoggedIn && username && (
            <span className="mobile-username">
              {username}
            </span>
          )}
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="mobile-nav-links">
          {getNavLinks()}
        </div>

        <div className="mobile-menu-footer">
          <div className="mobile-language-selector">
            <div className="mobile-language-label">{t('nav.language')}:</div>
            <div className="mobile-language-options">
              <button 
                className={`mobile-language-option ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
              <button 
                className={`mobile-language-option ${i18n.language === 'fr' ? 'active' : ''}`}
                onClick={() => changeLanguage('fr')}
              >
                FR
              </button>
              <button 
                className={`mobile-language-option ${i18n.language === 'ar' ? 'active' : ''}`}
                onClick={() => changeLanguage('ar')}
              >
                AR
              </button>
            </div>
          </div>

          {!isLoggedIn ? (
            <Link 
              to="/auth" 
              className="mobile-login-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.login')}
            </Link>
          ) : (
            <button 
              className="mobile-logout-btn" 
              onClick={handleLogout}
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;