import { AlertTriangle, X } from 'lucide-react';

interface BudgetAlert {
  id: string;
  categoryName: string;
  spent: number;
  budget: number;
  percentage: number;
}

interface BudgetAlertProps {
  alerts: BudgetAlert[];
  onDismiss: (id: string) => void;
}

export default function BudgetAlerts({ alerts, onDismiss }: BudgetAlertProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg p-4 ${
            alert.percentage >= 100
              ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
              : 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                alert.percentage >= 100
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold ${
                  alert.percentage >= 100
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}
              >
                {alert.percentage >= 100 ? 'Budget Exceeded!' : 'Budget Warning'}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  alert.percentage >= 100
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}
              >
                You've spent <strong>${alert.spent.toFixed(2)}</strong> of your{' '}
                <strong>${alert.budget.toFixed(2)}</strong> budget for{' '}
                <strong>{alert.categoryName}</strong> ({alert.percentage.toFixed(0)}%)
              </p>
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className={`flex-shrink-0 ${
                alert.percentage >= 100
                  ? 'text-red-600 hover:text-red-700 dark:text-red-400'
                  : 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
