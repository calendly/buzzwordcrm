import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './login.jsx';

let App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
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
