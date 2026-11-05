import React, { useState, useEffect } from 'react';
import { loadExams } from '../lib/publicData';
import { Calendar, Clock, BookOpen, CheckCircle2, AlertCircle, UserCheck, FileText, Download, Search } from 'lucide-react';

export const ExamsView: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExams().then(setExams).catch(() => setExams([]));
  }, []);

  const classFilters = ['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const statusFilters = ['All', 'Upcoming', 'Ongoing', 'Completed'];

  const filteredExams = exams.filter(e => {
    const matchesClass = selectedClass === 'All' || e.classLevel === selectedClass;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.syllabus && e.syllabus.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Continuous Assessment
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Weekly Examination Schedule
        </h1>
        <p className="text-slate-600 text-base">
          Regular weekly assessments ensure students stay on top of their coursework and are fully prepared for board examinations.
        </p>

        {/* Search & Filters */}
        <div className="space-y-4 pt-2">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search exams, subjects, or syllabus..."
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
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedClass === filter
                    ? 'bg-[#123B2A] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {statusFilters.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedStatus === st
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
            No examinations found matching your selected filters.
          </div>
        ) : (
          filteredExams.map((exam: any) => (
            <div key={exam.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
                    {exam.classLevel}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    exam.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' : 
                    exam.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {exam.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                  {exam.title}
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Subject: <strong className="text-slate-900">{exam.subject}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Date: <strong className="text-slate-900">{exam.examDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Time: <strong className="text-slate-900">{exam.startTime || exam.examTime} {exam.endTime ? `- ${exam.endTime}` : ''}</strong></span>
                  </div>
                  {exam.assignedTeacher && (
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Examiner: <strong className="text-slate-900">{exam.assignedTeacher}</strong></span>
                    </div>
                  )}
                </div>

                {exam.syllabus && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Syllabus & Topics:</h4>
                    <p className="text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      {exam.syllabus}
                    </p>
                  </div>
                )}

                {exam.instructions && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Special Instructions:</h4>
                    <p className="text-xs text-slate-600 italic">
                      {exam.instructions}
                    </p>
                  </div>
                )}

                {exam.pdfAttachments && exam.pdfAttachments.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Syllabus / Routine Attachments:</h4>
                    <div className="space-y-2">
                      {exam.pdfAttachments.map((att: any, idx: number) => (
                        <a
                          key={idx}
                          href={typeof att === 'string' ? att : att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 bg-slate-100 hover:bg-emerald-50 rounded-xl text-xs text-slate-800 font-semibold border transition-colors"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                            {typeof att === 'string' ? 'Exam Attachment' : att.name}
                          </span>
                          <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
