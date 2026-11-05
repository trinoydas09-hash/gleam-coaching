import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Pin, Search, FileText, Download, X, ExternalLink, ArrowRight } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  useEffect(() => {
    fetch('/api/notices?status=Published')
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(() => {});
  }, []);

  const categories = [
    'All',
    'General Notice',
    'Examination Notice',
    'Weekly Exam',
    'Result Announcement',
    'Class Routine',
    'Holiday Notice',
    'Admission Notice',
    'Academic Notice',
    'Emergency Notice'
  ];

  const classFilters = ['All', 'All Students', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Teachers'];

  const filteredNotices = notices.filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesClass = selectedClass === 'All' || n.targetClass === selectedClass || n.targetClass === 'All Students';
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClass && matchesSearch;
  });

  // Sort pinned notices first
  const sortedNotices = [...filteredNotices].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Official Notice Board
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Announcements & Circulars
        </h1>
        <p className="text-slate-600 text-base">
          Stay updated with examination schedules, result announcements, holiday notices, and academiccirculars from Gleam Coaching.
        </p>

        {/* Search & Filters */}
        <div className="space-y-4 pt-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by title or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#123B2A] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {classFilters.map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedClass === cls
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotices.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
            No notices found matching your search or filters.
          </div>
        ) : (
          sortedNotices.map((notice: any) => (
            <div
              key={notice.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
                notice.isPinned ? 'border-amber-400 ring-1 ring-amber-400/50 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                    {notice.category}
                  </span>
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                  {notice.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    {notice.date}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-800 font-bold">Target: {notice.targetClass || 'All Students'}</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Attachment: {notice.attachmentType || 'Text'}</span>
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="px-4 py-2 bg-[#123B2A] hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice Details Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                  {selectedNotice.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque'] mt-2">
                  {selectedNotice.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium py-2 border-y border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Published Date: {selectedNotice.date}
              </span>
              <span>·</span>
              <span className="text-emerald-800 font-bold">Target Audience: {selectedNotice.targetClass || 'All Students'}</span>
              <span>·</span>
              <span className="font-bold uppercase text-slate-700">Priority: {selectedNotice.priority || 'Normal'}</span>
            </div>

            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachmentUrl && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Official Attachment ({selectedNotice.attachmentType})</h4>
                    <p className="text-xs text-slate-500">Available for download or viewing</p>
                  </div>
                </div>
                <a
                  href={selectedNotice.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#123B2A] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            )}

            {selectedNotice.googleSheetUrl && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-8 h-8 text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Linked Google Sheet / Document</h4>
                    <p className="text-xs text-slate-500">Read-only spreadsheet reference</p>
                  </div>
                </div>
                <a
                  href={selectedNotice.googleSheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  Open Sheet <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
