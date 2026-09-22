import React from "react";
import { X } from "lucide-react";

interface ChipProps {
  value: string | number; // Representa o id ou identificador único do chip
  label: string;
  onClick?: (value: string | number) => void; // Inclui o id no callback
  onDelete?: (value: string | number) => void; // Inclui o id no callback
  variant?: "default" | "outlined";
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  value,
  label,
  onClick,
  onDelete,
  variant = "default",
  className = "",
  disabled = false,
}) => {
  const baseStyles = `flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium transition-opacity cursor-pointer`;
  const defaultStyles = `bg-stone-800 text-white hover:bg-stone-600`;
  const outlinedStyles = `border border-primary text-primary hover:bg-muted/90`;
  const disabledStyles = `opacity-50 cursor-not-allowed`;

  const combinedStyles = `${baseStyles} ${
    disabled ? disabledStyles : variant === "outlined" ? outlinedStyles : defaultStyles
  } ${className}`;

  const baseButtonStyles = `flex items-center justify-center w-4 h-4 rounded-full focus:outline-none`;
  const defaultButtonStyles = `bg-stone-600 dark:text-white text-primary-foreground hover:bg-stone-500`;
  const outlinedButtonStyles = `bg-stone-200 dark:text-black text-primary hover:bg-stone-300`;

  const combinedButtonStyles = `${baseButtonStyles} ${variant === "outlined" ? outlinedButtonStyles : defaultButtonStyles}`;

  return (
    <div
      className={combinedStyles}
      onClick={!disabled ? () => onClick?.(value) : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !disabled && onClick) {
          onClick(value);
        }
      }}
    >
      <span>{label}</span>
      {onDelete && !disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(value);
          }}
          className={combinedButtonStyles}
          type="button"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
