import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  LogOut,
  Moon,
  Sun,
  Download,
  Settings,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';
import StatsCard from '../components/StatsCard';
import ExpenseModal from '../components/ExpenseModal';
import ExpenseList from '../components/ExpenseList';
import Filters from '../components/Filters';
import Charts from '../components/Charts';
import BudgetAlerts from '../components/BudgetAlert';
import { exportToCSV, exportToPDF } from '../utils/export';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const { budgets } = useBudgets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesType = selectedType === 'all' || expense.type === selectedType;

      const matchesCategory = !selectedCategory || expense.category_id === selectedCategory;

      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);

      return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [expenses, searchTerm, selectedType, selectedCategory, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const totalIncome = expenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const totalExpense = expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const balance = totalIncome - totalExpense;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthIncome = expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return (
          exp.type === 'income' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthIncome = expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return (
          exp.type === 'income' &&
          date.getMonth() === lastMonth &&
          date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const incomeTrend =
      lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

    const thisMonthExpense = expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return (
          exp.type === 'expense' &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonthExpense = expenses
      .filter((exp) => {
        const date = new Date(exp.date);
        return (
          exp.type === 'expense' &&
          date.getMonth() === lastMonth &&
          date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const expenseTrend =
      lastMonthExpense > 0 ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      balance,
      incomeTrend,
      expenseTrend,
    };
  }, [expenses]);

  const budgetAlerts = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return budgets
      .filter((budget) => budget.month === currentMonth && budget.year === currentYear)
      .map((budget) => {
        const categoryExpenses = expenses
          .filter(
            (exp) =>
              exp.type === 'expense' &&
              exp.category_id === budget.category_id &&
              new Date(exp.date).getMonth() + 1 === currentMonth &&
              new Date(exp.date).getFullYear() === currentYear
          )
          .reduce((sum, exp) => sum + exp.amount, 0);

        const percentage = (categoryExpenses / budget.amount) * 100;

        if (percentage >= 80 && !dismissedAlerts.includes(budget.id)) {
          const category = categories.find((cat) => cat.id === budget.category_id);
          return {
            id: budget.id,
            categoryName: category?.name || 'Unknown',
            spent: categoryExpenses,
            budget: budget.amount,
            percentage,
          };
        }
        return null;
      })
      .filter((alert) => alert !== null);
  }, [budgets, expenses, categories, dismissedAlerts]);

  const handleSaveExpense = async (expenseData: any) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expenseData);
    } else {
      await addExpense(expenseData);
    }
    setEditingExpense(null);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteExpense(id);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredExpenses, categories);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredExpenses, categories);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Expense Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {budgetAlerts.length > 0 && (
          <div className="mb-6">
            <BudgetAlerts
              alerts={budgetAlerts}
              onDismiss={(id) => setDismissedAlerts([...dismissedAlerts, id])}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Income"
            amount={stats.totalIncome}
            icon={TrendingUp}
            color="bg-green-600"
            trend={{
              value: stats.incomeTrend,
              isPositive: stats.incomeTrend >= 0,
            }}
          />
          <StatsCard
            title="Total Expenses"
            amount={stats.totalExpense}
            icon={TrendingDown}
            color="bg-red-600"
            trend={{
              value: stats.expenseTrend,
              isPositive: stats.expenseTrend <= 0,
            }}
          />
          <StatsCard
            title="Balance"
            amount={stats.balance}
            icon={Wallet}
            color={stats.balance >= 0 ? 'bg-blue-600' : 'bg-orange-600'}
          />
        </div>

        <div className="mb-6">
          <Charts expenses={expenses} categories={categories} />
        </div>

        <div className="mb-6">
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            dateFrom={dateFrom}
            onDateFromChange={setDateFrom}
            dateTo={dateTo}
            onDateToChange={setDateTo}
            categories={categories}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        categories={categories}
        expense={editingExpense}
      />
    </div>
  );
}
