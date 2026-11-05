import React, { useState } from 'react';
import { BookOpen, GraduationCap, Calendar, Award, FileText, UserCheck, Phone, Menu, X, ShieldCheck, Clock } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isAdminLoggedIn: boolean;
  adminUser: any;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isAdminLoggedIn,
  adminUser,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'courses', label: 'Courses' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'exams', label: 'Weekly Exams' },
    { id: 'results', label: 'Results' },
    { id: 'routine', label: 'Routine' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B241B] text-white border-b border-[#123B2A] shadow-md">
      {/* Top bar announcement strip */}
      <div className="bg-[#123B2A] px-4 py-1.5 text-xs text-emerald-100/90 flex flex-wrap justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Iqbal Road, Kotwali, Chattogram, Bangladesh
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Tagline: "Learn Today. Lead Tomorrow."</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/share/g/19cGwwjKXs/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-300 transition-colors underline text-xs font-medium"
          >
            Official Facebook Group
          </a>
          <span>·</span>
          <span>Hotline: +880 1812-345678</span>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand - Nav Links - Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Brand Wordmark & Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
        >
          <img
            src="/assets/aistudio/image_4f62b769.png"
            alt="Gleam Coaching Logo"
            className="w-12 h-12 rounded-lg object-cover border border-emerald-500/30 shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="text-xl font-bold tracking-tight text-white block font-['Bricolage_Grotesque']">
              GLEAM COACHING
            </span>
            <span className="text-[11px] text-emerald-400/90 tracking-wider font-medium uppercase block">
              Chattogram, Bangladesh
            </span>
          </div>
        </button>

        {/* Desktop Nav Links (4-5 concise 1-word/2-word links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-100">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-300 py-1 border-b-2 ${
                currentView === link.id
                  ? 'border-emerald-400 text-emerald-300 font-semibold'
                  : 'border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Primary Action Zone */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('student-portal')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              currentView === 'student-portal'
                ? 'bg-emerald-500 text-slate-950 shadow-lg ring-2 ring-emerald-400'
                : 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Portal
          </button>

          {isAdminLoggedIn ? (
            <button
              onClick={() => setCurrentView('admin-dashboard')}
              className="px-3 py-2 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Dashboard
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('admin-login')}
              className="px-3 py-2 text-xs font-medium text-emerald-200 hover:text-white border border-emerald-700 hover:border-emerald-500 rounded-lg transition-colors whitespace-nowrap"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-emerald-200 hover:text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B241B] border-t border-[#123B2A] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === link.id
                  ? 'bg-emerald-900/50 text-emerald-300'
                  : 'text-emerald-100 hover:bg-emerald-900/30'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-emerald-900/50 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('student-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Student Portal
            </button>
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setCurrentView('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentView('admin-login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-medium text-emerald-200 border border-emerald-700 rounded-lg flex items-center justify-center gap-2"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
