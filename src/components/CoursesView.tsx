import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

interface CoursesViewProps {
  setCurrentView: (view: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ setCurrentView }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        const activeOnly = data
          .filter((c: any) => c.status === 'Active')
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setCourses(activeOnly);
      })
      .catch(() => {});
  }, []);

  const classFilters = ['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const filteredCourses = courses.filter(c => {
    const matchesClass = selectedClass === 'All' || c.className === selectedClass;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (Array.isArray(c.subjects) && c.subjects.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesClass && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Academic Programs
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Courses for Classes 6 to 12
        </h1>
        <p className="text-slate-600 text-base">
          Comprehensive coaching covering all academic subjects with regular weekly exams and expert guidance at Iqbal Road, Kotwali, Chattogram.
        </p>

        {/* Search & Class Filter Tabs */}
        <div className="space-y-4 pt-2">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search courses or subjects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {classFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedClass(filter)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedClass === filter
                    ? 'bg-[#123B2A] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course: any) => (
          <div key={course.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
                  {course.className}
                </span>
                {course.duration && (
                  <span className="text-xs text-slate-500 font-medium">Duration: {course.duration}</span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                {course.title}
              </h3>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Included Subjects:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(course.subjects) ? course.subjects.map((sub: string, idx: number) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                      {sub}
                    </span>
                  )) : (
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">{course.subjects}</span>
                  )}
                </div>
              </div>

              {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" /> Faculty Mentors:
                  </h4>
                  <p className="text-xs font-semibold text-slate-800">
                    {Array.isArray(course.assignedTeachers) ? course.assignedTeachers.join(', ') : course.assignedTeachers}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{course.schedule}</span>
              </div>
              <button
                onClick={() => setCurrentView('contact')}
                className="px-4 py-2 bg-[#123B2A] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors"
              >
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
