import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('auth') === 'true';
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
