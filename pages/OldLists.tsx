import React, { useState } from 'react';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';

const OldLists: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen">
            <Header onMenuClick={() => setMenuOpen(true)} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
            <main className="flex-1 p-6 bg-slate-100 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Listas Antigas</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Esta funcionalidade estará disponível em breve! Aqui você poderá ver suas listas de compras salvas anteriormente.</p>
                </div>
            </main>
        </div>
    );
};

export default OldLists;