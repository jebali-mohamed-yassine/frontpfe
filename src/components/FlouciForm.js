import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlouciForm = () => {
  const [id, setId] = useState(null);
  const [appSecret, setAppSecret] = useState('');
  const [appToken, setAppToken] = useState('');
  const [developerTrackingId, setDeveloperTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const appId = sessionStorage.getItem('app_id');

      try {
        const response = await axios.get(`http://localhost:9095/tritux/Flouci/tokens/${appId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Mettre à jour les états avec les données récupérées
        setId(response.data.id);
        setAppSecret(response.data.appSecret);
        setAppToken(response.data.appToken);
        setDeveloperTrackingId(response.data.developerTrackingId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Ne pas afficher d'erreur pour les erreurs 404
          console.log('Aucune donnée trouvée pour cet ID d\'application.');
        } else {
          // Gérer les autres erreurs
          setError('Erreur lors de la récupération des données existantes: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!appSecret || !appToken || !developerTrackingId) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const payload = {
      appToken,
      appSecret,
      developerTrackingId,
      application: { id: sessionStorage.getItem('app_id') }
    };

    try {
      let response;
      if (id) {
        payload.id = id;
        response = await axios.put('http://localhost:9095/tritux/Flouci/tokens/update', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        response = await axios.post('http://localhost:9095/tritux/Flouci/tokens/add', payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage(id ? 'Données mises à jour avec succès !' : 'Données ajoutées avec succès !');
      } else {
        throw new Error('Échec de l\'opération');
      }
    } catch (error) {
      setError('Erreur lors de l\'opération: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{id ? 'Mettre à jour Flouci' : 'Ajouter Flouci'}</h1>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="appSecret">Flouci Secret :</label>
            <input type="text" id="appSecret" value={appSecret} onChange={(e) => setAppSecret(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="appToken">Flouci Token :</label>
            <input type="text" id="appToken" value={appToken} onChange={(e) => setAppToken(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="developerTrackingId">Developer Tracking ID :</label>
            <input type="text" id="developerTrackingId" value={developerTrackingId} onChange={(e) => setDeveloperTrackingId(e.target.value)} />
          </div>
          <button type="submit" disabled={loading || !appSecret || !appToken || !developerTrackingId}>
            {loading ? 'En cours...' : (id ? 'Mettre à jour' : 'Ajouter')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlouciForm;
