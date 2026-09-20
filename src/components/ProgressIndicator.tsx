import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: '01', label: 'Perkenalan' },
    { num: '02', label: 'Umur' },
    { num: '03', label: 'Tujuan' },
  ];

  return (
    <nav aria-label="Progress Onboarding" className="flex flex-col items-center justify-center py-2">
      <div className="flex items-center space-x-2 sm:space-x-3">
        {steps.map((step, idx) => {
          const stepNumber = (idx + 1) as 1 | 2 | 3;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <React.Fragment key={step.num}>
              {/* Step Node */}
              <div className="flex items-center space-x-1.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs ring-4 ring-indigo-100 scale-105'
                      : isCompleted
                      ? 'bg-indigo-400 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline transition-colors duration-200 ${
                    isCurrent
                      ? 'text-indigo-900 font-semibold'
                      : isCompleted
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line (between 1-2 and 2-3) */}
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 rounded-full transition-all duration-300 ${
                    currentStep > idx + 1 ? 'bg-indigo-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
