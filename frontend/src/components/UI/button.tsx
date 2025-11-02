import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
