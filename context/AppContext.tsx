import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Category, Item, Message } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  recoverPassword: (email: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  items: Item[];
  addItem: (itemData: Omit<Item, 'id' | 'completed' | 'user_id'>) => Promise<void>;
  toggleItemCompleted: (itemId: string, currentStatus: boolean) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  messages: Message[];
  addMessage: (text: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Verificar sessão atual ao carregar
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchData(session.user.id);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData(session.user.id);
      } else {
        setCategories([]);
        setItems([]);
        setMessages([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carregar dados do Supabase filtrando pelo usuário
  const fetchData = async (userId: string) => {
    if (!userId) return;

    const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
    if (cats) setCategories(cats);

    const { data: itms } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
    
    if (itms) {
        const mappedItems = itms.map((i: any) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            categoryId: i.category_id,
            completed: i.completed,
            photoUrl: i.photo_url,
            productUrl: i.product_url,
            notes: i.notes,
            user_id: i.user_id
        }));
        setItems(mappedItems);
    }

    // Mensagens podem ser globais ou por usuário, aqui deixarei global para chat compartilhado 
    // ou você pode filtrar por user_id se for anotação pessoal. 
    // Assumindo chat compartilhado global por enquanto, ou pessoal. 
    // Vamos filtrar por user_id para ser "bloco de notas" pessoal conforme pedido.
    const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    if (msgs) setMessages(msgs);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const recoverPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/account', // Redireciona para conta para mudar senha
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    // Como não podemos deletar o usuário do Auth via Client sem Edge Functions,
    // vamos apagar todos os DADOS do usuário e fazer logout.
    await supabase.from('items').delete().eq('user_id', user.id);
    await supabase.from('categories').delete().eq('user_id', user.id);
    await supabase.from('messages').delete().eq('user_id', user.id);
    
    await logout();
  };

  const addCategory = async (name: string) => {
    if (!user) return;
    const { error } = await supabase.from('categories').insert([{ name, user_id: user.id }]);
    if (error) console.error('Erro ao criar categoria:', error);
    else fetchData(user.id);
  };
  
  const addItem = async (itemData: Omit<Item, 'id' | 'completed' | 'user_id'>) => {
      if (!user) return;
      const payload = {
          name: itemData.name,
          price: itemData.price,
          category_id: itemData.categoryId,
          photo_url: itemData.photoUrl,
          product_url: itemData.productUrl,
          notes: itemData.notes,
          completed: false,
          user_id: user.id
      };
      
      const { error } = await supabase.from('items').insert([payload]);
      if (error) console.error('Erro ao adicionar item:', error);
      else fetchData(user.id);
  };

  const toggleItemCompleted = async (itemId: string, currentStatus: boolean) => {
      if (!user) return;
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, completed: !currentStatus } : i));

      const { error } = await supabase
        .from('items')
        .update({ completed: !currentStatus })
        .eq('id', itemId);
        
      if (error) {
          console.error('Erro ao atualizar item:', error);
          fetchData(user.id);
      }
  };

  const deleteItem = async (itemId: string) => {
      if (!user) return;
      const { error } = await supabase.from('items').delete().eq('id', itemId);
      if (error) console.error('Erro ao deletar:', error);
      else fetchData(user.id);
  }

  const addMessage = async (text: string) => {
      if(!user) return;
      // Usar email ou parte dele como nome
      const userName = user.email ? user.email.split('@')[0] : 'Usuário';
      
      const { error } = await supabase.from('messages').insert([{
          text,
          user_name: userName,
          user_id: user.id
      }]);
      if (error) console.error('Erro mensagem:', error);
      else fetchData(user.id);
  }

  return (
    <AppContext.Provider value={{ 
        user, loading, login, register, recoverPassword, logout, deleteAccount,
        categories, addCategory, 
        items, addItem, toggleItemCompleted, deleteItem,
        messages, addMessage 
    }}>
      {children}
    </AppContext.Provider>
  );
};