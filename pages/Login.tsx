import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await login(email, password);
    
    if (error) {
      setError('Erro ao entrar. Verifique e-mail e senha.');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Bem-vindo</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Faça login na sua Lista de Compras</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md dark:bg-red-900/30 dark:text-red-300 text-center">{error}</div>}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Esqueceu a senha?</Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;