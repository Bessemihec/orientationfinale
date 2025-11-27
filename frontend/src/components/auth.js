import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../images/holmena.png';
import '../css/auth.css';

function AuthPage() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    bac_type: '',
    mg: 0,
    ville: ''
  });

  // ✅ FONCTION DE DÉBOGAGE - AJOUTÉE
  useEffect(() => {
    console.log('=== DÉBOGAGE GOOGLE AUTH ===');
    console.log('REACT_APP_GOOGLE_CLIENT_ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('GoogleOAuthProvider configuré:', !!process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('useGoogleLogin disponible:', !!useGoogleLogin);
    console.log('Environnement:', process.env.NODE_ENV);
    console.log('============================');
  }, []);

  // ✅ FONCTION POUR TESTER LA CONFIG GOOGLE - AJOUTÉE
  const testGoogleConfig = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      toast.error('❌ REACT_APP_GOOGLE_CLIENT_ID non trouvé!');
      console.error('❌ Client ID manquant');
      return false;
    }
    
    if (clientId.includes('votre_google_client_id')) {
      toast.error('❌ Client ID non configuré!');
      console.error('❌ Client ID par défaut détecté');
      return false;
    }
    
    toast.success('✅ Configuration Google OK!');
    console.log('✅ Client ID valide:', clientId);
    return true;
  };

  // Original bac types in Arabic (for API submission)
  const originalBacTypes = [
    'آداب', 'رياضيات', 'اقتصاد وتصرف', 'علوم تجريبية', 
    'العلوم التقنية', 'علوم الإعلامية', 'رياضة',
  ];

  // Villes disponibles (valeurs en arabe pour l'API)
  const villes = [
    'تونس الكبرى', 'بنزرت', 'نابل', 'زغوان', 'باجة', 'جندوبة', 
    'الكاف', 'سليانة', 'سوسة', 'المنستير', 'المهدية', 'صفاقس', 
    'القيروان', 'القصرين', 'سيدي بوزيد', 'قفصة', 'توزر', 'قبلي', 
    'قابس', 'مدنين', 'تطاوين'
  ];

  // Translation keys for UI (must match keys in your translation file)
  const bacTypeKeys = [
    'arts', 'math', 'economy', 'experimental', 
    'technical', 'computer', 'sport',
  ];

  // Translation keys for cities
  const villeKeys = [
    'tunis', 'bizerte', 'nabeul', 'zaghouan', 'beja', 'jendouba', 
    'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax', 
    'kairouan', 'kasserine', 'sidibouzid', 'gafsa', 'tozeur', 
    'kebili', 'gabes', 'medenine', 'tatouine'
  ];

  const navigate = useNavigate();

  // GOOGLE AUTH FUNCTION
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('🔑 Token Google reçu:', tokenResponse);
      setGoogleLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/google/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token
          }),
        });

        const data = await response.json();
        console.log('📡 Réponse backend:', data);

        if (response.ok) {
          localStorage.setItem('token', data.token);
          
          if (data.user.is_new_user) {
            toast.success(t('auth.googleWelcome'));
            // Rediriger vers le profil pour compléter
            setTimeout(() => navigate('/profile'), 1000);
          } else {
            toast.success(t('auth.googleWelcomeBack'));
            // Rediriger vers l'accueil
            setTimeout(() => navigate('/'), 1000);
          }
          
          window.dispatchEvent(new CustomEvent('authStateChanged'));
        } else {
          throw new Error(data.error || t('auth.googleError'));
        }
      } catch (error) {
        console.error('❌ Erreur Google auth:', error);
        toast.error(error.message || t('auth.networkError'));
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('❌ Erreur Google OAuth:', error);
      toast.error(t('auth.googleAuthFailed'));
      setGoogleLoading(false);
    }
  });

  const handleGoogleConnect = () => {
    console.log('🟢 Bouton Google cliqué');
    
    // Test de la configuration avant de continuer
    if (!testGoogleConfig()) {
      return;
    }
    
    googleLogin();
  };

  // Helper function to translate backend error messages
  const translateError = (error) => {
    if (!error) return t('auth.toast.loginError');
    
    const errorMessage = typeof error === 'object' ? error.message || JSON.stringify(error) : String(error);
    const errorLower = errorMessage.toLowerCase().trim();

    // Map backend error messages to translation keys
    const errorMappings = {
      'email not found': 'auth.emailNotFound',
      'email introuvable': 'auth.emailNotFound',
      'incorrect password': 'auth.incorrectPassword',
      'mot de passe incorrect': 'auth.incorrectPassword',
      'incorrect email or password': 'auth.toast.invalidCredentials',
      'username already exists': 'auth.usernameExists',
      'nom d\'utilisateur déjà utilisé': 'auth.usernameExists',
      'email already exists': 'auth.emailExists',
      'email déjà utilisé': 'auth.emailExists',
      'email already in use': 'auth.emailExists',
      'invalid email': 'auth.invalidEmail',
      'password must be at least 8 characters long': 'auth.toast.passwordRequirements',
      'password is too short': 'auth.toast.passwordTooShort',
      'password too short': 'auth.toast.passwordTooShort',
      'password too common': 'auth.toast.passwordTooCommon',
      'user not found': 'auth.toast.userNotFound',
      'email is required': 'auth.toast.emailRequired',
      'password is required': 'auth.toast.passwordRequired',
      'passwords don\'t match': 'auth.toast.passwordsDontMatch',
      'network error': 'auth.toast.networkError',
      'server error': 'auth.toast.networkError'
    };

    // Find matching error key
    for (const [key, translationKey] of Object.entries(errorMappings)) {
      if (errorLower.includes(key)) {
        return t(translationKey);
      }
    }

    // Default to the original error message if no translation found
    return errorMessage;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: motDePasse
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Show success toast
        toast.success(t('auth.toast.loginSuccess'), {
          autoClose: 2000,
          pauseOnHover: false
        });

        // Dispatch auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged'));

        // Wait for 2 seconds before navigating
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorMessage = translateError(data.error || data.detail || data.message || '');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = translateError(error);
      toast.error(errorMessage);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // ✅ SIMPLE VALIDATION - JUSTE LE TOAST
    if (registerData.password.length < 8) {
      toast.error(t('auth.toast.passwordRequirements'));
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...registerData,
          mg: 0
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('auth.toast.registerSuccess'));
        setEmail(registerData.email);
        setMotDePasse(registerData.password);
        setIsLogin(true);
      } else {
        const errorMessage = data.error ? translateError(data.error) : t('auth.toast.registerError');
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = translateError(error);
      toast.error(errorMessage);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };

  // Add RTL support for Arabic
  const pageDirection = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="auth-page-container" dir={pageDirection}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={i18n.language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Welcome Section */}
      <div className="auth-welcome-section">
        <img src={logo} alt="FindX Logo" className="auth-logo" />
        <h1 className="auth-welcome-title">{t('auth.welcomeTitle')}</h1>
        <p className="auth-welcome-text">
          {t('auth.welcomeText')}
        </p>
      </div>

      {/* Form Section */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          {isLogin ? (
            <>
              <h2 className="auth-form-title">{t('auth.loginTitle')}</h2>

              <form onSubmit={handleLogin}>
                <label className="auth-form-label">{t('auth.email')}</label>
                <input
                  type="email"
                  className="auth-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.email')}
                />

                <label className="auth-form-label">{t('auth.password')}</label>
                <input
                  type="password"
                  className="auth-form-input"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  placeholder={t('auth.password')}
                />

                <button type="submit" className="auth-form-btn">
                  {t('auth.loginButton')}
                </button>

                {/* Bouton S'inscrire en dessous du bouton Login */}
                <button 
                  type="button" 
                  className="auth-form-switch-btn"
                  onClick={() => setIsLogin(false)}
                >
                  {t('auth.switchToRegister')}
                </button>

                {message && (
                  <p className={`auth-form-message ${message === t('auth.loginSuccess') ? 'auth-form-success' : 'auth-form-error'}`}>
                    {message}
                  </p>
                )}
              </form>

              {/* Google Connect Button - EN DESSOUS du formulaire */}
              <div className="auth-separator">
                <span className="auth-separator-text">{t('auth.or')}</span>
              </div>

              <button 
                type="button" 
                className="auth-google-btn"
                onClick={handleGoogleConnect}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <span className="auth-google-loading">
                    <div className="spinner"></div>
                    {t('auth.connecting')}
                  </span>
                ) : (
                  <>
                    <span className="auth-google-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </span>
                    {t('auth.connectWithGoogle')}
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <h2 className="auth-form-title">{t('auth.registerTitle')}</h2>

              <form onSubmit={handleRegister}>
                <label className="auth-form-label">{t('auth.username')}</label>
                <input
                  name="username"
                  className="auth-form-input"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  placeholder={t('auth.username')}
                />

                <label className="auth-form-label">{t('auth.email')}</label>
                <input
                  name="email"
                  type="email"
                  className="auth-form-input"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  placeholder={t('auth.email')}
                />

                <label className="auth-form-label">{t('auth.password')}</label>
                <input
                  name="password"
                  type="password"
                  className="auth-form-input"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  placeholder={t('auth.password')}
                />

                <label className="auth-form-label">{t('auth.bacType')}</label>
                <select
                  name="bac_type"
                  className="auth-form-input"
                  onChange={handleRegisterChange}
                  required
                  value={registerData.bac_type}
                >
                  <option value="">-- {t('auth.selectOption')} --</option>
                  {originalBacTypes.map((type, index) => (
                    <option key={type} value={type}>
                      {t(`bac.${bacTypeKeys[index]}`)}
                    </option>
                  ))}
                </select>

                <label className="auth-form-label">{t('auth.city')}</label>
                <select
                  name="ville"
                  className="auth-form-input"
                  onChange={handleRegisterChange}
                  required
                  value={registerData.ville}
                >
                  <option value="">-- {t('auth.selectCity')} --</option>
                  {villes.map((ville, index) => (
                    <option key={ville} value={ville}>
                      {t(`cities.${villeKeys[index]}`)}
                    </option>
                  ))}
                </select>

                <button type="submit" className="auth-form-btn">
                  {t('auth.registerButton')}
                </button>

                {/* Bouton Se connecter en dessous du bouton S'inscrire */}
                <button 
                  type="button" 
                  className="auth-form-switch-btn"
                  onClick={() => setIsLogin(true)}
                >
                  {t('auth.switchToLogin')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;