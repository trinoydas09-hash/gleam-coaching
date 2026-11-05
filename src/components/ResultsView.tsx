import React, { useState } from 'react';
import { Search, Award, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ResultsViewProps {
  setCurrentView: (view: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ setCurrentView }) => {
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !/^\d{6}$/.test(pin)) {
      setError("Please enter your Student ID and 6-digit Verification PIN.");
      return;
    }
    if (!supabase) {
      setError("Student Portal is not configured. Please contact the coaching office.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('student-portal-login', {
        body: { studentId: studentId.trim(), pin },
      });
      if (invokeError) throw invokeError;
      if (data?.success && data.student) {
        setStudentData(data.student);
        setResults(Array.isArray(data.results) ? data.results : []);
        setPin('');
      } else {
        setError(data?.error || "Verification failed. Please check your Student ID and PIN.");
      }
    } catch {
      setError("Unable to verify right now. Please try again or contact the coaching office.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Academic Results
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Student Result Verification
        </h1>
        <p className="text-slate-600 text-base">
          Enter your Student ID and secure Verification PIN to view your published examination marks, grade, and teacher remarks.
        </p>
      </div>

      {!studentData ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
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
                inputMode="numeric"
                maxLength={6}
                autoComplete="off"
                placeholder="6-digit PIN"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify & View Results"}
            </button>
          </form>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-emerald-900">Need access?</p>
            <p>Contact the coaching office to receive your registered Student ID and 6-digit PIN. Demo credentials are not available.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                Verified Student
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                {studentData.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                <span>ID: <strong className="text-slate-900">{studentData.id}</strong></span>
                <span>·</span>
                <span>Class: <strong className="text-slate-900">{studentData.classLevel}</strong></span>
                <span>·</span>
                <span>Group: <strong className="text-slate-900">{studentData.group}</strong></span>
                <span>·</span>
                <span>Status: <strong className="text-emerald-700">{studentData.status}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setStudentData(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Sign Out / Switch Student
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Published Examination Results
            </h3>

            {results.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
                No examination results published yet for this student ID.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map((res: any) => (
                  <div key={res.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{res.examTitle}</span>
                      <h4 className="text-lg font-bold text-slate-900">{res.subject}</h4>
                      <p className="text-xs text-slate-600 italic">"{res.remarks}"</p>
                      {(res.resultFileUrl || res.googleSheetUrl) && <div className="flex flex-wrap items-center gap-3 pt-3">
                        {res.resultFileUrl && (res.resultFileType === 'application/pdf'
                          ? <a href={res.resultFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">View / Download Result PDF</a>
                          : <a href={res.resultFileUrl} target="_blank" rel="noopener noreferrer" className="block"><img src={res.resultFileUrl} alt="Result attachment" className="max-h-48 max-w-full rounded-xl border object-contain" /></a>)}
                        {res.googleSheetUrl && <a href={res.googleSheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">Open Google Sheets Result</a>}
                      </div>}
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Marks</span>
                        <span className="text-base font-extrabold text-slate-900">{res.obtainedMarks} / {res.totalMarks}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade</span>
                        <span className="text-base font-extrabold text-emerald-700">{res.grade || "—"}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Published</span>
                        <span className="text-xs font-bold text-[#123B2A]">{res.publishedAt ? new Date(res.publishedAt).toLocaleDateString() : "—"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
