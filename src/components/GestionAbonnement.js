import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; // Assurez-vous d'importer le fichier CSS

const GestionAbonnement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [product, setProduct] = useState('');
  const [tarif, setTarif] = useState('');
  const appId = sessionStorage.getItem('app_id');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!appId || !token) {
      console.error('App ID or token is missing!');
      return;
    }

    // Fetch subscriptions
    axios.get(`http://localhost:9095/tritux/Abonnement/findAbonnementByAppId?appId=${appId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setSubscriptions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the subscriptions!', error);
      });
  }, [appId, token]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:9095/tritux/Abonnement/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the subscription!', error);
      });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:9095/tritux/Abonnement/update`, {
      id: selectedSubscription.id,
      product,
      tarif
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setSubscriptions(subscriptions.map(sub => sub.id === selectedSubscription.id ? response.data : sub));
        setSelectedSubscription(null);
        setProduct('');
        setTarif('');
      })
      .catch(error => {
        console.error('There was an error updating the subscription!', error);
      });
  };

  return (
    <div className="form-container">
      <h2>Gestion des Abonnements</h2>
      <div className="radio-buttons-container">
        <div className="radio-buttons">
          {subscriptions.map(sub => (
            <label key={sub.id} className={`radio-label ${selectedSubscription?.id === sub.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="subscription"
                value={sub.id}
                checked={selectedSubscription?.id === sub.id}
                onChange={() => {
                  setSelectedSubscription(sub);
                  setProduct(sub.product);
                  setTarif(sub.tarif);
                }}
              />
              <span>{sub.product}</span>
            </label>
          ))}
        </div>
      </div>
      {selectedSubscription && (
        <div className="subscription-details">
          <h3>Modifier l'abonnement</h3>
          <div className="form-group">
            <label>Produit :</label>
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tarif :</label>
            <input type="number" value={tarif} onChange={(e) => setTarif(e.target.value)} />
          </div>
          <button onClick={handleUpdate}>Mettre à jour</button>
          <button onClick={() => handleDelete(selectedSubscription.id)}>Supprimer</button>
          <button onClick={() => {
            setSelectedSubscription(null);
            setProduct('');
            setTarif('');
          }}>Annuler</button>
        </div>
      )}
    </div>
  );
};

export default GestionAbonnement;
