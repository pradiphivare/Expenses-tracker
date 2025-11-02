
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 shadow-md rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{children}</h2>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
