import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAppStore, FaMoneyCheckAlt, FaDollarSign } from 'react-icons/fa';
import { MdSubscriptions } from 'react-icons/md';
import DashAbonnement from './DashAbonnement';
import DashApplication from './DashApplication';
import DashTransaction from './DashTransaction';
import DashVente from './DashVente';
import '../Styles/Dashboard.css';

function Dashboard() {
  const role = sessionStorage.getItem('role'); // Récupération du rôle dès que possible
  const appId = parseInt(sessionStorage.getItem('app_id')); // Convertir app_id en nombre
  const initialTab = role === 'ADMIN' ? 'abonnement' : 'transaction'; // Set initial tab based on role
  const [tab, setTab] = useState(initialTab);
  const [appCount, setAppCount] = useState(0);
  const [subCount, setSubCount] = useState(0);
  const [transCount, setTransCount] = useState(0);
  const [revenue, setRevenue] = useState(0); // Nouvel état pour le revenu
  const [loading, setLoading] = useState(true);
  const [abonnements, setAbonnements] = useState([]); // Nouvel état pour stocker les abonnements

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAbonnementDetails = async (abonnementId) => {
      try {
        const response = await axios.get(`http://localhost:9095/tritux/Abonnement/abonnementById?id=${abonnementId}`, { headers });
        if (response.data.app.id === appId) {
          return response.data.tarif;
        }
        return 0;
      } catch (error) {
        console.error('Error fetching abonnement details:', error);
        return 0;
      }
    };

    if (role === 'ADMIN') {
      axios.get('http://localhost:9095/tritux/Abonnement/List', { headers })
        .then(response => {
          const apps = new Set(response.data.map(sub => sub.app.nom));
          setAppCount(apps.size);
          setSubCount(response.data.filter(sub => sub.app.id === appId).length); // Filtrer par appId
          setLoading(false);
        })
        .catch(error => setLoading(false));
    } else if (role === 'USER') {
      axios.get(`http://localhost:9095/tritux/Abonnement/findAbonnementByAppId?appId=${appId}`, { headers })
        .then(response => {
          setAbonnements(response.data); // Stocker les abonnements dans l'état
          setSubCount(response.data.length);
        })
        .catch(error => setLoading(false));

      axios.get('http://localhost:9095/tritux/Flouci/infopayment', { headers })
        .then(async response => {
          const filteredPayments = response.data.filter(payment => {
            const abonnement = abonnements.find(a => parseInt(a.id) === payment.abonnementId);
            return abonnement && abonnement.app.id === appId;
          });
          setTransCount(filteredPayments.length);
          let totalRevenue = 0;

          for (const payment of filteredPayments) {
            const tarif = await fetchAbonnementDetails(payment.abonnementId);
            totalRevenue += tarif;
          }

          setRevenue(totalRevenue);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching payment info:', error);
          setLoading(false);
        });
    }
  }, [role, appId, abonnements]); // Include role, appId, and abonnements in the dependency array

  if (loading) return <div>Loading...</div>;

  return (
    <div className="content">
      <div className="dashboard-info">
        {role === 'ADMIN' ? (
          <>
            <div className="info-box">
              <FaAppStore className="info-icon" />
              <span className="info-title">Nombre d'application:</span>
              <span className="info-value">{appCount}</span>
            </div>
            <div className="info-box">
              <MdSubscriptions className="info-icon" />
              <span className="info-title">Nombre d'abonnement:</span>
              <span className="info-value">{subCount}</span>
            </div>
          </>
        ) : (
          <>
            <div className="info-box">
              <MdSubscriptions className="info-icon" />
              <span className="info-title">Nombre d'abonnement:</span>
              <span className="info-value">{subCount}</span>
            </div>
            <div className="info-box">
              <FaMoneyCheckAlt className="info-icon" />
              <span className="info-title">Nombre de transactions:</span>
              <span className="info-value">{transCount}</span>
            </div>
            <div className="info-box">
              <FaDollarSign className="info-icon" />
              <span className="info-title">Revenu Total:</span>
              <span className="info-value">{revenue.toLocaleString('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 })}</span> {/* Affichage du revenu sans chiffres après la virgule */}
            </div>
          </>
        )}
      </div>
      <div className="tab-buttons">
        {role === 'ADMIN' && (
          <>
            <button onClick={() => setTab('abonnement')}>Abonnements</button>
            <button onClick={() => setTab('application')}>Applications</button>
          </>
        )}
        {role === 'USER' && (
          <>
            <button onClick={() => setTab('transaction')}>Transactions</button>
            <button onClick={() => setTab('vente')}>Ventes</button>
          </>
        )}
      </div>
      {tab === 'abonnement' && <DashAbonnement />}
      {tab === 'application' && <DashApplication />}
      {tab === 'transaction' && <DashTransaction />}
      {tab === 'vente' && <DashVente />}
    </div>
  );
}

export default Dashboard;