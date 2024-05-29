import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Importez le composant Navigate
import "../App.css";

const AddUser = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [bearerToken, setBearerToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setBearerToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole && storedRole.toLowerCase() === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:9095/tritux/Application/List', {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    .then(response => {
      setApplications(response.data);
    })
    .catch(error => {
      console.error('Error fetching applications:', error);
    });
  }, [bearerToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!firstname || !lastname || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstname,
        lastname,
        email,
        password,
        appId: role === 'user' ? selectedApplication : null, // Utilisez l'ID de l'application uniquement si le rôle est 'user'
        isAdmin: role === 'admin'
      };

      await axios.post('http://localhost:9095/tritux/auth/register', userData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      setLoading(false);
      setSuccessMessage('Utilisateur ajouté avec succès !');
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
      setSelectedApplication('');

    } catch (error) {
      setLoading(false);
      setError('Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.');
    }
  };

  if (!isAdmin) {
    return <div>Vous n'avez pas les autorisations nécessaires pour accéder à cette fonctionnalité.</div>;
  }

  // Si le succès est vrai, redirigez l'utilisateur vers la page de vérification
  if (successMessage) {
    return <Navigate to="/verification" />;
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Ajouter un utilisateur</h1>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Ajouter:</label>
            <div className="toggle-switch">
              <input type="checkbox" id="admin-toggle" checked={role === 'admin'} onChange={() => setRole(role === 'admin' ? 'user' : 'admin')} />
              <label htmlFor="admin-toggle" className="switch"></label>
            </div>
            <span>{role === 'admin' ? 'Admin' : 'User'}</span>
          </div>
          {role === 'user' && (
            <div className="form-group">
              <label htmlFor="application">Sélectionner une application :</label>
              <select id="application" value={selectedApplication} onChange={(event) => setSelectedApplication(event.target.value)}>
                <option value="">Sélectionner une application</option>
                {applications.map(application => (
                  <option key={application.id} value={application.id}>{application.nom}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="firstname">Prénom :</label>
            <input type="text" id="firstname" value={firstname} onChange={(event) => setFirstname(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Nom :</label>
            <input type="text" id="lastname" value={lastname} onChange={(event) => setLastname(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button type="submit" disabled={!isAdmin || !firstname || !lastname || !email || !password || loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
