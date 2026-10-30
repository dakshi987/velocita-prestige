import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState('');
  const [errorResponse, setErrorResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessResponse('');
    setErrorResponse('');

    try {
      const res = await api.submitContact({
        name,
        email,
        phone: phone || undefined,
        subject,
        message,
      });

      setSuccessResponse(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('[Contact Form] Failed to submit contact request:', err);
      setErrorResponse(err.message || 'Failed to submit contact request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
          Concierge Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Contact Our Executive Desk
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Whether organizing private airport transfers, long-term corporate fleet leasing, or custom vehicle requests, our dedicated dispatch is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Details & Hubs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Direct Inquiries</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block text-sm">+1 (800) 555-VELO</span>
                  <span className="text-slate-400">Toll-free 24-hour dispatch & roadside assistance</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block text-sm">concierge@velocita.com</span>
                  <span className="text-slate-400">Response guaranteed within 2 business hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Operating Hours</span>
                  <span className="text-slate-500">24 Hours / 7 Days a week / 365 Days a year</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Primary Fleet Hubs</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Downtown Center Terminal</p>
                  <p className="text-slate-500">700 Grand Avenue, Financial District</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">International Airport Hub (Terminal 2 VIP)</p>
                  <p className="text-slate-500">Curbside delivery & private hangar staging</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Beverly Luxury Pavilion</p>
                  <p className="text-slate-500">300 Rodeo Driveway West</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Functional Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-slate-200/90 shadow-2xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Send a Message</h2>
          <p className="text-xs text-slate-500 mb-6">
            All inquiries are directly cataloged and assigned to our on-duty fleet concierge.
          </p>

          {successResponse && (
            <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successResponse}</span>
            </div>
          )}

          {errorResponse && (
            <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorResponse}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="E.g., Corporate booking inquiry"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your requirements, dates, or custom vehicle needs..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:bg-slate-400"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
