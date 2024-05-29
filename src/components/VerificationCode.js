import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

const VerificationCode = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const bearerToken = sessionStorage.getItem("token");

      if (!bearerToken) {
        throw new Error("Jetons d'authentification manquant.");
      }

      const response = await axios.get(`http://localhost:9095/tritux/auth/activate-account?token=${verificationCode}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });

      setLoading(false);
      setSuccessMessage('Code de vérification correct !');
      navigate('/gestion-utilisateurs'); // Corrected to match the intended redirection after successful verification

    } catch (error) {
      setLoading(false);
      setError('Code de vérification incorrect. Veuillez réessayer.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Vérification du Code</h1>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verificationCode">Code de vérification :</label>
            <input 
              type="text" 
              id="verificationCode" 
              value={verificationCode} 
              onChange={(event) => setVerificationCode(event.target.value)} 
            />
          </div>
          <button type="submit" disabled={loading}>Vérifier</button>
        </form>
      </div>
    </div>
  );
};

export default VerificationCode;
