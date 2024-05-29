import React, { useState, useEffect } from "react";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Subscriptions as SubscriptionIcon,
  AppRegistration as AppRegistrationIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  List as ListIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountCircleIcon,
  SupervisorAccount as SupervisorAccountIcon,
  PersonAdd as PersonAddIcon,
  VerifiedUser as VerificationIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import '../Styles/Sidebar.css'; 

const Sidebar = ({ isAuthenticated, handleLogout }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFirstname, setUserFirstname] = useState("");
  const location = useLocation();

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setIsAdmin(storedRole === "ADMIN");

    const storedFirstname = sessionStorage.getItem("firstname");
    setUserFirstname(storedFirstname);
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div className="sidebar-container">
      
      <Menu className="custom-sidebar">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/logook.png`} alt="TriTux Gateway" className="logo" />
      </div>
        <div className="menu-content">
          <MenuItem
            component={<Link to="/dashboard" className="link" />}
            className={`custom-menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
            icon={<DashboardIcon />}
          >
            Tableau de bord
          </MenuItem>
          <SubMenu label="Abonnements" icon={<SubscriptionIcon />} className="custom-submenu">
            {isAuthenticated && !isAdmin && (
              <>
                <MenuItem icon={<AddCircleOutlineIcon />}>
                  <Link to="/ajouter-abonnement" className={`link ${location.pathname === '/ajouter-abonnement' ? 'active' : ''}`}>
                    Ajouter un abonnement
                  </Link>
                </MenuItem>
                <MenuItem icon={<ListIcon />}>
                  <Link to="/gestion-abonnement" className={`link ${location.pathname === '/gestion-abonnement' ? 'active' : ''}`}>
                    Gérer les abonnements
                  </Link>
                </MenuItem>
              </>
            )}
            <MenuItem icon={<ListIcon />}>
              <Link to="/liste-abonnement" className={`link ${location.pathname === '/liste-abonnement' ? 'active' : ''}`}>
                Liste des abonnements
              </Link>
            </MenuItem>
          </SubMenu>

          {isAdmin && (
            <MenuItem
              component={<Link to="/gestion-utilisateurs" className={`link gestion-utilisateurs ${location.pathname === '/gestion-utilisateurs' ? 'active' : ''}`} />}
              className="custom-menu-item"
              icon={<SupervisorAccountIcon />}
            >
              Gestion des utilisateurs
            </MenuItem>
          )}

          {isAdmin && (
            <SubMenu label="Applications" icon={<AppRegistrationIcon />} className="custom-submenu">
              <MenuItem icon={<AddCircleOutlineIcon />}>
                <Link to="/ajouter-application" className={`link ${location.pathname === '/ajouter-application' ? 'active' : ''}`}>
                  Ajouter une application
                </Link>
              </MenuItem>
              <MenuItem icon={<ListIcon />}>
                <Link to="/gestion-application" className={`link ${location.pathname === '/gestion-application' ? 'active' : ''}`}>
                  Gérer les applications
                </Link>
              </MenuItem>
              <MenuItem icon={<PersonAddIcon />}>
                <Link to="/ajouter-utilisateur" className={`link ${location.pathname === '/ajouter-utilisateur' ? 'active' : ''}`}>
                  Ajouter un utilisateur
                </Link>
              </MenuItem>
              <MenuItem icon={<VerificationIcon />}>
                <Link to="/Verification" className={`link ${location.pathname === '/Verification' ? 'active' : ''}`}>
                  Vérification de compte
                </Link>
              </MenuItem>
            </SubMenu>
          )}

          {isAuthenticated && !isAdmin && (
            <MenuItem className={`custom-menu-item ${location.pathname === '/methode-paiement' ? 'active' : ''}`} icon={<PaymentIcon />}>
              <Link to="/methode-paiement" className="link">
                Méthode de paiement
              </Link>
            </MenuItem>
          )}
          <div className="space-between-sections"></div>
          {isAuthenticated && (
            <SubMenu label={`${userFirstname}`} icon={<AccountCircleIcon />} className="custom-submenu">
              <MenuItem icon={<AccountCircleIcon />}>
                <Link to="/modifier-profil" className={`link ${location.pathname === '/modifier-profil' ? 'active' : ''}`}>
                  Modifier mon profil
                </Link>
              </MenuItem>
              <MenuItem icon={<ExitToAppIcon />} onClick={handleLogoutClick} className="custom-menu-item">
                Se déconnecter
              </MenuItem>
            </SubMenu>
          )}
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;