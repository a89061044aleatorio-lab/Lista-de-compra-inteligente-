import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { recoverPassword } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await recoverPassword(email);

    if (error) {
      setError(error.message || 'Erro ao enviar e-mail.');
    } else {
      setMessage('Verifique seu e-mail para redefinir a senha.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Recuperar Senha</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Digite seu e-mail para receber o link de redefinição.</p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</div>}
          {message && <div className="text-green-500 text-sm text-center bg-green-50 dark:bg-green-900/30 p-2 rounded">{message}</div>}
          
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
            <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Lembrou a senha?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para o Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;