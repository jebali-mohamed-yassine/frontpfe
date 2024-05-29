import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function DashTransaction() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const appId = parseInt(sessionStorage.getItem('app_id')); // Convertir app_id en nombre
    if (!token) {
      console.error('Authentication token is not available.');
      setError('Authentication token is not available');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios.get(`http://localhost:9095/tritux/Abonnement/findAbonnementByAppId?appId=${appId}`, { headers })
      .then(response => {
        const abonnements = response.data;

        axios.get('http://localhost:9095/tritux/Flouci/infopayment', { headers })
          .then(paymentResponse => {
            const filteredPayments = paymentResponse.data.filter(payment => {
              const abonnement = abonnements.find(a => parseInt(a.id) === payment.abonnementId);
              return abonnement && abonnement.app.id === appId;
            });

            const paymentCounts = filteredPayments.reduce((acc, payment) => {
              const paymentSystem = payment.paymentSystem;
              acc[paymentSystem] = (acc[paymentSystem] || 0) + 1;
              return acc;
            }, {});

            console.log('Payment counts:', paymentCounts);

            const labels = Object.keys(paymentCounts);
            const data = Object.values(paymentCounts);

            setChartData({
              labels,
              datasets: [{
                label: 'Transactions par système de paiement',
                data,
                backgroundColor: ['#2C3E50', '#ECF0F1', '#4CAF50', '#FF9F05', '#0056b3', '#85144b'],
                hoverBackgroundColor: ['#1A242F', '#D5D9DB', '#388E3C', '#FF851B', '#003366', '#641E3C']
              }]
            });
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching payment info:', error);
            setError('Failed to fetch payment info: ' + error.message);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching abonnement info:', error);
        setError('Failed to fetch abonnement info: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-container">
      <Pie data={chartData} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Transactions par système de paiement',
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }} />
    </div>
  );
}

export default DashTransaction;
