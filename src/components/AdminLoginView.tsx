import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AdminLoginViewProps {
  onAdminLoginSuccess: (admin: any) => void;
  setCurrentView: (view: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onAdminLoginSuccess, setCurrentView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Add the project URL and publishable key to the deployment environment.');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError || !authData.user) {
        setError(authError?.message || 'Invalid email or password.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        setError('This account is not authorized for the Gleam Coaching admin dashboard.');
        return;
      }

      onAdminLoginSuccess({
        id: authData.user.id,
        email: authData.user.email,
        name: profile.full_name || authData.user.email,
        role: profile.role,
      });
      setCurrentView('admin-dashboard');
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[#0B241B] text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Admin Portal Login
        </h1>
        <p className="text-slate-600 text-sm">
          Authorized administrators only. Manage courses, teachers, weekly exams, results, routines, and notices.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center">
          Sign in with an administrator account created in Supabase Authentication.
        </p>
      </div>
    </div>
  );
};
