import Dashboard from './dashboard.jsx';
import Events from './events.jsx';
import EventType from './eventType';
import Invitee from './invitee.jsx';
import Login from './login.jsx';
import Nav from './nav.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RequireAuth, AuthProvider } from './auth.jsx';
import { Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Event from './event.jsx';
import EventTypeAvailTimes from './eventTypeAvailTimes.jsx';
import UserBusyTimes from "./userBusyTimes";

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
      exact
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
    <Route
      path="/events/:uuid"
      element={
        <RequireAuth>
          <Event />
        </RequireAuth>
      }
    />
    <Route
      path="/events/:uuid/invitees"
      element={
        <RequireAuth>
          <Invitee />
        </RequireAuth>
      }
    />
    <Route path="/event_type_available_times"
    element={
      <RequireAuth>
        <EventTypeAvailTimes />
      </RequireAuth>
    }
    />
    <Route path="/user_busy_times"
    element={
      <RequireAuth>
        <UserBusyTimes />
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
