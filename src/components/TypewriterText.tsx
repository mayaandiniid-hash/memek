import React, { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char (20-35ms)
  onComplete?: () => void;
  onTypingStateChange?: (isTyping: boolean) => void;
  className?: string;
  allowSkip?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 26,
  onComplete,
  onTypingStateChange,
  className = '',
  allowSkip = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset state on text change
    setDisplayedText('');
    setIsFinished(false);
    indexRef.current = 0;
    if (onTypingStateChange) onTypingStateChange(true);

    if (!text) {
      setIsFinished(true);
      if (onTypingStateChange) onTypingStateChange(false);
      if (onComplete) onComplete();
      return;
    }

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayedText(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsFinished(true);
        if (onTypingStateChange) onTypingStateChange(false);
        if (onComplete) onComplete();
      }
    };

    timerRef.current = setTimeout(typeNextChar, speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed]);

  const handleSkip = () => {
    if (!allowSkip || isFinished) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayedText(text);
    setIsFinished(true);
    if (onTypingStateChange) onTypingStateChange(false);
    if (onComplete) onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`relative cursor-pointer transition-colors ${className}`}
      title={allowSkip && !isFinished ? 'Klik untuk mempercepat teks' : undefined}
    >
      <span className="leading-relaxed whitespace-pre-line text-slate-800 font-medium">
        {displayedText}
      </span>
      {!isFinished && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 rounded-xs animate-pulse align-middle" />
      )}
    </div>
  );
};
