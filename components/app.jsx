import Dashboard from './dashboard.jsx';
import Events from './events.jsx';
import Invitee from './invitee.jsx';
import Login from './login.jsx';
import Nav from './nav.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RequireAuth, AuthConsumer, AuthProvider } from './auth.jsx';
import { Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Event from './event.jsx';

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
      exact path="/events"
      element={
        <RequireAuth>
          <Events />
        </RequireAuth>
      }
    />
    <Route path="/events/:uuid"
      element={
        <RequireAuth>
          <Event />
        </RequireAuth>
      }
    />
    <Route path="/events/:uuid/invitees"
      element={
        <RequireAuth>
          <Invitee />
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
