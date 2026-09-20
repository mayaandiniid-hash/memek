import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { AurelCharacter } from './AurelCharacter';

interface AuthModalProps {
  onLoginSuccess: (isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLoginSuccess(mode === 'register');
  };

  const handleQuickFirstTimeLogin = () => {
    // Directly triggers the first-time user login/register flow
    onLoginSuccess(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-white to-slate-100 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Brand & Companion Avatar */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 mb-2">
            <AurelCharacter mood="idle" isSpeaking={false} size="sm" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 mt-2">
            AURELIA LEARNING
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Portal belajar mandiri dengan panduan interaktif pendamping belajar Aurel
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Akun Baru
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Pengguna
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            {mode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>DAFTAR & MULAI ONBOARDING</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>MASUK</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            id="quick-start-onboarding-btn"
            type="button"
            onClick={handleQuickFirstTimeLogin}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulasi Pengguna Baru (Masuk Onboarding Aurel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
