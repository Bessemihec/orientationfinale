import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // ✅ Assure-toi que le chemin est correct

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: motDePasse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token reçu:', data.token);
        localStorage.setItem('token', data.token);
        setMessage('Connexion réussie ✅');
        navigate('/');
      } else {
        setMessage(data.message || 'Échec de la connexion ❌');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setMessage('Erreur réseau ou serveur.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="title">Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label className="label">Email :</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Mot de passe :</label>
          <input
            type="password"
            className="input"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Se connecter</button>
      </form>

      {message && (
        <p className={message.includes('✅') ? 'message-success' : 'message-error'}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;
