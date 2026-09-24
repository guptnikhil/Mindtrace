import React from 'react';
import { Leaf } from 'lucide-react';

interface BrandProps {
  onClick?: () => void;
}

export const Brand: React.FC<BrandProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div 
        className="grid size-9 place-items-center rounded-xl bg-[#2f6f64] text-white shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:bg-[#255c53] active:scale-95"
        title="MindTrace — First Page"
      >
        <Leaf size={18} strokeWidth={2.3} className="transition-transform duration-200 group-hover:rotate-6" />
      </div>
      <div>
        <div className="text-[15px] font-semibold tracking-[-0.02em] text-[#1e332f] dark:text-[#e2ece8] group-hover:text-[#2f6f64] dark:group-hover:text-[#6ec4b2] transition-colors">
          MindTrace
        </div>
        <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#7a918b] dark:text-[#91a8a2]">
          Wellbeing Companion
        </div>
      </div>
    </div>
  );
};
