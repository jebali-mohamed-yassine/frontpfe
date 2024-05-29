import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "../App.css"; // Importation du fichier index.css

const AjouterApplication = () => {
  const [formData, setFormData] = useState({
    nom: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [successClass, setSuccessClass] = useState('');
  const [errorClass, setErrorClass] = useState('');
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    setSuccessClass('');
    setErrorClass('');

    if (!formData.nom) {
      setError('Veuillez remplir le champ nom.');
      setErrorClass('error-message');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem("token"); // Récupérer le token Bearer depuis le stockage de session

    axios.post('http://localhost:9095/tritux/Application/add', formData, {
      headers: {
        'Authorization': `Bearer ${token}` // Ajouter le token Bearer dans les en-têtes de la requête
      }
    })
    .then(response => {
      setLoading(false);
      setSuccessMessage('Application ajoutée avec succès !');
      setSuccessClass('success-message');
      setFormData({
        nom: "",
      });
      navigate('/ajouter-utilisateur'); // Rediriger vers la page d'ajout d'utilisateur
    })
    .catch(error => {
      setLoading(false);
      setError('Erreur lors de l\'ajout de l\'application. Veuillez réessayer.');
      setErrorClass('error-message');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Ajouter une application</h1>
        <form onSubmit={handleSubmit}>
          <p className={errorClass}>{error}</p>
          <p className={successClass}>{successMessage}</p>
          <div className="form-group">
            <label htmlFor="nom">Nom de l'application:</label>
            <input
              type="text"
              name="nom"
              id="nom"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={!formData.nom || loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterApplication;
