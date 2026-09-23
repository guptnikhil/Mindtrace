import React from 'react';
import { X, BookOpen, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { ResourceItem } from '../../types/wellbeing';

interface ArticleReaderModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ resource, onClose }) => {
  if (!resource || resource.type !== 'article' || !resource.content) return null;

  const { readingTime, sections, keyTakeaways } = resource.content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#152420] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-[#243d36] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#203630] bg-[#fafaf8] dark:bg-[#121e1b]">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-[#6ec4b2] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Wellness Guide</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {resource.badge || 'Essential'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {readingTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {resource.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {resource.description}
            </p>
          </div>

          {/* Key Takeaways Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-[#192f29] border border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Key Takeaways
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-1">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-6 pt-2">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {section.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Non-Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              For general wellbeing information only. This does not replace professional medical or counselling advice.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#203630] bg-[#fafaf8] dark:bg-[#121e1b] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs transition-colors"
          >
            Back to Resources
          </button>
        </div>
      </div>
    </div>
  );
};
