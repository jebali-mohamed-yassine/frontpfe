import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/ListeAbonnement.css"; // Chemin mis à jour

function ListeAbonnement() {
  const [abonnements, setAbonnements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bearerToken, setBearerToken] = useState("");

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setBearerToken(storedToken);
    }
  }, []);

  useEffect(() => {
    async function fetchAbonnements() {
      try {
        let apiUrl = "";
        const storedRole = sessionStorage.getItem("role").toLowerCase(); // Convert role to lowercase
        const storedAppId = sessionStorage.getItem("app_id");

        if (storedRole === "admin") {
          apiUrl = "http://localhost:9095/tritux/Abonnement/List";
        } else if (storedRole === "user" && storedAppId) {
          apiUrl = `http://localhost:9095/tritux/Abonnement/findAbonnementByAppId?appId=${storedAppId}`;
        } else {
          console.error("Invalid role or missing app_id in session storage.");
          return;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (Array.isArray(response.data)) {
          setAbonnements(response.data);
        } else {
          console.error("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching abonnements:", error);
        if (error.response && error.response.status === 401) {
          sessionStorage.removeItem("token");
          window.location.reload();
        }
      }
    }

    if (bearerToken) {
      fetchAbonnements();
    }
  }, [bearerToken]);

  let filteredAbonnements = [];
  if (Array.isArray(abonnements)) {
    filteredAbonnements = abonnements.filter(
      (abonnement) =>
        abonnement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (abonnement.app &&
          abonnement.app.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  return (
    <div className="table-content">
      <div className="table-wrapper">
        <div className="search-container">
          <form className="text-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <div className="custom-table-container table-container">
          <table className="custom-table table">
            <thead>
              <tr>
                <th>Abonnement</th>
                <th>Application</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbonnements.map((abonnement, index) => (
                <tr key={index}>
                  <td>{abonnement.product}</td>
                  <td>{abonnement.app && abonnement.app.nom}</td>
                  <td>{abonnement.tarif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListeAbonnement;
