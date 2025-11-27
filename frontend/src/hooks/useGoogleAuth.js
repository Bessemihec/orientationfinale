// src/hooks/useGoogleAuth.js
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Configuration Google OAuth
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = window.location.origin;
    
    // URL d'authentification Google
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const params = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
    };
    
    Object.keys(params).forEach(key => 
      authUrl.searchParams.append(key, params[key])
    );
    
    // Ouvrir une popup pour l'authentification Google
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      authUrl.toString(),
      'google_auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    // Vérifier régulièrement si la popup est fermée
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        setLoading(false);
      }
    }, 500);
    
    // Écouter les messages de la popup
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        handleGoogleToken(event.data.access_token);
        if (popup) popup.close();
        window.removeEventListener('message', messageListener);
        clearInterval(checkPopup);
      }
      
      if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        toast.error(event.data.error);
        if (popup) popup.close();
        window.removeEventListener('message', messageListener);
        setLoading(false);
        clearInterval(checkPopup);
      }
    };
    
    window.addEventListener('message', messageListener);
  };

  const handleGoogleToken = async (access_token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: access_token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        if (data.user.is_new_user) {
          toast.success(t('auth.googleWelcome'));
        } else {
          toast.success(t('auth.googleWelcomeBack'));
        }

        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        throw new Error(data.error || t('auth.googleError'));
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(error.message || t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleLogin, loading };
};