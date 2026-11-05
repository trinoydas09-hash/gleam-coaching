import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'gleam_db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const initialDb = {
  settings: {
    instituteName: "GLEAM COACHING",
    tagline: "Learn Today. Lead Tomorrow.",
    address: "Iqbal Road, Kotwali, Chattogram, Bangladesh",
    phone: "+880 1812-345678",
    email: "info@gleamcoaching.edu.bd",
    facebookUrl: "https://www.facebook.com/share/g/19cGwwjKXs/",
    aboutText: "Gleam Coaching is Chattogram's premier academic coaching institute providing expert mentorship, regular weekly exams, comprehensive study notes, and rigorous academic support for students from Class 6 to Class 12 across all subjects.",
    heroHeadline: "Your Future Begins With The Right Guidance.",
    heroSubheading: "Quality Education, Experienced Teachers, Regular Assessments and Continuous Academic Support for Classes 6–12.",
    logoUrl: "/assets/aistudio/image_4f62b769.png",
    heroBgUrl: "/assets/aistudio/image_4f62b769.png"
  },
  teachers: [
    {
      id: "t1",
      name: "Joy Gomes Jonerthon",
      designation: "Founder & Chief Instructor",
      subject: "Mathematics & Physics",
      bio: "Master mentor with over 12 years of experience guiding students to top board exam results in Chattogram.",
      experience: "12+ Years",
      image: "/assets/aistudio/image_4f62b769.png",
      email: "joy.gomes@gleamcoaching.edu.bd",
      phone: "+880 1811-111111",
      displayOrder: 1,
      isActive: true
    },
    {
      id: "t2",
      name: "Joy Das Soyrov",
      designation: "Senior Instructor",
      subject: "Higher Mathematics & Chemistry",
      bio: "Expert in complex calculus and organic chemistry, passionate about simplifying difficult scientific concepts.",
      experience: "8+ Years",
      image: "/assets/aistudio/image_4f62b769.png",
      email: "joy.soyrov@gleamcoaching.edu.bd",
      phone: "+880 1822-222222",
      displayOrder: 2,
      isActive: true
    },
    {
      id: "t3",
      name: "Victoria",
      designation: "Language & Literature Expert",
      subject: "English & Bengali",
      bio: "Dedicated linguistic scholar specializing in grammar, creative writing, and academic literature mastery.",
      experience: "7+ Years",
      image: "/assets/aistudio/image_4f62b769.png",
      email: "victoria@gleamcoaching.edu.bd",
      phone: "+880 1833-333333",
      displayOrder: 3,
      isActive: true
    },
    {
      id: "t4",
      name: "Avishek",
      designation: "Science Faculty",
      subject: "Biology & General Science",
      bio: "Committed medical entrance guide with extensive practical laboratory training methods.",
      experience: "6+ Years",
      image: "/assets/aistudio/image_4f62b769.png",
      email: "avishek@gleamcoaching.edu.bd",
      phone: "+880 1844-444444",
      displayOrder: 4,
      isActive: true
    },
    {
      id: "t5",
      name: "Arpita Chakravorty",
      designation: "Commerce & Social Science",
      subject: "Accounting, Finance & Economics",
      bio: "Chartered finance background helping students master commerce fundamentals with real-world applications.",
      experience: "9+ Years",
      image: "/assets/aistudio/image_4f62b769.png",
      email: "arpita@gleamcoaching.edu.bd",
      phone: "+880 1855-555555",
      displayOrder: 5,
      isActive: true
    }
  ],
  courses: [
    {
      id: "c6",
      className: "Class 6",
      title: "Class 6 Comprehensive Foundation",
      subjects: ["Mathematics", "English", "Science", "Bengali", "ICT", "Social Studies"],
      assignedTeachers: ["Joy Gomes Jonerthon", "Victoria"],
      description: "Building rock-solid academic habits and conceptual clarity for early high school transition.",
      schedule: "Sun, Tue, Thu (3:00 PM - 5:00 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 1,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c7",
      className: "Class 7",
      title: "Class 7 Academic Excellence",
      subjects: ["Mathematics", "English", "General Science", "Bengali", "Religion", "ICT"],
      assignedTeachers: ["Joy Das Soyrov", "Avishek"],
      description: "Advanced analytical problem solving and rigorous practice across all board curriculum subjects.",
      schedule: "Sat, Mon, Wed (3:00 PM - 5:00 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 2,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c8",
      className: "Class 8",
      title: "Class 8 Junior Scholarship Prep",
      subjects: ["Mathematics", "English", "Science", "Bangladesh & Global Studies", "ICT"],
      assignedTeachers: ["Joy Gomes Jonerthon", "Victoria", "Arpita Chakravorty"],
      description: "Intensive preparation for junior board curriculum and scholarship examinations with weekly mock tests.",
      schedule: "Sun, Tue, Thu (5:00 PM - 7:00 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 3,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c9",
      className: "Class 9",
      title: "Class 9 Science & Commerce Stream",
      subjects: ["Physics", "Chemistry", "Higher Math", "Biology", "Accounting", "General Math", "English"],
      assignedTeachers: ["Joy Das Soyrov", "Avishek", "Arpita Chakravorty"],
      description: "Stream selection foundation course focusing on core scientific and business principles.",
      schedule: "Sat, Mon, Wed (5:00 PM - 7:00 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 4,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c10",
      className: "Class 10",
      title: "SSC Board Exam Candidate Coaching",
      subjects: ["Physics", "Chemistry", "Higher Math", "Biology", "Accounting", "English", "ICT"],
      assignedTeachers: ["Joy Gomes Jonerthon", "Joy Das Soyrov", "Avishek"],
      description: "Mission-critical SSC test paper solving, rigorous weekly examinations, and revision modules.",
      schedule: "Daily batches (Morning & Evening slots available)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 5,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c11",
      className: "Class 11",
      title: "HSC 1st Year Advanced Program",
      subjects: ["Physics", "Chemistry", "Higher Math", "Biology", "ICT", "English"],
      assignedTeachers: ["Joy Gomes Jonerthon", "Joy Das Soyrov"],
      description: "Bridging school curriculum to higher secondary college standards with conceptual depth.",
      schedule: "Sun, Tue, Thu (4:00 PM - 6:30 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 6,
      image: "/assets/aistudio/image_4f62b769.png"
    },
    {
      id: "c12",
      className: "Class 12",
      title: "HSC & University Admission Target",
      subjects: ["Physics", "Chemistry", "Higher Math", "Biology", "ICT", "English"],
      assignedTeachers: ["Joy Gomes Jonerthon", "Joy Das Soyrov", "Avishek"],
      description: "HSC board mastery coupled with medical, engineering, and university admission preparation.",
      schedule: "Sat, Mon, Wed (4:00 PM - 6:30 PM)",
      duration: "1 Year",
      status: "Active",
      displayOrder: 7,
      image: "/assets/aistudio/image_4f62b769.png"
    }
  ],
  exams: [
    {
      id: "ex1",
      title: "Weekly Physics & Math Assessment",
      classLevel: "Class 10",
      subject: "Physics & Higher Math",
      assignedTeacher: "Joy Gomes Jonerthon",
      examDate: "2026-11-08",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      totalMarks: 50,
      syllabus: "Motion, Force, Quadratic Equations, Vectors.",
      instructions: "Arrive 15 minutes prior to start time with standard non-programmable geometry set.",
      pdfAttachments: [
        { name: "Syllabus & Sample Paper.pdf", url: "/assets/aistudio/sample_notice.pdf" }
      ],
      imageAttachments: [],
      status: "Upcoming",
      isPublished: true
    },
    {
      id: "ex2",
      title: "Monthly Chemistry Diagnostic Test",
      classLevel: "Class 12",
      subject: "Chemistry",
      assignedTeacher: "Joy Das Soyrov",
      examDate: "2026-11-10",
      startTime: "03:00 PM",
      endTime: "05:00 PM",
      totalMarks: 100,
      syllabus: "Organic Reaction Mechanisms & Thermodynamics.",
      instructions: "Answer all 4 structured questions in section A and 2 problem sets in section B.",
      pdfAttachments: [],
      imageAttachments: [],
      status: "Upcoming",
      isPublished: true
    }
  ],
  results: [
    {
      id: "res1",
      studentId: "GLM1001",
      studentName: "Tanvir Ahmed",
      classLevel: "Class 10",
      group: "Science",
      examTitle: "Weekly Physics & Math Assessment",
      subject: "Physics",
      obtainedMarks: 45,
      totalMarks: 50,
      gpa: "5.00",
      position: "1st",
      remarks: "Outstanding precision and analytical skills!",
      status: "Published"
    }
  ],
  routine: [
    {
      id: "rt1",
      title: "Class 10 Master Academic Routine (2026)",
      classLevel: "Class 10",
      academicSession: "2026 Academic Session",
      description: "Official weekly timetable for Class 10 SSC Candidate Batches at Iqbal Road, Kotwali, Chattogram.",
      effectiveDate: "2026-11-01",
      day: "Sunday",
      subject: "Physics & Higher Math",
      teacher: "Joy Gomes Jonerthon",
      startTime: "04:00 PM",
      endTime: "06:00 PM",
      room: "Room 101",
      imageAttachments: [
        { name: "Class10_Routine_Schedule.png", url: "/assets/aistudio/image_4f62b769.png", fileType: "image" }
      ],
      pdfAttachments: [
        { name: "Official_Class10_Routine_2026.pdf", url: "/assets/aistudio/sample_notice.pdf", fileType: "pdf" }
      ],
      googleSheetUrl: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit",
      status: "Published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  notices: [
    {
      id: "n1",
      title: "HSC 2026 Final Revision Schedule Announced",
      category: "Examination Notice",
      targetClass: "Class 12",
      date: "2026-11-01",
      status: "Published",
      content: "All HSC 12th-grade students are requested to collect their special test question papers.",
      isPinned: true
    }
  ],
  testimonials: [
    {
      id: "ts1",
      name: "Rafiqul Islam",
      role: "Parent of HSC Student",
      comment: "Joy Gomes Jonerthon sir's dedication is unmatched. My son improved his Physics score dramatically.",
      rating: 5
    }
  ],
  students: [
    {
      id: "GLM1001",
      name: "Tanvir Ahmed",
      dob: "2010-05-14",
      gender: "Male",
      mobile: "+880 1711-234567",
      email: "tanvir.ahmed@gmail.com",
      address: "House 14, Iqbal Road, Kotwali, Chattogram",
      classLevel: "Class 10",
      group: "Science",
      academicSession: "2026 Academic Session",
      admissionDate: "2025-01-15",
      guardianName: "Md. Abdul Karim",
      guardianMobile: "+880 1811-987654",
      guardianRelationship: "Father",
      guardianAddress: "House 14, Iqbal Road, Kotwali, Chattogram",
      pin: "1234",
      status: "Active"
    },
    {
      id: "GLM1002",
      name: "Nusrat Jahan",
      dob: "2011-08-22",
      gender: "Female",
      mobile: "+880 1722-345678",
      email: "nusrat.jahan@gmail.com",
      address: "Station Road, Kotwali, Chattogram",
      classLevel: "Class 9",
      group: "Science",
      academicSession: "2026 Academic Session",
      admissionDate: "2025-01-20",
      guardianName: "Rafiqul Islam",
      guardianMobile: "+880 1822-876543",
      guardianRelationship: "Father",
      guardianAddress: "Station Road, Kotwali, Chattogram",
      pin: "5678",
      status: "Active"
    }
  ],
  verificationLogs: [],
  farewellAlbums: [
    {
      id: "fa_hsc_2026",
      category: "HSC",
      year: 2026,
      title: "HSC 2026 Farewell Ceremony & Memories",
      description: "Celebrating the dedication, bright futures, and cherished memories of our HSC Batch 2026 candidates at Gleam Coaching Chattogram.",
      coverImage: "/assets/aistudio/image_4f62b769.png",
      status: "Published",
      createdAt: "2026-11-01T00:00:00.000Z",
      updatedAt: "2026-11-01T00:00:00.000Z",
      photos: [
        {
          id: "p_hsc_2026_1",
          imageUrl: "/assets/aistudio/image_4f62b769.png",
          caption: "HSC 2026 Grand Group Photo with Founder & Chief Instructor Joy Gomes Jonerthon",
          displayOrder: 1,
          createdAt: "2026-11-01T00:00:00.000Z"
        },
        {
          id: "p_hsc_2026_2",
          imageUrl: "/assets/aistudio/image_4f62b769.png",
          caption: "Special crest & academic award presentation to HSC top scorers",
          displayOrder: 2,
          createdAt: "2026-11-01T00:00:00.000Z"
        }
      ]
    },
    {
      id: "fa_ssc_2026",
      category: "SSC",
      year: 2026,
      title: "SSC 2026 Farewell Gathering & Celebration",
      description: "Honoring our Class 10 SSC Candidate Batch 2026 as they prepare for their board examinations.",
      coverImage: "/assets/aistudio/image_4f62b769.png",
      status: "Published",
      createdAt: "2026-11-01T00:00:00.000Z",
      updatedAt: "2026-11-01T00:00:00.000Z",
      photos: [
        {
          id: "p_ssc_2026_1",
          imageUrl: "/assets/aistudio/image_4f62b769.png",
          caption: "SSC 2026 Farewell Group Photo at Gleam Coaching Campus",
          displayOrder: 1,
          createdAt: "2026-11-01T00:00:00.000Z"
        }
      ]
    }
  ]
};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading DB file, using seed:", e);
  }
  saveDb(initialDb);
  return initialDb;
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error saving DB file:", e);
  }
}

let db = loadDb();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // File Upload API endpoint
  app.post('/api/upload', (req, res) => {
    try {
      const { fileName, fileType, dataUrl } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: "No dataUrl provided." });
      }
      
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 payload." });
      }

      const ext = fileName ? path.extname(fileName) : '.bin';
      const cleanName = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8) + ext;
      const filePath = path.join(UPLOADS_DIR, cleanName);
      const buffer = Buffer.from(matches[2], 'base64');
      fs.writeFileSync(filePath, buffer);

      const publicUrl = '/uploads/' + cleanName;
      res.json({ success: true, url: publicUrl, fileName: fileName || cleanName });
    } catch (err: any) {
      console.error("File upload error:", err);
      res.status(500).json({ error: "Upload failed: " + err.message });
    }
  });

  // Settings
  app.get('/api/settings', (req, res) => res.json(db.settings));
  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    res.json(db.settings);
  });

  // Teachers CRUD
  app.get('/api/teachers', (req, res) => {
    const sorted = [...db.teachers].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    res.json(sorted);
  });
  app.post('/api/teachers', (req, res) => {
    const newT = {
      id: 't_' + Date.now(),
      displayOrder: db.teachers.length + 1,
      isActive: true,
      experience: '5+ Years',
      ...req.body
    };
    db.teachers.push(newT);
    saveDb(db);
    res.status(201).json(newT);
  });
  app.put('/api/teachers/:id', (req, res) => {
    db.teachers = db.teachers.map((t: any) => t.id === req.params.id ? { ...t, ...req.body } : t);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/teachers/:id', (req, res) => {
    db.teachers = db.teachers.filter((t: any) => t.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Courses CRUD
  app.get('/api/courses', (req, res) => {
    const sorted = [...db.courses].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
    res.json(sorted);
  });
  app.post('/api/courses', (req, res) => {
    const newC = {
      id: 'c_' + Date.now(),
      displayOrder: db.courses.length + 1,
      status: 'Active',
      duration: '1 Year',
      ...req.body
    };
    if (typeof newC.subjects === 'string') {
      newC.subjects = newC.subjects.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof newC.assignedTeachers === 'string') {
      newC.assignedTeachers = newC.assignedTeachers.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    db.courses.push(newC);
    saveDb(db);
    res.status(201).json(newC);
  });
  app.put('/api/courses/:id', (req, res) => {
    const body = { ...req.body };
    if (typeof body.subjects === 'string') {
      body.subjects = body.subjects.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof body.assignedTeachers === 'string') {
      body.assignedTeachers = body.assignedTeachers.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    db.courses = db.courses.map((c: any) => c.id === req.params.id ? { ...c, ...body } : c);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/courses/:id', (req, res) => {
    db.courses = db.courses.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Weekly Exams CRUD
  app.get('/api/exams', (req, res) => {
    res.json(db.exams);
  });
  app.post('/api/exams', (req, res) => {
    const newE = {
      id: 'ex_' + Date.now(),
      status: 'Upcoming',
      isPublished: true,
      pdfAttachments: [],
      imageAttachments: [],
      ...req.body
    };
    db.exams.unshift(newE);
    saveDb(db);
    res.status(201).json(newE);
  });
  app.put('/api/exams/:id', (req, res) => {
    db.exams = db.exams.map((e: any) => e.id === req.params.id ? { ...e, ...req.body } : e);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/exams/:id', (req, res) => {
    db.exams = db.exams.filter((e: any) => e.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Results
  app.get('/api/results', (req, res) => {
    const { studentId } = req.query;
    if (studentId) return res.json(db.results.filter((r: any) => r.studentId === studentId && r.status === 'Published'));
    res.json(db.results);
  });
  app.post('/api/results', (req, res) => {
    const newR = { id: 'res_' + Date.now(), status: 'Published', ...req.body };
    db.results.push(newR);
    saveDb(db);
    res.status(201).json(newR);
  });
  app.put('/api/results/:id', (req, res) => {
    db.results = db.results.map((r: any) => r.id === req.params.id ? { ...r, ...req.body } : r);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/results/:id', (req, res) => {
    db.results = db.results.filter((r: any) => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });
  app.post('/api/results/import-sheets', (req, res) => {
    const sampleImported = [
      { id: 'res_' + Date.now() + '1', studentId: 'GLM1001', studentName: 'Tanvir Ahmed', classLevel: 'Class 10', group: 'Science', examTitle: 'Monthly Mock Exam', subject: 'Mathematics', obtainedMarks: 49, totalMarks: 50, gpa: '5.00', position: '1st', remarks: 'Flawless calculation', status: 'Published' },
      { id: 'res_' + Date.now() + '2', studentId: 'GLM1002', studentName: 'Nusrat Jahan', classLevel: 'Class 9', group: 'Science', examTitle: 'Monthly Mock Exam', subject: 'General Science', obtainedMarks: 44, totalMarks: 50, gpa: '4.75', position: '2nd', remarks: 'Very thorough', status: 'Published' }
    ];
    db.results.push(...sampleImported);
    saveDb(db);
    res.json({ success: true, count: sampleImported.length });
  });

  // Routine
  app.get('/api/routine', (req, res) => {
    const { status, className } = req.query;
    let list = [...(db.routine || [])];
    if (status) list = list.filter((r: any) => r.status === status);
    if (className && className !== 'All') list = list.filter((r: any) => (r.classLevel === className || r.className === className));
    res.json(list);
  });
  app.post('/api/routine', (req, res) => {
    const newRt = {
      id: 'rt_' + Date.now(),
      title: req.body.title || `${req.body.classLevel || req.body.className || 'Class Routine'} Schedule`,
      classLevel: req.body.classLevel || req.body.className || 'Class 10',
      academicSession: req.body.academicSession || '2026 Academic Session',
      description: req.body.description || '',
      effectiveDate: req.body.effectiveDate || new Date().toISOString().split('T')[0],
      googleSheetUrl: req.body.googleSheetUrl || '',
      imageAttachments: req.body.imageAttachments || [],
      pdfAttachments: req.body.pdfAttachments || [],
      status: req.body.status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };
    db.routine.unshift(newRt);
    saveDb(db);
    res.status(201).json(newRt);
  });
  app.put('/api/routine/:id', (req, res) => {
    db.routine = db.routine.map((r: any) => r.id === req.params.id ? { ...r, ...req.body, updatedAt: new Date().toISOString() } : r);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/routine/:id', (req, res) => {
    db.routine = db.routine.filter((r: any) => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });
  app.post('/api/routine/import-sheets', (req, res) => {
    const sampleRoutine = [
      {
        id: 'rt_' + Date.now() + '1',
        title: 'Class 10 Google Sheets Routine Sync',
        classLevel: 'Class 10',
        academicSession: '2026 Academic Session',
        description: 'Synced directly from official Gleam Coaching Google Spreadsheet schedule.',
        effectiveDate: new Date().toISOString().split('T')[0],
        day: 'Saturday',
        subject: 'Biology & Chemistry',
        teacher: 'Avishek',
        startTime: '04:00 PM',
        endTime: '06:00 PM',
        room: 'Room 102',
        imageAttachments: [],
        pdfAttachments: [],
        googleSheetUrl: req.body?.sheetUrl || 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
        status: 'Published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    db.routine.unshift(...sampleRoutine);
    saveDb(db);
    res.json({ success: true, count: sampleRoutine.length });
  });

  // Notices
  app.get('/api/notices', (req, res) => {
    const { status } = req.query;
    if (status) return res.json(db.notices.filter((n: any) => n.status === status));
    res.json(db.notices);
  });
  app.post('/api/notices', (req, res) => {
    const newN = { id: 'n_' + Date.now(), date: new Date().toISOString().split('T')[0], status: 'Published', ...req.body };
    db.notices.unshift(newN);
    saveDb(db);
    res.status(201).json(newN);
  });
  app.put('/api/notices/:id', (req, res) => {
    db.notices = db.notices.map((n: any) => n.id === req.params.id ? { ...n, ...req.body } : n);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/notices/:id', (req, res) => {
    db.notices = db.notices.filter((n: any) => n.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Testimonials
  app.get('/api/testimonials', (req, res) => res.json(db.testimonials));
  app.post('/api/testimonials', (req, res) => {
    const newTs = { id: 'ts_' + Date.now(), ...req.body };
    db.testimonials.push(newTs);
    saveDb(db);
    res.status(201).json(newTs);
  });
  app.put('/api/testimonials/:id', (req, res) => {
    db.testimonials = db.testimonials.map((t: any) => t.id === req.params.id ? { ...t, ...req.body } : t);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/testimonials/:id', (req, res) => {
    db.testimonials = db.testimonials.filter((t: any) => t.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Farewell Albums & Photo Gallery
  app.get('/api/farewell/albums', (req, res) => {
    const { category, year, status } = req.query;
    db.farewellAlbums = db.farewellAlbums || [];
    let list = [...db.farewellAlbums];
    if (category && category !== 'All') {
      list = list.filter((a: any) => a.category === category);
    }
    if (year && year !== 'All') {
      const yearNum = parseInt(year as string, 10);
      if (!isNaN(yearNum)) {
        list = list.filter((a: any) => parseInt(a.year, 10) === yearNum);
      }
    }
    if (status && status !== 'All') {
      list = list.filter((a: any) => a.status === status);
    }
    // Sort by year descending
    list.sort((a: any, b: any) => (parseInt(b.year, 10) - parseInt(a.year, 10)));
    res.json(list);
  });

  app.get('/api/farewell/albums/:id', (req, res) => {
    db.farewellAlbums = db.farewellAlbums || [];
    const album = db.farewellAlbums.find((a: any) => a.id === req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found." });
    res.json(album);
  });

  app.post('/api/farewell/albums', (req, res) => {
    db.farewellAlbums = db.farewellAlbums || [];
    const year = parseInt(req.body.year || '2026', 10);
    const category = req.body.category || 'HSC';

    // Prevent duplicate album for same category and year unless explicitly requested
    const existing = db.farewellAlbums.find((a: any) => a.category === category && parseInt(a.year, 10) === year);
    if (existing && !req.body.allowDuplicate) {
      return res.status(400).json({ error: `An album for ${category} Farewell ${year} already exists! ("${existing.title}"). You can edit the existing album.` });
    }

    const newAlbum = {
      id: 'fa_' + Date.now(),
      category,
      year,
      title: req.body.title || `${category} Farewell ${year} Album`,
      description: req.body.description || '',
      coverImage: req.body.coverImage || (req.body.photos?.[0]?.imageUrl || '/assets/aistudio/image_4f62b769.png'),
      status: req.body.status || 'Published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      photos: req.body.photos || []
    };

    db.farewellAlbums.unshift(newAlbum);
    saveDb(db);
    res.status(201).json(newAlbum);
  });

  app.put('/api/farewell/albums/:id', (req, res) => {
    db.farewellAlbums = db.farewellAlbums || [];
    let updated = false;
    db.farewellAlbums = db.farewellAlbums.map((a: any) => {
      if (a.id === req.params.id) {
        updated = true;
        const photos = req.body.photos !== undefined ? req.body.photos : (a.photos || []);
        const coverImage = req.body.coverImage || (photos.length > 0 ? photos[0].imageUrl : a.coverImage);
        return {
          ...a,
          ...req.body,
          photos,
          coverImage,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    });

    if (!updated) return res.status(404).json({ error: "Album not found." });
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/farewell/albums/:id', (req, res) => {
    db.farewellAlbums = db.farewellAlbums || [];
    db.farewellAlbums = db.farewellAlbums.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Students
  app.get('/api/students', (req, res) => res.json(db.students));
  app.post('/api/students', (req, res) => {
    const studentId = (req.body.id || '').trim().toUpperCase();
    if (!studentId) return res.status(400).json({ error: "Student ID is required." });

    // Validate duplicate Student ID
    if (db.students.some((s: any) => s.id.toUpperCase() === studentId)) {
      return res.status(400).json({ error: `Student ID "${studentId}" already exists! Please use a unique Student ID.` });
    }

    const newS = {
      id: studentId,
      name: req.body.name || '',
      dob: req.body.dob || '',
      gender: req.body.gender || 'Male',
      mobile: req.body.mobile || '',
      email: req.body.email || '',
      address: req.body.address || '',
      classLevel: req.body.classLevel || 'Class 10',
      group: req.body.group || 'Science',
      academicSession: req.body.academicSession || '2026 Academic Session',
      admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0],
      guardianName: req.body.guardianName || '',
      guardianMobile: req.body.guardianMobile || '',
      guardianRelationship: req.body.guardianRelationship || 'Father',
      guardianAddress: req.body.guardianAddress || '',
      pin: req.body.pin || '1234',
      status: req.body.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.students.unshift(newS);
    saveDb(db);
    res.status(201).json(newS);
  });
  app.put('/api/students/:id', (req, res) => {
    const targetId = req.params.id;
    // Check if updating ID to another ID that conflicts
    if (req.body.id && req.body.id !== targetId) {
      if (db.students.some((s: any) => s.id === req.body.id)) {
        return res.status(400).json({ error: `Student ID "${req.body.id}" already exists!` });
      }
    }
    db.students = db.students.map((s: any) => s.id === targetId ? { ...s, ...req.body, updatedAt: new Date().toISOString() } : s);
    saveDb(db);
    res.json({ success: true });
  });
  app.delete('/api/students/:id', (req, res) => {
    db.students = db.students.filter((s: any) => s.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Verification
  app.post('/api/students/verify', (req, res) => {
    const { studentId, pin } = req.body;
    const student = db.students.find((s: any) => s.id === studentId);
    if (!student || student.status !== 'Active' || student.pin !== pin) {
      db.verificationLogs = db.verificationLogs || [];
      db.verificationLogs.unshift({
        id: 'log_' + Date.now(),
        timestamp: new Date().toISOString(),
        studentId,
        status: 'Failed',
        reason: 'Invalid ID/PIN or Inactive'
      });
      saveDb(db);
      return res.status(401).json({ error: "Invalid Student ID, PIN, or inactive account." });
    }
    db.verificationLogs = db.verificationLogs || [];
    db.verificationLogs.unshift({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      studentId: student.id,
      studentName: student.name,
      status: 'Success'
    });
    saveDb(db);
    const studentResults = db.results.filter((r: any) => r.studentId === student.id && r.status === 'Published');
    res.json({ success: true, student, results: studentResults });
  });

  app.get('/api/verification-logs', (req, res) => res.json(db.verificationLogs || []));
  app.delete('/api/verification-logs', (req, res) => {
    db.verificationLogs = [];
    saveDb(db);
    res.json({ success: true });
  });

  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@gleamcoaching.com" && password === "gleam2026") {
      return res.json({ success: true, token: "gleam_admin_token", admin: { name: "Joy Gomes Jonerthon", email } });
    }
    res.status(401).json({ error: "Invalid admin credentials" });
  });

  app.get('/api/stats', (req, res) => {
    res.json({
      totalStudents: db.students.length,
      activeStudents: db.students.filter((s: any) => s.status === 'Active').length,
      totalTeachers: db.teachers.length,
      activeTeachers: db.teachers.filter((t: any) => t.isActive !== false).length,
      totalCourses: db.courses.length,
      activeCourses: db.courses.filter((c: any) => c.status === 'Active').length,
      totalExams: db.exams.length,
      upcomingExams: db.exams.filter((e: any) => e.status === 'Upcoming').length,
      totalNotices: db.notices.length,
      totalResults: db.results.length
    });
  });

  app.get('/api/docs/apps-script', (req, res) => {
    const fullAppsScript = `// GLEAM COACHING — Google Apps Script Master Student Integration Code (Code.gs)
// Deploy as Web App -> Execute as: Me -> Who has access: Anyone

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "verify"; // "verify", "upsert", "get_all"
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Students");
      sheet.appendRow([
        "Student ID", "Full Name", "DOB", "Gender", "Mobile", "Email", "Address",
        "Class", "Group", "Academic Session", "Admission Date",
        "Guardian Name", "Guardian Mobile", "Guardian Relationship", "Guardian Address",
        "PIN", "Status"
      ]);
    }
    
    var rows = sheet.getDataRange().getValues();
    
    if (action === "verify") {
      var studentId = String(data.studentId || "").trim().toUpperCase();
      var pin = String(data.pin || "").trim();
      
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === studentId) {
          var storedPin = String(rows[i][15]).trim();
          var status = String(rows[i][16]).trim();
          
          if (status !== "Active") {
            return responseJSON({ success: false, error: "Account is inactive. Contact Gleam Coaching Admin." });
          }
          if (storedPin === pin) {
            return responseJSON({
              success: true,
              student: {
                id: rows[i][0],
                name: rows[i][1],
                dob: rows[i][2],
                gender: rows[i][3],
                mobile: rows[i][4],
                email: rows[i][5],
                address: rows[i][6],
                classLevel: rows[i][7],
                group: rows[i][8],
                academicSession: rows[i][9],
                admissionDate: rows[i][10],
                guardianName: rows[i][11],
                guardianMobile: rows[i][12],
                guardianRelationship: rows[i][13],
                guardianAddress: rows[i][14],
                status: rows[i][16]
              }
            });
          } else {
            return responseJSON({ success: false, error: "Invalid Verification PIN code." });
          }
        }
      }
      return responseJSON({ success: false, error: "Student ID not found in Google Sheets database." });
    }
    
    if (action === "upsert") {
      var s = data.student;
      var foundRow = -1;
      
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]).trim().toUpperCase() === String(s.id).trim().toUpperCase()) {
          foundRow = i + 1;
          break;
        }
      }
      
      var newRowData = [
        s.id, s.name, s.dob || "", s.gender || "", s.mobile || "", s.email || "", s.address || "",
        s.classLevel, s.group, s.academicSession || "2026 Academic Session", s.admissionDate || "",
        s.guardianName || "", s.guardianMobile || "", s.guardianRelationship || "", s.guardianAddress || "",
        s.pin || "1234", s.status || "Active"
      ];
      
      if (foundRow > 0) {
        sheet.getRange(foundRow, 1, 1, newRowData.length).setValues([newRowData]);
        return responseJSON({ success: true, message: "Student record updated in Google Sheets row " + foundRow });
      } else {
        sheet.appendRow(newRowData);
        return responseJSON({ success: true, message: "New student record added to Google Sheets" });
      }
    }
    
    return responseJSON({ success: false, error: "Unknown action" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}`;
    res.json({ script: fullAppsScript });
  });

  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
  app.listen(3000, '0.0.0.0', () => console.log('Gleam server running on port 3000'));
}

startServer();
