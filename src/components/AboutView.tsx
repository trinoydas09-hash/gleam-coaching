import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Users, CheckCircle2, MapPin, Calendar, Camera, ChevronLeft, ChevronRight, X, Image as ImageIcon, Sparkles, GraduationCap } from 'lucide-react';

export const AboutView: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<'HSC' | 'SSC'>('HSC');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeAlbum, setActiveAlbum] = useState<any>(null);
  
  // Lightbox Modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const yearsList = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

  useEffect(() => {
    fetch('/api/farewell/albums?status=Published')
      .then(res => res.json())
      .then(data => {
        setAlbums(data || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Find album matching activeCategory and selectedYear
    const matched = albums.find(a => a.category === activeCategory && parseInt(a.year, 10) === selectedYear);
    setActiveAlbum(matched || null);
  }, [albums, activeCategory, selectedYear]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !activeAlbum?.photos?.length) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < activeAlbum.photos.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : activeAlbum.photos.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeAlbum]);

  const availableYearsWithAlbums = new Set(
    albums.filter(a => a.category === activeCategory && a.photos?.length > 0).map(a => parseInt(a.year, 10))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 font-['Plus_Jakarta_Sans']">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          About Gleam Coaching
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">
          Learn Today. Lead Tomorrow.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Located at Iqbal Road, Kotwali, Chattogram, Gleam Coaching is dedicated to transforming academic potential into outstanding board examination results and lifelong intellectual capability for Classes 6 to 12.
        </p>
      </div>

      {/* 2. Founder & Leadership Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 relative">
            <img
              src="/assets/aistudio/image_4f62b769.png"
              alt="Joy Gomes Jonerthon - Founder"
              className="w-full h-full object-cover aspect-[4/5]"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-6 text-white">
              <h3 className="font-bold text-xl font-['Bricolage_Grotesque']">Joy Gomes Jonerthon</h3>
              <p className="text-xs text-emerald-400 font-semibold">Founder & Chief Instructor</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Our Vision & Mentorship
          </span>
          <h2 className="text-3xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
            Guiding Chattogram's Future Leaders Since 2017
          </h2>
          <p className="text-slate-600 leading-relaxed">
            With over 12 years of dedicated teaching experience in Chattogram, Joy Gomes Jonerthon established Gleam Coaching with a clear vision: to provide uncompromising educational standards, rigorous analytical training, and holistic mentoring for students from Class 6 to Class 12 across all subjects.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700"><strong className="text-slate-900">Conceptual Depth:</strong> We emphasize foundational clarity and problem-solving over rote memorization.</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700"><strong className="text-slate-900">Regular Weekly Assessments:</strong> Continuous evaluation through structured exams ensures students are board-ready.</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700"><strong className="text-slate-900">Dedicated Faculty Team:</strong> Guided by Joy Das Soyrov, Victoria, Avishek, and Arpita Chakravorty.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Facilities & Location Cards */}
      <div className="bg-[#0B241B] rounded-3xl p-8 lg:p-12 text-white grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">Prime Location</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Conveniently situated at Iqbal Road, Kotwali, Chattogram, providing a secure academic atmosphere for students.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">Expert Faculty</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Subject specialist instructors in Higher Math, Physics, Chemistry, Biology, Accounting, ICT, English, and Bengali.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">Proven Track Record</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Consistently producing top board examination scores and GPA 5.00 achievers across SSC and HSC batches.
          </p>
        </div>
      </div>

      {/* 4. FAREWELL MEMORIES & PHOTO GALLERY SYSTEM */}
      <section className="space-y-10 pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-700" /> Farewell Memories & Photo Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
            Cherished SSC & HSC Farewell Albums (2017–2026)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Preserving precious memories, farewell celebrations, group photographs, and memorable moments of our graduating batches.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveCategory('HSC')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeCategory === 'HSC'
                ? 'bg-[#123B2A] text-white shadow-lg ring-2 ring-emerald-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>HSC FAREWELL</span>
          </button>

          <button
            onClick={() => setActiveCategory('SSC')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeCategory === 'SSC'
                ? 'bg-[#123B2A] text-white shadow-lg ring-2 ring-emerald-500/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>SSC FAREWELL</span>
          </button>
        </div>

        {/* Year Selector Grid (2017 to 2026) */}
        <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase text-center mb-3 tracking-wider">
            Select {activeCategory} Batch Year (2017 – 2026):
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {yearsList.map((yr) => {
              const hasAlbum = availableYearsWithAlbums.has(yr);
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : hasAlbum
                      ? 'bg-white text-slate-900 border border-slate-300 hover:bg-emerald-50'
                      : 'bg-slate-200/70 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>{yr}</span>
                  {hasAlbum && (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-600'}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Album Details & Photo Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          {activeAlbum ? (
            <div className="space-y-8">
              {/* Album Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                      {activeAlbum.category} Farewell {activeAlbum.year}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeAlbum.photos?.length || 0} Photographs
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
                    {activeAlbum.title}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                    {activeAlbum.description || `Special memories and farewell gathering photographs for ${activeAlbum.category} Batch ${activeAlbum.year} at Gleam Coaching.`}
                  </p>
                </div>
              </div>

              {/* Photo Grid */}
              {activeAlbum.photos && activeAlbum.photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {activeAlbum.photos.map((photo: any, idx: number) => (
                    <div
                      key={photo.id || idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group cursor-pointer bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all relative aspect-[4/3]"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                        <p className="text-xs font-semibold line-clamp-2">{photo.caption || `${activeAlbum.category} ${activeAlbum.year} Memory`}</p>
                        <span className="text-[10px] text-emerald-300 font-bold mt-1 inline-flex items-center gap-1">
                          Click to expand <Camera className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm text-slate-600 font-medium">
                    No photographs uploaded yet for {activeCategory} Farewell {selectedYear}.
                  </p>
                  <p className="text-xs text-slate-400">
                    The Admin can upload photographs for this album from the Admin Dashboard.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Camera className="w-12 h-12 text-emerald-700/40 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
                {activeCategory} Farewell {selectedYear} Album Not Published Yet
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Photographs for {activeCategory} Farewell {selectedYear} are currently being archived. Please select another year or check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. LIGHTBOX FULLSCREEN IMAGE VIEWER MODAL */}
      {lightboxIndex !== null && activeAlbum?.photos?.[lightboxIndex] && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-3 text-slate-400 hover:text-white rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors z-50"
            title="Close Viewer (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : activeAlbum.photos.length - 1
              )
            }
            className="absolute left-4 p-3 text-slate-300 hover:text-white rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors z-50"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next Button */}
          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev < activeAlbum.photos.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 p-3 text-slate-300 hover:text-white rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors z-50"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Lightbox Content Container */}
          <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl border border-slate-800">
              <img
                src={activeAlbum.photos[lightboxIndex].imageUrl}
                alt={activeAlbum.photos[lightboxIndex].caption || 'Farewell Photo'}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl"
              />
            </div>

            <div className="text-center text-white space-y-1 bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-800 max-w-xl">
              <p className="text-sm font-semibold text-emerald-300">
                {activeAlbum.photos[lightboxIndex].caption || `${activeAlbum.category} Farewell ${activeAlbum.year} Memory`}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Photo {lightboxIndex + 1} of {activeAlbum.photos.length} · {activeAlbum.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
