// Route.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../App.css"; // Importation du fichier index.css


const Home = () => {
  return (
    <>
      <h1 className="header">WELCOME TO QUICKPAY</h1>
      <h3>Bank of the free</h3>
      <p>Lorem ipsum dolor sit amet...</p>
    </>
  );
};

const Dashboard = () => {
  return (
    <>
      <h1 className="header"> DASHBOARD PAGE</h1>
      <h3>Welcome User</h3>
      <p>Lorem ipsum dolor sit amet...</p>
    </>
  );
};

const Transactions = () => {
  return (
    <>
      <h1 className="header">KEEP TRACK OF YOUR SPENDINGS</h1>
      <h3>Seamless Transactions</h3>
      <p>Lorem ipsum dolor sit amet...</p>
    </>
  );
};

export { Home, Dashboard, Transactions };
