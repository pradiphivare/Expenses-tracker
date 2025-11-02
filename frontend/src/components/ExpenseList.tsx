import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Expense } from '../hooks/useExpenses';
import { Category } from '../hooks/useCategories';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, categories, onEdit, onDelete }: ExpenseListProps) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return '#6B7280';
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Start by adding your first transaction
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                    {expense.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getCategoryColor(expense.category_id) }}
                  >
                    {getCategoryName(expense.category_id)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(expense.date)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`font-semibold text-lg ${
                      expense.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {expense.type === 'income' ? '+' : '-'}$
                    {expense.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
