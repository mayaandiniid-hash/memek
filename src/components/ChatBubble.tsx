import React from 'react';

interface ChatBubbleProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isTyping?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  children,
  onClick,
  className = '',
  isTyping = false,
}) => {
  return (
    <div className={`relative group ${className}`} onClick={onClick}>
      {/* Educational Tail for Desktop (pointing left toward Aurel) */}
      <div
        className="hidden md:block absolute -left-3 top-8 w-4 h-4 bg-white border-l border-b border-slate-200/80 rotate-45 pointer-events-none"
        aria-hidden="true"
      />

      {/* Educational Tail for Mobile (pointing up toward Aurel) */}
      <div
        className="md:hidden absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200/80 rotate-45 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Bubble Container */}
      <div className="relative bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow max-w-[480px] w-full text-slate-800">
        {/* Subtle top indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
            Aurel
          </span>
          {isTyping && (
            <span className="text-[11px] text-slate-400 font-normal">
              Ketuk untuk percepat
            </span>
          )}
        </div>

        {/* Content */}
        <div className="text-base sm:text-lg leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
