import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense } from '../hooks/useExpenses';
import { Category } from '../hooks/useCategories';

interface ChartsProps {
  expenses: Expense[];
  categories: Category[];
}

export default function Charts({ expenses, categories }: ChartsProps) {
  const expensesByCategory = expenses
    .filter((exp) => exp.type === 'expense')
    .reduce((acc, expense) => {
      const categoryName = expense.category_id
        ? categories.find((cat) => cat.id === expense.category_id)?.name || 'Uncategorized'
        : 'Uncategorized';

      const categoryColor = expense.category_id
        ? categories.find((cat) => cat.id === expense.category_id)?.color || '#6B7280'
        : '#6B7280';

      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
      }
      acc[categoryName].value += expense.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  const pieData = Object.values(expensesByCategory);

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (expense.type === 'income') {
      acc[month].income += expense.amount;
    } else {
      acc[month].expense += expense.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const barData = Object.values(monthlyData).slice(-6);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Income: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Expense: ${payload[1].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No data available for charts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expenses by Category
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Overview (Last 6 Months)
        </h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<BarTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expense" fill="#EF4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
