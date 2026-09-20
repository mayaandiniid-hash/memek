import { useState, useEffect } from 'react';
import { AureliaUser, OnboardingProgress } from './types';
import { OnboardingView } from './components/OnboardingView';
import { BerandaDashboard } from './components/BerandaDashboard';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AureliaUser | null>(null);
  const [savedOnboarding, setSavedOnboarding] = useState<OnboardingProgress | null>(null);
  const [viewState, setViewState] = useState<'auth' | 'onboarding' | 'beranda'>('auth');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('aurelia_user');
      const storedOnboarding = localStorage.getItem('aurelia_onboarding');

      let parsedUser: AureliaUser | null = null;
      let parsedOnboarding: OnboardingProgress | null = null;

      if (storedUser) {
        parsedUser = JSON.parse(storedUser);
      }
      if (storedOnboarding) {
        parsedOnboarding = JSON.parse(storedOnboarding);
      }

      if (parsedUser && parsedUser.onboardingCompleted) {
        // Already completed -> Straight to Beranda
        setCurrentUser(parsedUser);
        setViewState('beranda');
      } else if (parsedOnboarding && !parsedOnboarding.completed) {
        // Resuming uncompleted onboarding
        setSavedOnboarding(parsedOnboarding);
        setViewState('onboarding');
      } else {
        // Brand new or unauthenticated: Start in onboarding directly if desired or show initial login
        // Defaulting to onboarding for instantaneous access to the requested Aurel experience
        setViewState('onboarding');
      }
    } catch (err) {
      console.error('Error loading saved state:', err);
      setViewState('onboarding');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const handleLoginSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      // Clear previous onboarding and start fresh
      localStorage.removeItem('aurelia_onboarding');
      setSavedOnboarding(null);
      setViewState('onboarding');
    } else {
      // Check if user has already completed onboarding
      const storedUser = localStorage.getItem('aurelia_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.onboardingCompleted) {
          setCurrentUser(user);
          setViewState('beranda');
          return;
        }
      }
      // If not completed, start/resume onboarding
      setViewState('onboarding');
    }
  };

  const handleOnboardingComplete = (user: AureliaUser) => {
    setCurrentUser(user);
    setViewState('beranda');
  };

  const handleResetOnboarding = () => {
    // Allows user to re-run the onboarding dialog anytime
    try {
      localStorage.removeItem('aurelia_onboarding');
      if (currentUser) {
        const resetUser = { ...currentUser, onboardingCompleted: false };
        localStorage.setItem('aurelia_user', JSON.stringify(resetUser));
      }
    } catch (e) {
      console.error(e);
    }
    setSavedOnboarding(null);
    setViewState('onboarding');
  };

  const handleSwitchUser = () => {
    try {
      localStorage.removeItem('aurelia_user');
      localStorage.removeItem('aurelia_onboarding');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setSavedOnboarding(null);
    setViewState('auth');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      {viewState === 'auth' && <AuthModal onLoginSuccess={handleLoginSuccess} />}

      {viewState === 'onboarding' && (
        <OnboardingView
          initialData={savedOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}

      {viewState === 'beranda' && currentUser && (
        <BerandaDashboard
          user={currentUser}
          onResetOnboarding={handleResetOnboarding}
          onSwitchUser={handleSwitchUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />
      )}
    </div>
  );
}
