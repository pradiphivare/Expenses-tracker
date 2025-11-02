import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  period: 'monthly' | 'yearly';
  month: number | null;
  year: number;
  created_at: string;
  updated_at: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBudgets = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBudgets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const addBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('budgets')
      .insert({
        ...budget,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setBudgets((prev) => [data, ...prev]);
    }

    return { data, error };
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setBudgets((prev) => prev.map((bdg) => (bdg.id === id ? data : bdg)));
    }

    return { data, error };
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id);

    if (!error) {
      setBudgets((prev) => prev.filter((bdg) => bdg.id !== id));
    }

    return { error };
  };

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
}
