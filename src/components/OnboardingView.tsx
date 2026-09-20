import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, HelpCircle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { AurelCharacter, AurelMood } from './AurelCharacter';
import { ChatBubble } from './ChatBubble';
import { TypewriterText } from './TypewriterText';
import { ProgressIndicator } from './ProgressIndicator';
import { AureliaUser, OnboardingProgress } from '../types';
import { determineEducationLevel } from '../data/learningData';

interface OnboardingViewProps {
  initialData?: OnboardingProgress | null;
  onComplete: (user: AureliaUser) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ initialData, onComplete }) => {
  // Step tracking: 1, 2, 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(initialData?.step || 1);
  const [subStep, setSubStep] = useState<string>(initialData?.subStep || 'step1_input');

  // Input states
  const [name, setName] = useState<string>(initialData?.name || '');
  const [nameInput, setNameInput] = useState<string>(initialData?.name || '');
  const [age, setAge] = useState<number | null>(initialData?.age || null);
  const [ageInput, setAgeInput] = useState<string>(initialData?.age ? String(initialData.age) : '');
  const [ageError, setAgeError] = useState<string>('');

  // Aurel mood & talking status
  const [aurelMood, setAurelMood] = useState<AurelMood>('idle');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [typewriterFinished, setTypewriterFinished] = useState<boolean>(false);

  // Focus ref for inputs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);

  // Save progress to LocalStorage
  const saveProgress = (
    stepNum: 1 | 2 | 3,
    currentSubStep: string,
    currentName: string,
    currentAge: number | null,
    understands: boolean | null,
    completed: boolean
  ) => {
    const progressData: OnboardingProgress = {
      step: stepNum,
      subStep: currentSubStep as any,
      name: currentName,
      age: currentAge,
      understandsPurpose: understands,
      completed,
    };
    try {
      localStorage.setItem('aurelia_onboarding', JSON.stringify(progressData));
      if (currentName) {
        const userObj: AureliaUser = {
          name: currentName,
          age: currentAge,
          understandsPurpose: understands,
          onboardingCompleted: completed,
          educationLevel: currentAge ? determineEducationLevel(currentAge) : undefined,
          registeredAt: new Date().toISOString(),
        };
        localStorage.setItem('aurelia_user', JSON.stringify(userObj));
      }
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  // Synchronize autofocus when typewriter finishes
  useEffect(() => {
    if (typewriterFinished) {
      if (currentStep === 1 && subStep === 'step1_input') {
        nameInputRef.current?.focus();
      } else if (currentStep === 2 && subStep === 'step2_input') {
        ageInputRef.current?.focus();
      }
    }
  }, [typewriterFinished, currentStep, subStep]);

  // STEP 1: Name submission handler
  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) return;

    setName(trimmed);
    setAurelMood('nod');
    setSubStep('step1_greet');
    setTypewriterFinished(false);

    saveProgress(1, 'step1_greet', trimmed, age, null, false);

    // After Aurel greets the user, proceed to Step 2
    setTimeout(() => {
      setAurelMood('idle');
    }, 800);
  };

  const handleAfterNameGreet = () => {
    // Wait a brief natural beat after the greeting completes before moving to Step 2
    setTimeout(() => {
      setCurrentStep(2);
      setSubStep('step2_input');
      setTypewriterFinished(false);
      saveProgress(2, 'step2_input', name, age, null, false);
    }, 900);
  };

  // STEP 2: Age validation & submission handler
  const handleAgeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAgeError('');

    const raw = ageInput.trim();
    if (!raw) {
      setAgeError('Masukkan umur menggunakan angka.');
      return;
    }

    // Must be integer digits only, no letters, no decimals
    if (!/^\d+$/.test(raw)) {
      setAgeError('Masukkan umur menggunakan angka.');
      return;
    }

    const parsedAge = parseInt(raw, 10);
    // Reasonable age validation
    if (parsedAge < 6 || parsedAge > 100) {
      setAgeError('Mohon masukkan umur yang masuk akal (6 - 100 tahun).');
      return;
    }

    setAge(parsedAge);
    setAurelMood('nod');
    setSubStep('step2_confirm');
    setTypewriterFinished(false);

    saveProgress(2, 'step2_confirm', name, parsedAge, null, false);

    setTimeout(() => {
      setAurelMood('idle');
    }, 800);
  };

  const handleAfterAgeConfirm = () => {
    setTimeout(() => {
      setCurrentStep(3);
      setSubStep('step3_ask');
      setTypewriterFinished(false);
      saveProgress(3, 'step3_ask', name, age, null, false);
    }, 900);
  };

  // STEP 3: Choosing purpose knowledge
  const handleChoosePurpose = (knows: boolean) => {
    setAurelMood('nod');
    setTypewriterFinished(false);

    if (knows) {
      // Chooses "YA"
      setSubStep('step3_confirm_ya');
      saveProgress(3, 'step3_confirm_ya', name, age, true, false);

      // Brief delay, then show "Yuk mulai perjalanan belajarmu"
      setTimeout(() => {
        setSubStep('step3_ready_ya');
        setTypewriterFinished(false);
        saveProgress(3, 'step3_ready_ya', name, age, true, false);
      }, 1400);
    } else {
      // Chooses "TIDAK"
      setSubStep('step3_explain_tidak');
      saveProgress(3, 'step3_explain_tidak', name, age, false, false);
    }
  };

  // Handle "SAYA MENGERTI" button
  const handleUnderstandClick = () => {
    setAurelMood('nod');
    setSubStep('step3_ready_tidak');
    setTypewriterFinished(false);
    saveProgress(3, 'step3_ready_tidak', name, age, false, false);
  };

  // Finish Onboarding & proceed to Beranda
  const handleFinishOnboarding = () => {
    const finalUser: AureliaUser = {
      name,
      age,
      understandsPurpose: subStep.includes('ya'),
      onboardingCompleted: true,
      educationLevel: age ? determineEducationLevel(age) : 'UMUM',
      registeredAt: new Date().toISOString(),
      quizScore: 0,
      quizCompleted: false,
    };

    saveProgress(3, 'completed', name, age, subStep.includes('ya'), true);
    localStorage.setItem('aurelia_user', JSON.stringify(finalUser));
    onComplete(finalUser);
  };

  // Determine current active dialog text based on step & subStep
  const getDialogText = (): string => {
    if (currentStep === 1) {
      if (subStep === 'step1_input') {
        return 'Halo aku Aurel! Senang bertemu denganmu hari ini. Bisa kenalan lebih dulu? Nama kamu siapa tulis di bawah ini!';
      }
      if (subStep === 'step1_greet') {
        return `Halo kak ${name}, senang bisa berkenalan denganmu.`;
      }
    }

    if (currentStep === 2) {
      if (subStep === 'step2_input') {
        return `Halo kak ${name}, kamu umurnya berapa nih?`;
      }
      if (subStep === 'step2_confirm') {
        return `Wah umur kamu ${age} ya?`;
      }
    }

    if (currentStep === 3) {
      if (subStep === 'step3_ask') {
        return `Wah umur kamu ${age} ya? Oke mari kita lanjut pertanyaan selanjutnya.\n\nApakah kamu sudah tahu fungsi kamu memasuki website ini?`;
      }
      if (subStep === 'step3_explain_tidak') {
        return 'Fungsi kamu masuk ke website ini yaitu kamu akan mengklaim dan menjawab beberapa pertanyaan. Jika skor kamu mencapai minimal 80, maka kamu bisa menggunakan bot WhatsApp satu hari gratis premium.';
      }
      if (subStep === 'step3_ready_tidak') {
        return 'Oke, sekarang kamu sudah tahu cara kerjanya.\n\nYuk mulai perjalanan belajarmu.';
      }
      if (subStep === 'step3_confirm_ya') {
        return 'Oke paham.';
      }
      if (subStep === 'step3_ready_ya') {
        return 'Yuk mulai perjalanan belajarmu.';
      }
    }

    return '';
  };

  // Exact step transition specifications:
  // Old: opacity 1, blur 0, scale 1 -> opacity 0, blur 6px, scale 0.98
  // New: opacity 0, blur 6px, scale 0.98 -> opacity 1, blur 0, scale 1
  // Durasi: 300–450ms.
  const stepVariants = {
    initial: {
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: { duration: 0.38, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.98,
      transition: { duration: 0.32, ease: 'easeIn' as const },
    },
  };

  const isNameValid = nameInput.trim().length >= 2;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 text-slate-800 p-4 sm:p-6 md:p-8">
      {/* Top Header with Progress */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-800">
            AURELIA
          </span>
        </div>

        {/* Small pastel 01 - 02 - 03 Progress Bar */}
        <ProgressIndicator currentStep={currentStep} />

        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            Langkah {currentStep} / 3
          </span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex items-center justify-center my-4 sm:my-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
          {/* Desktop Left / Mobile Top: Aurel Character */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative">
            <AurelCharacter
              mood={aurelMood}
              isSpeaking={isTyping}
              size="lg"
            />
            {/* Subtle supportive tag */}
            <p className="mt-3 text-xs text-slate-500 font-medium text-center hidden md:block">
              Aurel siap memandu langkah awal belajarmu
            </p>
          </div>

          {/* Desktop Right / Mobile Bottom: Chat Bubble + Interactive Form */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${subStep}`}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex flex-col items-center md:items-start"
              >
                {/* Aurel Chat Bubble */}
                <ChatBubble isTyping={isTyping}>
                  <TypewriterText
                    text={getDialogText()}
                    speed={24}
                    onTypingStateChange={setIsTyping}
                    onComplete={() => {
                      setTypewriterFinished(true);
                      if (currentStep === 1 && subStep === 'step1_greet') {
                        handleAfterNameGreet();
                      } else if (currentStep === 2 && subStep === 'step2_confirm') {
                        handleAfterAgeConfirm();
                      }
                    }}
                  />
                </ChatBubble>

                {/* Additional explainer card for "TIDAK" in Step 3 */}
                {currentStep === 3 && subStep === 'step3_explain_tidak' && typewriterFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[480px] mt-3 p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-sm text-teal-900 leading-relaxed"
                  >
                    <div className="flex items-start space-x-2.5">
                      <BookOpen className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <span>
                        Jadi, kamu perlu menyelesaikan beberapa bab pembelajaran dan menjawab soal dengan hasil minimal 80 untuk menyelesaikan misi.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Interactive Controls below Chat Bubble (Fade in after Typewriter finishes) */}
                <div className="w-full max-w-[480px] mt-4 sm:mt-5">
                  {/* STEP 1: Name Input Form */}
                  {currentStep === 1 && subStep === 'step1_input' && (
                    <motion.form
                      onSubmit={handleNameSubmit}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: typewriterFinished ? 1 : 0.4,
                        y: typewriterFinished ? 0 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 w-full"
                    >
                      <div>
                        <label
                          htmlFor="name-input"
                          className="block text-xs font-bold tracking-wider text-slate-600 uppercase mb-1.5"
                        >
                          NAMA KAMU
                        </label>
                        <input
                          id="name-input"
                          ref={nameInputRef}
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Tulis nama kamu..."
                          autoComplete="off"
                          className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 outline-hidden transition-all text-slate-800 placeholder-slate-400 text-base"
                        />
                      </div>

                      <button
                        id="submit-name-btn"
                        type="submit"
                        disabled={!isNameValid}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center space-x-2 transition-all duration-200 ${
                          isNameValid
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>KIRIM</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}

                  {/* STEP 2: Age Input Form */}
                  {currentStep === 2 && subStep === 'step2_input' && (
                    <motion.form
                      onSubmit={handleAgeSubmit}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: typewriterFinished ? 1 : 0.4,
                        y: typewriterFinished ? 0 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 w-full"
                    >
                      <div>
                        <label
                          htmlFor="age-input"
                          className="block text-xs font-bold tracking-wider text-slate-600 uppercase mb-1.5"
                        >
                          UMUR KAMU
                        </label>
                        <input
                          id="age-input"
                          ref={ageInputRef}
                          type="number"
                          value={ageInput}
                          onChange={(e) => {
                            setAgeInput(e.target.value);
                            if (ageError) setAgeError('');
                          }}
                          placeholder="Masukkan umur..."
                          min="6"
                          max="100"
                          step="1"
                          className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 outline-hidden transition-all text-slate-800 placeholder-slate-400 text-base"
                        />
                        {ageError && (
                          <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center space-x-1">
                            <span>{ageError}</span>
                          </p>
                        )}
                      </div>

                      <button
                        id="submit-age-btn"
                        type="submit"
                        disabled={!ageInput.trim()}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-base flex items-center justify-center space-x-2 transition-all duration-200 ${
                          ageInput.trim()
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>KIRIM</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.form>
                  )}

                  {/* STEP 3: Choice YA / TIDAK */}
                  {currentStep === 3 && subStep === 'step3_ask' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: typewriterFinished ? 1 : 0.4,
                        y: typewriterFinished ? 0 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-3 w-full"
                    >
                      <button
                        id="purpose-ya-btn"
                        type="button"
                        onClick={() => handleChoosePurpose(true)}
                        className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl shadow-xs hover:shadow-md transition-all group cursor-pointer hover:bg-indigo-50/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">YA</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">Sudah Tahu</span>
                      </button>

                      <button
                        id="purpose-tidak-btn"
                        type="button"
                        onClick={() => handleChoosePurpose(false)}
                        className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl shadow-xs hover:shadow-md transition-all group cursor-pointer hover:bg-indigo-50/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <HelpCircle className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">TIDAK</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">Belum Tahu</span>
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3 (TIDAK branch): "SAYA MENGERTI" button */}
                  {currentStep === 3 && subStep === 'step3_explain_tidak' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: typewriterFinished ? 1 : 0.4,
                        y: typewriterFinished ? 0 : 4,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-full pt-1"
                    >
                      <button
                        id="saya-mengerti-btn"
                        type="button"
                        onClick={handleUnderstandClick}
                        className="w-full py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>SAYA MENGERTI</span>
                        <Check className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3 FINAL: "MULAI BELAJAR" button (both branches) */}
                  {currentStep === 3 &&
                    (subStep === 'step3_ready_tidak' || subStep === 'step3_ready_ya') && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: typewriterFinished ? 1 : 0.4,
                          y: typewriterFinished ? 0 : 4,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-full pt-2"
                      >
                        <button
                          id="mulai-belajar-btn"
                          type="button"
                          onClick={handleFinishOnboarding}
                          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2.5 cursor-pointer text-base"
                        >
                          <Sparkles className="w-5 h-5 text-indigo-200" />
                          <span>MULAI BELAJAR</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl mx-auto pt-4 text-center text-xs text-slate-400">
        <span>Aurel mendampingi sesi belajar kamu secara bertahap</span>
      </footer>
    </div>
  );
};
