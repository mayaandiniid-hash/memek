import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export type AurelMood = 'idle' | 'speaking' | 'nod' | 'happy';

interface AurelCharacterProps {
  mood?: AurelMood;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AurelCharacter: React.FC<AurelCharacterProps> = ({
  mood = 'idle',
  isSpeaking = false,
  size = 'lg',
}) => {
  const [blink, setBlink] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3600);

    return () => clearInterval(blinkInterval);
  }, []);

  // Determine scale by size prop
  const sizeClasses = {
    sm: 'w-32 h-32 md:w-36 md:h-36',
    md: 'w-40 h-40 md:w-48 md:h-48',
    lg: 'w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72',
    xl: 'w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80',
  }[size];

  const currentMood = mood === 'nod' ? 'nod' : isSpeaking ? 'speaking' : mood;

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} select-none`}>
      {/* Soft pastel background aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-100/70 via-indigo-100/50 to-rose-100/60 blur-xl scale-95 pointer-events-none" />
      <div className="absolute -inset-2 rounded-full border border-teal-200/40 opacity-70 pointer-events-none" />

      {/* Aurel Floating Body Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={
          currentMood === 'nod'
            ? { y: [0, 8, -2, 0], rotate: [0, 2, -1, 0] }
            : { y: [-3, 3, -3] }
        }
        transition={
          currentMood === 'nod'
            ? { duration: 0.6, ease: 'easeInOut' }
            : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gentle Shadow beneath */}
          <ellipse cx="120" cy="225" rx="60" ry="9" fill="#0f172a" fillOpacity="0.08" />

          {/* Torso & Outer Cardigan/Uniform (Friendly Educational Companion) */}
          <path
            d="M72 178C72 162 84 150 102 148H138C156 148 168 162 168 178V222H72V178Z"
            fill="#4F46E5"
          />
          {/* Soft Pastel Cardigan Layer */}
          <path
            d="M75 180C75 165 86 153 104 150H136C154 150 165 165 165 180V222H75V180Z"
            fill="#6366F1"
          />
          {/* Shirt / Inner Collar */}
          <path
            d="M102 148L120 178L138 148V162L120 186L102 162V148Z"
            fill="#EEF2FF"
          />
          {/* Collar flaps */}
          <path d="M100 148L118 166L112 172L96 154L100 148Z" fill="#E0E7FF" />
          <path d="M140 148L122 166L128 172L144 154L140 148Z" fill="#E0E7FF" />
          {/* Cute study ribbon / badge */}
          <circle cx="120" cy="180" r="5" fill="#14B8A6" />
          <path d="M117 184L114 196L120 193L126 196L123 184H117Z" fill="#0D9488" />

          {/* Neck */}
          <rect x="110" y="130" width="20" height="24" rx="6" fill="#FCD3B6" />
          <path d="M110 134C114 140 126 140 130 134V146H110V134Z" fill="#F8B486" opacity="0.4" />

          {/* Back Hair */}
          <path
            d="M62 110C58 142 66 178 86 190C82 170 78 140 82 110H62Z"
            fill="#3B2A1E"
          />
          <path
            d="M178 110C182 142 174 178 154 190C158 170 162 140 158 110H178Z"
            fill="#3B2A1E"
          />

          {/* Head & Face */}
          <rect x="80" y="68" width="80" height="78" rx="38" fill="#FDE2CD" />
          {/* Rosy Cheeks */}
          <ellipse cx="94" cy="116" rx="8" ry="4" fill="#FDA4AF" opacity="0.7" />
          <ellipse cx="146" cy="116" rx="8" ry="4" fill="#FDA4AF" opacity="0.7" />

          {/* Eyes */}
          {blink ? (
            // Blinking Eyes
            <g stroke="#292524" strokeWidth="2.8" strokeLinecap="round">
              <path d="M92 108C96 111 102 111 106 108" />
              <path d="M134 108C138 111 144 111 148 108" />
            </g>
          ) : currentMood === 'happy' || currentMood === 'nod' ? (
            // Happy crescent eyes
            <g stroke="#292524" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M92 110C96 104 104 104 108 110" />
              <path d="M132 110C136 104 144 104 148 110" />
            </g>
          ) : (
            // Open Warm Eyes
            <g>
              <ellipse cx="100" cy="106" rx="7" ry="8" fill="#292524" />
              <ellipse cx="140" cy="106" rx="7" ry="8" fill="#292524" />
              {/* Eye highlights */}
              <circle cx="98" cy="103" r="2.5" fill="#FFFFFF" />
              <circle cx="102" cy="108" r="1.2" fill="#FFFFFF" />
              <circle cx="138" cy="103" r="2.5" fill="#FFFFFF" />
              <circle cx="142" cy="108" r="1.2" fill="#FFFFFF" />
              {/* Gentle Eyelashes */}
              <path d="M93 101C96 98 103 98 107 101" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M133 101C137 98 144 98 147 101" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}

          {/* Eyebrows */}
          <path
            d="M93 96C97 94 103 95 106 97"
            stroke="#4A3B32"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M134 97C137 95 143 94 147 96"
            stroke="#4A3B32"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cute Nose */}
          <circle cx="120" cy="113" r="2" fill="#F8B486" />

          {/* Mouth */}
          {isSpeaking ? (
            // Speaking Mouth Animation
            <motion.path
              d="M112 122C112 128 128 128 128 122Z"
              fill="#E11D48"
              animate={{
                d: [
                  'M113 123C113 127 127 127 127 123Z',
                  'M111 122C111 131 129 131 129 122Z',
                  'M113 123C113 127 127 127 127 123Z',
                ],
              }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          ) : currentMood === 'happy' || currentMood === 'nod' ? (
            // Wide Gentle Smile
            <path
              d="M111 121C112 129 128 129 129 121"
              stroke="#B91C1C"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="#F43F5E"
            />
          ) : (
            // Relaxed Friendly Smile
            <path
              d="M113 122C116 126 124 126 127 122"
              stroke="#831843"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Front Hair Bangs */}
          <path
            d="M78 84C80 62 100 48 120 48C140 48 160 62 162 84C162 86 150 78 136 82C122 86 112 76 96 82C84 86 78 84 78 84Z"
            fill="#4A3525"
          />
          {/* Bang Details */}
          <path
            d="M80 84C92 98 106 90 114 84C122 92 136 92 144 86C152 92 158 88 162 84C158 64 142 50 120 50C98 50 82 64 80 84Z"
            fill="#3B2A1E"
          />
          {/* Cute Mint/Teal Hair Clip */}
          <rect
            x="84"
            y="76"
            width="14"
            height="5"
            rx="2.5"
            transform="rotate(18 84 76)"
            fill="#14B8A6"
          />
        </svg>
      </motion.div>

      {/* Decorative Study Element: Soft Pastel Pill */}
      <div className="absolute -bottom-2 px-3 py-1 bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-full shadow-xs text-xs font-semibold text-indigo-700 tracking-wide select-none">
        Aurel · Pendamping Belajar
      </div>
    </div>
  );
};
