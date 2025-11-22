import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AddCategoryModal from '../components/AddCategoryModal';
import AddItemModal from '../components/AddItemModal';
import Chat from '../components/Chat';
import { Item } from '../types';

const Dashboard: React.FC = () => {
  const { categories, items, toggleItemCompleted, deleteItem } = useAppContext();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  // Agrupamento de itens por categoria
  const itemsByCategory = useMemo(() => {
    const grouped: { [key: string]: Item[] } = {};
    items.forEach(item => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    return grouped;
  }, [items]);
  
  // Cálculos de Totais por Categoria
  const categoryTotals = useMemo(() => {
    const catTotals: { [key: string]: { total: number; pending: number; paid: number } } = {};

    categories.forEach(category => {
        const categoryItems = itemsByCategory[category.id] || [];
        const total = categoryItems.reduce((sum, item) => sum + item.price, 0);
        const pending = categoryItems
            .filter(item => !item.completed)
            .reduce((sum, item) => sum + item.price, 0);
        const paid = total - pending;
        
        catTotals[category.id] = { total, pending, paid };
    });

    return catTotals;
  }, [categories, itemsByCategory]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
      
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-24">
            
            {/* Action Container (Apenas Botões) */}
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-inner mb-6 flex flex-col sm:flex-row justify-start items-center gap-4">
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => setCategoryModalOpen(true)} 
                        className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                        + Categoria
                    </button>
                    <button 
                        onClick={() => setItemModalOpen(true)} 
                        disabled={categories.length === 0}
                        className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        + Novo Item
                    </button>
                </div>
            </div>

            {/* Lista de Categorias (Cards) */}
            <div className="space-y-6">
                {categories.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">Sua lista está vazia.</p>
                        <p className="text-sm">Comece adicionando uma categoria acima.</p>
                    </div>
                )}
                
                {categories.map(category => {
                    const stats = categoryTotals[category.id] || { total: 0, pending: 0, paid: 0 };
                    const catItems = itemsByCategory[category.id] || [];

                    return (
                        <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Cabeçalho do Card */}
                            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                {/* Esquerda: Título e Ícones de Ação */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{category.name}</h3>
                                    <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity ml-2">
                                        <button className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors" aria-label="Editar Categoria">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" aria-label="Excluir Categoria">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Direita: Estatísticas da Categoria */}
                                <div className="flex flex-wrap items-center gap-2 text-sm font-medium w-full sm:w-auto justify-end">
                                    {/* Pendente (Vermelho) */}
                                    <div className="flex items-center gap-1 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded border border-red-100 dark:border-red-800/30">
                                        <span>A Pagar:</span>
                                        <span className="font-bold">R$ {stats.pending.toFixed(2)}</span>
                                    </div>

                                    {/* Pago (Verde) */}
                                    <div className="flex items-center gap-1 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded border border-green-100 dark:border-green-800/30">
                                        <span>Pago:</span>
                                        <span className="font-bold">R$ {stats.paid.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de Itens (Corpo do Card) */}
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {catItems.length > 0 ? (
                                    catItems.map(item => (
                                    <li key={item.id} className={`group p-3 sm:p-4 transition-colors ${item.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20'}`}>
                                        <div className="flex justify-between items-center gap-3">
                                            
                                            {/* LADO ESQUERDO: Checkbox, Info */}
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="pt-1">
                                                    <input 
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        onChange={() => toggleItemCompleted(item.id, item.completed)}
                                                        className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                                                    />
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-base font-medium truncate ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                                            {item.name}
                                                        </span>
                                                        
                                                        {/* Ícones de Link/Foto */}
                                                        <div className="flex items-center gap-1">
                                                            {item.productUrl && (
                                                                <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex-shrink-0 p-0.5" title="Ver Produto">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                                </a>
                                                            )}
                                                            {item.photoUrl && (
                                                                <a href={item.photoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 flex-shrink-0 p-0.5" title="Ver Foto">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Obs */}
                                                    {item.notes && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                                                            {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* LADO DIREITO: Preço e Ações */}
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <span className={`font-mono font-bold text-base ${item.completed ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                                    R$ {item.price.toFixed(2)}
                                                </span>
                                                
                                                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Editar">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => { if(window.confirm('Excluir este item?')) deleteItem(item.id); }}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" 
                                                        title="Excluir"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    ))
                                ) : (
                                    <li className="p-6 text-center text-sm text-gray-400 dark:text-gray-500 italic">
                                        Nenhum item nesta categoria.
                                    </li>
                                )}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
      </main>
      
      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
      <AddItemModal isOpen={isItemModalOpen} onClose={() => setItemModalOpen(false)} />
      <Chat isOpen={isChatOpen} onClose={() => setChatOpen(false)} />

      {/* Chat FAB */}
       <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 z-30 transition-transform hover:scale-105 active:scale-95"
        aria-label="Abrir chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;