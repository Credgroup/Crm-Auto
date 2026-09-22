interface MercedesLogoProps {
  className?: string;
  variant?: "compact" | "extended" | "vertical";
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark" | "auto";
}

export function MercedesLogo({
  className = "",
  variant = "extended",
  size = "md",
  theme = "auto",
}: MercedesLogoProps) {
  const getTextColorClasses = () => {
    if (theme === "dark") {
      return {
        title: "text-white",
        subtitle: "text-[#00adef]",
        circle: "fill-[#111820]",
        ring: "stroke-white",
        star: "fill-white",
      };
    }
    if (theme === "light") {
      return {
        title: "text-zinc-900",
        subtitle: "text-[#00677f]",
        circle: "fill-[#111820]",
        ring: "stroke-white",
        star: "fill-white",
      };
    }
    return {
      title: "text-zinc-900 dark:text-white",
      subtitle: "text-[#00677f] dark:text-[#00adef]",
      circle: "fill-[#111820] dark:fill-zinc-100",
      ring: "stroke-white dark:stroke-[#111820]",
      star: "fill-white dark:fill-[#111820]",
    };
  };

  const colors = getTextColorClasses();

  // 1. Apenas o emblema (para o sidebar recolhido)
  if (variant === "compact") {
    const sizeClasses = {
      sm: "w-7 h-7",
      md: "w-9 h-9",
      lg: "w-12 h-12",
    }[size];

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="3 3 44 44"
          className={`${sizeClasses} flex-shrink-0 transition-transform duration-200`}
        >
          <circle cx="25" cy="25" r="21" className={colors.circle} />
          <circle
            cx="25"
            cy="25"
            r="16.5"
            fill="none"
            className={colors.ring}
            strokeWidth="1.8"
          />
          <path
            d="M25 10 L28 25 L39 33 L25 29 L11 33 L22 25 Z"
            className={colors.star}
          />
        </svg>
      </div>
    );
  }

  // 2. Formato Vertical / Simétrico (perfeito para a tela de Login)
  if (variant === "vertical") {
    const starSizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-14 h-14",
    }[size];

    const titleSizeClasses = {
      sm: "text-xs tracking-wider",
      md: "text-sm tracking-widest",
      lg: "text-base tracking-[0.18em]",
    }[size];

    const subTitleSizeClasses = {
      sm: "text-[8px] tracking-widest",
      md: "text-[9px] tracking-[0.2em]",
      lg: "text-[10px] tracking-[0.22em]",
    }[size];

    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="3 3 44 44"
          className={`${starSizeClasses} flex-shrink-0 mb-3 drop-shadow-sm`}
        >
          <circle cx="25" cy="25" r="21" className={colors.circle} />
          <circle
            cx="25"
            cy="25"
            r="16.5"
            fill="none"
            className={colors.ring}
            strokeWidth="1.8"
          />
          <path
            d="M25 10 L28 25 L39 33 L25 29 L11 33 L22 25 Z"
            className={colors.star}
          />
        </svg>
        <div className="flex flex-col items-center justify-center text-center">
          <span className={`font-bold uppercase leading-tight font-sans ${colors.title} ${titleSizeClasses}`}>
            Mercedes-Benz
          </span>
          <span className={`font-semibold uppercase leading-tight mt-1 ${colors.subtitle} ${subTitleSizeClasses}`}>
            Trucks · F&amp;I Hub
          </span>
        </div>
      </div>
    );
  }

  // 3. Formato Horizontal (Emblema à esquerda + Texto à direita)
  const starSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  return (
    <div className={`inline-flex items-center justify-center gap-2.5 select-none ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="3 3 44 44"
        className={`${starSizeClasses} flex-shrink-0`}
      >
        <circle cx="25" cy="25" r="21" className={colors.circle} />
        <circle
          cx="25"
          cy="25"
          r="16.5"
          fill="none"
          className={colors.ring}
          strokeWidth="1.8"
        />
        <path
          d="M25 10 L28 25 L39 33 L25 29 L11 33 L22 25 Z"
          className={colors.star}
        />
      </svg>
      <div className="flex flex-col text-left justify-center">
        <span className={`font-bold text-[13px] tracking-wider uppercase leading-none font-sans ${colors.title}`}>
          Mercedes-Benz
        </span>
        <span className={`text-[8.5px] font-semibold tracking-[0.16em] uppercase leading-none mt-1 ${colors.subtitle}`}>
          Trucks · F&amp;I Hub
        </span>
      </div>
    </div>
  );
}

export function PoweredByEkio({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center gap-1.5 leading-none select-none ${className}`}>
      <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 leading-none">
        Powered by
      </span>
      <img
        src="/assets/branding/ekio-logo.png"
        alt="Ekio"
        className="h-3 w-auto object-contain dark:brightness-0 dark:invert inline-block"
      />
    </div>
  );
}
