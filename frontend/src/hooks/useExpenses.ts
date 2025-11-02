import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error && data) {
      setExpenses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setExpenses((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? data : exp)));
    }

    return { data, error };
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (!error) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }

    return { error };
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
}
