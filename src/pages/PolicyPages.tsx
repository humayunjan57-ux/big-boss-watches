import React from 'react';
import { ArrowLeft, Clock, FileText, HelpCircle, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { StoreSettings } from '../types';

interface PolicyPagesProps {
  policyType: 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms';
  storeSettings?: StoreSettings;
  onBack: () => void;
  onNavigateContact: () => void;
}

export const PolicyPages: React.FC<PolicyPagesProps> = ({
  policyType,
  storeSettings,
  onBack,
  onNavigateContact,
}) => {
  const email = storeSettings?.email || 'bossbigwatches@gmail.com';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';
  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-[#C9A227] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </button>

        {/* 1. HOROLOGY FAQ */}
        {policyType === 'faq' && (
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                CONCIERGE KNOWLEDGE BASE
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-1">
                Frequently Asked Questions
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Key questions regarding authenticity, movements, delivery, and care.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Are all BIG BOSS WATCHES 100% authentic with genuine automatic movements?',
                  a: 'Yes. Every timepiece in the BIG BOSS NOIR and BIG BOSS ROYAL collections is outfitted with high-beat mechanical or automatic chronometer calibres. We do not manufacture disposable battery quartz replicas.',
                },
                {
                  q: 'What is included in the 5-Year International Warranty?',
                  a: 'Our comprehensive 5-year guarantee protects against any mechanical failure, escapement variance, or craftsmanship defects. In the rare event of an issue, our authorized service centers will restore your watch without charge.',
                },
                {
                  q: 'Can I inspect the watch upon delivery before paying (Cash on Delivery)?',
                  a: 'Yes. In regions where Cash on Delivery is enabled, our insured courier allows you to inspect the unbroken holographic seal, presentation case, and timepiece credentials prior to completing payment.',
                },
                {
                  q: 'How water resistant are the timepieces?',
                  a: 'Our models are hydrostatic tested up to 200M (20 ATM) and 300M (30 ATM) for the Deep Sea Diver series. They are suitable for swimming, maritime activities, and everyday luxury wear.',
                },
                {
                  q: 'What is the standard delivery timeline?',
                  a: 'Orders are dispatched within 24 hours of concierge verification via armored express transport. Typical transit duration is 24 to 48 hours nationwide, and 3 to 5 business days for international destinations.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#131313] border border-[#222222] p-5 rounded-sm space-y-2">
                  <h3 className="font-serif text-sm font-semibold text-white flex items-start gap-2">
                    <span className="text-[#C9A227] font-mono">Q{idx + 1}.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SHIPPING POLICY */}
        {policyType === 'shipping' && (
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                LOGISTICS & ARMORED TRANSIT
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-1">
                White-Glove Shipping Policy
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Our protocol for secure, fully insured timepiece delivery worldwide.
              </p>
            </div>

            <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4 text-xs text-neutral-300 leading-relaxed font-light">
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                1. Complimentary Insured Delivery
              </h3>
              <p>
                Every order placed on BIG BOSS WATCHES qualifies for complimentary armored courier transport. We maintain transit insurance on 100% of the declared horological value until you personally accept the delivery.
              </p>

              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider pt-2">
                2. Milestone Tracking
              </h3>
              <p>
                Upon dispatch from our vault, an individualized tracking reference is attached to your customer account and transmitted to your verified email and phone number.
              </p>

              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider pt-2">
                3. Direct Verification Hand-off
              </h3>
              <p>
                Couriers require a physical signature upon delivery. Packages will not be left unattended at doorsteps under any circumstances.
              </p>
            </div>
          </div>
        )}

        {/* 3. RETURN & WARRANTY POLICY */}
        {policyType === 'returns' && (
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                CLIENT PROTECTION
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-1">
                7-Day Inspection & 5-Year Warranty
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Unconditional peace of mind with every BIG BOSS acquisition.
              </p>
            </div>

            <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4 text-xs text-neutral-300 leading-relaxed font-light">
              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                7-Day Private Inspection Period
              </h3>
              <p>
                We invite you to examine your timepiece in the tranquility of your residence. If you find any optical flaw, sizing discrepancy, or cosmetic concern, you may request an exchange or full refund within 7 days of delivery, provided the protective plastic wraps have not been removed.
              </p>

              <h3 className="font-serif text-sm font-semibold text-white uppercase tracking-wider pt-2">
                5-Year International Movement Guarantee
              </h3>
              <p>
                BIG BOSS WATCHES warrants the mechanical movement against material defects and timing anomalies for five (5) full years from the date of acquisition. All services are performed by master watchmakers utilizing authentic replacement components.
              </p>
            </div>
          </div>
        )}

        {/* 4. PRIVACY POLICY */}
        {policyType === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                SECURITY & DATA STEWARDSHIP
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-1">
                Client Privacy Policy
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Strict confidentiality regarding your identity, orders, and correspondence.
              </p>
            </div>

            <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4 text-xs text-neutral-300 leading-relaxed font-light">
              <p>
                At BIG BOSS WATCHES, client confidentiality is paramount. We collect personal details strictly necessary to fulfill your orders, provide warranty coverage, and address concierge inquiries.
              </p>
              <p>
                We never monetize, sell, rent, or distribute client identity data to third-party marketing entities. All database transactions are safeguarded by enterprise Firebase security rules and 256-bit encryption.
              </p>
            </div>
          </div>
        )}

        {/* 5. TERMS & CONDITIONS */}
        {policyType === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-[#222222] pb-6">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                LEGAL FRAMEWORK
              </span>
              <h1 className="font-serif text-3xl font-bold text-white mt-1">
                Terms and Conditions of Sale
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Official terms governing timepiece acquisitions from BIG BOSS WATCHES.
              </p>
            </div>

            <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4 text-xs text-neutral-300 leading-relaxed font-light">
              <p>
                By placing an order on BIG BOSS WATCHES, you agree to these Terms. All orders are subject to inventory verification and confirmation by our concierge desk.
              </p>
              <p>
                We reserve the right to limit order quantities to preserve limited allocations for genuine horology collectors. Prices are authoritative as stated at the time of confirmed order placement.
              </p>
            </div>
          </div>
        )}

        {/* Contact Concierge Banner */}
        <div className="bg-[#141414] border border-[#252525] p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-sm font-semibold text-white">
              Have Specific Inquiries Regarding Our Policies?
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Contact our client concierge desk for personalized clarification.
            </p>
          </div>
          <button
            onClick={onNavigateContact}
            className="px-5 py-2.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer shrink-0"
          >
            Contact Concierge
          </button>
        </div>
      </div>
    </div>
  );
};
