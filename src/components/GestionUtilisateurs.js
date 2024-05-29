import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; // Assurez-vous que le chemin vers votre fichier CSS est correct

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:9095/tritux/auth/users', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Une erreur s\'est produite lors de la récupération des utilisateurs.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');
    if (confirmDelete) {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`http://localhost:9095/tritux/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });

        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setLoading(false);
      } catch (error) {
        setError('Une erreur s\'est produite lors de la suppression de l\'utilisateur.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Gérer les utilisateurs</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Application</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstname}</td>
                <td>{user.lastname || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.app ? user.app.nom : 'Admin'}</td>
                <td>
                  <button className="small-delete-button" onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GestionUtilisateurs;
