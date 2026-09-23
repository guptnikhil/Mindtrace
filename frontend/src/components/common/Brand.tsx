import React from 'react';
import { Leaf } from 'lucide-react';

export const Brand: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-xl bg-[#2f6f64] text-white shadow-sm">
        <Leaf size={18} strokeWidth={2.3} />
      </div>
      <div>
        <div className="text-[15px] font-semibold tracking-[-0.02em] text-[#1e332f] dark:text-[#e2ece8]">MindTrace</div>
        <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#7a918b] dark:text-[#91a8a2]">Wellbeing Companion</div>
      </div>
    </div>
  );
};
