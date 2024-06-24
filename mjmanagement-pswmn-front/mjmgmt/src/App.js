import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registar from "./components/Registar";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import CriarAnuncio from "./components/CriarAnuncio";
import EditarAnuncio from "./components/EditarAnuncio";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import DetalhesAnuncio from "./components/DetalhesAnuncio";

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registar" element={<Registar />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }/>
            <Route path="/criar-anuncio" element={
              <ProtectedRoute>
                <CriarAnuncio />
              </ProtectedRoute>
            }/>
            <Route path="/anuncios/:id/editar" element={
              <ProtectedRoute>
                <EditarAnuncio />
              </ProtectedRoute>
            }/>
            <Route path="/anuncios/:id" element={<DetalhesAnuncio />}/>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
