import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Users, BookOpen, Calendar, Award, FileText, 
  Settings, LogOut, ShieldCheck, Plus, Trash2, Edit, CheckCircle2, AlertCircle, Code, UserCheck, Clock, X, Search, Upload, Download, Pin, Eye, Image as ImageIcon, Briefcase, ExternalLink, RefreshCw, Key, Archive, FileUp, Phone, MapPin, Mail, Camera, GraduationCap, ChevronUp, ChevronDown
} from 'lucide-react';

interface AdminDashboardViewProps {
  onLogout: () => void;
  setCurrentView: (view: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onLogout, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'courses' | 'exams' | 'results' | 'routine' | 'notices' | 'testimonials' | 'farewell' | 'students' | 'logs' | 'settings' | 'apps-script'>('overview');
  
  // Farewell & Gallery Sub-tabs & Search
  const [farewellSubTab, setFarewellSubTab] = useState<'all' | 'hsc' | 'ssc' | 'create' | 'published' | 'archived'>('all');
  const [farewellSearch, setFarewellSearch] = useState('');
  const [farewellCategoryFilter, setFarewellCategoryFilter] = useState('All');
  const [farewellYearFilter, setFarewellYearFilter] = useState('All');
  const [farewellAlbums, setFarewellAlbums] = useState<any[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [albumPreviewModal, setAlbumPreviewModal] = useState<any>(null);
  const [albumForm, setAlbumForm] = useState({
    category: 'HSC' as 'HSC' | 'SSC',
    year: 2026,
    title: 'HSC 2026 Grand Farewell Ceremony',
    description: '',
    coverImage: '/assets/aistudio/image_4f62b769.png',
    status: 'Published',
    photos: [] as any[]
  });
  
  // Teachers Sub-tabs & Search
  const [teacherSubTab, setTeacherSubTab] = useState<'all' | 'add'>('all');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState('All');

  // Courses Sub-tabs & Search
  const [courseSubTab, setCourseSubTab] = useState<'all' | 'add'>('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [courseClassFilter, setCourseClassFilter] = useState('All');

  // Exams Sub-tabs & Search
  const [examSubTab, setExamSubTab] = useState<'all' | 'create' | 'upcoming' | 'completed'>('all');
  const [examSearch, setExamSearch] = useState('');
  const [examClassFilter, setExamClassFilter] = useState('All');

  // Results Sub-tabs & Search
  const [resultSubTab, setResultSubTab] = useState<'all' | 'add' | 'sheets' | 'published' | 'drafts'>('all');
  const [resultSearch, setResultSearch] = useState('');
  const [resultClassFilter, setResultClassFilter] = useState('All');

  // Class Routine Sub-tabs & Search
  const [routineSubTab, setRoutineSubTab] = useState<'all' | 'create' | 'upload-image' | 'upload-pdf' | 'sheets' | 'published' | 'archived'>('all');
  const [routineSearch, setRoutineSearch] = useState('');
  const [routineClassFilter, setRoutineClassFilter] = useState('All');

  // Notices Sub-tabs & Search
  const [noticeSubTab, setNoticeSubTab] = useState<'all' | 'create' | 'published' | 'drafts' | 'pinned'>('all');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState('All');

  // Testimonials Sub-tabs & Search
  const [testimonialSubTab, setTestimonialSubTab] = useState<'all' | 'add'>('all');
  const [testimonialSearch, setTestimonialSearch] = useState('');

  // Students Sub-tabs & Search
  const [studentSubTab, setStudentSubTab] = useState<'all' | 'add' | 'active' | 'inactive'>('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');

  // Core Data
  const [stats, setStats] = useState<any>({});
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [routine, setRoutine] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [appsScriptCode, setAppsScriptCode] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- TEACHER FORM STATE ---
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    designation: 'Instructor',
    subject: '',
    bio: '',
    experience: '5+ Years',
    image: '/assets/aistudio/image_4f62b769.png',
    email: '',
    phone: '',
    displayOrder: 1,
    isActive: true
  });

  // --- COURSE FORM STATE ---
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    className: 'Class 10',
    title: '',
    description: '',
    subjects: '',
    assignedTeachers: [] as string[],
    duration: '1 Year',
    schedule: 'Sun, Tue, Thu (4:00 PM - 6:00 PM)',
    image: '/assets/aistudio/image_4f62b769.png',
    status: 'Active',
    displayOrder: 1
  });

  // --- EXAM FORM STATE ---
  const [editingExam, setEditingExam] = useState<any>(null);
  const [examForm, setExamForm] = useState({
    title: '',
    classLevel: 'Class 10',
    subject: '',
    assignedTeacher: 'Joy Gomes Jonerthon',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    totalMarks: 50,
    syllabus: '',
    instructions: 'Arrive 15 minutes prior to the exam with necessary stationery.',
    pdfAttachments: [] as any[],
    imageAttachments: [] as any[],
    status: 'Upcoming',
    isPublished: true
  });

  // --- RESULT FORM STATE ---
  const [editingResult, setEditingResult] = useState<any>(null);
  const [resultForm, setResultForm] = useState({
    studentId: 'GLM1001',
    studentName: 'Tanvir Ahmed',
    classLevel: 'Class 10',
    group: 'Science',
    examTitle: 'Weekly Assessment',
    subject: 'Physics',
    obtainedMarks: 45,
    totalMarks: 50,
    gpa: '5.00',
    position: '1st',
    remarks: 'Excellent performance and high analytical accuracy.',
    documentUrl: '',
    status: 'Published'
  });

  // --- CLASS ROUTINE FORM STATE ---
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [routineForm, setRoutineForm] = useState({
    title: '',
    classLevel: 'Class 10',
    academicSession: '2026 Academic Session',
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    imageAttachments: [] as any[],
    pdfAttachments: [] as any[],
    googleSheetUrl: '',
    status: 'Published'
  });

  // --- NOTICE FORM STATE ---
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'General Notice',
    targetClass: 'All Students',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    priority: 'Normal',
    attachmentType: 'Text',
    attachmentUrl: '',
    googleSheetUrl: '',
    content: '',
    isPinned: false,
    status: 'Published'
  });

  // --- TESTIMONIAL FORM STATE ---
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: 'Parent of SSC Candidate',
    comment: '',
    rating: 5,
    image: '/assets/aistudio/image_4f62b769.png',
    isActive: true
  });

  // --- FULL STUDENT FORM STATE ---
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [studentForm, setStudentForm] = useState({
    id: 'GLM1003',
    name: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    address: 'Iqbal Road, Kotwali, Chattogram',
    classLevel: 'Class 10',
    group: 'Science',
    academicSession: '2026 Academic Session',
    admissionDate: new Date().toISOString().split('T')[0],
    guardianName: '',
    guardianMobile: '',
    guardianRelationship: 'Father',
    guardianAddress: '',
    status: 'Active'
  });

  // --- SETTINGS FORM STATE ---
  const [settingsForm, setSettingsForm] = useState<any>({});

  // Google Sheets Config State
  const [sheetUrlInput, setSheetUrlInput] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [sheetTabName, setSheetTabName] = useState('Students');
  const [pinResetStudent, setPinResetStudent] = useState<any>(null);
  const [newPinInput, setNewPinInput] = useState('');
  const [previewModalFile, setPreviewModalFile] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    fetch('/api/stats').then(res => res.json()).then(data => setStats(data)).catch(() => {});
    if (supabase) {
      Promise.all([
        supabase.from('teachers').select('*').order('sort_order', { ascending: true }),
        supabase.from('courses').select('*').order('sort_order', { ascending: true }),
      ]).then(([teacherResult, courseResult]) => {
        if (teacherResult.error) showError('Unable to load teachers: ' + teacherResult.error.message);
        else setTeachers((teacherResult.data || []).map((row: any) => ({
          id: row.id, name: row.name, designation: row.designation || '',
          subject: (row.subjects || []).join(', '), bio: row.bio || '',
          experience: row.qualification || '', image: row.photo_path || '',
          email: row.email || '', phone: row.phone || '',
          displayOrder: row.sort_order, isActive: row.is_published,
        })));
        if (courseResult.error) showError('Unable to load courses: ' + courseResult.error.message);
        else setCourses((courseResult.data || []).map((row: any) => ({
          id: row.id, title: row.title, className: 'Class ' + row.class_level,
          description: row.description || '', subjects: row.subjects || [],
          duration: row.duration || '', schedule: row.schedule || '',
          image: row.image_path || '', status: row.status || 'active',
          displayOrder: row.sort_order,
        })));
      });
    }
    if (supabase) {
      supabase.from('weekly_exams')
        .select('*, teachers(name), exam_attachments(id,file_path,file_name,content_type)')
        .order('exam_date', { ascending: true })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load weekly exams: ' + error.message);
          setExams((data || []).map((row: any) => {
            const attachments = row.exam_attachments || [];
            const start = row.start_time ? String(row.start_time).slice(0, 5) : '10:00';
            const startParts = start.split(':').map(Number);
            const endDate = new Date(2000, 0, 1, startParts[0] || 0, (startParts[1] || 0) + (row.duration_minutes || 120));
            const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return {
              id: row.id, title: row.title, classLevel: 'Class ' + row.class_level,
              subject: row.subject, assignedTeacher: row.teachers?.name || '',
              examDate: row.exam_date || new Date().toISOString().split('T')[0],
              startTime: new Date('2000-01-01T' + start + ':00').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              endTime, totalMarks: Number(row.total_marks || 50), syllabus: row.syllabus || '',
              instructions: row.instructions || '', status: row.status === 'published' ? 'Upcoming' : 'Draft',
              isPublished: row.status === 'published',
              pdfAttachments: attachments.filter((a: any) => (a.content_type || '').includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path, fileType: 'pdf' })),
              imageAttachments: attachments.filter((a: any) => !(a.content_type || '').includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path, fileType: 'image' })),
            };
          }));
        });
    }
    fetch('/api/results').then(res => res.json()).then(data => setResults(data)).catch(() => {});
    if (supabase) {
      supabase.from('routines')
        .select('*, routine_attachments(id,file_path,file_name,content_type,sort_order)')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load class routines: ' + error.message);
          setRoutine((data || []).map((row: any) => {
            const attachments = row.routine_attachments || [];
            return {
              id: row.id, title: row.title,
              classLevel: row.class_level ? 'Class ' + row.class_level : 'All Classes',
              academicSession: row.academic_session || '2026 Academic Session',
              description: row.description || '',
              effectiveDate: row.published_at ? String(row.published_at).slice(0, 10) : String(row.created_at || '').slice(0, 10),
              googleSheetUrl: row.google_sheet_url || '',
              status: row.status === 'archived' ? 'Archived' : row.status === 'published' ? 'Published' : 'Draft',
              imageAttachments: attachments.filter((a: any) => !(a.content_type || '').includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path, fileType: 'image' })),
              pdfAttachments: attachments.filter((a: any) => (a.content_type || '').includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path, fileType: 'pdf' })),
            };
          }));
        });
    }
    if (supabase) {
      supabase.from('notices').select('*, notice_attachments(id,file_path,file_name,content_type)').order('published_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load notices: ' + error.message);
          setNotices((data || []).map((row: any) => {
            const attachment = row.notice_attachments?.[0];
            return {
              id: row.id, title: row.title, content: row.body || '', category: row.category || 'General Notice',
              targetClass: row.target_class || 'All Students',
              date: row.published_at ? String(row.published_at).slice(0, 10) : String(row.created_at || '').slice(0, 10),
              expiryDate: row.expires_at ? String(row.expires_at).slice(0, 10) : '',
              priority: row.priority || 'Normal', attachmentUrl: attachment?.file_path || '',
              attachmentType: attachment?.content_type?.includes('pdf') ? 'PDF File' : attachment ? 'Image File' : (row.google_sheet_url ? 'Google Sheet Link' : 'Text'),
              googleSheetUrl: row.google_sheet_url || '', isPinned: Boolean(row.is_pinned),
              status: row.status === 'published' ? 'Published' : 'Draft',
            };
          }));
        });
      supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load testimonials: ' + error.message);
          setTestimonials((data || []).map((row: any) => ({
            id: row.id, name: row.student_name || '', role: row.author_role || (row.class_level ? 'Class ' + row.class_level : 'Student'),
            comment: row.quote || '', rating: Number(row.rating || 5), image: row.photo_path || '',
            isActive: Boolean(row.is_published), sortOrder: row.sort_order || 0,
          })));
        });
      supabase.from('farewell_albums').select('*, farewell_photos(id,file_path,caption,sort_order)')
        .order('year', { ascending: false }).order('sort_order', { ascending: true })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load farewell albums: ' + error.message);
          setFarewellAlbums((data || []).map((row: any) => ({
            id: row.id, category: row.school_level || 'HSC', year: row.year, title: row.title,
            description: row.description || '', coverImage: row.cover_photo_path || '',
            status: row.status === 'archived' ? 'Archived' : row.status === 'draft' || !row.is_published ? 'Draft' : 'Published',
            updatedAt: row.updated_at || row.created_at,
            photos: (row.farewell_photos || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((photo: any) => ({ id: photo.id, imageUrl: photo.file_path, caption: photo.caption || '', sortOrder: photo.sort_order })),
          })));
        });
    }
    if (supabase) {
      supabase.from('students')
        .select('id,student_id,full_name,date_of_birth,gender,student_phone,email,address,class_level,group_name,session,admission_date,guardian_name,guardian_phone,relationship,guardian_address,status,created_at')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) return showError('Unable to load student records: ' + error.message);
          setStudents((data || []).map((row: any) => ({
            uuid: row.id,
            id: row.student_id,
            name: row.full_name,
            dob: row.date_of_birth || '',
            gender: row.gender || 'Male',
            mobile: row.student_phone || '',
            email: row.email || '',
            address: row.address || '',
            classLevel: row.class_level ? 'Class ' + row.class_level : '',
            group: row.group_name || '',
            academicSession: row.session || '',
            admissionDate: row.admission_date || '',
            guardianName: row.guardian_name || '',
            guardianMobile: row.guardian_phone || '',
            guardianRelationship: row.relationship || '',
            guardianAddress: row.guardian_address || '',
            status: (row.status || 'active').toLowerCase() === 'active' ? 'Active' : 'Inactive',
          })));
        });
    }
    fetch('/api/verification-logs').then(res => res.json()).then(data => setLogs(data)).catch(() => {});
    fetch('/api/settings').then(res => res.json()).then(data => {
      setSettings(data);
      setSettingsForm(data);
    }).catch(() => {});
    fetch('/api/docs/apps-script').then(res => res.json()).then(data => setAppsScriptCode(data.script || '')).catch(() => {});
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const generateNextStudentId = () => {
    let maxNum = 1000;
    students.forEach(s => {
      const match = (s.id || '').match(/GLM(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `GLM${maxNum + 1}`;
  };

  // Helper for uploading files via base64 to /api/upload
  const handleFileUpload = async (file: File, callback: (attachment: { name: string; url: string; fileType: string }) => void) => {
    setUploading(true);
    setUploadProgress(20);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setUploadProgress(60);
        const dataUrl = e.target?.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileType: file.type, dataUrl })
        });
        const data = await res.json();
        setUploadProgress(100);
        if (data.success) {
          const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
          callback({
            name: file.name,
            url: data.url,
            fileType: isPdf ? 'pdf' : 'image'
          });
          showSuccess(`File "${file.name}" uploaded successfully!`);
        } else {
          showError(data.error || "Upload failed.");
        }
        setUploading(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploading(false);
      setUploadProgress(0);
      showError("File upload error: " + err.message);
    }
  };

  const uploadPublicAsset = async (file: File, bucket: string, maxBytes: number, allowedTypes: string[]) => {
    if (!supabase) throw new Error('Supabase is not configured. Please refresh and sign in again.');
    if (!allowedTypes.includes(file.type)) throw new Error('Unsupported file type.');
    if (file.size > maxBytes) throw new Error('File is larger than the allowed size.');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = 'admin/' + Date.now() + '-' + Math.random().toString(36).slice(2, 9) + '-' + safeName;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600', upsert: false, contentType: file.type,
    });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  // ==================== 1. TEACHERS MANAGEMENT ====================
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) return showError("Teacher name is required.");
    if (!supabase) return showError("Supabase is not configured. Please refresh and sign in again.");
    const payload = {
      name: teacherForm.name.trim(),
      designation: teacherForm.designation.trim() || null,
      subjects: teacherForm.subject.split(',').map((value: string) => value.trim()).filter(Boolean),
      bio: teacherForm.bio.trim() || null,
      qualification: teacherForm.experience.trim() || null,
      photo_path: teacherForm.image || null,
      email: teacherForm.email.trim() || null,
      phone: teacherForm.phone.trim() || null,
      sort_order: Number(teacherForm.displayOrder) || 1,
      is_published: Boolean(teacherForm.isActive),
      updated_at: new Date().toISOString(),
    };
    try {
      const result = editingTeacher
        ? await supabase.from('teachers').update(payload).eq('id', editingTeacher.id).select('id').single()
        : await supabase.from('teachers').insert(payload).select('id').single();
      if (result.error) throw result.error;
      showSuccess(editingTeacher ? "Teacher profile updated!" : "New teacher added!");
      setEditingTeacher(null);
      setTeacherForm({ name: '', designation: 'Instructor', subject: '', bio: '', experience: '5+ Years', image: '/assets/aistudio/image_4f62b769.png', email: '', phone: '', displayOrder: 1, isActive: true });
      setTeacherSubTab('all');
      loadAllData();
    } catch (error: any) {
      showError("Unable to save teacher: " + (error?.message || "Unknown error"));
    }
  };

  const handleEditTeacherClick = (t: any) => {
    setEditingTeacher(t);
    setTeacherForm({
      name: t.name || '',
      designation: t.designation || '',
      subject: t.subject || '',
      bio: t.bio || '',
      experience: t.experience || '5+ Years',
      image: t.image || '/assets/aistudio/image_4f62b769.png',
      email: t.email || '',
      phone: t.phone || '',
      displayOrder: t.displayOrder || 1,
      isActive: t.isActive !== false
    });
    setTeacherSubTab('add');
  };

  const handleDeleteTeacherClick = async (id: string, name: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete teacher "${name}"?`)) return;
    try {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;
      showSuccess(`Teacher "${name}" deleted.`);
      loadAllData();
    } catch (error: any) {
      showError("Unable to delete teacher: " + (error?.message || "Unknown error"));
    }
  };

  const filteredTeachersList = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                          t.subject.toLowerCase().includes(teacherSearch.toLowerCase());
    const matchesStatus = teacherStatusFilter === 'All' || 
                          (teacherStatusFilter === 'Active' && t.isActive !== false) ||
                          (teacherStatusFilter === 'Inactive' && t.isActive === false);
    return matchesSearch && matchesStatus;
  });

  // ==================== 2. COURSES MANAGEMENT ====================
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return showError("Course title is required.");
    if (!supabase) return showError("Supabase is not configured. Please refresh and sign in again.");
    const classLevel = Number(String(courseForm.className).replace(/[^0-9]/g, ''));
    if (!Number.isInteger(classLevel) || classLevel < 6 || classLevel > 12) return showError("Please select a valid class level.");
    const payload = {
      title: courseForm.title.trim(),
      class_level: classLevel,
      description: courseForm.description.trim() || null,
      subjects: courseForm.subjects.split(',').map((value: string) => value.trim()).filter(Boolean),
      duration: courseForm.duration.trim() || null,
      schedule: courseForm.schedule.trim() || null,
      image_path: courseForm.image || null,
      status: String(courseForm.status || 'Active').toLowerCase(),
      sort_order: Number(courseForm.displayOrder) || 1,
      is_published: String(courseForm.status || 'Active').toLowerCase() === 'active',
      updated_at: new Date().toISOString(),
    };
    try {
      const result = editingCourse
        ? await supabase.from('courses').update(payload).eq('id', editingCourse.id).select('id').single()
        : await supabase.from('courses').insert(payload).select('id').single();
      if (result.error) throw result.error;
      showSuccess(editingCourse ? "Course updated!" : "New course created!");
      setEditingCourse(null);
      setCourseForm({ className: 'Class 10', title: '', description: '', subjects: '', assignedTeachers: [], duration: '1 Year', schedule: 'Sun, Tue, Thu (4:00 PM - 6:00 PM)', image: '/assets/aistudio/image_4f62b769.png', status: 'Active', displayOrder: 1 });
      setCourseSubTab('all');
      loadAllData();
    } catch (error: any) {
      showError("Unable to save course: " + (error?.message || "Unknown error"));
    }
  };

  const handleEditCourseClick = (c: any) => {
    setEditingCourse(c);
    setCourseForm({
      className: c.className || 'Class 10',
      title: c.title || '',
      description: c.description || '',
      subjects: Array.isArray(c.subjects) ? c.subjects.join(', ') : (c.subjects || ''),
      assignedTeachers: Array.isArray(c.assignedTeachers) ? c.assignedTeachers : (c.assignedTeachers ? [c.assignedTeachers] : []),
      duration: c.duration || '1 Year',
      schedule: c.schedule || '',
      image: c.image || '/assets/aistudio/image_4f62b769.png',
      status: c.status || 'Active',
      displayOrder: c.displayOrder || 1
    });
    setCourseSubTab('add');
  };

  const handleDeleteCourseClick = async (id: string, title: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      showSuccess(`Course "${title}" deleted.`);
      loadAllData();
    } catch (error: any) {
      showError("Unable to delete course: " + (error?.message || "Unknown error"));
    }
  };

  const filteredCoursesList = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesClass = courseClassFilter === 'All' || c.className === courseClassFilter;
    return matchesSearch && matchesClass;
  });

  // ==================== 3. WEEKLY EXAMS MANAGEMENT ====================
  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title.trim()) return showError("Exam title is required.");
    if (!examForm.subject.trim()) return showError("Exam subject is required.");
    if (!supabase) return showError("Supabase is not configured. Please refresh and sign in again.");
    const classLevel = Number(String(examForm.classLevel).replace(/[^0-9]/g, ''));
    if (!Number.isInteger(classLevel) || classLevel < 6 || classLevel > 12) return showError("Please select a valid class level.");
    const parseClock = (value: string) => {
      const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return null;
      let hour = Number(match[1]) % 12;
      if (match[3].toUpperCase() === 'PM') hour += 12;
      return { hour, minute: Number(match[2]) };
    };
    const start = parseClock(examForm.startTime);
    const end = parseClock(examForm.endTime);
    if (!start || !end) return showError("Please enter valid exam start and end times.");
    let duration = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute);
    if (duration <= 0) duration += 24 * 60;
    try {
      const { data: teacherRows, error: teacherError } = await supabase.from('teachers').select('id,name');
      if (teacherError) throw teacherError;
      const matchedTeacher = (teacherRows || []).find((t: any) => (t.name || '').trim().toLowerCase() === examForm.assignedTeacher.trim().toLowerCase());
      const payload = {
        title: examForm.title.trim(),
        class_level: classLevel,
        subject: examForm.subject.trim(),
        teacher_id: matchedTeacher?.id || null,
        exam_date: examForm.examDate || null,
        start_time: `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}:00`,
        duration_minutes: duration,
        syllabus: examForm.syllabus.trim() || null,
        instructions: examForm.instructions.trim() || null,
        total_marks: Number(examForm.totalMarks) || 50,
        status: examForm.isPublished ? 'published' : 'draft',
        updated_at: new Date().toISOString(),
      };
      const result = editingExam
        ? await supabase.from('weekly_exams').update(payload).eq('id', editingExam.id).select('id').single()
        : await supabase.from('weekly_exams').insert(payload).select('id').single();
      if (result.error) throw result.error;
      const examId = result.data.id;
      const attachments = [...(examForm.pdfAttachments || []), ...(examForm.imageAttachments || [])];
      const { error: deleteAttachmentError } = await supabase.from('exam_attachments').delete().eq('exam_id', examId);
      if (deleteAttachmentError) throw deleteAttachmentError;
      if (attachments.length) {
        const attachmentRows = attachments.filter((a: any) => a?.url).map((a: any) => ({
          exam_id: examId, file_path: a.url, file_name: a.name || 'Exam attachment',
          content_type: a.fileType === 'pdf' || String(a.url).toLowerCase().includes('.pdf') ? 'application/pdf' : 'image/*',
        }));
        if (attachmentRows.length) {
          const { error: attachmentError } = await supabase.from('exam_attachments').insert(attachmentRows);
          if (attachmentError) throw attachmentError;
        }
      }
      showSuccess(editingExam ? "Examination updated!" : "Weekly Exam created!");
      setEditingExam(null);
      setExamForm({
        title: '', classLevel: 'Class 10', subject: '', assignedTeacher: 'Joy Gomes Jonerthon',
        examDate: new Date().toISOString().split('T')[0], startTime: '10:00 AM', endTime: '12:00 PM',
        totalMarks: 50, syllabus: '', instructions: 'Arrive 15 minutes prior to the exam with necessary stationery.',
        pdfAttachments: [], imageAttachments: [], status: 'Upcoming', isPublished: true
      });
      setExamSubTab('all');
      loadAllData();
    } catch (error: any) {
      showError("Unable to save weekly exam: " + (error?.message || "Unknown error"));
    }
  };

  const handleEditExamClick = (ex: any) => {
    setEditingExam(ex);
    setExamForm({
      title: ex.title || '',
      classLevel: ex.classLevel || 'Class 10',
      subject: ex.subject || '',
      assignedTeacher: ex.assignedTeacher || 'Joy Gomes Jonerthon',
      examDate: ex.examDate || new Date().toISOString().split('T')[0],
      startTime: ex.startTime || '10:00 AM',
      endTime: ex.endTime || '12:00 PM',
      totalMarks: ex.totalMarks || 50,
      syllabus: ex.syllabus || '',
      instructions: ex.instructions || '',
      pdfAttachments: ex.pdfAttachments || ex.attachments?.filter((a: any) => a.fileType === 'pdf') || [],
      imageAttachments: ex.imageAttachments || ex.attachments?.filter((a: any) => a.fileType !== 'pdf') || [],
      status: ex.status || 'Upcoming',
      isPublished: ex.isPublished !== false
    });
    setExamSubTab('create');
  };

  const handleDeleteExamClick = async (id: string, title: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete exam "${title}"?`)) return;
    try {
      const { error } = await supabase.from('weekly_exams').delete().eq('id', id);
      if (error) throw error;
      showSuccess(`Exam "${title}" deleted.`);
      loadAllData();
    } catch (error: any) {
      showError("Unable to delete weekly exam: " + (error?.message || "Unknown error"));
    }
  };

  const filteredExamsList = exams.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(examSearch.toLowerCase()) || ex.subject.toLowerCase().includes(examSearch.toLowerCase());
    const matchesClass = examClassFilter === 'All' || ex.classLevel === examClassFilter;
    const matchesTab = examSubTab === 'upcoming' ? ex.status === 'Upcoming' :
                       examSubTab === 'completed' ? ex.status === 'Completed' : true;
    return matchesSearch && matchesClass && matchesTab;
  });

  // ==================== 4. RESULT MANAGEMENT ====================
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultForm.studentId.trim() || !resultForm.subject.trim()) return showError("Student ID and Subject are required.");
    const url = editingResult ? `/api/results/${editingResult.id}` : '/api/results';
    const method = editingResult ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultForm)
    }).then(() => {
      showSuccess(editingResult ? "Result updated successfully!" : "New Result added!");
      setEditingResult(null);
      setResultSubTab('all');
      loadAllData();
    });
  };

  const handleEditResultClick = (resItem: any) => {
    setEditingResult(resItem);
    setResultForm({
      studentId: resItem.studentId || '',
      studentName: resItem.studentName || '',
      classLevel: resItem.classLevel || 'Class 10',
      group: resItem.group || 'Science',
      examTitle: resItem.examTitle || '',
      subject: resItem.subject || '',
      obtainedMarks: resItem.obtainedMarks || 0,
      totalMarks: resItem.totalMarks || 50,
      gpa: resItem.gpa || '5.00',
      position: resItem.position || '1st',
      remarks: resItem.remarks || '',
      documentUrl: resItem.documentUrl || '',
      status: resItem.status || 'Published'
    });
    setResultSubTab('add');
  };

  const handleDeleteResultClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete result entry for "${name}"?`)) {
      fetch(`/api/results/${id}`, { method: 'DELETE' }).then(() => {
        showSuccess("Result entry deleted.");
        loadAllData();
      });
    }
  };

  const handleImportSheetResults = () => {
    fetch('/api/results/import-sheets', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        showSuccess(`Successfully imported ${data.count || 2} student results from Google Sheets!`);
        loadAllData();
        setResultSubTab('all');
      });
  };

  const filteredResultsList = results.filter(r => {
    const matchesSearch = r.studentId.toLowerCase().includes(resultSearch.toLowerCase()) ||
                          (r.studentName && r.studentName.toLowerCase().includes(resultSearch.toLowerCase())) ||
                          (r.subject && r.subject.toLowerCase().includes(resultSearch.toLowerCase()));
    const matchesClass = resultClassFilter === 'All' || r.classLevel === resultClassFilter;
    const matchesTab = resultSubTab === 'published' ? r.status === 'Published' :
                       resultSubTab === 'drafts' ? r.status === 'Draft' : true;
    return matchesSearch && matchesClass && matchesTab;
  });

  // ==================== 5. CLASS ROUTINE MANAGEMENT ====================
  const handleRoutineFileUpload = async (file: File, fileType: 'image' | 'pdf') => {
    if (!supabase) return showError("Supabase is not configured. Please sign in again.");
    const validImage = fileType === 'image' && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const validPdf = fileType === 'pdf' && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (!validImage && !validPdf) return showError(fileType === 'pdf' ? 'Please choose a PDF file.' : 'Please choose a JPG, PNG, or WEBP image.');
    if (file.size > 20 * 1024 * 1024) return showError('File size must be 20 MB or less.');
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const filePath = `routines/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
      const { error } = await supabase.storage.from('routine-files').upload(filePath, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('routine-files').getPublicUrl(filePath);
      const attachment = { name: file.name, url: data.publicUrl, fileType };
      if (fileType === 'pdf') setRoutineForm(prev => ({ ...prev, pdfAttachments: [...prev.pdfAttachments, attachment] }));
      else setRoutineForm(prev => ({ ...prev, imageAttachments: [...prev.imageAttachments, attachment] }));
      showSuccess(`File "${file.name}" uploaded successfully.`);
    } catch (error: any) {
      showError('Routine file upload failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineForm.title.trim()) return showError("Routine Title is required.");
    if (!supabase) return showError("Supabase is not configured. Please refresh and sign in again.");
    const classLevelText = String(routineForm.classLevel || '').trim();
    const classLevel = /all/i.test(classLevelText) ? null : Number(classLevelText.replace(/[^0-9]/g, ''));
    if (classLevel !== null && (!Number.isInteger(classLevel) || classLevel < 1 || classLevel > 12)) return showError("Please select a valid class level.");
    const status = String(routineForm.status).toLowerCase() === 'archived' ? 'archived' : String(routineForm.status).toLowerCase() === 'draft' ? 'draft' : 'published';
    try {
      const payload = {
        title: routineForm.title.trim(),
        class_level: classLevel,
        academic_session: routineForm.academicSession?.trim() || null,
        description: routineForm.description?.trim() || null,
        google_sheet_url: routineForm.googleSheetUrl?.trim() || null,
        status,
        published_at: routineForm.effectiveDate ? new Date(routineForm.effectiveDate + 'T00:00:00').toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      const result = editingRoutine
        ? await supabase.from('routines').update(payload).eq('id', editingRoutine.id).select('id').single()
        : await supabase.from('routines').insert(payload).select('id').single();
      if (result.error) throw result.error;
      const routineId = result.data.id;
      const attachments = [...(routineForm.pdfAttachments || []), ...(routineForm.imageAttachments || [])]
        .filter((a: any) => a?.url)
        .map((a: any, index: number) => ({
          routine_id: routineId,
          file_path: a.url,
          file_name: a.name || 'Routine attachment',
          content_type: a.fileType === 'pdf' || String(a.url).toLowerCase().includes('.pdf') ? 'application/pdf' : 'image/*',
          sort_order: index,
        }));
      const { error: removeError } = await supabase.from('routine_attachments').delete().eq('routine_id', routineId);
      if (removeError) throw removeError;
      if (attachments.length) {
        const { error: attachError } = await supabase.from('routine_attachments').insert(attachments);
        if (attachError) throw attachError;
      }
      showSuccess(editingRoutine ? "Class routine updated successfully!" : "New Class Routine saved successfully!");
      setEditingRoutine(null);
      setRoutineForm({
        title: '', classLevel: 'Class 10', academicSession: '2026 Academic Session',
        description: '', effectiveDate: new Date().toISOString().split('T')[0],
        imageAttachments: [], pdfAttachments: [], googleSheetUrl: '', status: 'Published'
      });
      setRoutineSubTab('all');
      loadAllData();
    } catch (error: any) {
      showError("Unable to save class routine: " + (error?.message || "Unknown error"));
    }
  };

  const handleEditRoutineClick = (rtItem: any) => {
    setEditingRoutine(rtItem);
    setRoutineForm({
      title: rtItem.title || '',
      classLevel: rtItem.classLevel || rtItem.className || 'Class 10',
      academicSession: rtItem.academicSession || '2026 Academic Session',
      description: rtItem.description || '',
      effectiveDate: rtItem.effectiveDate || new Date().toISOString().split('T')[0],
      imageAttachments: rtItem.imageAttachments || [],
      pdfAttachments: rtItem.pdfAttachments || [],
      googleSheetUrl: rtItem.googleSheetUrl || '',
      status: rtItem.status || 'Published'
    });
    setRoutineSubTab('create');
  };

  const handleDeleteRoutineClick = async (id: string, title: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete routine "${title}"?`)) return;
    try {
      const { error: attachmentError } = await supabase.from('routine_attachments').delete().eq('routine_id', id);
      if (attachmentError) throw attachmentError;
      const { error } = await supabase.from('routines').delete().eq('id', id);
      if (error) throw error;
      showSuccess(`Routine "${title}" deleted.`);
      loadAllData();
    } catch (error: any) {
      showError("Unable to delete class routine: " + (error?.message || "Unknown error"));
    }
  };

  const handleToggleArchiveRoutine = async (rtItem: any) => {
    if (!supabase) return showError("Supabase is not configured. Please refresh and sign in again.");
    const newStatus = rtItem.status === 'Archived' ? 'published' : 'archived';
    try {
      const { error } = await supabase.from('routines').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', rtItem.id);
      if (error) throw error;
      showSuccess(`Routine status changed to ${newStatus === 'archived' ? 'Archived' : 'Published'}.`);
      loadAllData();
    } catch (error: any) {
      showError("Unable to update routine status: " + (error?.message || "Unknown error"));
    }
  };

  const handleImportSheetRoutine = () => {
    fetch('/api/routine/import-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetUrl: sheetUrlInput })
    })
      .then(res => res.json())
      .then(data => {
        showSuccess(`Imported routine data from Google Sheets!`);
        loadAllData();
        setRoutineSubTab('all');
      });
  };

  const filteredRoutineList = routine.filter(rt => {
    const titleMatch = (rt.title || '').toLowerCase().includes(routineSearch.toLowerCase()) ||
                       (rt.description || '').toLowerCase().includes(routineSearch.toLowerCase());
    const matchesClass = routineClassFilter === 'All' || rt.classLevel === routineClassFilter || rt.className === routineClassFilter;
    const matchesSubTab = routineSubTab === 'published' ? rt.status === 'Published' :
                          routineSubTab === 'archived' ? rt.status === 'Archived' : true;
    return titleMatch && matchesClass && matchesSubTab;
  });

  // ==================== 6. NOTICE BOARD MANAGEMENT ====================
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return showError("Notice title and content are required.");
    if (!supabase) return showError("Supabase is not configured.");
    try {
      const payload = {
        title: noticeForm.title.trim(), body: noticeForm.content.trim(), category: noticeForm.category,
        target_class: noticeForm.targetClass, priority: noticeForm.priority, is_pinned: Boolean(noticeForm.isPinned),
        google_sheet_url: noticeForm.googleSheetUrl.trim() || null,
        status: noticeForm.status === 'Published' ? 'published' : 'draft',
        published_at: noticeForm.date ? new Date(noticeForm.date + 'T00:00:00').toISOString() : new Date().toISOString(),
        expires_at: noticeForm.expiryDate ? new Date(noticeForm.expiryDate + 'T23:59:59').toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      const result = editingNotice
        ? await supabase.from('notices').update(payload).eq('id', editingNotice.id).select('id').single()
        : await supabase.from('notices').insert(payload).select('id').single();
      if (result.error) throw result.error;
      const noticeId = result.data.id;
      const { error: removeError } = await supabase.from('notice_attachments').delete().eq('notice_id', noticeId);
      if (removeError) throw removeError;
      if (noticeForm.attachmentUrl && ['PDF File', 'Image File'].includes(noticeForm.attachmentType)) {
        const fileName = decodeURIComponent(noticeForm.attachmentUrl.split('/').pop()?.split('?')[0] || 'notice-attachment');
        const isPdf = noticeForm.attachmentType === 'PDF File';
        const contentType = isPdf ? 'application/pdf' : fileName.toLowerCase().endsWith('.png') ? 'image/png' : fileName.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/jpeg';
        const { error } = await supabase.from('notice_attachments').insert({
          notice_id: noticeId, file_path: noticeForm.attachmentUrl, file_name: fileName, content_type: contentType,
        });
        if (error) throw error;
      }
      showSuccess(editingNotice ? "Notice updated!" : "Notice saved successfully!");
      setEditingNotice(null); setNoticeSubTab('all'); loadAllData();
    } catch (error: any) {
      showError("Unable to save notice: " + (error?.message || 'Unknown error'));
    }
  };

  const handleEditNoticeClick = (item: any) => {
    setEditingNotice(item);
    setNoticeForm({
      title: item.title || '', category: item.category || 'General Notice', targetClass: item.targetClass || 'All Students',
      date: item.date || new Date().toISOString().split('T')[0], expiryDate: item.expiryDate || '',
      priority: item.priority || 'Normal', attachmentType: item.attachmentType || 'Text',
      attachmentUrl: item.attachmentUrl || '', googleSheetUrl: item.googleSheetUrl || '',
      content: item.content || '', isPinned: Boolean(item.isPinned), status: item.status || 'Published',
    });
    setNoticeSubTab('create');
  };

  const handleDeleteNoticeClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete notice "${title}"?`)) return;
    if (!supabase) return showError("Supabase is not configured.");
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) return showError("Unable to delete notice: " + error.message);
    showSuccess("Notice deleted."); loadAllData();
  };

  const handleTogglePinNotice = async (item: any) => {
    if (!supabase) return showError("Supabase is not configured.");
    const { error } = await supabase.from('notices').update({
      is_pinned: !item.isPinned, updated_at: new Date().toISOString(),
    }).eq('id', item.id);
    if (error) return showError("Unable to update notice pin: " + error.message);
    showSuccess(item.isPinned ? "Notice unpinned." : "Notice pinned to top!"); loadAllData();
  };

  const filteredNoticesList = notices.filter(n => {
    const matchesSearch = (n.title || '').toLowerCase().includes(noticeSearch.toLowerCase()) ||
      (n.content || '').toLowerCase().includes(noticeSearch.toLowerCase());
    const matchesCategory = noticeCategoryFilter === 'All' || n.category === noticeCategoryFilter;
    const matchesTab = noticeSubTab === 'published' ? n.status === 'Published' :
      noticeSubTab === 'drafts' ? n.status === 'Draft' : noticeSubTab === 'pinned' ? n.isPinned : true;
    return matchesSearch && matchesCategory && matchesTab;
  });

  // ==================== 7. TESTIMONIALS MANAGEMENT ====================
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.comment.trim()) return showError("Name and testimonial comment are required.");
    if (!supabase) return showError("Supabase is not configured.");
    const payload = {
      student_name: testimonialForm.name.trim(), author_role: testimonialForm.role.trim() || 'Student',
      quote: testimonialForm.comment.trim(), rating: Number(testimonialForm.rating) || 5,
      photo_path: testimonialForm.image || null, is_published: Boolean(testimonialForm.isActive),
      sort_order: editingTestimonial ? Number(editingTestimonial.sortOrder || 0) : testimonials.length + 1,
    };
    try {
      const result = editingTestimonial
        ? await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id).select('id').single()
        : await supabase.from('testimonials').insert(payload).select('id').single();
      if (result.error) throw result.error;
      showSuccess(editingTestimonial ? "Testimonial updated!" : "Testimonial added!");
      setEditingTestimonial(null); setTestimonialSubTab('all'); loadAllData();
    } catch (error: any) {
      showError("Unable to save testimonial: " + (error?.message || 'Unknown error'));
    }
  };

  const handleEditTestimonialClick = (item: any) => {
    setEditingTestimonial(item);
    setTestimonialForm({
      name: item.name || '', role: item.role || 'Student', comment: item.comment || '',
      rating: Number(item.rating || 5), image: item.image || '', isActive: item.isActive !== false,
    });
    setTestimonialSubTab('add');
  };

  const handleDeleteTestimonialClick = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial by "${name}"?`)) return;
    if (!supabase) return showError("Supabase is not configured.");
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return showError("Unable to delete testimonial: " + error.message);
    showSuccess("Testimonial deleted."); loadAllData();
  };

  const filteredTestimonialsList = testimonials.filter(t =>
    (t.name || '').toLowerCase().includes(testimonialSearch.toLowerCase()) ||
    (t.comment || '').toLowerCase().includes(testimonialSearch.toLowerCase())
  );



  // ==================== FAREWELL & GALLERY MANAGEMENT HANDLERS ====================
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title.trim()) return showError("Album Title is required.");
    if (!supabase) return showError("Supabase is not configured.");
    const status = albumForm.status === 'Published' ? 'published' : albumForm.status === 'Archived' ? 'archived' : 'draft';
    const payload = {
      school_level: albumForm.category, year: Number(albumForm.year), title: albumForm.title.trim(),
      description: albumForm.description.trim() || null,
      cover_photo_path: albumForm.coverImage || albumForm.photos[0]?.imageUrl || null,
      is_published: status === 'published', status, updated_at: new Date().toISOString(),
    };
    try {
      const result = editingAlbum
        ? await supabase.from('farewell_albums').update(payload).eq('id', editingAlbum.id).select('id').single()
        : await supabase.from('farewell_albums').insert({ ...payload, sort_order: 0 }).select('id').single();
      if (result.error) throw result.error;
      const albumId = result.data.id;
      const { error: removeError } = await supabase.from('farewell_photos').delete().eq('album_id', albumId);
      if (removeError) throw removeError;
      if (albumForm.photos.length) {
        const rows = albumForm.photos.map((photo: any, index: number) => ({
          album_id: albumId, file_path: photo.imageUrl, caption: photo.caption || null, sort_order: index,
        }));
        const { error } = await supabase.from('farewell_photos').insert(rows);
        if (error) throw error;
      }
      showSuccess(editingAlbum ? "Farewell album updated!" : "New Farewell album saved!");
      setEditingAlbum(null); setFarewellSubTab('all'); loadAllData();
    } catch (error: any) {
      showError("Unable to save farewell album: " + (error?.message || 'Unknown error'));
    }
  };

  const handleEditAlbumClick = (album: any) => {
    setEditingAlbum(album);
    setAlbumForm({
      category: album.category || 'HSC', year: parseInt(album.year || '2026', 10),
      title: album.title || '', description: album.description || '',
      coverImage: album.coverImage || '/assets/aistudio/image_4f62b769.png',
      status: album.status || 'Published', photos: album.photos || [],
    });
    setFarewellSubTab('create');
  };

  const handleDeleteAlbumClick = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete farewell album "${title}"?`)) return;
    if (!supabase) return showError("Supabase is not configured.");
    const { error: photosError } = await supabase.from('farewell_photos').delete().eq('album_id', id);
    if (photosError) return showError("Unable to delete album photos: " + photosError.message);
    const { error } = await supabase.from('farewell_albums').delete().eq('id', id);
    if (error) return showError("Unable to delete album: " + error.message);
    showSuccess(`Farewell album "${title}" deleted.`); loadAllData();
  };

  const handleAddPhotosToAlbum = async (files: FileList) => {
    if (!files || files.length === 0) return;
    if (!supabase) return showError("Supabase is not configured.");
    setUploading(true); setUploadProgress(0);
    try {
      const list = Array.from(files);
      const added: any[] = [];
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const imageUrl = await uploadPublicAsset(file, 'farewell-gallery', 10 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/webp']);
        added.push({
          id: 'new-' + Date.now() + '-' + i + '-' + Math.random().toString(36).slice(2, 7),
          imageUrl, caption: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        });
        setUploadProgress(Math.round(((i + 1) / list.length) * 100));
      }
      setAlbumForm(prev => ({ ...prev, photos: [...prev.photos, ...added], coverImage: prev.coverImage || added[0]?.imageUrl || '' }));
      showSuccess(added.length + " photograph(s) uploaded successfully!");
    } catch (error: any) {
      showError("Photo upload failed: " + (error?.message || 'Unknown error'));
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const handleDeletePhotoFromAlbum = (photoId: string) => {
    setAlbumForm(prev => {
      const updated = prev.photos.filter(p => p.id !== photoId);
      const removed = prev.photos.find(p => p.id === photoId);
      const cover = prev.coverImage === removed?.imageUrl ? (updated[0]?.imageUrl || '/assets/aistudio/image_4f62b769.png') : prev.coverImage;
      return { ...prev, photos: updated, coverImage: cover };
    });
    showSuccess("Photo removed from album form.");
  };

  const handleUpdatePhotoCaption = (photoId: string, caption: string) => {
    setAlbumForm(prev => ({ ...prev, photos: prev.photos.map(p => p.id === photoId ? { ...p, caption } : p) }));
  };

  const handleSetCoverPhoto = (imageUrl: string) => {
    setAlbumForm(prev => ({ ...prev, coverImage: imageUrl }));
    showSuccess("Album cover image updated!");
  };

  const handleMovePhotoOrder = (photoId: string, direction: 'up' | 'down') => {
    setAlbumForm(prev => {
      const index = prev.photos.findIndex(p => p.id === photoId);
      const target = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      [photos[index], photos[target]] = [photos[target], photos[index]];
      return { ...prev, photos };
    });
  };

  const filteredFarewellAlbumsList = farewellAlbums.filter(a => {
    const matchesSearch = (a.title || '').toLowerCase().includes(farewellSearch.toLowerCase()) || (a.description || '').toLowerCase().includes(farewellSearch.toLowerCase());
    const matchesCategory = farewellCategoryFilter === 'All' || a.category === farewellCategoryFilter;
    const matchesYear = farewellYearFilter === 'All' || String(a.year) === farewellYearFilter;
    const matchesTab = farewellSubTab === 'hsc' ? a.category === 'HSC' : farewellSubTab === 'ssc' ? a.category === 'SSC' : farewellSubTab === 'published' ? a.status === 'Published' : farewellSubTab === 'archived' ? a.status === 'Archived' : true;
    return matchesSearch && matchesCategory && matchesYear && matchesTab;
  });

  // ==================== 8. COMPLETE STUDENTS (GOOGLE SHEETS) MANAGEMENT ====================
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.id.trim()) {
      return showError("Student ID and Full Name are required.");
    }
    if (!supabase) return showError("Supabase is not configured.");

    const studentRecord = {
      student_id: studentForm.id.trim(),
      full_name: studentForm.name.trim(),
      date_of_birth: studentForm.dob || null,
      gender: studentForm.gender || null,
      student_phone: studentForm.mobile || null,
      email: studentForm.email || null,
      address: studentForm.address || null,
      class_level: Number.parseInt(String(studentForm.classLevel).replace(/\D/g, ''), 10) || null,
      group_name: studentForm.group || null,
      session: studentForm.academicSession || null,
      admission_date: studentForm.admissionDate || null,
      guardian_name: studentForm.guardianName || null,
      guardian_phone: studentForm.guardianMobile || null,
      relationship: studentForm.guardianRelationship || null,
      guardian_address: studentForm.guardianAddress || null,
      status: studentForm.status.toLowerCase(),
    };

    const request = editingStudent
      ? supabase.from('students').update(studentRecord).eq('student_id', editingStudent.id)
      : supabase.from('students').insert(studentRecord);

    const { error } = await request;
    if (error) {
      showError(error.message.includes('duplicate') ? 'This Student ID already exists.' : 'Unable to save student: ' + error.message);
      return;
    }

    showSuccess(editingStudent
      ? `Student profile for "${studentForm.name}" updated successfully.`
      : `Student "${studentForm.name}" registered. Set a 6-digit PIN using Reset PIN before portal access.`);
    setEditingStudent(null);
    setStudentSubTab('all');
    loadAllData();
  };

  const handleEditStudentClick = (st: any) => {
    setEditingStudent(st);
    setStudentForm({
      id: st.id || 'GLM1001',
      name: st.name || '',
      dob: st.dob || '',
      gender: st.gender || 'Male',
      mobile: st.mobile || '',
      email: st.email || '',
      address: st.address || 'House 14, Iqbal Road, Kotwali, Chattogram',
      classLevel: st.classLevel || 'Class 10',
      group: st.group || 'Science',
      academicSession: st.academicSession || '2026 Academic Session',
      admissionDate: st.admissionDate || new Date().toISOString().split('T')[0],
      guardianName: st.guardianName || '',
      guardianMobile: st.guardianMobile || '',
      guardianRelationship: st.guardianRelationship || 'Father',
      guardianAddress: st.guardianAddress || '',
      status: st.status || 'Active'
    });
    setStudentSubTab('add');
  };

  const handleDeleteStudentClick = async (id: string, name: string) => {
    if (!supabase || !confirm(`Are you sure you want to delete student profile for "${name}" (${id})?`)) return;
    const { error } = await supabase.from('students').delete().eq('student_id', id);
    if (error) return showError('Unable to delete student: ' + error.message);
    showSuccess('Student profile deleted.');
    loadAllData();
  };

  const handleToggleStudentStatus = async (st: any) => {
    if (!supabase) return showError('Supabase is not configured.');
    const newStatus = st.status === 'Active' ? 'inactive' : 'active';
    const { error } = await supabase.from('students').update({ status: newStatus }).eq('student_id', st.id);
    if (error) return showError('Unable to update student status: ' + error.message);
    showSuccess(`Student ${st.name} is now ${newStatus === 'active' ? 'Active' : 'Inactive'}.`);
    loadAllData();
  };

  const handleResetStudentPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinResetStudent || !/^\d{6}$/.test(newPinInput)) {
      return showError('Enter exactly 6 digits for the student PIN.');
    }
    if (!supabase) return showError('Supabase is not configured.');
    const { error } = await supabase.rpc('set_student_pin', {
      p_student_id: pinResetStudent.id,
      p_pin: newPinInput,
    });
    if (error) return showError('Unable to reset PIN: ' + error.message);
    showSuccess(`6-digit PIN updated for student ${pinResetStudent.name}.`);
    setPinResetStudent(null);
    setNewPinInput('');
  };

  const filteredStudentsList = students.filter(st => {
    const matchesSearch = st.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          (st.mobile && st.mobile.includes(studentSearch)) ||
                          (st.guardianName && st.guardianName.toLowerCase().includes(studentSearch.toLowerCase()));
    const matchesClass = studentClassFilter === 'All' || st.classLevel === studentClassFilter;
    const matchesSubTab = studentSubTab === 'active' ? st.status === 'Active' :
                          studentSubTab === 'inactive' ? st.status === 'Inactive' : true;
    return matchesSearch && matchesClass && matchesSubTab;
  });

  // ==================== 9. WEBSITE SETTINGS & CONTENT ====================
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsForm)
    }).then(() => {
      showSuccess("Website content & institute settings updated live!");
      loadAllData();
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0B241B] text-white p-6 space-y-6 shrink-0">
        <div className="flex items-center gap-3 pb-6 border-b border-[#123B2A]">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base font-['Bricolage_Grotesque']">Admin Dashboard</h2>
            <p className="text-xs text-emerald-400 font-medium">Gleam Coaching Management</p>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'teachers', label: 'Teachers Management', icon: Users },
            { id: 'courses', label: 'Courses Management', icon: BookOpen },
            { id: 'exams', label: 'Weekly Exams', icon: Calendar },
            { id: 'results', label: 'Result Management', icon: Award },
            { id: 'routine', label: 'Class Routine', icon: Clock },
            { id: 'notices', label: 'Notice Board', icon: FileText },
            { id: 'testimonials', label: 'Testimonials', icon: Users },
            { id: 'farewell', label: 'Farewell & Gallery', icon: Camera },
            { id: 'students', label: 'Students (Google Sheets)', icon: UserCheck },
            { id: 'logs', label: 'Verification Logs', icon: ShieldCheck },
            { id: 'settings', label: 'Website Settings & Content', icon: Settings },
            { id: 'apps-script', label: 'Google Apps Script', icon: Code },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-emerald-100 hover:bg-[#123B2A]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-[#123B2A] space-y-2">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 bg-[#123B2A] hover:bg-emerald-900 text-emerald-200 text-xs font-bold rounded-xl transition-colors text-center block"
          >
            View Live Website
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        {successMsg && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm rounded-2xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-100 border border-rose-300 text-rose-900 text-sm rounded-2xl flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
                Admin Control Overview
              </h1>
              <p className="text-slate-600 text-sm">Welcome, Joy Gomes Jonerthon. All institute management modules are operational.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Total Faculty</span>
                <p className="text-3xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque']">{teachers.length}</p>
                <span className="text-xs text-emerald-700 font-bold">{teachers.filter(t => t.isActive !== false).length} Active Instructors</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Academic Courses</span>
                <p className="text-3xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque']">{courses.length}</p>
                <span className="text-xs text-emerald-700 font-bold">Classes 6 to 12</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Weekly Exams</span>
                <p className="text-3xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque']">{exams.length}</p>
                <span className="text-xs text-amber-700 font-bold">{exams.filter(e => e.status === 'Upcoming').length} Scheduled Upcoming</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Registered Students</span>
                <p className="text-3xl font-extrabold text-[#123B2A] font-['Bricolage_Grotesque']">{students.length}</p>
                <span className="text-xs text-emerald-700 font-bold">Google Sheets Synced</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 1. TEACHERS MANAGEMENT ==================== */}
        {activeTab === 'teachers' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Teachers Management</h1>
                <p className="text-slate-600 text-sm">Add, edit, upload photos, set order, and activate faculty profiles.</p>
              </div>
              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setTeacherForm({ name: '', designation: 'Instructor', subject: '', bio: '', experience: '5+ Years', image: '/assets/aistudio/image_4f62b769.png', email: '', phone: '', displayOrder: teachers.length + 1, isActive: true });
                  setTeacherSubTab('add');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Teacher Profile
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button onClick={() => setTeacherSubTab('all')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${teacherSubTab === 'all' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'}`}>All Teachers ({teachers.length})</button>
              <button onClick={() => setTeacherSubTab('add')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${teacherSubTab === 'add' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'}`}>{editingTeacher ? `Editing: ${editingTeacher.name}` : '+ Add New Teacher'}</button>
            </div>

            {teacherSubTab === 'all' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search teachers by name or subject..." value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeachersList.map((t: any) => (
                    <div key={t.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <img src={t.image || '/assets/aistudio/image_4f62b769.png'} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600/30 shrink-0" />
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{t.name}</h3>
                            <p className="text-xs text-emerald-700 font-semibold">{t.designation}</p>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded mt-1 inline-block">{t.isActive !== false ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">Specialization: <strong className="text-slate-900">{t.subject}</strong></p>
                        <p className="text-xs text-slate-600 line-clamp-2">{t.bio}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                        <button onClick={() => handleEditTeacherClick(t)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteTeacherClick(t.id, t.name)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teacherSubTab === 'add' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-2xl space-y-6">
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">{editingTeacher ? `Edit Teacher: ${editingTeacher.name}` : 'Add Teacher Profile'}</h3>
                <form onSubmit={handleSaveTeacher} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                    <input type="text" required placeholder="e.g. Joy Gomes Jonerthon" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation</label>
                      <input type="text" required placeholder="e.g. Chief Instructor" value={teacherForm.designation} onChange={e => setTeacherForm({...teacherForm, designation: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject Specialization</label>
                      <input type="text" required placeholder="e.g. Mathematics & Physics" value={teacherForm.subject} onChange={e => setTeacherForm({...teacherForm, subject: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Profile Photo Upload</label>
                    <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, (att) => setTeacherForm({...teacherForm, image: att.url})); }} className="text-xs text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography</label>
                    <textarea rows={3} required placeholder="Teaching biography..." value={teacherForm.bio} onChange={e => setTeacherForm({...teacherForm, bio: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setTeacherSubTab('all')} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs">{editingTeacher ? 'Update Profile' : 'Save Profile'}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. COURSES MANAGEMENT ==================== */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Courses Management</h1>
                <p className="text-slate-600 text-sm">Manage class academic programs for Class 6 to 12.</p>
              </div>
              <button onClick={() => { setEditingCourse(null); setCourseSubTab('add'); }} className="px-5 py-3 bg-[#123B2A] text-white font-bold rounded-xl text-xs flex items-center gap-2"><Plus className="w-4 h-4" /> Add Course</button>
            </div>

            {courseSubTab === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCoursesList.map((c: any) => (
                  <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">{c.className}</span>
                    <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600">{c.description}</p>
                    <p className="text-xs text-slate-500 font-medium">Schedule: {c.schedule}</p>
                    <div className="pt-4 border-t flex justify-end gap-2">
                      <button onClick={() => handleEditCourseClick(c)} className="px-3 py-1.5 bg-slate-100 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => handleDeleteCourseClick(c.id, c.title)} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {courseSubTab === 'add' && (
              <div className="bg-white rounded-3xl p-8 border max-w-2xl space-y-6">
                <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Class Level</label>
                    <select value={courseForm.className} onChange={e => setCourseForm({...courseForm, className: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm">
                      <option>Class 6</option><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Title</label>
                    <input type="text" required placeholder="Course title..." value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Subjects (Comma separated)</label>
                    <input type="text" required placeholder="Physics, Math..." value={courseForm.subjects} onChange={e => setCourseForm({...courseForm, subjects: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Description</label>
                    <textarea rows={3} required placeholder="Course summary..." value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setCourseSubTab('all')} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs">Save Course</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. WEEKLY EXAMS MANAGEMENT ==================== */}
        {activeTab === 'exams' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Weekly Exams</h1>
                <p className="text-slate-600 text-sm">Schedule assessments and publish exam routines.</p>
              </div>
              <button onClick={() => { setEditingExam(null); setExamSubTab('create'); }} className="px-5 py-3 bg-[#123B2A] text-white font-bold rounded-xl text-xs flex items-center gap-2"><Plus className="w-4 h-4" /> Create Exam</button>
            </div>

            {examSubTab !== 'create' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredExamsList.map((ex: any) => (
                  <div key={ex.id} className="bg-white rounded-3xl p-6 border space-y-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">{ex.classLevel} · {ex.subject}</span>
                    <h3 className="text-xl font-bold">{ex.title}</h3>
                    <p className="text-xs text-slate-600">Date: {ex.examDate} ({ex.startTime} - {ex.endTime})</p>
                    <p className="text-xs text-slate-500">Syllabus: {ex.syllabus}</p>
                    <div className="pt-4 border-t flex justify-end gap-2">
                      <button onClick={() => handleEditExamClick(ex)} className="px-3 py-1.5 bg-slate-100 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => handleDeleteExamClick(ex.id, ex.title)} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {examSubTab === 'create' && (
              <div className="bg-white rounded-3xl p-8 border max-w-2xl space-y-6">
                <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">{editingExam ? 'Edit Exam' : 'Create Exam'}</h3>
                <form onSubmit={handleSaveExam} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Title</label>
                    <input type="text" required placeholder="Weekly Physics Exam" value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Class</label>
                      <select value={examForm.classLevel} onChange={e => setExamForm({...examForm, classLevel: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm">
                        <option>Class 6</option><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Subject</label>
                      <input type="text" required placeholder="Physics" value={examForm.subject} onChange={e => setExamForm({...examForm, subject: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Syllabus</label>
                    <textarea rows={2} required placeholder="Exam topics..." value={examForm.syllabus} onChange={e => setExamForm({...examForm, syllabus: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setExamSubTab('all')} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs">Save Exam</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. RESULT MANAGEMENT ==================== */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Result Management</h1>
                <p className="text-slate-600 text-sm">Add results manually, import Google Sheets data, upload result sheets, and publish student scores.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleImportSheetResults} className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"><RefreshCw className="w-4 h-4" /> Quick Import Sheets</button>
                <button onClick={() => { setEditingResult(null); setResultForm({ studentId: 'GLM1001', studentName: 'Tanvir Ahmed', classLevel: 'Class 10', group: 'Science', examTitle: 'Weekly Assessment', subject: 'Physics', obtainedMarks: 45, totalMarks: 50, gpa: '5.00', position: '1st', remarks: 'Excellent performance', documentUrl: '', status: 'Published' }); setResultSubTab('add'); }} className="px-4 py-2.5 bg-[#123B2A] hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"><Plus className="w-4 h-4" /> Add Result</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: 'all', label: `All Results (${results.length})` },
                { id: 'add', label: editingResult ? `Editing: ${editingResult.studentId}` : '+ Add New Result' },
                { id: 'sheets', label: 'Import Google Sheet' },
                { id: 'published', label: `Published (${results.filter(r => r.status === 'Published').length})` },
                { id: 'drafts', label: `Drafts (${results.filter(r => r.status === 'Draft').length})` }
              ].map(tab => (
                <button key={tab.id} onClick={() => setResultSubTab(tab.id as any)} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${resultSubTab === tab.id ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'}`}>{tab.label}</button>
              ))}
            </div>

            {resultSubTab === 'sheets' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-2xl space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b pb-4">
                  <ExternalLink className="w-6 h-6 text-emerald-700" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 font-['Bricolage_Grotesque']">Google Sheets Result Importer</h3>
                    <p className="text-xs text-slate-500">Connect Google Spreadsheet URL to sync weekly exam results automatically.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Google Spreadsheet URL or ID</label>
                    <input type="text" value={sheetUrlInput} onChange={e => setSheetUrlInput(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono" />
                  </div>
                  <button onClick={handleImportSheetResults} className="w-full py-3 bg-[#123B2A] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Import Data From Google Sheets</button>
                </div>
              </div>
            )}

            {(resultSubTab === 'all' || resultSubTab === 'published' || resultSubTab === 'drafts') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredResultsList.map((resItem: any) => (
                  <div key={resItem.id} className="bg-white rounded-3xl p-6 border space-y-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg font-mono">ID: {resItem.studentId}</span>
                    <h3 className="text-lg font-bold text-slate-900">{resItem.studentName || 'Student'}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{resItem.classLevel} · {resItem.subject}</p>
                    <p className="text-xs text-slate-500">Marks: {resItem.obtainedMarks}/{resItem.totalMarks} | GPA: {resItem.gpa}</p>
                    <div className="pt-4 border-t flex justify-end gap-2">
                      <button onClick={() => handleEditResultClick(resItem)} className="px-3 py-1.5 bg-slate-100 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => handleDeleteResultClick(resItem.id, resItem.studentId)} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resultSubTab === 'add' && (
              <div className="bg-white rounded-3xl p-8 border max-w-2xl space-y-6">
                <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">{editingResult ? 'Edit Result' : 'Add Result Entry'}</h3>
                <form onSubmit={handleSaveResult} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Student ID</label>
                      <input type="text" required value={resultForm.studentId} onChange={e => setResultForm({...resultForm, studentId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Student Name</label>
                      <input type="text" required value={resultForm.studentName} onChange={e => setResultForm({...resultForm, studentName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setResultSubTab('all')} className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs">Save Result</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. CLASS ROUTINE MANAGEMENT ==================== */}
        {activeTab === 'routine' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Class Routine Management</h1>
                <p className="text-slate-600 text-sm">Upload routine images (JPG/PNG/WEBP), PDF routine attachments, and Google Sheets links for Classes 6 to 12.</p>
              </div>
              <button
                onClick={() => {
                  setEditingRoutine(null);
                  setRoutineForm({
                    title: '',
                    classLevel: 'Class 10',
                    academicSession: '2026 Academic Session',
                    description: '',
                    effectiveDate: new Date().toISOString().split('T')[0],
                    imageAttachments: [],
                    pdfAttachments: [],
                    googleSheetUrl: '',
                    status: 'Published'
                  });
                  setRoutineSubTab('create');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create Class Routine
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: 'all', label: `All Routines (${routine.length})` },
                { id: 'create', label: editingRoutine ? `Editing: ${editingRoutine.title}` : '+ Add New Routine' },
                { id: 'upload-image', label: 'Upload Image Routine' },
                { id: 'upload-pdf', label: 'Upload PDF Routine' },
                { id: 'sheets', label: 'Google Sheets Import' },
                { id: 'published', label: `Published (${routine.filter(r => r.status === 'Published').length})` },
                { id: 'archived', label: `Archived (${routine.filter(r => r.status === 'Archived').length})` },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setRoutineSubTab(sub.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    routineSubTab === sub.id ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {routineSubTab === 'create' && (
              <form onSubmit={handleSaveRoutine} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{editingRoutine ? 'Edit Class Routine' : 'Create New Class Routine'}</h2>
                    <p className="text-sm text-slate-500 mt-1">Add a class routine and publish it for students.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 rounded-full px-3 py-2 h-fit">{editingRoutine ? 'EDIT MODE' : 'NEW ROUTINE'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Routine Title *</label>
                    <input required value={routineForm.title} onChange={e => setRoutineForm({ ...routineForm, title: e.target.value })} placeholder="Example: Class 10 Weekly Class Routine" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Class *</label>
                    <select required value={routineForm.classLevel} onChange={e => setRoutineForm({ ...routineForm, classLevel: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      {[6,7,8,9,10,11,12].map(level => <option key={level} value={`Class ${level}`}>Class {level}</option>)}
                      <option value="All Classes">All Classes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Academic Session</label>
                    <input value={routineForm.academicSession} onChange={e => setRoutineForm({ ...routineForm, academicSession: e.target.value })} placeholder="2026 Academic Session" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Effective Date</label>
                    <input type="date" value={routineForm.effectiveDate} onChange={e => setRoutineForm({ ...routineForm, effectiveDate: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Publication Status</label>
                    <select value={routineForm.status} onChange={e => setRoutineForm({ ...routineForm, status: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      <option value="Published">Published</option><option value="Draft">Save as Draft</option><option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Description</label>
                    <textarea rows={3} value={routineForm.description} onChange={e => setRoutineForm({ ...routineForm, description: e.target.value })} placeholder="Add any instructions or details for students..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-y" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Upload Routine Images</label>
                    <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e => { Array.from(e.target.files || []).forEach(file => handleRoutineFileUpload(file, 'image')); e.currentTarget.value = ''; }} className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-800" />
                    <div className="mt-2 space-y-1">{routineForm.imageAttachments.map((file: any, index: number) => <div key={index} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg"><span className="truncate">{file.name}</span><button type="button" onClick={() => setRoutineForm(prev => ({ ...prev, imageAttachments: prev.imageAttachments.filter((_: any, i: number) => i !== index) }))} className="text-rose-600 font-bold ml-2">Remove</button></div>)}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Upload Routine PDF</label>
                    <input type="file" accept="application/pdf,.pdf" multiple onChange={e => { Array.from(e.target.files || []).forEach(file => handleRoutineFileUpload(file, 'pdf')); e.currentTarget.value = ''; }} className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-800" />
                    <div className="mt-2 space-y-1">{routineForm.pdfAttachments.map((file: any, index: number) => <div key={index} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg"><span className="truncate">{file.name}</span><button type="button" onClick={() => setRoutineForm(prev => ({ ...prev, pdfAttachments: prev.pdfAttachments.filter((_: any, i: number) => i !== index) }))} className="text-rose-600 font-bold ml-2">Remove</button></div>)}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Google Sheets URL (Optional)</label>
                    <input type="url" value={routineForm.googleSheetUrl} onChange={e => setRoutineForm({ ...routineForm, googleSheetUrl: e.target.value })} placeholder="https://docs.google.com/spreadsheets/d/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    <p className="text-[11px] text-slate-500 mt-1">Paste a view-accessible Google Sheets link. It will be saved with this routine.</p>
                  </div>
                </div>
                {uploading && <div className="text-xs font-bold text-emerald-700">Uploading attachment… {uploadProgress}%</div>}
                <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
                  <button type="button" onClick={() => { setEditingRoutine(null); setRoutineSubTab('all'); }} className="px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-6 py-3 bg-[#123B2A] hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs">{editingRoutine ? 'Update Routine' : 'Create Class Routine'}</button>
                </div>
              </form>
            )}

            {(routineSubTab === 'upload-image' || routineSubTab === 'upload-pdf') && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-extrabold text-lg text-slate-900">{routineSubTab === 'upload-image' ? 'Upload Image Routine' : 'Upload PDF Routine'}</h2>
                <p className="text-sm text-slate-500 mt-1 mb-4">Create a routine first, then attach the {routineSubTab === 'upload-image' ? 'routine image' : 'PDF file'} in the form.</p>
                <button type="button" onClick={() => { setEditingRoutine(null); setRoutineForm({ title: '', classLevel: 'Class 10', academicSession: '2026 Academic Session', description: '', effectiveDate: new Date().toISOString().split('T')[0], imageAttachments: [], pdfAttachments: [], googleSheetUrl: '', status: 'Published' }); setRoutineSubTab('create'); }} className="px-5 py-3 bg-[#123B2A] text-white rounded-xl text-xs font-bold">Create Routine and Attach File</button>
              </div>
            )}

            {routineSubTab === 'sheets' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h2 className="font-extrabold text-lg text-slate-900">Google Sheets Routine</h2>
                <p className="text-sm text-slate-500">Create a routine record and save the Google Sheets link for students to open.</p>
                <input type="url" value={routineForm.googleSheetUrl} onChange={e => setRoutineForm({ ...routineForm, googleSheetUrl: e.target.value })} placeholder="https://docs.google.com/spreadsheets/d/..." className="w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm" />
                <button type="button" onClick={() => { setEditingRoutine(null); setRoutineForm({ ...routineForm, title: routineForm.title || 'Class Routine - Google Sheets', classLevel: routineForm.classLevel || 'Class 10' }); setRoutineSubTab('create'); }} className="px-5 py-3 bg-[#123B2A] text-white rounded-xl text-xs font-bold">Continue to Create Routine</button>
              </div>
            )}

            {(routineSubTab === 'all' || routineSubTab === 'published' || routineSubTab === 'archived') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoutineList.map((rtItem: any) => (
                  <div key={rtItem.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                          {rtItem.classLevel || rtItem.className}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${rtItem.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {rtItem.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">{rtItem.title}</h3>
                      <p className="text-xs text-slate-500">Session: <strong>{rtItem.academicSession || '2026'}</strong> | Effective: <strong>{rtItem.effectiveDate || '2026-11-01'}</strong></p>
                    </div>
                    <div className="pt-4 border-t flex justify-end gap-2">
                      <button onClick={() => handleEditRoutineClick(rtItem)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => handleDeleteRoutineClick(rtItem.id, rtItem.title)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 6. NOTICE BOARD MANAGEMENT ==================== */}
        {activeTab === 'notices' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Notice Board Management</h1>
                <p className="text-slate-600 text-sm font-medium">Create, edit, pin, draft, publish, and attach documents for official academic notices.</p>
              </div>
              <button
                onClick={() => {
                  setEditingNotice(null);
                  setNoticeForm({
                    title: '',
                    category: 'General Notice',
                    targetClass: 'All Students',
                    date: new Date().toISOString().split('T')[0],
                    expiryDate: '',
                    priority: 'Normal',
                    attachmentType: 'Text',
                    attachmentUrl: '',
                    googleSheetUrl: '',
                    content: '',
                    isPinned: false,
                    status: 'Published'
                  });
                  setNoticeSubTab('create');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create New Notice
              </button>
            </div>

            {/* Sub-tabs & Search */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: 'all', label: `All Notices (${notices.length})` },
                { id: 'create', label: editingNotice ? `Editing: ${editingNotice.title}` : '+ Create Notice' },
                { id: 'published', label: `Published (${notices.filter(n => n.status === 'Published').length})` },
                { id: 'drafts', label: `Drafts (${notices.filter(n => n.status === 'Draft').length})` },
                { id: 'pinned', label: `Pinned (${notices.filter(n => n.isPinned).length})` },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setNoticeSubTab(sub.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    noticeSubTab === sub.id ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* LIST VIEW */}
            {(noticeSubTab === 'all' || noticeSubTab === 'published' || noticeSubTab === 'drafts' || noticeSubTab === 'pinned') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search notices by title or text..."
                      value={noticeSearch}
                      onChange={e => setNoticeSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Category:</span>
                    <select
                      value={noticeCategoryFilter}
                      onChange={e => setNoticeCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    >
                      <option>All</option>
                      <option>General Notice</option>
                      <option>Examination Notice</option>
                      <option>Weekly Exam</option>
                      <option>Result Announcement</option>
                      <option>Class Routine</option>
                      <option>Holiday Notice</option>
                      <option>Admission Notice</option>
                      <option>Academic Notice</option>
                      <option>Emergency Notice</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNoticesList.map((notItem: any) => (
                    <div
                      key={notItem.id}
                      className={`bg-white rounded-3xl p-6 border shadow-sm space-y-4 flex flex-col justify-between ${
                        notItem.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                            {notItem.category}
                          </span>
                          <div className="flex items-center gap-1">
                            {notItem.isPinned && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-1">
                                <Pin className="w-3 h-3" /> Pinned
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${notItem.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                              {notItem.status}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque'] line-clamp-2">{notItem.title}</h3>
                        
                        <div className="text-xs text-slate-500 font-medium space-x-2">
                          <span>Date: <strong className="text-slate-800">{notItem.date}</strong></span>
                          <span>·</span>
                          <span>Target: <strong className="text-emerald-800">{notItem.targetClass || 'All Students'}</strong></span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{notItem.content}</p>
                      </div>

                      <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePinNotice(notItem)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${
                            notItem.isPinned ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" /> {notItem.isPinned ? 'Unpin' : 'Pin to Top'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleEditNoticeClick(notItem)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                          <button onClick={() => handleDeleteNoticeClick(notItem.id, notItem.title)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE / EDIT FORM VIEW */}
            {noticeSubTab === 'create' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-3xl space-y-6 shadow-md">
                <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">{editingNotice ? `Edit Notice: ${editingNotice.title}` : 'Create New Notice'}</h3>

                <form onSubmit={handleSaveNotice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Notice Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HSC 2026 Final Revision Schedule Announced"
                      value={noticeForm.title}
                      onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Notice Category</label>
                      <select
                        value={noticeForm.category}
                        onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      >
                        <option>General Notice</option>
                        <option>Examination Notice</option>
                        <option>Weekly Exam</option>
                        <option>Result Announcement</option>
                        <option>Class Routine</option>
                        <option>Holiday Notice</option>
                        <option>Admission Notice</option>
                        <option>Academic Notice</option>
                        <option>Emergency Notice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Target Audience / Class</label>
                      <select
                        value={noticeForm.targetClass}
                        onChange={e => setNoticeForm({ ...noticeForm, targetClass: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      >
                        <option>All Students</option>
                        <option>Class 6</option>
                        <option>Class 7</option>
                        <option>Class 8</option>
                        <option>Class 9</option>
                        <option>Class 10</option>
                        <option>Class 11</option>
                        <option>Class 12</option>
                        <option>Teachers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Publication Date</label>
                      <input
                        type="date"
                        required
                        value={noticeForm.date}
                        onChange={e => setNoticeForm({ ...noticeForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Notice Priority</label>
                      <select
                        value={noticeForm.priority}
                        onChange={e => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      >
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Notice Content / Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter complete notice text, instructions, or announcements..."
                      value={noticeForm.content}
                      onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                    />
                  </div>

                  {/* Attachment & Google Sheet Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Attachment Type</label>
                      <select
                        value={noticeForm.attachmentType}
                        onChange={e => setNoticeForm({ ...noticeForm, attachmentType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs"
                      >
                        <option>Text</option>
                        <option>PDF File</option>
                        <option>Image File</option>
                        <option>Google Sheet Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Upload Attachment File</label>
                      <input
                        type="file"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            (async () => {
                              setUploading(true);
                              try {
                                const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                                const url = await uploadPublicAsset(file, 'notice-files', 20 * 1024 * 1024, isPdf ? ['application/pdf'] : ['image/jpeg', 'image/png', 'image/webp']);
                                setNoticeForm(prev => ({ ...prev, attachmentUrl: url, attachmentType: isPdf ? 'PDF File' : 'Image File' }));
                                showSuccess('Notice attachment uploaded.');
                              } catch (error: any) {
                                showError('Notice attachment upload failed: ' + (error?.message || 'Unknown error'));
                              } finally { setUploading(false); }
                            })();
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase mb-1">Google Sheet URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        value={noticeForm.googleSheetUrl}
                        onChange={e => setNoticeForm({ ...noticeForm, googleSheetUrl: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Pin & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noticeForm.isPinned}
                        onChange={e => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      Pin this notice to top of public Notice Board
                    </label>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-700">Publication Status:</label>
                      <select
                        value={noticeForm.status}
                        onChange={e => setNoticeForm({ ...noticeForm, status: e.target.value })}
                        className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setNoticeSubTab('all')}
                      className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs shadow-md"
                    >
                      Save Notice
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 7. TESTIMONIALS MANAGEMENT ==================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Testimonials Management</h1>
                <p className="text-slate-600 text-sm font-medium">Add, edit, upload photos, and manage student & parent feedback ratings.</p>
              </div>
              <button
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestimonialForm({
                    name: '',
                    role: 'Parent of Class 10 SSC Candidate',
                    comment: '',
                    rating: 5,
                    image: '/assets/aistudio/image_4f62b769.png',
                    isActive: true
                  });
                  setTestimonialSubTab('add');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Testimonial
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button
                onClick={() => setTestimonialSubTab('all')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${testimonialSubTab === 'all' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'}`}
              >
                All Testimonials ({testimonials.length})
              </button>
              <button
                onClick={() => setTestimonialSubTab('add')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${testimonialSubTab === 'add' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'}`}
              >
                {editingTestimonial ? `Editing: ${editingTestimonial.name}` : '+ Add Testimonial'}
              </button>
            </div>

            {/* LIST VIEW */}
            {testimonialSubTab === 'all' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search testimonials by name or keyword..."
                      value={testimonialSearch}
                      onChange={e => setTestimonialSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTestimonialsList.map((ts: any) => (
                    <div key={ts.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={ts.image || '/assets/aistudio/image_4f62b769.png'}
                            alt={ts.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600/30 shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{ts.name}</h3>
                            <p className="text-xs text-emerald-700 font-semibold">{ts.role}</p>
                            <div className="flex items-center gap-0.5 mt-1 text-amber-400 text-xs font-bold">
                              {Array.from({ length: ts.rating || 5 }).map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                              <span className="text-slate-500 text-[10px] ml-1">({ts.rating || 5}/5)</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-2xl border">
                          "{ts.comment}"
                        </p>
                      </div>

                      <div className="pt-4 border-t flex justify-end gap-2">
                        <button onClick={() => handleEditTestimonialClick(ts)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteTestimonialClick(ts.id, ts.name)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE / EDIT FORM VIEW */}
            {testimonialSubTab === 'add' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-2xl space-y-6 shadow-md">
                <h3 className="text-xl font-bold font-['Bricolage_Grotesque']">{editingTestimonial ? `Edit Testimonial: ${editingTestimonial.name}` : 'Add New Testimonial'}</h3>

                <form onSubmit={handleSaveTestimonial} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Author Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rafiqul Islam"
                        value={testimonialForm.name}
                        onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Author Role / Designation</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Parent of HSC Student"
                        value={testimonialForm.role}
                        onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Testimonial Feedback Comment</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write feedback comment..."
                      value={testimonialForm.comment}
                      onChange={e => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Star Rating (1 - 5 Stars)</label>
                      <select
                        value={testimonialForm.rating}
                        onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value, 10) })}
                        className="w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-bold"
                      >
                        <option value={5}>5 Stars (★★★★★ - Outstanding)</option>
                        <option value={4}>4 Stars (★★★★☆ - Very Good)</option>
                        <option value={3}>3 Stars (★★★☆☆ - Good)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Author Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            (async () => {
                              setUploading(true);
                              try {
                                const url = await uploadPublicAsset(file, 'website-assets', 10 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/webp']);
                                setTestimonialForm(prev => ({ ...prev, image: url }));
                                showSuccess('Testimonial photo uploaded.');
                              } catch (error: any) {
                                showError('Testimonial photo upload failed: ' + (error?.message || 'Unknown error'));
                              } finally { setUploading(false); }
                            })();
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setTestimonialSubTab('all')}
                      className="px-5 py-2.5 bg-slate-100 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs shadow-md"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== FAREWELL & GALLERY MANAGEMENT ==================== */}
        {activeTab === 'farewell' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Farewell & Photo Gallery Management</h1>
                <p className="text-slate-600 text-sm font-medium">Manage HSC and SSC Farewell Albums, upload group photographs, captions, cover images, and publication statuses for 2017 to 2026.</p>
              </div>
              <button
                onClick={() => {
                  setEditingAlbum(null);
                  setAlbumForm({
                    category: 'HSC',
                    year: 2026,
                    title: 'HSC 2026 Grand Farewell Ceremony',
                    description: 'Celebrating the achievements and cherished memories of HSC Batch 2026 at Gleam Coaching Chattogram.',
                    coverImage: '/assets/aistudio/image_4f62b769.png',
                    status: 'Published',
                    photos: []
                  });
                  setFarewellSubTab('create');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create New Farewell Album
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: 'all', label: `All Albums (${farewellAlbums.length})` },
                { id: 'hsc', label: `HSC Farewell (${farewellAlbums.filter(a => a.category === 'HSC').length})` },
                { id: 'ssc', label: `SSC Farewell (${farewellAlbums.filter(a => a.category === 'SSC').length})` },
                { id: 'create', label: editingAlbum ? `Editing: ${editingAlbum.title}` : '+ Create New Album' },
                { id: 'published', label: `Published (${farewellAlbums.filter(a => a.status === 'Published').length})` },
                { id: 'archived', label: `Archived (${farewellAlbums.filter(a => a.status === 'Archived').length})` },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setFarewellSubTab(sub.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    farewellSubTab === sub.id ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* ALBUMS LIST VIEW */}
            {(farewellSubTab === 'all' || farewellSubTab === 'hsc' || farewellSubTab === 'ssc' || farewellSubTab === 'published' || farewellSubTab === 'archived') && (
              <div className="space-y-6">
                {/* Search & Category / Year Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search album by title or keywords..."
                      value={farewellSearch}
                      onChange={e => setFarewellSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">Category:</span>
                      <select
                        value={farewellCategoryFilter}
                        onChange={e => setFarewellCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      >
                        <option>All</option>
                        <option>HSC</option>
                        <option>SSC</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">Year:</span>
                      <select
                        value={farewellYearFilter}
                        onChange={e => setFarewellYearFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-bold"
                      >
                        <option>All</option>
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(yr => (
                          <option key={yr}>{yr}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Album Cards Grid */}
                {filteredFarewellAlbumsList.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
                    <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold">No farewell albums found matching your filters.</p>
                    <p className="text-xs text-slate-400">Click "+ Create New Album" above to publish a new HSC or SSC farewell album.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFarewellAlbumsList.map((alb: any) => (
                      <div key={alb.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          {/* Album Cover Photo */}
                          <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                            <img
                              src={alb.coverImage || alb.photos?.[0]?.imageUrl || '/assets/aistudio/image_4f62b769.png'}
                              alt={alb.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-[#123B2A] text-white text-xs font-bold rounded-lg shadow-md">
                                {alb.category} Farewell
                              </span>
                              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-lg shadow-md font-mono">
                                {alb.year}
                              </span>
                            </div>
                            <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-950/80 text-emerald-300 text-[11px] font-bold rounded-lg backdrop-blur-sm flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5" /> {alb.photos?.length || 0} Photos
                            </span>
                          </div>

                          {/* Album Details */}
                          <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                                alb.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {alb.status}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Updated: {new Date(alb.updatedAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque'] line-clamp-1">{alb.title}</h3>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{alb.description || 'Graduation and farewell ceremony album.'}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                          <button
                            onClick={() => setAlbumPreviewModal(alb)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEditAlbumClick(alb)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> Manage Photos
                            </button>
                            <button
                              onClick={() => handleDeleteAlbumClick(alb.id, alb.title)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CREATE / EDIT ALBUM FORM VIEW */}
            {farewellSubTab === 'create' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-4xl space-y-8 shadow-md">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-slate-900">
                      {editingAlbum ? `Manage Album: ${editingAlbum.title}` : 'Create New Farewell Album'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload group photographs, individual memories, edit captions, and set cover photos for HSC or SSC farewell batches.
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${albumForm.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                    {albumForm.status}
                  </span>
                </div>

                <form onSubmit={handleSaveAlbum} className="space-y-8">
                  {/* 1. Basic Album Information */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 border-b pb-2">1. Album Basic Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Farewell Category</label>
                        <select
                          value={albumForm.category}
                          onChange={e => setAlbumForm({ ...albumForm, category: e.target.value as any })}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900"
                        >
                          <option value="HSC">HSC Farewell</option>
                          <option value="SSC">SSC Farewell</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Batch Year (2017 – 2026)</label>
                        <select
                          value={albumForm.year}
                          onChange={e => setAlbumForm({ ...albumForm, year: parseInt(e.target.value, 10) })}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900"
                        >
                          {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Publication Status</label>
                        <select
                          value={albumForm.status}
                          onChange={e => setAlbumForm({ ...albumForm, status: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900"
                        >
                          <option value="Published">Published (Visible Publicly)</option>
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Album Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. HSC 2026 Grand Farewell Ceremony & Memories"
                          value={albumForm.title}
                          onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Album Description</label>
                        <textarea
                          rows={3}
                          placeholder="Write a brief overview of this farewell batch, event highlights, and memories..."
                          value={albumForm.description}
                          onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Photo Drag & Drop Upload Zone */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 border-b pb-2">2. Upload Photographs</h4>

                    <div className="p-8 border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 rounded-3xl text-center space-y-3 transition-colors relative">
                      <Upload className="w-10 h-10 text-emerald-700 mx-auto" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Drag and drop farewell photographs here, or click to browse</p>
                        <p className="text-xs text-slate-500 mt-1">Supports multi-photo selection (JPG, JPEG, PNG, WEBP)</p>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={e => {
                          if (e.target.files) handleAddPhotosToAlbum(e.target.files);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {uploading && (
                      <div className="space-y-2 p-4 bg-emerald-100/70 rounded-2xl border border-emerald-300">
                        <div className="flex justify-between text-xs font-bold text-emerald-900">
                          <span>Uploading photographs to Supabase storage...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-700 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Managed Photo Grid inside Album */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                        3. Album Photographs ({albumForm.photos.length})
                      </h4>
                      <span className="text-xs text-slate-500">Set cover image, edit captions, or reorder</span>
                    </div>

                    {albumForm.photos.length === 0 ? (
                      <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-500 text-xs border border-slate-200">
                        No photographs added yet. Use the upload box above to select photos from your device.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {albumForm.photos.map((photo: any, index: number) => {
                          const isCover = albumForm.coverImage === photo.imageUrl;
                          return (
                            <div
                              key={photo.id || index}
                              className={`bg-white p-4 rounded-2xl border shadow-sm space-y-3 relative flex flex-col justify-between ${
                                isCover ? 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                                  <img src={photo.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                  {isCover && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded shadow-md">
                                      Album Cover
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Caption</label>
                                  <input
                                    type="text"
                                    placeholder="Enter photo caption..."
                                    value={photo.caption || ''}
                                    onChange={e => handleUpdatePhotoCaption(photo.id, e.target.value)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs"
                                  />
                                </div>
                              </div>

                              <div className="pt-2 border-t flex items-center justify-between gap-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(photo.imageUrl)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                                    isCover ? 'bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {isCover ? 'Cover Set' : 'Set Cover'}
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhotoOrder(photo.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMovePhotoOrder(photo.id, 'down')}
                                    disabled={index === albumForm.photos.length - 1}
                                    className="p-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePhotoFromAlbum(photo.id)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded"
                                    title="Delete Photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setAlbumPreviewModal(albumForm)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Live Preview Album
                    </button>

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => { setEditingAlbum(null); setFarewellSubTab('all'); }}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md"
                      >
                        Save Farewell Album
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW ALBUM MODAL */}
        {albumPreviewModal && (
          <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg">
                    {albumPreviewModal.category} Farewell {albumPreviewModal.year}
                  </span>
                  <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-slate-900 mt-2">
                    {albumPreviewModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{albumPreviewModal.description}</p>
                </div>
                <button
                  onClick={() => setAlbumPreviewModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {albumPreviewModal.photos?.map((photo: any, i: number) => (
                  <div key={i} className="bg-slate-900 rounded-2xl overflow-hidden border shadow-sm aspect-[4/3]">
                    <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button onClick={() => setAlbumPreviewModal(null)} className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 8. COMPLETE STUDENTS (GOOGLE SHEETS) MANAGEMENT ==================== */}
        {activeTab === 'students' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Students Management</h1>
                <p className="text-slate-600 text-sm">Full student records synced live with Google Sheets primary database.</p>
              </div>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setStudentForm({
                    id: generateNextStudentId(),
                    name: '',
                    dob: '',
                    gender: 'Male',
                    mobile: '',
                    email: '',
                    address: 'Iqbal Road, Kotwali, Chattogram',
                    classLevel: 'Class 10',
                    group: 'Science',
                    academicSession: '2026 Academic Session',
                    admissionDate: new Date().toISOString().split('T')[0],
                    guardianName: '',
                    guardianMobile: '',
                    guardianRelationship: 'Father',
                    guardianAddress: '',
                    status: 'Active'
                  });
                  setStudentSubTab('add');
                }}
                className="px-5 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Register New Student
              </button>
            </div>

            {/* Supabase Student Database */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-6 h-6 text-emerald-700 shrink-0" />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Google Sheets Database Connection</h3>
                    <p className="text-xs text-slate-500">All updates to personal, academic, guardian, and security fields sync live to Google Sheets.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Active
                </span>
              </div>
            </div>

            {/* Sub-tabs & Search Bar */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button onClick={() => setStudentSubTab('all')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${studentSubTab === 'all' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border'}`}>All Students ({students.length})</button>
              <button onClick={() => setStudentSubTab('add')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${studentSubTab === 'add' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border'}`}>{editingStudent ? `Editing: ${editingStudent.name} (${editingStudent.id})` : '+ Add New Student'}</button>
              <button onClick={() => setStudentSubTab('active')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${studentSubTab === 'active' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border'}`}>Active ({students.filter(s => s.status === 'Active').length})</button>
              <button onClick={() => setStudentSubTab('inactive')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${studentSubTab === 'inactive' ? 'bg-[#123B2A] text-white shadow-md' : 'bg-white text-slate-700 border'}`}>Inactive ({students.filter(s => s.status === 'Inactive').length})</button>
            </div>

            {/* STUDENT LIST VIEW */}
            {(studentSubTab === 'all' || studentSubTab === 'active' || studentSubTab === 'inactive') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, student name, guardian, or phone..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">Class:</span>
                    {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(cls => (
                      <button
                        key={cls}
                        onClick={() => setStudentClassFilter(cls)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          studentClassFilter === cls ? 'bg-[#123B2A] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Student Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudentsList.map((st: any) => (
                    <div key={st.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold font-mono rounded-lg">{st.id}</span>
                          <button onClick={() => handleToggleStudentStatus(st)} className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${st.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {st.status}
                          </button>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">{st.name}</h3>
                          <p className="text-xs font-bold text-emerald-700">{st.classLevel} ({st.group || 'Science'}) · Session: {st.academicSession || '2026'}</p>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border space-y-1.5">
                          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-700" /><span>Mobile: <strong className="text-slate-900">{st.mobile || 'N/A'}</strong></span></div>
                          {st.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-700" /><span>Email: <strong className="text-slate-900">{st.email}</strong></span></div>}
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-700" /><span>Address: <strong className="text-slate-900 line-clamp-1">{st.address || 'Chattogram'}</strong></span></div>
                          <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-700" /><span>Guardian: <strong className="text-slate-900">{st.guardianName} ({st.guardianRelationship || 'Parent'})</strong></span></div>
                          {st.guardianMobile && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-700" /><span>Guardian Phone: <strong className="text-slate-900">{st.guardianMobile}</strong></span></div>}
                        </div>

                        <div className="bg-slate-100 p-2 rounded-xl text-xs flex justify-between items-center font-mono">
                          <span className="text-slate-500 text-[11px]">PIN: securely stored</span>
                          <button onClick={() => { setPinResetStudent(st); setNewPinInput(''); }} className="text-emerald-800 hover:underline font-bold flex items-center gap-1 text-[11px]"><Key className="w-3 h-3" /> Reset PIN</button>
                        </div>
                      </div>

                      <div className="pt-4 border-t flex justify-end gap-2">
                        <button onClick={() => handleEditStudentClick(st)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit Full Profile</button>
                        <button onClick={() => handleDeleteStudentClick(st.id, st.name)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPLETE SECTIONED STUDENT FORM (ADD / EDIT) */}
            {studentSubTab === 'add' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-4xl space-y-8 shadow-md">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-slate-900">
                      {editingStudent ? `Edit Student Profile: ${editingStudent.name} (${editingStudent.id})` : 'Register New Student'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Complete student registration record synced directly with Google Sheets.
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${studentForm.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {studentForm.status}
                  </span>
                </div>

                <form onSubmit={handleSaveStudent} className="space-y-8">
                  {/* SECTION 1: Personal Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-900 border-b pb-2">
                      <UserCheck className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">1. Personal Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Student ID (Unique)</label>
                        <input
                          type="text"
                          required
                          readOnly={!!editingStudent}
                          placeholder="e.g. GLM1005"
                          value={studentForm.id}
                          onChange={e => setStudentForm({...studentForm, id: e.target.value.trim().toUpperCase()})}
                          className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono ${editingStudent ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tanvir Ahmed"
                          value={studentForm.name}
                          onChange={e => setStudentForm({...studentForm, name: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date of Birth (Optional)</label>
                        <input
                          type="date"
                          value={studentForm.dob}
                          onChange={e => setStudentForm({...studentForm, dob: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Gender</label>
                        <select
                          value={studentForm.gender}
                          onChange={e => setStudentForm({...studentForm, gender: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Student Mobile Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="+880 1711-000000"
                          value={studentForm.mobile}
                          onChange={e => setStudentForm({...studentForm, mobile: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address (Optional)</label>
                        <input
                          type="email"
                          placeholder="student@example.com"
                          value={studentForm.email}
                          onChange={e => setStudentForm({...studentForm, email: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Residence Address</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. House 14, Iqbal Road, Kotwali, Chattogram"
                          value={studentForm.address}
                          onChange={e => setStudentForm({...studentForm, address: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Academic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-900 border-b pb-2">
                      <BookOpen className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">2. Academic Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Class Level</label>
                        <select
                          value={studentForm.classLevel}
                          onChange={e => setStudentForm({...studentForm, classLevel: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        >
                          <option>Class 6</option><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Academic Group / Stream</label>
                        <select
                          value={studentForm.group}
                          onChange={e => setStudentForm({...studentForm, group: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        >
                          <option>Science</option>
                          <option>Commerce</option>
                          <option>Humanities</option>
                          <option>General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Academic Session</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026 Academic Session"
                          value={studentForm.academicSession}
                          onChange={e => setStudentForm({...studentForm, academicSession: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Admission Date</label>
                        <input
                          type="date"
                          value={studentForm.admissionDate}
                          onChange={e => setStudentForm({...studentForm, admissionDate: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Guardian Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-900 border-b pb-2">
                      <Users className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">3. Guardian Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guardian Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Md. Abdul Karim"
                          value={studentForm.guardianName}
                          onChange={e => setStudentForm({...studentForm, guardianName: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guardian Mobile Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="+880 1811-000000"
                          value={studentForm.guardianMobile}
                          onChange={e => setStudentForm({...studentForm, guardianMobile: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guardian Relationship</label>
                        <select
                          value={studentForm.guardianRelationship}
                          onChange={e => setStudentForm({...studentForm, guardianRelationship: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        >
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Uncle</option>
                          <option>Legal Guardian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Guardian Address (Optional)</label>
                        <input
                          type="text"
                          placeholder="Guardian address if different..."
                          value={studentForm.guardianAddress}
                          onChange={e => setStudentForm({...studentForm, guardianAddress: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: Account & Security */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-900 border-b pb-2">
                      <Key className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">4. Account & Security</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Student Login ID</label>
                        <input
                          type="text"
                          readOnly
                          value={studentForm.id}
                          className="w-full px-4 py-2.5 bg-slate-200 border text-slate-600 rounded-xl text-sm font-mono"
                        />
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-900">
                        Student PINs are never stored or displayed in plain text. After saving this profile, use the Reset PIN action to set a secure 6-digit PIN.
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Account Status</label>
                        <select
                          value={studentForm.status}
                          onChange={e => setStudentForm({...studentForm, status: e.target.value})}
                          className="w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-bold text-slate-900"
                        >
                          <option value="Active">Active (Can Log In)</option>
                          <option value="Inactive">Inactive (Blocked)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                    {editingStudent && (
                      <button
                        type="button"
                        onClick={() => { setPinResetStudent(editingStudent); setNewPinInput(''); }}
                        className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <Key className="w-4 h-4" /> Reset PIN Code
                      </button>
                    )}

                    <div className="flex justify-end gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => { setEditingStudent(null); setStudentSubTab('all'); }}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-[#123B2A] hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md"
                      >
                        Save Student Record
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* PIN RESET MODAL */}
        {pinResetStudent && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="font-bold text-lg font-['Bricolage_Grotesque']">Reset PIN for {pinResetStudent.name}</h3>
              <p className="text-xs text-slate-500">Student ID: <strong className="font-mono text-slate-900">{pinResetStudent.id}</strong></p>
              <form onSubmit={handleResetStudentPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">New 6-Digit PIN</label>
                  <input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="new-password" required placeholder="Enter 6-digit PIN" value={newPinInput} onChange={e => setNewPinInput(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm font-mono text-center" />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setPinResetStudent(null)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl">Update PIN</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL FOR FILE ATTACHMENTS */}
        {previewModalFile && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <span className="font-bold text-xs">{previewModalFile.name || 'File Preview'}</span>
                <button onClick={() => setPreviewModalFile(null)} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 bg-slate-100 p-2 overflow-auto flex items-center justify-center">
                {previewModalFile.fileType === 'image' || previewModalFile.url?.match(/\.(jpeg|jpg|png|webp)$/i) ? (
                  <img src={previewModalFile.url || previewModalFile} alt="Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <iframe src={previewModalFile.url || previewModalFile} title="Preview" className="w-full h-full border-0" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* VERIFICATION LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Verification Logs</h1>
                <p className="text-slate-600 text-sm">Security audit logs for student login and result verification attempts.</p>
              </div>
              {logs.length > 0 && (
                <button onClick={() => fetch('/api/verification-logs', { method: 'DELETE' }).then(() => loadAllData())} className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">Clear Logs</button>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No verification attempts logged yet.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-slate-400 uppercase text-[10px] font-bold">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Student ID</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {logs.map((lg: any) => (
                      <tr key={lg.id}>
                        <td className="py-3 font-mono text-slate-500">{new Date(lg.timestamp).toLocaleString()}</td>
                        <td className="py-3 font-bold font-mono">{lg.studentId}</td>
                        <td className="py-3 font-semibold">{lg.studentName || 'Unknown'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${lg.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {lg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* WEBSITE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Website Settings & Content</h1>
              <p className="text-slate-600 text-sm">Dynamically manage institute identity, brand tagline, location address, and hero banner content.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Institute Name</label>
                  <input type="text" value={settingsForm.instituteName || ''} onChange={e => setSettingsForm({...settingsForm, instituteName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Brand Tagline</label>
                  <input type="text" value={settingsForm.tagline || ''} onChange={e => setSettingsForm({...settingsForm, tagline: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Location Address</label>
                  <input type="text" value={settingsForm.address || ''} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm" />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-6 py-2.5 bg-[#123B2A] text-white font-bold rounded-xl text-xs">Save Website Content</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* GOOGLE APPS SCRIPT TAB */}
        {activeTab === 'apps-script' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">Google Apps Script Integration</h1>
              <p className="text-slate-600 text-sm">Copy and deploy this Apps Script code to verify student credentials directly from Google Sheets.</p>
            </div>

            <div className="bg-slate-900 text-emerald-300 p-6 rounded-3xl font-mono text-xs overflow-x-auto space-y-4">
              <div className="flex justify-between items-center text-slate-400 text-[11px] border-b border-slate-800 pb-3">
                <span>Code.gs — Google Apps Script Web App</span>
                <button onClick={() => { navigator.clipboard.writeText(appsScriptCode); showSuccess("Apps Script code copied to clipboard!"); }} className="px-3 py-1 bg-emerald-900 text-emerald-200 rounded font-bold hover:bg-emerald-800">Copy Code</button>
              </div>
              <pre className="leading-relaxed whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
