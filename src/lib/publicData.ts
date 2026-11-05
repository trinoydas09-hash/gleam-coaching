import { supabase } from './supabase';

const requireClient = () => {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
};

export async function loadTeachers() {
  const { data, error } = await requireClient().from('teachers').select('*').eq('is_published', true).order('sort_order');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, name: row.name, designation: row.designation || '', subject: (row.subjects || []).join(', '),
    bio: row.bio || '', experience: row.qualification || '', image: row.photo_path || '', email: row.email || '',
    phone: row.phone || '', displayOrder: row.sort_order, isActive: row.is_published,
  }));
}

export async function loadCourses() {
  const { data, error } = await requireClient().from('courses').select('*').eq('is_published', true).eq('status', 'active').order('sort_order');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, title: row.title, className: `Class ${row.class_level}`, classLevel: `Class ${row.class_level}`,
    description: row.description, subjects: row.subjects || [], duration: row.duration, schedule: row.schedule,
    image: row.image_path, status: 'Active', displayOrder: row.sort_order,
  }));
}

export async function loadExams() {
  const { data, error } = await requireClient().from('weekly_exams')
    .select('*, teachers(name), exam_attachments(id,file_path,file_name,content_type)')
    .eq('status', 'published').order('exam_date', { ascending: true });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, title: row.title, classLevel: `Class ${row.class_level}`, subject: row.subject,
    assignedTeacher: row.teachers?.name || '', examDate: row.exam_date, startTime: row.start_time,
    duration: row.duration_minutes, syllabus: row.syllabus, instructions: row.instructions,
    totalMarks: row.total_marks, status: 'Upcoming', isPublished: true,
    attachments: (row.exam_attachments || []).map((a: any) => ({ name: a.file_name, url: a.file_path, fileType: a.content_type?.includes('pdf') ? 'pdf' : 'image' })),
  }));
}

export async function loadRoutines() {
  const { data, error } = await requireClient().from('routines')
    .select('*, routine_attachments(id,file_path,file_name,content_type,sort_order)')
    .eq('status', 'published').order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => {
    const attachments = row.routine_attachments || [];
    return {
      id: row.id, title: row.title, classLevel: row.class_level ? `Class ${row.class_level}` : 'All Classes',
      description: row.description, status: 'Published', effectiveDate: row.published_at,
      imageAttachments: attachments.filter((a: any) => !a.content_type?.includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path })),
      pdfAttachments: attachments.filter((a: any) => a.content_type?.includes('pdf')).map((a: any) => ({ name: a.file_name, url: a.file_path })),
    };
  });
}

export async function loadNotices() {
  const { data, error } = await requireClient().from('notices')
    .select('*, notice_attachments(id,file_path,file_name,content_type)')
    .eq('status', 'published').order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, title: row.title, content: row.body || '', category: row.category || 'General Notice',
    date: row.published_at, status: 'Published', targetClass: 'All Students', isPinned: false,
    attachmentUrl: row.notice_attachments?.[0]?.file_path || '',
    attachmentType: row.notice_attachments?.[0]?.content_type?.includes('pdf') ? 'PDF' : 'Text',
  }));
}

export async function loadTestimonials() {
  const { data, error } = await requireClient().from('testimonials').select('*').eq('is_published', true).order('sort_order');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, name: row.student_name, role: row.class_level ? `Class ${row.class_level}` : 'Student',
    comment: row.quote, image: row.photo_path, isActive: row.is_published,
  }));
}

export async function loadFarewellAlbums() {
  const { data, error } = await requireClient().from('farewell_albums')
    .select('*, farewell_photos(id,file_path,caption,sort_order)')
    .eq('is_published', true).order('year', { ascending: false }).order('sort_order');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, category: row.school_level, year: row.year, title: row.title,
    description: row.description, coverImage: row.cover_photo_path, status: 'Published',
    photos: (row.farewell_photos || []).sort((a: any,b: any) => a.sort_order-b.sort_order)
      .map((p: any) => ({ id: p.id, imageUrl: p.file_path, caption: p.caption })),
  }));
}
