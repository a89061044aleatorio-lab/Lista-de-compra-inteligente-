import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">Menu</h2>
          
          <div className="mb-6 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">Usuário</span>
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate" title={user?.email}>{user?.email || 'Visitante'}</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              <li><Link to="/" onClick={onClose} className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-medium">Lista de Compras</Link></li>
              <li><Link to="/account" onClick={onClose} className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-medium">Minha Conta</Link></li>
            </ul>
          </nav>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleLogout} className="w-full flex items-center py-2 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;