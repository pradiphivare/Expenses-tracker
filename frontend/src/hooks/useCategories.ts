import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  created_at: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const addCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...category,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setCategories((prev) => [...prev, data]);
    }

    return { data, error };
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)));
    }

    return { data, error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (!error) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }

    return { error };
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
