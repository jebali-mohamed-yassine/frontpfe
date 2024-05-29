import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function DashAbonnement() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Authentication token is not available.');
      setError('Authentication token is not available');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    axios.get('http://localhost:9095/tritux/Abonnement/List', { headers })
      .then(response => {
        const appCounts = response.data.reduce((acc, sub) => {
          const appName = sub.app.nom;
          acc[appName] = (acc[appName] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(appCounts);
        const data = Object.values(appCounts);

        setChartData({
          labels,
          datasets: [{
            label: 'Nombre d\'abonnements',
            data,
            backgroundColor: ['#2C3E50', '#ECF0F1', '#4CAF50', '#FF9F05', '#0056b3', '#85144b'], // Couleurs modifiées
            hoverBackgroundColor: ['#1A242F', '#D5D9DB', '#388E3C', '#FF851B', '#003366', '#641E3C']
          }],
          options: {
            plugins: {
              title: {
                display: true,
                text: 'Répartition des abonnements par application',
                font: {
                  size: 16
                }
              }
            },
            responsive: true,
            maintainAspectRatio: false
          }
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to fetch subscriptions: ' + error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-container">
      <Pie data={chartData} options={chartData.options} />
    </div>
  );
}

export default DashAbonnement;
