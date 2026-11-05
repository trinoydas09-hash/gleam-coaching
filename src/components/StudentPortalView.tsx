import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Award, BookOpen, Calendar, FileText, LogOut, CheckCircle2 } from 'lucide-react';

interface StudentPortalViewProps {
  setCurrentView: (view: string) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ setCurrentView }) => {
  const [verifiedStudent, setVerifiedStudent] = useState<any>(null);
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [routine, setRoutine] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'exams' | 'routine' | 'notices'>('profile');

  useEffect(() => {
    const saved = localStorage.getItem('gleam_verified_student');
    if (saved) {
      try {
        const student = JSON.parse(saved);
        setVerifiedStudent(student);
        fetchStudentData(student.id);
      } catch (e) {}
    }
  }, []);

  const fetchStudentData = (id: string) => {
    fetch(`/api/results?studentId=${id}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(() => {});

    fetch('/api/exams')
      .then(res => res.json())
      .then(data => setExams(data))
      .catch(() => {});

    fetch('/api/routine')
      .then(res => res.json())
      .then(data => setRoutine(data))
      .catch(() => {});

    fetch('/api/notices')
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(() => {});
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !pin) {
      setError("Please enter both Student ID and Verification PIN.");
      return;
    }
    setLoading(true);
    setError('');
    fetch('/api/students/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, pin })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.success) {
          setVerifiedStudent(data.student);
          setResults(data.results);
          localStorage.setItem('gleam_verified_student', JSON.stringify(data.student));
          fetchStudentData(data.student.id);
        } else {
          setError(data.error || "Verification failed. Check your ID and PIN.");
        }
      })
      .catch(() => setError("Network error during verification."))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('gleam_verified_student');
    setVerifiedStudent(null);
    setStudentId('');
    setPin('');
  };

  if (!verifiedStudent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#0B241B] text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
            Student Portal
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your Google Sheet enrolled Student ID and secure PIN to access your personal academic dashboard.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                placeholder="e.g. GLM1001"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Verification PIN
              </label>
              <input
                type="password"
                placeholder="4-digit PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "VERIFY STUDENT"}
            </button>
          </form>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-emerald-900">Demo Student IDs:</p>
            <p>1. <strong className="text-slate-900">GLM1001</strong> (PIN: <strong className="text-slate-900">1234</strong>) - Tanvir Ahmed (Class 10)</p>
            <p>2. <strong className="text-slate-900">GLM1002</strong> (PIN: <strong className="text-slate-900">5678</strong>) - Nusrat Jahan (Class 9)</p>
          </div>
        </div>
      </div>
    );
  }

  const classExams = exams.filter(e => e.classLevel === verifiedStudent.classLevel);
  const classRoutine = routine.filter(r => r.classLevel === verifiedStudent.classLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Student Top Header Card */}
      <div className="bg-[#0B241B] rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg">
              Active Student Dashboard
            </span>
            <span className="text-xs text-emerald-300">Google Sheets Verified</span>
          </div>
          <h1 className="text-3xl font-extrabold font-['Bricolage_Grotesque']">
            Welcome, {verifiedStudent.name}
          </h1>
          <p className="text-xs text-emerald-100/80">
            Student ID: <strong className="text-white">{verifiedStudent.id}</strong> · Class: <strong className="text-white">{verifiedStudent.classLevel}</strong> · Group: <strong className="text-white">{verifiedStudent.group}</strong>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'profile', label: 'Student Profile' },
          { id: 'results', label: `My Results (${results.length})` },
          { id: 'exams', label: `Weekly Exams (${classExams.length})` },
          { id: 'routine', label: 'Class Routine' },
          { id: 'notices', label: 'Notices' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#123B2A] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Personal Information & Enrollment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Full Name</span>
                <p className="font-bold text-slate-900 text-base">{verifiedStudent.name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Student ID</span>
                <p className="font-bold text-slate-900 text-base">{verifiedStudent.id}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Class Level</span>
                <p className="font-bold text-slate-900 text-base">{verifiedStudent.classLevel}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Stream / Group</span>
                <p className="font-bold text-slate-900 text-base">{verifiedStudent.group}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Account Status</span>
                <p className="font-bold text-emerald-700 text-base flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {verifiedStudent.status}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-bold">Guardian Contact</span>
                <p className="font-bold text-slate-900 text-base">{verifiedStudent.guardianPhone || '+880 1812-345678'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              My Examination Results
            </h2>
            {results.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                No results published for your ID yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map((res: any) => (
                  <div key={res.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{res.examTitle}</span>
                      <h3 className="text-lg font-bold text-slate-900">{res.subject}</h3>
                      <p className="text-xs text-slate-600 italic">"{res.remarks}"</p>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Marks</span>
                        <span className="text-base font-extrabold text-slate-900">{res.obtainedMarks} / {res.totalMarks}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">GPA</span>
                        <span className="text-base font-extrabold text-emerald-700">{res.gpa}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Position</span>
                        <span className="text-base font-extrabold text-[#123B2A]">{res.position}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Weekly Examinations for {verifiedStudent.classLevel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classExams.map((exam: any) => (
                <div key={exam.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">{exam.subject}</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold rounded-lg">{exam.status}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
                  <p className="text-xs text-slate-600">Date: {exam.examDate} | Time: {exam.examTime}</p>
                  <p className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">Syllabus: {exam.syllabus}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routine' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Class Routine for {verifiedStudent.classLevel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classRoutine.map((item: any) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">{item.day}</span>
                    <span className="text-slate-500">{item.room}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.subject}</h3>
                  <p className="text-xs text-slate-600">Instructor: <strong className="text-slate-900">{item.teacher}</strong></p>
                  <p className="text-xs text-slate-600">Time: <strong className="text-slate-900">{item.startTime} - {item.endTime}</strong></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Latest Notices
            </h2>
            <div className="space-y-4">
              {notices.map((n: any) => (
                <div key={n.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{n.category}</span>
                    <span className="text-slate-500">{n.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
