import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const AuthContext = React.createContext('auth');

const useAuth = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/authenticate').then((res) => res.json());
      setAuth(result);
    };

    fetchData();
  }, []);

  return auth;
};

const RequireAuth = ({ children }) => {
  const auth = AuthConsumer();
  const location = useLocation();

  if (!auth) return;

  if (!auth.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const AuthConsumer = () => {
  return React.useContext(AuthContext);
};

export { RequireAuth, AuthConsumer, AuthProvider };
