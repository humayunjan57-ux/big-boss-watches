import React from 'react';
import {
  Clock,
  Crown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
  storeSettings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, storeSettings }) => {
  const email = storeSettings?.email || 'bossbigwatches@gmail.com';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';
  const phone2 = storeSettings?.phones?.[1] || '0345 0434786';
  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';
  const whatsapp2 = storeSettings?.whatsAppNumbers?.[1] || '0345 0434786';
  const address = storeSettings?.address || 'Boutique Suite 10, Luxury Horology Pavilion, Beverly Arcade';
  const supportHours = storeSettings?.supportHours || 'Monday – Saturday: 10:00 AM – 8:00 PM PKT';

  return (
    <footer className="bg-[#080808] border-t border-[#C9A227]/25 text-neutral-300">
      {/* Brand Value Pillars / Trust Strip */}
      <div className="border-b border-[#1F1F1F] py-10 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#171717] rounded-sm border border-[#C9A227]/30 text-[#C9A227] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
                5-Year International Warranty
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Full mechanical coverage and certified inspection on all timepieces.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#171717] rounded-sm border border-[#C9A227]/30 text-[#C9A227] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
                Insured White-Glove Shipping
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Complimentary armored courier delivery with live milestone tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#171717] rounded-sm border border-[#C9A227]/30 text-[#C9A227] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
                7-Day Inspection Guarantee
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Examine your timepiece in the privacy of your home with total peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#171717] rounded-sm border border-[#C9A227]/30 text-[#C9A227] shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
                Haute Horology Lineage
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Architectural balance wheels, sapphire glass, and aerospace 316L metallurgy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Business Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              {storeSettings?.logoUrl ? (
                <div className="w-9 h-9 rounded-sm bg-[#171717] border border-[#C9A227] flex items-center justify-center overflow-hidden">
                  <img src={storeSettings.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-sm bg-[#171717] border border-[#C9A227] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#C9A227]" />
                </div>
              )}
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-white">
                {storeSettings?.brandTitle || storeSettings?.businessName || 'BIG BOSS WATCHES'}
              </span>
            </div>

            <p className="font-serif text-sm text-[#C9A227] tracking-widest mt-2 uppercase font-semibold">
              {storeSettings?.slogan || 'TIME, REDEFINED.'}
            </p>
            <p className="text-xs text-[#E5C76B] font-medium tracking-widest mt-0.5">
              {storeSettings?.brandStatement || 'PRECISION. POWER. PRESTIGE.'}
            </p>

            <p className="text-xs text-neutral-400 mt-4 leading-relaxed max-w-sm">
              {storeSettings?.footerAbout || 'BIG BOSS WATCHES designs and manufactures world-class luxury wristwatches forged for titans of industry and connoisseurs of refined precision.'}
            </p>

            <div className="mt-6 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>{supportHours}</span>
              </div>
            </div>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white tracking-[0.2em] uppercase mb-4 text-[#E5C76B]">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Master Catalog (All)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections', 'noir')}
                  className="hover:text-[#C9A227] transition cursor-pointer flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-600 inline-block" />
                  BIG BOSS NOIR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections', 'royal')}
                  className="hover:text-[#C9A227] transition cursor-pointer flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C9A227] inline-block" />
                  BIG BOSS ROYAL
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections', 'featured')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Featured Allocations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collections', 'new')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  2026 Novelties
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Support */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white tracking-[0.2em] uppercase mb-4 text-[#E5C76B]">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('account')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-faq')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Horology FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-shipping')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Shipping & Customs Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy-returns')}
                  className="hover:text-[#C9A227] transition cursor-pointer"
                >
                  Return & Warranty Protocol
                </button>
              </li>
            </ul>
          </div>

          {/* Official Direct Contact */}
          <div>
            <h4 className="font-serif text-xs font-bold text-white tracking-[0.2em] uppercase mb-4 text-[#E5C76B]">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-neutral-400">Direct Support Emails:</p>
                <a
                  href={`mailto:${email}`}
                  className="text-white hover:text-[#C9A227] transition flex items-center gap-1.5 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{email}</span>
                </a>
              </div>

              <div>
                <p className="text-neutral-400">Concierge Telephones:</p>
                <div className="flex flex-col gap-1 mt-1">
                  <a
                    href={`tel:${phone1.replace(/\s+/g, '')}`}
                    className="text-white hover:text-[#C9A227] transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{phone1}</span>
                  </a>
                  <a
                    href={`tel:${phone2.replace(/\s+/g, '')}`}
                    className="text-white hover:text-[#C9A227] transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{phone2}</span>
                  </a>
                </div>
              </div>

              <div>
                <p className="text-neutral-400">WhatsApp VIP Support:</p>
                <div className="flex flex-col gap-1 mt-1">
                  <a
                    href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello BIG BOSS WATCHES Concierge, I need assistance.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp: {whatsapp1}</span>
                  </a>
                  <a
                    href={`https://wa.me/92${whatsapp2.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello BIG BOSS WATCHES Concierge, I need assistance.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:underline flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp: {whatsapp2}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Strip */}
        <div className="border-t border-[#1C1C1C] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            {storeSettings?.copyrightText || `© ${new Date().getFullYear()} ${storeSettings?.brandTitle || 'BIG BOSS WATCHES'}. All Rights Reserved. Precision horology engineered for leadership.`}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('policy-privacy')}
              className="hover:text-neutral-300 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('policy-terms')}
              className="hover:text-neutral-300 transition cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="text-neutral-600 hover:text-[#C9A227] transition cursor-pointer"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
