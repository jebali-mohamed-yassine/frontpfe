import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = ({ setUserRole }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!firstname || !lastname || !email || !password) {
      setLoading(false);
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9095/auth/register', {
        firstname,
        lastname,
        email,
        password,
        application: selectedApplication
      });
  
      setLoading(false);
      setSuccessMessage('Utilisateur ajouté avec succès ! Veuillez vérifier votre e-mail.');
      setUserRole('admin'); // Assume que l'inscription réussie fait de l'utilisateur un administrateur
      navigate('/verification');
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

  return (
    <div className="container">
      <div className="form-container">
        <h1>Ajouter un utilisateur</h1>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">Prénom :</label>
            <input type="text" id="firstname" value={firstname} onChange={(event) => setFirstname(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Nom de famille :</label>
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
          <button type="submit" disabled={loading}>Ajouter</button>
          <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
