import { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onAuth: () => void;
  onSwitch: () => void;
}

export function AuthPage({ mode, onAuth, onSwitch }: AuthPageProps) {
  const { setAuth } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = mode === 'signup' ? (name || 'Francis') : (email.split('@')[0] || 'Francis');
    setAuth({ name: displayName.charAt(0).toUpperCase() + displayName.slice(1), email });
    onAuth();
  };

  const isSignup = mode === 'signup';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isSignup ? 'Start finding what needs attention in your business.' : 'Sign in to your Recoverly account.'}
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Business name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Business Ltd"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              {isSignup ? 'Create account' : 'Sign in'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500">
            Demo authentication — no real account is created. Your data stays in this browser.
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={onSwitch} className="font-semibold text-brand-600 hover:text-brand-700">
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
