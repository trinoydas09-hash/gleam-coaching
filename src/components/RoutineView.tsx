import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, Download, FileText, ExternalLink, Eye, X, Image as ImageIcon, Archive, Sparkles } from 'lucide-react';

export const RoutineView: React.FC = () => {
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [selectedPdfModal, setSelectedPdfModal] = useState<any>(null);

  useEffect(() => {
    fetch('/api/routine?status=Published')
      .then(res => res.json())
      .then(data => setRoutines(data))
      .catch(() => {});
  }, []);

  const classFilters = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  // Published routines for the selected class
  const classRoutines = routines.filter(r => (r.classLevel === selectedClass || r.className === selectedClass) && r.status === 'Published');

  // Primary (latest) routine for this class
  const latestRoutine = classRoutines[0];
  // Archived/previous routines for this class
  const archivedRoutines = routines.filter(r => (r.classLevel === selectedClass || r.className === selectedClass) && r.status === 'Archived');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-['Plus_Jakarta_Sans']">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
          Official Academic Routine
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Class Schedules & Timetables
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Access latest published class routines, weekly exam timetables, image schedules, and downloadable PDF routine files for Classes 6 to 12.
        </p>

        {/* Class Filter Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {classFilters.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedClass === cls
                  ? 'bg-[#123B2A] text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Main Latest Published Routine for Selected Class */}
      {!latestRoutine ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 max-w-2xl mx-auto space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Published Routine for {selectedClass}</h3>
          <p className="text-xs text-slate-500">The administration has not published a routine for {selectedClass} yet. Please check back soon.</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Active Routine Details Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                    {latestRoutine.classLevel || latestRoutine.className}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {latestRoutine.academicSession || '2026 Academic Session'}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
                  {latestRoutine.title || `${selectedClass} Official Routine`}
                </h2>
              </div>

              <div className="text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-2xl border">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Effective Date</span>
                <strong className="text-slate-900 text-sm">{latestRoutine.effectiveDate || '2026-11-01'}</strong>
              </div>
            </div>

            {latestRoutine.description && (
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {latestRoutine.description}
              </p>
            )}

            {/* Quick Action Links / External Google Sheets */}
            {latestRoutine.googleSheetUrl && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-6 h-6 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Live Google Sheet Routine</h4>
                    <p className="text-xs text-slate-500">Read-only live updated schedule spreadsheet</p>
                  </div>
                </div>
                <a
                  href={latestRoutine.googleSheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#123B2A] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 flex items-center gap-1.5 shrink-0"
                >
                  Open Google Sheet <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Image Attachments Section */}
            {latestRoutine.imageAttachments && latestRoutine.imageAttachments.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-700" /> Routine Image Sheets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latestRoutine.imageAttachments.map((img: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-3 group overflow-hidden">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 border">
                        <img
                          src={img.url || img}
                          alt={img.name || `Routine Sheet ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => setSelectedImageModal(img.url || img)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2"
                        >
                          <Eye className="w-5 h-5" /> Expand Image
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs px-1">
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">{img.name || `Routine Sheet ${idx + 1}`}</span>
                        <button
                          onClick={() => setSelectedImageModal(img.url || img)}
                          className="text-emerald-700 hover:underline font-bold flex items-center gap-1 text-[11px]"
                        >
                          View Full
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF Attachments Section */}
            {latestRoutine.pdfAttachments && latestRoutine.pdfAttachments.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" /> Official PDF Routine Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latestRoutine.pdfAttachments.map((pdf: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                          PDF
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{pdf.name || `Routine_Document_${idx + 1}.pdf`}</h4>
                          <p className="text-[11px] text-slate-500">Official Routine Attachment</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedPdfModal(pdf)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <a
                          href={pdf.url || pdf}
                          download={pdf.name || 'Routine.pdf'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#123B2A] hover:bg-emerald-900 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Archived / Previous Routines Section */}
          {archivedRoutines.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque'] flex items-center gap-2">
                <Archive className="w-5 h-5 text-slate-500" /> Archived Routine Records ({selectedClass})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedRoutines.map((arc: any) => (
                  <div key={arc.id} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Archived</span>
                    <h4 className="font-bold text-slate-800 text-base">{arc.title}</h4>
                    <p className="text-xs text-slate-500">Effective Date: {arc.effectiveDate || 'Previous'}</p>
                    {arc.pdfAttachments && arc.pdfAttachments.length > 0 && (
                      <a href={arc.pdfAttachments[0].url || arc.pdfAttachments[0]} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 font-bold flex items-center gap-1 pt-2">
                        <Download className="w-3.5 h-3.5" /> View Archived PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expand Image Viewer Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImageModal(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-slate-800 hover:bg-slate-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImageModal} alt="Enlarged Routine" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-white" />
          </div>
        </div>
      )}

      {/* Embedded PDF Viewer Modal */}
      {selectedPdfModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">{selectedPdfModal.name || 'Routine Document'}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPdfModal.url || selectedPdfModal}
                  download={selectedPdfModal.name || 'Routine.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
                <button
                  onClick={() => setSelectedPdfModal(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 p-2">
              <iframe
                src={selectedPdfModal.url || selectedPdfModal}
                title="PDF Preview"
                className="w-full h-full border-0 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
