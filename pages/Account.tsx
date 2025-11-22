import React, { useState } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { useAppContext } from '../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { user, deleteAccount, logout } = useAppContext();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm('TEM CERTEZA? Isso apagará todos os seus itens, categorias e mensagens permanentemente. Esta ação não pode ser desfeita.')) {
            await deleteAccount();
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
            <Header onMenuClick={() => setMenuOpen(true)} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
            <main className="flex-1 p-6">
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Minha Conta</h1>
                    
                    {user && (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">E-mail conectado</p>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">{user.email}</p>
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Zona de Perigo</h3>
                                <div className="flex flex-col gap-4">
                                    <button 
                                        onClick={() => logout()}
                                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                                    >
                                        Sair da Conta
                                    </button>
                                    
                                    <button 
                                        onClick={handleDelete}
                                        className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40 rounded-md transition-colors text-center"
                                    >
                                        Excluir Conta e Dados
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Account;