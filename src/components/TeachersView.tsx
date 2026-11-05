import React, { useState, useEffect } from 'react';
import { Mail, Phone, Award, BookOpen, Clock, Briefcase } from 'lucide-react';

export const TeachersView: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => {
        const activeOnly = data
          .filter((t: any) => t.isActive !== false)
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setTeachers(activeOnly);
      })
      .catch(() => {});
  }, []);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Faculty Directory
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Meet Our Expert Educators
        </h1>
        <p className="text-slate-600 text-base">
          Led by founder Joy Gomes Jonerthon alongside Joy Das Soyrov, Victoria, Avishek, and Arpita Chakravorty, our faculty is dedicated to academic excellence in Chattogram.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search teachers by name or subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher: any) => (
          <div key={teacher.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-emerald-600/30 shadow-md relative bg-slate-100">
                <img 
                  src={teacher.image || '/assets/aistudio/image_4f62b769.png'} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover" 
                  onError={(e: any) => { e.target.src = '/assets/aistudio/image_4f62b769.png'; }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                  {teacher.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-1 uppercase tracking-wider">{teacher.designation}</p>
                <p className="text-xs font-medium text-slate-600 mt-0.5">Specialization: <strong className="text-slate-900">{teacher.subject}</strong></p>
                {teacher.experience && (
                  <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-bold">
                    <Briefcase className="w-3 h-3" /> Experience: {teacher.experience}
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {teacher.bio}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              {teacher.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{teacher.email}</span>
                </div>
              )}
              {teacher.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
