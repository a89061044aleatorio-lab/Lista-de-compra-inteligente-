import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

// FIX: Changed children prop type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
