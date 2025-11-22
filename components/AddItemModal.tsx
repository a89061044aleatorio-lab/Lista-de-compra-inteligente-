import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Novos campos
  const [photoUrl, setPhotoUrl] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [notes, setNotes] = useState('');

  const { categories, addItem } = useAppContext();

  useEffect(() => {
    if (isOpen && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [isOpen, categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && categoryId) {
      addItem({
          name: name.trim(), 
          price: parseFloat(price) || 0, 
          categoryId,
          photoUrl: photoUrl.trim(),
          productUrl: productUrl.trim(),
          notes: notes.trim()
      });
      
      // Limpar campos
      setName('');
      setPrice('');
      setPhotoUrl('');
      setProductUrl('');
      setNotes('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg my-8 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Novo Item</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Fileira 1: Nome do Item */}
          <div>
            <label htmlFor="item-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome do Produto *</label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
              placeholder="Ex: Arroz 5kg"
            />
          </div>
          
          {/* Fileira 2: Preço e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="item-price" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Preço Estimado</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                        id="item-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="item-category" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                <select
                id="item-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                <option value="" disabled>Selecione...</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                </select>
            </div>
          </div>

          {/* Fileira 3: Foto e Link (Opcionais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
             <div>
                <label htmlFor="item-photo" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Link da Foto (URL)</label>
                <input
                id="item-photo"
                type="url"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="item-link" className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Link da Loja (URL)</label>
                <input
                id="item-link"
                type="url"
                placeholder="https://..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
          </div>

          {/* Fileira 4: Observações */}
          <div>
              <label htmlFor="item-notes" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Observações</label>
              <textarea
              id="item-notes"
              rows={2}
              placeholder="Marca preferida, detalhes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Salvar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;