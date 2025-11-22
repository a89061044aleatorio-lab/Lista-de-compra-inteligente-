import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const { messages, addMessage, user } = useAppContext();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-indigo-600 rounded-t-lg">
          <h3 className="text-lg font-medium text-white">Chat da Lista</h3>
          <button onClick={onClose} className="text-indigo-100 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
            {messages.map(msg => {
                const isMe = msg.user_name === user;
                return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-xs lg:max-w-md shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-tl-none'}`}>
                        {!isMe && <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{msg.user_name}</p>}
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                );
            })}
             <div ref={messagesEndRef} />
            </div>
        </main>

        <footer className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite..."
                  className="flex-1 px-4 py-2 text-gray-900 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button type="submit" className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
