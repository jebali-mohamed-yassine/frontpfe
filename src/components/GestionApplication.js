import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; // Assurez-vous d'importer le fichier CSS

const GestionApplication = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('Token is missing!');
      return;
    }

    // Fetch applications
    axios.get('http://localhost:9095/tritux/Application/List', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setApplications(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the applications!', error);
      });

    // Fetch users
    axios.get('http://localhost:9095/tritux/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, [token]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:9095/tritux/Application/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setApplications(applications.filter(app => app.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the application!', error);
      });
  };

  const getUserByAppId = (appId) => {
    const user = users.find(user => user.app && user.app.id === appId);
    return user ? `${user.firstname} ${user.lastname}` : 'Aucun utilisateur associé à cette application';
  };

  return (
    <div className="form-container">
      <h2>Gestion des Applications</h2>
      <div className="radio-buttons">
        {applications.map(app => (
          <label key={app.id} className={`radio-label ${selectedApplication?.id === app.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="application"
              value={app.id}
              checked={selectedApplication?.id === app.id}
              onChange={() => setSelectedApplication(app)}
            />
            <span>{app.nom}</span>
          </label>
        ))}
      </div>
      {selectedApplication && (
        <div className="application-details">
          <h3>Détails de l'application</h3>
          <p>Nom de l'application: {selectedApplication.nom}</p>
          <p>Nom de l'utilisateur: {getUserByAppId(selectedApplication.id)}</p>
          <button onClick={() => handleDelete(selectedApplication.id)}>Supprimer</button>
          <button onClick={() => setSelectedApplication(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
};

export default GestionApplication;
