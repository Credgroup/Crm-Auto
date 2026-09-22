import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  calculateStrength,
  getStrengthLabel,
} from "./PasswordStrengthMeterHook";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({
  password,
  className,
}: Readonly<PasswordStrengthMeterProps>) {
  const [strength, setStrength] = useState<number>(0);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const strengthLabel = getStrengthLabel(strength);
  
  // Extract nested ternary into independent statement
  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
      case 4:
        return "bg-yellow-500";
      case 5:
        return "bg-green-300";
      default:
        return "hidden";
    }
  };
  
  const strengthColor = getStrengthColor(strength);

  return (
    <div
      className={clsx(
        className,
        "mt-2 flex justify-end items-center gap-2 pointer-events-none"
      )}
    >
      <div className={clsx(`w-3 h-3 rounded-full ${strengthColor}`)} />
      <span className={clsx("text-sm font-medium")}>{strengthLabel}</span>
    </div>
  );
}
