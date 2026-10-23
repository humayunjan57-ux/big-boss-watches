import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Crown,
  FileQuestion,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createContactMessage } from '../services/storeService';
import { InquiryCategory, StoreSettings } from '../types';

interface ContactPageProps {
  storeSettings?: StoreSettings;
  initialOrderNumber?: string;
  onNavigateFAQ: () => void;
}

const CATEGORIES: InquiryCategory[] = [
  'Product Information',
  'Order Status',
  'Shipping and Delivery',
  'Returns and Exchanges',
  'Payment Issues',
  'Warranty and Repairs',
  'Complaints and Feedback',
  'Business Partnerships',
  'Other Questions',
];

export const ContactPage: React.FC<ContactPageProps> = ({
  storeSettings,
  initialOrderNumber = '',
  onNavigateFAQ,
}) => {
  const { currentUser, userProfile } = useAuth();

  const businessName = storeSettings?.businessName || 'BIG BOSS WATCHES';
  const slogan = storeSettings?.slogan || 'TIME, REDEFINED.';
  const email = storeSettings?.email || 'bossbigwatches@gmail.com';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';
  const phone2 = storeSettings?.phones?.[1] || '0345 0434786';
  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';
  const whatsapp2 = storeSettings?.whatsAppNumbers?.[1] || '0345 0434786';
  const address = storeSettings?.address || 'Boutique Suite 10, Luxury Horology Pavilion, Beverly Arcade';
  const supportHours = storeSettings?.supportHours || 'Monday – Saturday: 10:00 AM – 8:00 PM PKT';
  const responseTime = storeSettings?.responseTime || 'Typically under 2 hours';

  // Form Fields
  const [name, setName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [userEmail, setUserEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [category, setCategory] = useState<InquiryCategory>(
    initialOrderNumber ? 'Order Status' : 'Product Information'
  );
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [subject, setSubject] = useState(initialOrderNumber ? `Inquiry on Order #${initialOrderNumber}` : '');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setError('Please provide a valid email address for our reply.');
      return;
    }
    if (!subject.trim()) {
      setError('Please provide an inquiry subject.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide a descriptive message (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createContactMessage({
        name: name.trim(),
        email: userEmail.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        category,
        orderNumber: orderNumber.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSubmittedRef(result.referenceNumber);
      setMessage('');
      if (!initialOrderNumber) {
        setSubject('');
        setOrderNumber('');
      }
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setError(err.message || 'Unable to transmit inquiry. Please contact our concierge directly via WhatsApp or phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1A1A1A] border border-[#C9A227]/40 text-[#E5C76B] text-[11px] font-semibold tracking-[0.25em] uppercase mb-4">
            <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>VIP CLIENT CONCIERGE & SUPPORT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-white">
            {businessName}
          </h1>
          <p className="font-serif text-sm tracking-[0.3em] uppercase text-[#C9A227] font-semibold mt-2">
            {slogan}
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 mt-4 leading-relaxed max-w-xl mx-auto">
            Our private client concierges and master horologists are available to assist with technical specifications, order logistics, warranty care, or custom allocations.
          </p>
        </div>

        {/* Quick Contact Action Buttons Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {/* Email Button */}
          <a
            href={`mailto:${email}`}
            className="p-5 bg-[#141414] border border-[#262626] hover:border-[#C9A227] rounded-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#1E1E1E] text-[#C9A227] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Send an Email
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 truncate">{email}</p>
            </div>
            <span className="text-[10px] text-[#C9A227] font-semibold uppercase tracking-wider mt-4 block">
              Response: {responseTime} →
            </span>
          </a>

          {/* WhatsApp Primary */}
          <a
            href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello BIG BOSS WATCHES, I need concierge assistance.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-[#141414] border border-[#25D366]/30 hover:border-[#25D366] rounded-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#1a281e] text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Chat on WhatsApp 1
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 font-mono">{whatsapp1}</p>
            </div>
            <span className="text-[10px] text-[#25D366] font-semibold uppercase tracking-wider mt-4 block">
              Instant Live Chat →
            </span>
          </a>

          {/* WhatsApp Secondary */}
          <a
            href={`https://wa.me/92${whatsapp2.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello BIG BOSS WATCHES, I need concierge assistance.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-[#141414] border border-[#25D366]/30 hover:border-[#25D366] rounded-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#1a281e] text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Chat on WhatsApp 2
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 font-mono">{whatsapp2}</p>
            </div>
            <span className="text-[10px] text-[#25D366] font-semibold uppercase tracking-wider mt-4 block">
              Direct Senior Support →
            </span>
          </a>

          {/* Telephone Hotline */}
          <a
            href={`tel:${phone1.replace(/\s+/g, '')}`}
            className="p-5 bg-[#141414] border border-[#262626] hover:border-[#C9A227] rounded-sm transition group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-[#1E1E1E] text-[#C9A227] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Call VIP Concierge
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 font-mono">{phone1}</p>
            </div>
            <span className="text-[10px] text-[#C9A227] font-semibold uppercase tracking-wider mt-4 block">
              {supportHours.split(':')[0]} →
            </span>
          </a>
        </div>

        {/* Main Form and Boutique Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8">
            <div className="border-b border-[#202020] pb-4 mb-6">
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                Direct Client Inquiry Dossier
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Submissions are logged directly into our authorized concierge system.
              </p>
            </div>

            {submittedRef ? (
              <div className="p-8 bg-[#0F1410] border border-emerald-700/60 rounded-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Inquiry Successfully Transmitted
                </h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Your communication has been securely filed. Our client support team will examine your dossier and reply to <strong className="text-white">{userEmail}</strong>.
                </p>

                <div className="p-3 bg-black/60 border border-emerald-800/50 rounded-sm inline-block">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                    Assigned Reference ID:
                  </span>
                  <span className="font-mono text-sm font-bold text-[#E5C76B]">
                    {submittedRef}
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(`Hello BIG BOSS WATCHES, I submitted inquiry reference ${submittedRef}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] text-black text-xs font-bold uppercase rounded-sm flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded-sm"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-red-950/70 border border-red-800 text-red-200 rounded flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Humayun Jan"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as InquiryCategory)}
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Order Reference # (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g. BBW-2026-10294"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Subject Summary *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Inquiring regarding Big Boss Noir Sovereign Chronograph"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                      Detailed Message *
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {message.length}/5000 characters
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    maxLength={5000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your request in detail. If you are inquiring about a particular timepiece or custom strap fitting, include all pertinent information."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-white focus:outline-none placeholder-neutral-600 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit Inquiry to Concierge'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Boutique Information & FAQ Link (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-lg font-bold text-white border-b border-[#202020] pb-3">
                Official Boutique Credentials
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider">
                      Physical Flagship Address
                    </h4>
                    <p className="text-neutral-400 mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider">
                      Concierge Operating Hours
                    </h4>
                    <p className="text-neutral-400 mt-0.5">{supportHours}</p>
                    <p className="text-[#C9A227] text-[11px] mt-0.5">
                      Average reply time: {responseTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider">
                      Direct Support Email
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-[#E5C76B] hover:underline font-mono mt-0.5 block"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white uppercase tracking-wider">
                      Official Telephones & WhatsApp
                    </h4>
                    <div className="space-y-1 mt-1 font-mono">
                      <p className="text-white">
                        Line 1: <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-[#C9A227]">{phone1}</a>
                      </p>
                      <p className="text-white">
                        Line 2: <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-[#C9A227]">{phone2}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="pt-4 border-t border-[#202020] text-[11px] text-neutral-500 leading-relaxed">
                <p>
                  Your submitted information is protected under strict privacy safeguards. We only utilize your contact data to resolve your specific inquiry.
                </p>
              </div>
            </div>

            {/* Quick FAQ Link Box */}
            <div className="bg-[#141414] border border-[#252525] p-6 rounded-sm flex items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-sm font-bold text-white">
                  Looking for Instant Answers?
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Read our Horology FAQ regarding warranty, water resistance, and delivery timelines.
                </p>
              </div>
              <button
                onClick={onNavigateFAQ}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-[#C9A227] font-semibold uppercase tracking-wider rounded-sm transition shrink-0 cursor-pointer"
              >
                Read FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
