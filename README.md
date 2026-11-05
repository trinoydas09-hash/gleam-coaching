# Gleam Coaching

Website and institute-management portal for Gleam Coaching, Iqbal Road, Kotwali, Chattogram, Bangladesh.

**Tagline:** Learn Today. Lead Tomorrow.  
**Classes:** 6–12  
**Faculty:** Joy Gomes Jonerthon, Joy Das Soyrov, Victoria, Avishek, and Arpita Chakravorty.

## Technology

- React, TypeScript, Vite, Tailwind CSS
- Supabase Database, Auth, Storage, and Edge Functions
- Vercel hosting

## Main areas

- Public pages: Home, About, Courses, Teachers, Weekly Exams, Results, Class Routine, Notices, and Contact
- Student Portal: Student ID and six-digit PIN verification through the `student-portal-login` Supabase Edge Function
- Admin dashboard: Teachers, Courses, Exams, Results, Routines, Notices, Testimonials, Farewell Gallery, Students, and Website Settings

## Supabase configuration

The browser app uses only these public environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Never place a Supabase service-role key or any server secret in a browser environment variable. The student login Edge Function reads its service-role secret on the server side.

## Current integration limits

- Student records and PIN verification are managed in Supabase.
- Google Sheets URLs can be saved as references in supported forms, but automatic Google Sheets row import/synchronization is not enabled.
- The verification-log viewer is not connected to the Supabase audit table yet.
- Admin uploads use the configured Supabase Storage buckets.

## Build

```bash
npm install
npm run build
npm run lint
```

## Deployment

The current working branch is `supabase-migration-foundation`. Preview deployment and production release are separate steps. Do not describe a Preview deployment as a public Production launch.
