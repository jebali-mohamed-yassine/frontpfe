import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PayPalForm = () => {
  const [payPalId, setPayPalId] = useState(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => { // Marquez cette fonction comme asynchrone
      setLoading(true);
      const storedAppId = sessionStorage.getItem('app_id');
      const token = sessionStorage.getItem('token');

      if (storedAppId && token) {
        setAppId(storedAppId);
        try {
          const response = await axios.get(`http://localhost:9095/tritux/Paypal/tokens/${storedAppId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data) {
            setPayPalId(response.data.id);
            setClientId(response.data.clientId);
            setClientSecret(response.data.clientSecret);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log('Aucune donnée PayPal trouvée pour cet ID d\'application.');
          } else {
            setError('Erreur lors de la récupération des données PayPal: ' + error.message);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData(); // Appeler fetchData ici
  }, []); // Assurez-vous que useEffect ne s'exécute qu'une fois au montage

  const handleClientIdChange = (e) => setClientId(e.target.value);
  const handleClientSecretChange = (e) => setClientSecret(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const payload = {
      clientId,
      clientSecret,
      application: { id: appId }
    };

    if (payPalId) {
      payload.id = payPalId; // Inclure l'ID lors de la mise à jour
    }

    try {
      let response;
      if (payPalId) {
        response = await axios.put('http://localhost:9095/tritux/Paypal/tokens/update', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post('http://localhost:9095/tritux/Paypal/tokens/add', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Données PayPal ' + (payPalId ? 'mises à jour' : 'ajoutées') + ' avec succès !');
        setPayPalId(response.data.id); // Mise à jour de l'ID après ajout pour de futures mises à jour
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
    <div className="form-container">
      <h2>{payPalId ? 'Mettre à jour PayPal' : 'Ajouter PayPal'}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="clientId">Client ID:</label>
          <input type="text" id="clientId" value={clientId} onChange={handleClientIdChange} />
        </div>
        <div className="form-group">
          <label htmlFor="clientSecret">Client Secret:</label>
          <input type="text" id="clientSecret" value={clientSecret} onChange={handleClientSecretChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : (payPalId ? 'Mettre à jour' : 'Ajouter')}
        </button>
      </form>
    </div>
  );
};

export default PayPalForm;
