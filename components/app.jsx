import * as React from 'react';
import Dashboard from './dashboard.jsx';
import Login from './login.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

let App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);

window.onload = () => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};
