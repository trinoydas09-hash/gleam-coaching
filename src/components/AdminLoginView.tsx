import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

interface AdminLoginViewProps {
  onAdminLoginSuccess: (admin: any) => void;
  setCurrentView: (view: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onAdminLoginSuccess, setCurrentView }) => {
  const [email, setEmail] = useState('admin@gleamcoaching.com');
  const [password, setPassword] = useState('gleam2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('gleam_admin_token', data.token);
          localStorage.setItem('gleam_admin_user', JSON.stringify(data.admin));
          onAdminLoginSuccess(data.admin);
          setCurrentView('admin-dashboard');
        } else {
          setError(data.error || "Invalid admin credentials.");
        }
      })
      .catch(() => setError("Network error during login."))
      .finally(() => setLoading(false));
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
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900">Default Admin Credentials:</p>
          <p>Email: <strong className="text-slate-800">admin@gleamcoaching.com</strong></p>
          <p>Password: <strong className="text-slate-800">gleam2026</strong></p>
        </div>
      </div>
    </div>
  );
};
