// PaymentSelector.js
import React, { useState } from 'react';
import PayPalForm from './PayPalForm';
import FlouciForm from './FlouciForm';
import '../App'; // Importez le fichier CSS pour les styles personnalisés

const PaymentSelector = () => {
  // État pour suivre la méthode de paiement sélectionnée
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');

  // Fonction pour gérer le changement de méthode de paiement sélectionnée
  const handlePaymentMethodChange = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  return (
    <div>
      <h2>Choisissez votre méthode de paiement :</h2>
      <div className="payment-tabs">
        <div
          className={`payment-tab ${selectedPaymentMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          PayPal
        </div>
        <div
          className={`payment-tab ${selectedPaymentMethod === 'flouci' ? 'active' : ''}`}
          onClick={() => handlePaymentMethodChange('flouci')}
        >
          Flouci
        </div>
      </div>
      {/* Conditionnellement afficher le formulaire correspondant */}
      {selectedPaymentMethod === 'paypal' && <PayPalForm />}
      {selectedPaymentMethod === 'flouci' && <FlouciForm />}
    </div>
  );
};

export default PaymentSelector;
