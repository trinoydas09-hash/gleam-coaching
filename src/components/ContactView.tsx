import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', classLevel: 'Class 10', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque']">
          Contact Gleam Coaching
        </h1>
        <p className="text-slate-600 text-base">
          Visit our campus at Iqbal Road, Kotwali, Chattogram, Bangladesh or reach out to us for admission inquiries and batch schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
              Institute Details
            </h2>

            <ul className="space-y-6 text-sm text-slate-700">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123B2A] flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Location</strong>
                  <span>Iqbal Road, Kotwali, Chattogram, Bangladesh</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123B2A] flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Phone Hotline</strong>
                  <span>+880 1812-345678 / +880 1811-111111</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123B2A] flex items-center justify-center shrink-0 font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Email Address</strong>
                  <span>info@gleamcoaching.edu.bd</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123B2A] flex items-center justify-center shrink-0 font-bold">
                  <Facebook className="w-6 h-6" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold mb-0.5">Official Facebook Group</strong>
                  <a
                    href="https://www.facebook.com/share/g/19cGwwjKXs/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    facebook.com/share/g/19cGwwjKXs/
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Admission Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">
            Send Admission Inquiry
          </h2>

          {formSubmitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Inquiry Received Successfully!</h3>
              <p className="text-sm text-slate-600">
                Thank you for your interest in Gleam Coaching. Our admission office at Iqbal Road, Chattogram will contact you shortly.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="px-6 py-2.5 bg-[#123B2A] text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1812..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Class Level
                </label>
                <select
                  value={formData.classLevel}
                  onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option>Class 6</option>
                  <option>Class 7</option>
                  <option>Class 8</option>
                  <option>Class 9</option>
                  <option>Class 10 (SSC)</option>
                  <option>Class 11 (HSC 1st Year)</option>
                  <option>Class 12 (HSC & Admission)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Inquiries
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify subjects or batch timing preference..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#123B2A] hover:bg-[#0B241B] text-white font-bold rounded-xl transition-colors shadow-md text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Admission Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
