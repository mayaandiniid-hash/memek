import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  LogOut,
  Sparkles,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Clock,
  Layers,
} from 'lucide-react';
import { AureliaUser, QuizQuestion } from '../types';
import { AurelCharacter } from './AurelCharacter';
import {
  MODULES_BY_LEVEL,
  getAurelRecommendation,
  getEducationLevelLabel,
} from '../data/learningData';

interface BerandaDashboardProps {
  user: AureliaUser;
  onResetOnboarding: () => void;
  onSwitchUser: () => void;
  onUpdateUser: (updated: AureliaUser) => void;
}

export const BerandaDashboard: React.FC<BerandaDashboardProps> = ({
  user,
  onResetOnboarding,
  onSwitchUser,
  onUpdateUser,
}) => {
  const educationLevel = user.educationLevel || 'UMUM';
  const modules = MODULES_BY_LEVEL[educationLevel] || MODULES_BY_LEVEL['UMUM'];
  const activeModule = modules[0];

  const recommendation = getAurelRecommendation(
    user.name,
    user.age || 17,
    educationLevel
  );

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(user.quizCompleted || false);
  const [quizScore, setQuizScore] = useState<number>(user.quizScore || 0);
  const [claimedWhatsApp, setClaimedWhatsApp] = useState<boolean>(false);
  const [waNumber, setWaNumber] = useState<string>('');
  const [waClaimSuccess, setWaClaimSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'materi' | 'misi'>('materi');

  const questions: QuizQuestion[] = activeModule?.questions || [];

  const handleSelectOption = (qIndex: number, optIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculatedScore);
    setIsQuizSubmitted(true);

    const updatedUser: AureliaUser = {
      ...user,
      quizScore: calculatedScore,
      quizCompleted: true,
    };
    onUpdateUser(updatedUser);
    try {
      localStorage.setItem('aurelia_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  };

  const handleClaimWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waNumber.trim()) return;
    setWaClaimSuccess(true);
  };

  const isEligibleForBot = quizScore >= 80;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              A
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                AURELIA LEARNING
              </span>
              <span className="text-[11px] font-medium text-indigo-600 block">
                Portal Belajar & Evaluasi Mandiri
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                {user.name} ({user.age} th)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                {educationLevel}
              </span>
            </div>

            {/* Quick Actions */}
            <button
              id="reset-onboarding-btn"
              type="button"
              onClick={onResetOnboarding}
              title="Ulangi Onboarding Aurel"
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ulangi Onboarding</span>
            </button>

            <button
              id="switch-user-btn"
              type="button"
              onClick={onSwitchUser}
              title="Ganti Akun"
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* AUREL PERSONALIZED RECOMMENDATION CARD */}
        <section
          aria-label="Rekomendasi Aurel"
          className="bg-gradient-to-r from-indigo-50/90 via-white to-teal-50/70 border border-indigo-100/90 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Aurel Avatar */}
            <div className="shrink-0 flex flex-col items-center">
              <AurelCharacter mood="happy" isSpeaking={false} size="sm" />
            </div>

            {/* Personalized Speech & Recommendation Details */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-100/80 text-indigo-800 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rekomendasi Pembelajaran untuk Kak {user.name}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Selamat Datang di Beranda, Kak {user.name}!
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
                {recommendation.recommendationText}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-indigo-200 text-slate-700 rounded-xl shadow-2xs">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>{getEducationLevelLabel(educationLevel)}</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-teal-200 text-slate-700 rounded-xl shadow-2xs">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>{recommendation.firstSubject}</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-indigo-200 text-slate-700 rounded-xl shadow-2xs">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>{recommendation.startingChapter}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION STATUS: WHATSAPP BOT 1 DAY FREE PREMIUM */}
        <section
          aria-label="Misi Bot WhatsApp"
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                  Misi Website
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Syarat: Skor Tes Minimal 80
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                1 Hari Gratis Premium Bot WhatsApp Belajar
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Klaim dan jawab soal evaluasi di bawah. Jika nilai kamu mencapai minimal 80,
                kamu berhak menikmati akses bot WhatsApp satu hari secara penuh.
              </p>
            </div>

            {/* Score & Claim Pill */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-end">
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[120px]">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Skor Saat Ini
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    quizScore >= 80
                      ? 'text-emerald-600'
                      : quizScore > 0
                      ? 'text-amber-600'
                      : 'text-slate-700'
                  }`}
                >
                  {isQuizSubmitted ? `${quizScore} / 100` : 'Belum Tes'}
                </span>
              </div>

              {isEligibleForBot ? (
                <button
                  id="claim-wa-bot-btn"
                  type="button"
                  onClick={() => setClaimedWhatsApp(true)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>KLAIM AKSES BOT WA</span>
                </button>
              ) : (
                <button
                  id="start-wa-mission-btn"
                  type="button"
                  onClick={() => setActiveTab('misi')}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>IKUTI TES (TARGET 80)</span>
                </button>
              )}
            </div>
          </div>

          {/* Modal / Dialog for Claiming WhatsApp Bot */}
          {claimedWhatsApp && (
            <div className="mt-5 pt-5 border-t border-slate-100 bg-slate-50/80 p-4 rounded-xl">
              {!waClaimSuccess ? (
                <form onSubmit={handleClaimWhatsApp} className="max-w-md space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-bold text-slate-800">
                      Selamat, skor kamu {quizScore}! Masukkan nomor WhatsApp aktif:
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-hidden"
                    />
                    <button
                      id="submit-claim-wa"
                      type="submit"
                      disabled={!waNumber.trim()}
                      className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      Aktifkan
                    </button>
                    <button
                      type="button"
                      onClick={() => setClaimedWhatsApp(false)}
                      className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-900">
                        Akses Bot WhatsApp Premium Aktif untuk Nomor {waNumber}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Kode Voucher: <strong>AUREL-FREE-1DAY</strong> (Berlaku 24 jam)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setClaimedWhatsApp(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* TAB TOGGLE: MATERI PEMBELAJARAN vs MISI TES */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('materi')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'materi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Materi Pembelajaran ({getEducationLevelLabel(educationLevel)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('misi')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'misi'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Tes Misi Evaluasi ({questions.length} Soal)</span>
          </button>
        </div>

        {/* TAB 1: MATERI PEMBELAJARAN */}
        {activeTab === 'materi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Daftar Bab & Silabus Khusus Tingkat {educationLevel}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Tersedia {modules.length} Modul Terstruktur
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                        {mod.subject}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mod.chaptersCount} Bab Pembelajaran</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('misi')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Buka Soal Tes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TES MISI EVALUASI */}
        {activeTab === 'misi' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tes Evaluasi Materi {activeModule.subject}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Jawab seluruh pertanyaan berikut. Minimal skor 80 untuk membuka akses bot WhatsApp 1 hari gratis.
                  </p>
                </div>

                {isQuizSubmitted && (
                  <button
                    id="retake-quiz-btn"
                    type="button"
                    onClick={handleRetakeQuiz}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center space-x-1 cursor-pointer self-start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Pengerjaan</span>
                  </button>
                )}
              </div>

              {/* Quiz Questions List */}
              <div className="space-y-6">
                {questions.map((q, qIdx) => {
                  const isAnswered = selectedAnswers[qIdx] !== undefined;
                  const isCorrect = selectedAnswers[qIdx] === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          let optionStyle =
                            'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';

                          if (isQuizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                            } else if (isSelected) {
                              optionStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                            } else {
                              optionStyle = 'bg-white border-slate-200 opacity-60';
                            }
                          } else if (isSelected) {
                            optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold ring-2 ring-indigo-100';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center space-x-2.5 cursor-pointer ${optionStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {isQuizSubmitted && (
                        <div
                          className={`mt-2 ml-9 p-3 rounded-xl text-xs leading-relaxed flex items-start space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50/80 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold">
                              {isCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat.'}{' '}
                            </span>
                            <span>{q.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz Action */}
              {!isQuizSubmitted && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Terjawab {Object.keys(selectedAnswers).length} dari {questions.length} soal
                  </span>

                  <button
                    id="submit-quiz-answers-btn"
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    KIRIM JAWABAN TES
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
