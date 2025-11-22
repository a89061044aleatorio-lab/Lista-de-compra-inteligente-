import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './hooks/useAppContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OldLists from './pages/OldLists';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div className="flex h-screen items-center justify-center dark:bg-slate-900"><div className="text-indigo-600">Carregando...</div></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/old-lists" element={<ProtectedRoute><OldLists /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;