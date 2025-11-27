import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      confirmEmail();
    } else {
      setStatus('error');
      toast.error('Lien de confirmation invalide');
    }
  }, [token]);

  const confirmEmail = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/confirm-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        toast.success('Email confirmé avec succès !');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        toast.error(data.error || 'Erreur lors de la confirmation');
      }
    } catch (error) {
      setStatus('error');
      toast.error('Erreur réseau');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {status === 'loading' && (
          <div>
            <h2 style={{ color: '#667eea', marginBottom: '20px' }}>Confirmation en cours...</h2>
            <p>Veuillez patienter pendant que nous confirmons votre email.</p>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>✅ Email confirmé !</h2>
            <p>Votre compte a été activé avec succès.</p>
            <p>Redirection vers la page de connexion...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <h2 style={{ color: '#f44336', marginBottom: '20px' }}>❌ Erreur de confirmation</h2>
            <p>Le lien de confirmation est invalide ou a expiré.</p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px',
                fontSize: '16px'
              }}
            >
              Aller à la page de connexion
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default ConfirmEmailPage;