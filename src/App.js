import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AjouterApplication from "./components/AjouterApplication";
import AjouterAbonnement from "./components/AjouterAbonnement";
import ListeAbonnement from "./components/ListeAbonnement";
import Login from "./components/Login";
import AddUser from "./components/AddUser";
import VerificationCode from "./components/VerificationCode";
import PaymentSelector from "./components/PaymentSelector";
import ModifierProfil from "./components/ModifierProfil";
import GestionUtilisateurs from "./components/GestionUtilisateurs";
import Dashboard from "./components/Dashboard";
import GestionAbonnement from "./components/GestionAbonnement";
import GestionApplication from "./components/GestionApplication"; // Importez le nouveau composant

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isAuthenticated && <Sidebar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}
      <section className="content">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<ListeAbonnement setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ajouter-application" element={<AjouterApplication />} />
              <Route path="/ajouter-abonnement" element={<AjouterAbonnement />} />
              <Route path="/liste-abonnement" element={<ListeAbonnement setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/ajouter-utilisateur" element={<AddUser />} />
              <Route path="/verification" element={<VerificationCode />} />
              <Route path="/methode-paiement" element={<PaymentSelector />} />
              <Route path="/modifier-profil" element={<ModifierProfil />} />
              <Route path="/gestion-utilisateurs" element={<GestionUtilisateurs />} />
              <Route path="/gestion-abonnement" element={<GestionAbonnement />} />
              <Route path="/gestion-application" element={<GestionApplication />} /> {/* Ajoutez cette ligne */}
            </>
          ) : (
            <>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </section>
    </div>
  );
};

export default App;
