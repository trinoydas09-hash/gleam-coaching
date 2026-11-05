import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AdminLoginViewProps {
  onAdminLoginSuccess: (admin: any) => void;
  setCurrentView: (view: string) => void;
  isPasswordRecovery?: boolean;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onAdminLoginSuccess,
  setCurrentView,
  isPasswordRecovery = false,
}) => {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(isPasswordRecovery ? 'reset' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isPasswordRecovery) {
      setMode('reset');
      setError('');
      setNotice('');
    }
  }, [isPasswordRecovery]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please contact the website administrator.');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
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

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Please contact the website administrator.');
      return;
    }
    if (!email.trim()) {
      setError('Enter your admin email address first.');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'https://gleam-coaching-preview-4gble9ykh-trinoy.vercel.app',
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setNotice('Password reset link sent. Check your inbox and open the newest email.');
    } catch {
      setError('Could not send the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('Supabase is not configured. Please contact the website administrator.');
      return;
    }
    if (password.length < 8) {
      setError('Your new password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      await supabase.auth.signOut();
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      setPassword('');
      setConfirmPassword('');
      setMode('login');
      setNotice('Your password has been updated. You can now sign in with your new password.');
    } catch {
      setError('Could not update the password. The reset link may have expired. Request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    setMode('login');
    setError('');
    setNotice('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[#0B241B] text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          {mode === 'reset' ? <KeyRound className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          {mode === 'forgot' ? 'Reset Admin Password' : mode === 'reset' ? 'Set New Password' : 'Admin Portal Login'}
        </h1>
        <p className="text-slate-600 text-sm">
          {mode === 'forgot'
            ? 'Enter your admin email and we will send you a secure password reset link.'
            : mode === 'reset'
              ? 'Choose a new password for your Gleam Coaching admin account.'
              : 'Authorized administrators only. Manage courses, teachers, weekly exams, results, routines, and notices.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
            <div className="text-right">
              <button type="button" onClick={() => { setMode('forgot'); setError(''); setNotice(''); }} className="text-sm font-semibold text-emerald-800 hover:underline">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm">
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your admin email" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={goToLogin} className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft className="w-4 h-4" /> Back to login</button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
              <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Enter the same password again" className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {error && <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
        {notice && <div role="status" className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{notice}</span></div>}
        {mode === 'login' && <p className="text-xs text-slate-500 text-center">Sign in with an administrator account created in Supabase Authentication.</p>}
      </div>
    </div>
  );
};
