import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; // Importation du fichier index.css

const AjouterAbonnement = () => {
  const [applications, setApplications] = useState([]);
  const [tarif, setTarif] = useState('');
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [bearerToken, setBearerToken] = useState("");
  const [loadingApps, setLoadingApps] = useState(true); // State pour suivre le chargement des applications
  const [selectedAppName, setSelectedAppName] = useState(''); // State pour stocker le nom de l'application sélectionnée

  useEffect(() => {
    // Récupérer le token JWT depuis le stockage de session
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setBearerToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Effectuer une requête pour récupérer les applications lorsque le composant est monté
    axios.get('http://localhost:9095/tritux/Application/List', {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    .then(response => {
      // Filtrer les applications pour afficher uniquement celle correspondant à l'`app_id`
      const filteredApplications = response.data.filter(app => app.id === parseInt(sessionStorage.getItem('app_id')));
      setApplications(filteredApplications);
      setLoadingApps(false); // Mettre à jour l'état du chargement une fois que les applications sont récupérées
      // Mettre à jour le nom de l'application sélectionnée
      if (filteredApplications.length > 0) {
        setSelectedAppName(filteredApplications[0].nom);
      }
    })
    .catch(error => {
      console.error('Error fetching applications:', error);
      setLoadingApps(false); // Mettre à jour l'état du chargement en cas d'erreur
    });
  }, [bearerToken]); // Exécuter cet effet lorsque le token JWT est mis à jour

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // Validation des champs obligatoires
    if (!tarif || !product) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    // Validation du tarif
    const parsedTarif = parseFloat(tarif);
    if (isNaN(parsedTarif) || parsedTarif <= 0) {
      setError('Veuillez saisir un tarif valide.');
      setLoading(false);
      return;
    }

    // Envoi de la requête POST pour créer un abonnement
    axios.post(
      'http://localhost:9095/tritux/Abonnement/add',
      {
        app: {
          id: parseInt(sessionStorage.getItem('app_id'))
        },
        tarif: parsedTarif,
        product: product
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    )
    .then(response => {
      setLoading(false);
      setSuccessMessage('Abonnement ajouté avec succès !');
      // Réinitialisation des champs du formulaire
      setTarif('');
      setProduct('');
    })
    .catch(error => {
      setLoading(false);
      setError('Erreur lors de l\'ajout de l\'abonnement. Veuillez réessayer.');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Ajouter un abonnement</h1>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="tarif">Tarif :</label>
            <input type="number" id="tarif" value={tarif} onChange={(event) => setTarif(event.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="product">Produit :</label>
            <input type="text" id="product" value={product} onChange={(event) => setProduct(event.target.value)} />
          </div>
          <button type="submit" disabled={!tarif || !product || loading}>
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterAbonnement;
