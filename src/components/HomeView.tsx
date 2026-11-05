import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Calendar, Award, ArrowRight, ShieldCheck, CheckCircle2, Phone, MapPin, Search } from 'lucide-react';

interface HomeViewProps {
  setCurrentView: (view: string) => void;
  onVerifyStudentQuick: (studentId: string, pin: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentView, onVerifyStudentQuick }) => {
  const [stats, setStats] = useState({ totalStudents: 150, activeStudents: 142, totalTeachers: 5, totalCourses: 7, totalExams: 18 });
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  
  // Quick result check form
  const [quickId, setQuickId] = useState('');
  const [quickPin, setQuickPin] = useState('');
  const [quickError, setQuickError] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => setStats(data)).catch(() => {});
    fetch('/api/teachers').then(res => res.json()).then(data => setTeachers(data)).catch(() => {});
    fetch('/api/courses').then(res => res.json()).then(data => setCourses(data)).catch(() => {});
    fetch('/api/notices').then(res => res.json()).then(data => setNotices(data)).catch(() => {});
    fetch('/api/exams').then(res => res.json()).then(data => setExams(data)).catch(() => {});
    fetch('/api/testimonials').then(res => res.json()).then(data => setTestimonials(data)).catch(() => {});
  }, []);

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickId || !quickPin) {
      setQuickError("Please enter both Student ID and PIN.");
      return;
    }
    setQuickLoading(true);
    setQuickError('');
    fetch('/api/students/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: quickId, pin: quickPin })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.success) {
          localStorage.setItem('gleam_verified_student', JSON.stringify(data.student));
          setCurrentView('student-portal');
        } else {
          setQuickError(data.error || "Verification failed. Check ID and PIN.");
        }
      })
      .catch(() => setQuickError("Network error during verification."))
      .finally(() => setQuickLoading(false));
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-[#0B241B] text-white overflow-hidden py-20 lg:py-28 border-b border-[#123B2A]">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('/assets/aistudio/image_4f62b769.png')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B241B] via-[#0B241B]/95 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123B2A] border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Iqbal Road, Kotwali, Chattogram
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Bricolage_Grotesque'] text-balance leading-tight">
              Your Future Begins With The Right Guidance.
            </h1>
            <p className="text-lg text-emerald-100/95 max-w-2xl font-normal leading-relaxed">
              Quality Education, Experienced Teachers, Regular Assessments and Continuous Academic Support for Classes 6–12. Led by Joy Gomes Jonerthon.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setCurrentView('courses')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                Explore Courses <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('student-portal')}
                className="px-6 py-3.5 bg-[#123B2A] hover:bg-emerald-900 text-emerald-100 font-semibold rounded-xl border border-emerald-600/50 transition-all flex items-center gap-2"
              >
                Student Portal <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Quick Result / Portal Verification Card */}
          <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-emerald-900/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#123B2A] flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Bricolage_Grotesque']">Student Portal Quick Login</h3>
                <p className="text-xs text-slate-500">Check marks & weekly exam progress securely</p>
              </div>
            </div>

            <form onSubmit={handleQuickVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID (e.g. GLM1001)
                </label>
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={quickId}
                  onChange={(e) => setQuickId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Verification PIN
                </label>
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={quickPin}
                  onChange={(e) => setQuickPin(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {quickError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {quickError}
                </div>
              )}

              <button
                type="submit"
                disabled={quickLoading}
                className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
              >
                {quickLoading ? "Verifying..." : "Verify & View Results"}
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Demo Test ID: <strong className="text-slate-700">GLM1001</strong> | PIN: <strong className="text-slate-700">1234</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque'] mb-1">
              {stats.activeStudents}+
            </div>
            <div className="text-sm font-medium text-slate-600">Enrolled Students</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque'] mb-1">
              {stats.totalTeachers}
            </div>
            <div className="text-sm font-medium text-slate-600">Expert Teachers</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque'] mb-1">
              {stats.totalCourses}
            </div>
            <div className="text-sm font-medium text-slate-600">Classes (6 to 12)</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque'] mb-1">
              Weekly
            </div>
            <div className="text-sm font-medium text-slate-600">Regular Examinations</div>
          </div>
        </div>
      </section>

      {/* About Gleam Coaching Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              About Gleam Coaching
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-['Bricolage_Grotesque']">
              Committed to Academic Excellence in Chattogram
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Located at Iqbal Road, Kotwali, Chattogram, Gleam Coaching was founded with a single mission: to empower students from Class 6 to Class 12 with deep conceptual understanding, disciplined study habits, and top-tier examination preparation.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Under the expert leadership of <strong className="text-slate-900">Joy Gomes Jonerthon</strong> and our distinguished faculty—Joy Das Soyrov, Victoria, Avishek, and Arpita Chakravorty—we ensure every student receives personal attention and comprehensive academic mentoring.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('about')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#123B2A] hover:text-emerald-800 transition-colors"
              >
                Read our complete story <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="/assets/aistudio/image_4f62b769.png"
                alt="Gleam Coaching Classroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Academic Programs
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-['Bricolage_Grotesque'] mt-2">
              Courses for Classes 6 to 12
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('courses')}
            className="text-sm font-semibold text-[#123B2A] hover:text-emerald-800 transition-colors inline-flex items-center gap-1.5"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course: any) => (
            <div key={course.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
                  {course.className}
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.subjects?.slice(0, 4).map((sub: string, idx: number) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {sub}
                    </span>
                  ))}
                  {course.subjects?.length > 4 && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      +{course.subjects.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{course.schedule}</span>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="text-xs font-bold text-[#123B2A] hover:underline flex items-center gap-1"
                >
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teachers Section Preview */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Expert Faculty
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-['Bricolage_Grotesque']">
              Learn From Chattogram's Best Mentors
            </h2>
            <p className="text-slate-600 text-sm">
              Our teachers bring years of board examination expertise and a passion for student success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teachers.map((teacher: any) => (
              <div key={teacher.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-emerald-600/30 shadow-inner">
                  <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque']">
                  {teacher.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">{teacher.designation}</p>
                <p className="text-xs text-slate-500 mt-1">{teacher.subject}</p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">{teacher.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board & Weekly Exams Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Notices */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Announcements
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] mt-2">
                Notice Board
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('notices')}
              className="text-xs font-bold text-[#123B2A] hover:underline"
            >
              View All Notices
            </button>
          </div>

          <div className="space-y-4">
            {notices.slice(0, 3).map((notice: any) => (
              <div key={notice.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {notice.category}
                  </span>
                  <span className="text-slate-500">{notice.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{notice.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Exams */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Assessments
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] mt-2">
                Weekly Exams
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('exams')}
              className="text-xs font-bold text-[#123B2A] hover:underline"
            >
              View All Exams
            </button>
          </div>

          <div className="space-y-4">
            {exams.slice(0, 3).map((exam: any) => (
              <div key={exam.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{exam.classLevel}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    exam.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{exam.title}</h4>
                <div className="text-xs text-slate-600 flex justify-between">
                  <span>Subject: {exam.subject}</span>
                  <span>Date: {exam.examDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-slate-100 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Student & Parent Feedback
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-['Bricolage_Grotesque']">
                What Parents & Students Say About Gleam
              </h2>
              <p className="text-slate-600 text-sm">
                Real experiences from families enrolled at Gleam Coaching in Chattogram.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((ts: any) => (
                <div key={ts.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ts.image || '/assets/aistudio/image_4f62b769.png'}
                        alt={ts.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600/30 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{ts.name}</h3>
                        <p className="text-xs text-emerald-700 font-semibold">{ts.role}</p>
                        <div className="flex items-center gap-0.5 mt-0.5 text-amber-400 text-xs">
                          {Array.from({ length: ts.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-2xl border">
                      "{ts.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B241B] rounded-3xl p-10 lg:p-14 text-white text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url('/assets/aistudio/image_4f62b769.png')` }}></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold font-['Bricolage_Grotesque']">
              Join Gleam Coaching Today
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base">
              Visit our campus at Iqbal Road, Kotwali, Chattogram or contact our office for admission inquiries and batch schedules.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setCurrentView('contact')}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg text-sm"
              >
                Contact & Location
              </button>
              <button
                onClick={() => setCurrentView('student-portal')}
                className="px-8 py-3.5 bg-[#123B2A] hover:bg-emerald-900 text-white font-semibold rounded-xl border border-emerald-600/50 transition-all text-sm"
              >
                Student Portal Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
