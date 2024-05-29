import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css'; // Assurez-vous que ce chemin est correct

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:9095/tritux/auth/authenticate', {
        email,
        password
      });

      const { token } = response.data;
      sessionStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const usersResponse = await axios.get('http://localhost:9095/tritux/auth/users');
      const user = usersResponse.data.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (user && user.app && user.app.id) {
        sessionStorage.setItem('app_id', user.app.id);
      } else {
        sessionStorage.removeItem('app_id');
      }

      sessionStorage.setItem('role', user.roles && user.roles.some(role => role.name === 'ADMIN') ? 'ADMIN' : 'USER');
      sessionStorage.setItem('firstname', user.firstname || '');
      sessionStorage.setItem('userid', user.id.toString());
      
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Email ou mot de passe incorrect.");
        } else {
          setError(`Erreur: ${error.response.status} - ${error.response.data.message}`);
        }
      } else if (error.request) {
        setError("Pas de réponse du serveur.");
      } else {
        setError("Erreur lors de la création de la requête.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="custom-sidebar">
        <div className="sidebar-logo">
          <img src="/logook.png" alt="Logo TriTux" /> {/* Assurez-vous que le logo est dans le dossier public */}
        </div>
      </div>
      <div className="login-content">
        <div className="form-container">
          <h1>Connexion</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
