import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { CoursesView } from './components/CoursesView';
import { TeachersView } from './components/TeachersView';
import { ExamsView } from './components/ExamsView';
import { ResultsView } from './components/ResultsView';
import { RoutineView } from './components/RoutineView';
import { NoticesView } from './components/NoticesView';
import { StudentPortalView } from './components/StudentPortalView';
import { ContactView } from './components/ContactView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [quickLoginCredentials, setQuickLoginCredentials] = useState<{ studentId: string; pin: string } | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(
    typeof window !== 'undefined' && window.location.hash.includes('type=recovery')
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const syncAdminSession = async (session: any) => {
      if (!session?.user) {
        if (active) {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!active) return;
      if (error || !profile || profile.role !== 'admin') {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
        if (currentView === 'admin-dashboard') setCurrentView('home');
        return;
      }

      setIsAdminLoggedIn(true);
      setAdminUser({
        id: session.user.id,
        email: session.user.email,
        name: profile.full_name || session.user.email,
        role: profile.role,
      });
    };

    supabase.auth.getSession().then(({ data }) => syncAdminSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
        setCurrentView('admin-login');
      }
      Promise.resolve().then(() => syncAdminSession(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAdminLoginSuccess = (admin: any) => {
    setIsAdminLoggedIn(true);
    setAdminUser(admin);
    setIsPasswordRecovery(false);
  };

  const handleAdminLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setIsPasswordRecovery(false);
    setCurrentView('home');
  };

  if (currentView === 'admin-dashboard' && isAdminLoggedIn) {
    return <AdminDashboardView onLogout={handleAdminLogout} setCurrentView={setCurrentView} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F5] text-[#171C19]">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUser={adminUser}
        onAdminLogout={handleAdminLogout}
      />

      <main className="flex-1">
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} onVerifyStudentQuick={(studentId, pin) => { setQuickLoginCredentials({ studentId, pin }); setCurrentView('student-portal'); }} />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'courses' && <CoursesView setCurrentView={setCurrentView} />}
        {currentView === 'teachers' && <TeachersView />}
        {currentView === 'exams' && <ExamsView />}
        {currentView === 'results' && <ResultsView setCurrentView={setCurrentView} />}
        {currentView === 'routine' && <RoutineView />}
        {currentView === 'notices' && <NoticesView />}
        {currentView === 'student-portal' && <StudentPortalView setCurrentView={setCurrentView} quickLoginCredentials={quickLoginCredentials} onQuickLoginConsumed={() => setQuickLoginCredentials(null)} />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'admin-login' && (
          <AdminLoginView
            onAdminLoginSuccess={handleAdminLoginSuccess}
            setCurrentView={setCurrentView}
            isPasswordRecovery={isPasswordRecovery}
          />
        )}
      </main>

      {currentView !== 'admin-dashboard' && <Footer setCurrentView={setCurrentView} />}
    </div>
  );
}
