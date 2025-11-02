import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, amount, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}% from last month
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
