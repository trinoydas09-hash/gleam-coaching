# Gleam Coaching - Digital Institute Management Platform

**Location:** Iqbal Road, Kotwali, Chattogram, Bangladesh  
**Brand Tagline:** "Learn Today. Lead Tomorrow."  
**Main Teacher & Founder:** Joy Gomes Jonerthon  
**Faculty:** Joy Das Soyrov, Victoria, Avishek, Arpita Chakravorty  
**Facebook Page:** [Gleam Coaching Facebook Group](https://www.facebook.com/share/g/19cGwwjKXs/)  

---

## Overview

Gleam Coaching is a complete, production-ready coaching institute management platform built for Classes 6 to 12. It features a fully responsive public website, a secure student portal verified via Google Sheets/PIN, a weekly examination system, a detailed result management module, a class routine timetable, an official notice board, and a comprehensive admin dashboard.

---

## Key Features

1. **Public Website:**
   - Professional homepage with hero section, dynamic stats, courses showcase, teacher profiles, weekly exams preview, and notice board.
   - Dedicated pages for About Us, Courses (Classes 6–12), Faculty, Weekly Exams, Results, Class Routine, Notices, and Contact Us (Iqbal Road, Kotwali, Chattogram).

2. **Google Sheets & PIN Student Verification:**
   - Acts as the source of truth for student identity, class enrollment, and active/inactive status.
   - Additional secure PIN requirement for private student data.
   - Backend verification logs and rate limiting protection.

3. **Student Portal:**
   - Personalized student dashboard displaying profile details, individual examination results, marks, GPA, position, weekly exam schedules, and class routines.

4. **Comprehensive Admin Dashboard:**
   - Secured admin authentication (`admin@gleamcoaching.com` / `gleam2026`).
   - Full CRUD management for Teachers, Courses, Weekly Exams, Results, Class Routines, Notices, and Student records.
   - Verification logs viewer and Google Apps Script deployment code generator.

---

## Technology Stack

- **Frontend:** Next.js / React SPA, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, Persistent JSON Data Store (Easily interchangeable with Supabase PostgreSQL)
- **Hosting & Deployment:** Vercel-ready

---

## Google Sheets & Apps Script Setup Guide

To connect your Google Sheet as the student verification source:
1. Create a Google Sheet named **GleamCoachingStudents** with columns:
   `Student ID` | `Student Name` | `Class` | `Group` | `Status` | `Verification PIN`
2. Open **Extensions > Apps Script** and paste the provided script from the Admin Dashboard (`Google Apps Script` tab).
3. Deploy as a **Web App** with access set to "Anyone".
4. Set the deployed Web App URL in your environment variables.

---

## Environment Variables (`.env.example`)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_web_app_url
GOOGLE_VERIFICATION_SECRET=your_verification_secret
```
