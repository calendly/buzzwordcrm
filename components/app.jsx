import Dashboard from './dashboard.jsx';
import Events from './events.jsx';
import EventType from './eventType';
import Login from './login.jsx';
import Nav from './nav.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RequireAuth, AuthConsumer, AuthProvider } from './auth.jsx';
import { Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

let App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      }
    />
    <Route
      path="/events"
      element={
        <RequireAuth>
          <Events />
        </RequireAuth>
      }
    />
    <Route
    path="/event_types/:uuid"
    element={
      <RequireAuth>
        <EventType />
      </RequireAuth>
    }
    />
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
