import React, { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = "", 
  title,
  subtitle,
  icon
}) => {
  return (
    <div className={`
      relative overflow-hidden p-8 
      bg-white text-[#1D1D1F]
      rounded-[2rem] shadow-[0_2px_12px_rgba(0,0,0,0.04)] 
      border border-neutral-200/60
      transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5
      flex flex-col
      ${className}
    `}>
      {(title || subtitle || icon) && (
        <div className="mb-6 z-10 flex items-center gap-4">
          {icon && (
            <div className="text-neutral-500 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100 shadow-sm shrink-0">
              {icon}
            </div>
          )}
          <div>
            {subtitle && (
              <div className="text-xs font-semibold uppercase tracking-wider mb-0.5 text-neutral-500">
                {subtitle}
              </div>
            )}
            {title && (
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
                {title}
              </h3>
            )}
          </div>
        </div>
      )}
      <div className="z-10 flex-grow flex flex-col">
        {children}
      </div>
    </div>
  );
};