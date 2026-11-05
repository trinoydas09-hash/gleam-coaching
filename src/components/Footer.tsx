import React from 'react';
import { MapPin, Phone, Mail, Facebook, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#0B241B] text-emerald-100/90 pt-16 pb-12 border-t border-[#123B2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_4f62b769.png"
              alt="Gleam Coaching Logo"
              className="w-12 h-12 rounded-lg object-cover border border-emerald-500/30"
            />
            <div>
              <span className="text-lg font-bold text-white block font-['Bricolage_Grotesque']">
                GLEAM COACHING
              </span>
              <span className="text-xs text-emerald-400">Learn Today. Lead Tomorrow.</span>
            </div>
          </div>
          <p className="text-sm text-emerald-200/80 leading-relaxed">
            Premier coaching institute in Chattogram offering rigorous academic mentorship, weekly examinations, and personalized student guidance from Class 6 to Class 12.
          </p>
          <div className="pt-2">
            <a
              href="https://www.facebook.com/share/g/19cGwwjKXs/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#123B2A] text-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors border border-emerald-700/50"
            >
              <Facebook className="w-4 h-4 text-emerald-400" />
              Join Facebook Group
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Bricolage_Grotesque']">
            Quick Navigation
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => setCurrentView('about')} className="hover:text-white transition-colors">
                About Us & Philosophy
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('courses')} className="hover:text-white transition-colors">
                Academic Courses (Class 6–12)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('teachers')} className="hover:text-white transition-colors">
                Our Expert Teachers
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('exams')} className="hover:text-white transition-colors">
                Weekly Examination Schedule
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('results')} className="hover:text-white transition-colors">
                Student Result Verification
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Classes & Subjects */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Bricolage_Grotesque']">
            Programs Offered
          </h3>
          <ul className="space-y-2.5 text-sm text-emerald-200/80">
            <li>Class 6 & 7 Foundation</li>
            <li>Class 8 Junior Scholarship Prep</li>
            <li>Class 9 Science & Commerce</li>
            <li>Class 10 SSC Candidate Coaching</li>
            <li>Class 11 & 12 HSC & Admission Prep</li>
            <li>All Academic Subjects (Math, Physics, Chem, Bio, English, ICT)</li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-['Bricolage_Grotesque']">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-emerald-200/80">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Iqbal Road, Kotwali, Chattogram, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>+880 1812-345678 / +880 1811-111111</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>info@gleamcoaching.edu.bd</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#123B2A] text-center text-xs text-emerald-300/70 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Gleam Coaching, Chattogram. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Main Instructor: Joy Gomes Jonerthon</span>
          <span>·</span>
          <span>Learn Today. Lead Tomorrow.</span>
        </p>
      </div>
    </footer>
  );
};
