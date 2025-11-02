import { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none",
        className
      )}
      {...props}
    />
  );
}
