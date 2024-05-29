import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; // Importation du fichier App.css

const ModifierProfil = () => {
  // Définissez les états pour les données du profil
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Nouvel état pour le message de succès
  const [userId, setUserId] = useState(null); // État pour stocker l'userId

  // Utilisez useEffect pour charger les données du profil une fois que le composant est monté
  useEffect(() => {
    // Fonction pour récupérer l'userId de sessionStorage
    const fetchUserId = () => {
      const storedUserId = sessionStorage.getItem('userid');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };

    fetchUserId();
  }, []);

  // Ajoutez une fonction de gestion pour soumettre les modifications du profil
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Créer un objet avec seulement les champs remplis
    const updatedData = {};
    if (firstname) updatedData.firstname = firstname;
    if (password) updatedData.password = password;

    // Vérifiez si l'objet updatedData n'est pas vide
    if (Object.keys(updatedData).length === 0) {
      setError('Aucune information à mettre à jour.');
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      // Récupérer le Bearer Token du sessionStorage ou localStorage
      const token = sessionStorage.getItem('token'); // ou localStorage.getItem('token');

      // Effectuez une requête pour mettre à jour les données du profil de l'utilisateur
      const response = await axios.put(`http://localhost:9095/tritux/auth/users/${userId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Vérifiez la réponse du serveur
      if (response.data) {
        setSuccess(true);
        setError(null);
      } else {
        setError('Une erreur inattendue est survenue.');
      }

      setLoading(false);
    } catch (error) {
      setError('Une erreur s\'est produite lors de la mise à jour du profil utilisateur.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Modifier le profil</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Profil mis à jour avec succès !</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">Prénom :</label>
          <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>Enregistrer les modifications</button>
      </form>
    </div>
  );
};

export default ModifierProfil;
