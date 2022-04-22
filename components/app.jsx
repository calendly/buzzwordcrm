import Dashboard from './dashboard.jsx';
import Nav from './nav.jsx';
import Login from './login.jsx';
import React from 'react';
import { RequireAuth, AuthConsumer, AuthProvider } from './auth.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

let App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
  </Routes>
);

window.onload = () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};
