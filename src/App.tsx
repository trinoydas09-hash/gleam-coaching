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

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('gleam_admin_token');
    const user = localStorage.getItem('gleam_admin_user');
    if (token && user) {
      setIsAdminLoggedIn(true);
      try {
        setAdminUser(JSON.parse(user));
      } catch (e) {}
    }
  }, []);

  const handleAdminLoginSuccess = (admin: any) => {
    setIsAdminLoggedIn(true);
    setAdminUser(admin);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('gleam_admin_token');
    localStorage.removeItem('gleam_admin_user');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setCurrentView('home');
  };

  // If admin dashboard is active, render dashboard without public navbar/footer
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
        {currentView === 'home' && <HomeView setCurrentView={setCurrentView} onVerifyStudentQuick={() => setCurrentView('student-portal')} />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'courses' && <CoursesView setCurrentView={setCurrentView} />}
        {currentView === 'teachers' && <TeachersView />}
        {currentView === 'exams' && <ExamsView />}
        {currentView === 'results' && <ResultsView setCurrentView={setCurrentView} />}
        {currentView === 'routine' && <RoutineView />}
        {currentView === 'notices' && <NoticesView />}
        {currentView === 'student-portal' && <StudentPortalView setCurrentView={setCurrentView} />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'admin-login' && (
          <AdminLoginView
            onAdminLoginSuccess={handleAdminLoginSuccess}
            setCurrentView={setCurrentView}
          />
        )}
      </main>

      {currentView !== 'admin-dashboard' && <Footer setCurrentView={setCurrentView} />}
    </div>
  );
}
