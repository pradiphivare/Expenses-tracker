import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense } from '../hooks/useExpenses';
import { Category } from '../hooks/useCategories';

export function exportToCSV(expenses: Expense[], categories: Category[]) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Description'];
  const rows = expenses.map((exp) => [
    exp.date,
    exp.title,
    getCategoryName(exp.category_id),
    exp.type,
    exp.amount.toFixed(2),
    exp.description || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(expenses: Expense[], categories: Category[]) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Expense Report', 14, 20);

  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const totalIncome = expenses
    .filter((exp) => exp.type === 'income')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpense = expenses
    .filter((exp) => exp.type === 'expense')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const balance = totalIncome - totalExpense;

  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 40);
  doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, 47);
  doc.text(`Balance: $${balance.toFixed(2)}`, 14, 54);

  const tableData = expenses.map((exp) => [
    exp.date,
    exp.title,
    getCategoryName(exp.category_id),
    exp.type,
    `$${exp.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`expenses_${new Date().toISOString().split('T')[0]}.pdf`);
}
