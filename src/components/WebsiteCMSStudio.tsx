import React, { useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Crown,
  Edit3,
  ExternalLink,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { FaqItem, StoreSettings, TestimonialItem } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

export const UPLOADED_WATCH_ASSETS = [
  { url: '/assets/aistudio/image_e63d280a.png', label: 'Noir Chronograph (Front Dial)' },
  { url: '/assets/aistudio/image_ea2bcf93.png', label: 'Tourbillon Exhibition (Caseback)' },
  { url: '/assets/aistudio/image_b3ea3724.png', label: 'Royal Imperator Gold Watch' },
  { url: '/assets/aistudio/image_0bde5378.png', label: 'Noir Sovereign DLC Steel' },
  { url: '/assets/aistudio/image_1d75ed49.png', label: 'Gold Fluted Bezel Timepiece' },
  { url: '/assets/aistudio/image_999d947a.png', label: 'Heritage Atelier Watchmaker' },
  { url: '/assets/aistudio/image_b3b7c3da.png', label: 'Sapphire Crystal Luxury Dial' },
  { url: '/assets/aistudio/image_cb8d0577.png', label: 'Executive Luxury Box Presentation' },
];

export const HOROLOGY_STOCK_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=90', label: 'Cinematic Noir Horology (Dark)' },
  { url: 'https://images.unsplash.com/photo-1547996160-71dfabbce574?auto=format&fit=crop&w=1400&q=85', label: 'Royal Gold Luxury Watch (Warm)' },
  { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85', label: 'Chronograph Stainless Steel' },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85', label: 'Tourbillon Skeleton Dial' },
  { url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1000&q=85', label: 'Geneva Atelier Precision Movement' },
];

interface WebsiteCMSStudioProps {
  settings: StoreSettings;
  onSave: (updated: StoreSettings) => Promise<void>;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
}

export const WebsiteCMSStudio: React.FC<WebsiteCMSStudioProps> = ({
  settings,
  onSave,
  saving,
  saveSuccess,
  saveError,
}) => {
  // Local state for all fields
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  // Gallery Picker Modal State
  const [galleryTargetKey, setGalleryTargetKey] = useState<string | null>(null);

  // Accordion active sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    hero: true,
    announcement: false,
    collections: false,
    code: false,
    concierge: false,
    about: false,
    testimonials: false,
    faqs: false,
    footer: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFieldChange = (key: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedChange = (parent: keyof StoreSettings, child: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value,
      },
    }));
  };

  const handleApplyGalleryImage = (url: string) => {
    if (!galleryTargetKey) return;
    handleFieldChange(galleryTargetKey as keyof StoreSettings, url);
    setGalleryTargetKey(null);
  };

  // Testimonials management
  const handleAddTestimonial = () => {
    const newId = `t-${Date.now()}`;
    const newTestimonial: TestimonialItem = {
      id: newId,
      author: 'VIP Collector',
      location: 'Geneva, Switzerland',
      watchModel: 'Big Boss Noir Sovereign',
      quote: 'Exceptional craftsmanship and unmatched wrist presence. Delivered with absolute elegance.',
      rating: 5,
    };
    const updated = [...(formData.testimonials || []), newTestimonial];
    handleFieldChange('testimonials', updated);
    setOpenSections((prev) => ({ ...prev, testimonials: true }));
  };

  const handleUpdateTestimonial = (id: string, field: keyof TestimonialItem, value: any) => {
    const list = formData.testimonials || [];
    const updated = list.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    handleFieldChange('testimonials', updated);
  };

  const handleDeleteTestimonial = (id: string) => {
    const list = formData.testimonials || [];
    handleFieldChange('testimonials', list.filter((item) => item.id !== id));
  };

  // FAQ management
  const handleAddFaq = () => {
    const newId = `faq-${Date.now()}`;
    const newFaq: FaqItem = {
      id: newId,
      category: 'General',
      question: 'How do I place an inquiry or bespoke order?',
      answer: 'Reach out to our VIP Concierge via phone or direct WhatsApp for immediate allocation support.',
    };
    const updated = [...(formData.faqs || []), newFaq];
    handleFieldChange('faqs', updated);
    setOpenSections((prev) => ({ ...prev, faqs: true }));
  };

  const handleUpdateFaq = (id: string, field: keyof FaqItem, value: any) => {
    const list = formData.faqs || [];
    const updated = list.map((item) => (item.id === id ? { ...item, [field]: value } : item));
    handleFieldChange('faqs', updated);
  };

  const handleDeleteFaq = (id: string) => {
    const list = formData.faqs || [];
    handleFieldChange('faqs', list.filter((item) => item.id !== id));
  };

  // Trust Badges management
  const handleUpdateTrustBadge = (index: number, val: string) => {
    const badges = [...(formData.trustBadges || ['Complimentary Insured Courier', '5-Year International Warranty', 'Cash on Delivery Available'])];
    badges[index] = val;
    handleFieldChange('trustBadges', badges);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Reusable Image Field with Instant Preview & Gallery Picker & Client-Side Auto-Compression
  const renderImageField = (
    label: string,
    key: keyof StoreSettings,
    helperText: string,
    placeholder: string
  ) => {
    const currentValue = (formData[key] as string) || '';
    return (
      <div className="space-y-2 p-3 bg-[#0E0E0E] border border-neutral-800 rounded-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{label}</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Device Upload with Instant Auto-Compression */}
            <label
              htmlFor={`upload-field-${key}`}
              className="text-[11px] text-white hover:text-[#C9A227] font-semibold flex items-center gap-1 bg-[#1A1A1A] hover:bg-[#252525] px-2.5 py-1 rounded border border-neutral-700 transition cursor-pointer"
              title="Upload photo from phone or computer with auto-compression"
            >
              <Upload className="w-3 h-3 text-[#C9A227]" />
              <span>Upload Photo</span>
            </label>
            <input
              type="file"
              id={`upload-field-${key}`}
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const compressed = await compressImageFile(file, {
                    maxWidth: key === 'logoUrl' || key === 'crestUrl' ? 600 : 1200,
                    maxHeight: key === 'logoUrl' || key === 'crestUrl' ? 600 : 1200,
                    quality: 0.82,
                  });
                  handleFieldChange(key, compressed);
                } catch (err: any) {
                  alert('Image upload notice: ' + err.message);
                }
              }}
            />

            {/* Curated Watch Photo Presets */}
            <button
              type="button"
              onClick={() => setGalleryTargetKey(key as string)}
              className="text-[11px] text-[#E5C76B] hover:text-[#C9A227] font-semibold flex items-center gap-1 bg-[#1A1A1A] hover:bg-[#252525] px-2.5 py-1 rounded border border-[#C9A227]/30 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#C9A227]" />
              <span>Watch Catalog Photos</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-[#070707] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white placeholder-neutral-600 focus:border-[#C9A227] focus:outline-none"
          />
          {currentValue && (
            <button
              type="button"
              onClick={() => handleFieldChange(key, '')}
              className="p-2 text-neutral-400 hover:text-red-400 border border-neutral-800 rounded hover:bg-neutral-800 transition"
              title="Clear Image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Visual Preview */}
        {currentValue ? (
          <div className="mt-2 flex items-center gap-3 p-2 bg-[#141414] rounded border border-[#C9A227]/30">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden bg-black shrink-0 border border-neutral-700">
              <img
                src={currentValue}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Live Preview Active</span>
              </p>
              <p className="text-[10px] text-neutral-400 truncate font-mono mt-0.5">{currentValue}</p>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-neutral-500 italic">{helperText}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-28">
      {/* CMS Header & Mobile Quick Navigation */}
      <div className="bg-[#121212] border border-[#C9A227]/40 rounded-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A227] block">
              FULL VISUAL & CONTENT CONTROL
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide mt-0.5">
              Website CMS & Visuals Studio
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Every picture, headline, badge, story paragraph, logo, and phone number can be customized here. Changes sync directly to the live site via Firestore.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                const allTrue: Record<string, boolean> = {};
                Object.keys(openSections).forEach((k) => (allTrue[k] = true));
                setOpenSections(allTrue);
              }}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-neutral-700 text-xs text-neutral-300 rounded cursor-pointer transition"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={() => {
                const allFalse: Record<string, boolean> = {};
                Object.keys(openSections).forEach((k) => (allFalse[k] = false));
                setOpenSections(allFalse);
              }}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-neutral-700 text-xs text-neutral-300 rounded cursor-pointer transition"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Quick jump pills for Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-[#222222] no-scrollbar">
          {[
            { id: 'brand', label: '🎨 Identity & Logo' },
            { id: 'hero', label: '🌟 Hero Banner' },
            { id: 'announcement', label: '📢 Announcement' },
            { id: 'collections', label: '⏱️ Collections' },
            { id: 'code', label: '🏛️ Craftsmanship' },
            { id: 'concierge', label: '👑 VIP Support' },
            { id: 'about', label: '📖 About Story' },
            { id: 'testimonials', label: '💬 Reviews' },
            { id: 'faqs', label: '❓ FAQs' },
            { id: 'footer', label: '📜 Footer' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setOpenSections((prev) => ({ ...prev, [pill.id]: true }));
                const el = document.getElementById(`section-${pill.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3 py-1 text-[11px] font-semibold whitespace-nowrap rounded border transition cursor-pointer shrink-0 ${
                openSections[pill.id]
                  ? 'bg-[#C9A227]/20 text-[#E5C76B] border-[#C9A227]/60'
                  : 'bg-[#181818] text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Save Success / Error Notice */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-600 text-emerald-200 rounded-sm flex items-center gap-2.5 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Website content successfully updated!</p>
            <p className="text-[11px] text-emerald-300">All public visitors and pages now see these new pictures and text.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-950/90 border border-red-600 text-red-200 rounded-sm flex items-center gap-2.5 text-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="font-bold">Error saving content:</p>
            <p className="text-[11px] text-red-300">{saveError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ========================================================================= */}
        {/* SECTION 1: BRAND IDENTITY & LOGOS */}
        {/* ========================================================================= */}
        <div id="section-brand" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Brand Identity, Logo & Emblems
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Custom Logo URL, Crest Coat of Arms, Brand Names & Slogans
                </p>
              </div>
            </div>
            {openSections.brand ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.brand && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderImageField(
                  'Custom Brand Logo URL',
                  'logoUrl',
                  'Leave blank to use the signature 24K Gold Crown insignia.',
                  'https://... or /assets/aistudio/...'
                )}

                {renderImageField(
                  'Crest / Coat of Arms Emblem URL',
                  'crestUrl',
                  'Appears on top hero badge and luxury authentication stamps.',
                  'https://... or /assets/aistudio/...'
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Primary Brand Title
                  </label>
                  <input
                    type="text"
                    value={formData.brandTitle || ''}
                    onChange={(e) => handleFieldChange('brandTitle', e.target.value)}
                    placeholder="BIG BOSS"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Brand Subtitle / Atelier
                  </label>
                  <input
                    type="text"
                    value={formData.brandSubtitle || ''}
                    onChange={(e) => handleFieldChange('brandSubtitle', e.target.value)}
                    placeholder="WATCHES • GENEVA"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Signature Slogan
                  </label>
                  <input
                    type="text"
                    value={formData.slogan || ''}
                    onChange={(e) => handleFieldChange('slogan', e.target.value)}
                    placeholder="TIME, REDEFINED."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Three-Word Creed / Statement
                  </label>
                  <input
                    type="text"
                    value={formData.brandStatement || ''}
                    onChange={(e) => handleFieldChange('brandStatement', e.target.value)}
                    placeholder="PRECISION. POWER. PRESTIGE."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: CINEMATIC HERO SECTION */}
        {/* ========================================================================= */}
        <div id="section-hero" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('hero')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Cinematic Hero Showcase
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Background Banner Image, Main Headlines, CTAs & Trust Badges
                </p>
              </div>
            </div>
            {openSections.hero ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.hero && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              {renderImageField(
                'Hero Showcase Background Image URL',
                'heroImageUrl',
                'Large cinematic background image displayed behind the main homepage title.',
                'https://... or /assets/aistudio/...'
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Top Eyebrow Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroBadge || ''}
                    onChange={(e) => handleFieldChange('heroBadge', e.target.value)}
                    placeholder="GENEVA HOROLOGICAL EXCELLENCE • 2026 ALLOCATIONS"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Hero Main Headline (Displayed under Brand Name)
                  </label>
                  <input
                    type="text"
                    value={formData.heroHeadline || ''}
                    onChange={(e) => handleFieldChange('heroHeadline', e.target.value)}
                    placeholder="TIME, REDEFINED."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Hero Story / Descriptive Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.heroDescription || ''}
                  onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                  placeholder="Engineered for modern leaders who command destiny..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroPrimaryBtnText || ''}
                    onChange={(e) => handleFieldChange('heroPrimaryBtnText', e.target.value)}
                    placeholder="Shop All Timepieces"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroSecondaryBtnText || ''}
                    onChange={(e) => handleFieldChange('heroSecondaryBtnText', e.target.value)}
                    placeholder="Explore Collections"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-[#222222] pt-3 space-y-2">
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Hero Trust Badges (3 items)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-neutral-400 block mb-1">Badge #{idx + 1}</span>
                      <input
                        type="text"
                        value={formData.trustBadges?.[idx] || ''}
                        onChange={(e) => handleUpdateTrustBadge(idx, e.target.value)}
                        placeholder={`Trust Badge ${idx + 1}`}
                        className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: TOP BAR & ANNOUNCEMENT BANNER */}
        {/* ========================================================================= */}
        <div id="section-announcement" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('announcement')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Top Bar & Announcement Marquee
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Header Tagline, Gold Marquee Ticker, and Instant Contact Shortcuts
                </p>
              </div>
            </div>
            {openSections.announcement ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.announcement && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Top Header Geneva Tagline
                </label>
                <input
                  type="text"
                  value={formData.topBarTagline || ''}
                  onChange={(e) => handleFieldChange('topBarTagline', e.target.value)}
                  placeholder="GENEVA ATELIER • OFFICIAL BOUTIQUE"
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* Announcement Banner Toggle */}
              <div className="p-4 bg-[#0E0E0E] rounded border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-xs">Enable Golden Announcement Marquee</h4>
                    <p className="text-[11px] text-neutral-400">
                      Displays a golden highlight banner at the very top of the website.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.announcementActive || false}
                    onChange={(e) => handleFieldChange('announcementActive', e.target.checked)}
                    className="w-5 h-5 accent-[#C9A227] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                    Announcement Text
                  </label>
                  <input
                    type="text"
                    value={formData.announcementText || ''}
                    onChange={(e) => handleFieldChange('announcementText', e.target.value)}
                    placeholder="e.g. COMPLIMENTARY INSURED WORLDWIDE EXPRESS DISPATCH THIS WEEK"
                    className="w-full bg-[#070707] border border-neutral-700 rounded py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: PRINCIPAL COLLECTIONS (NOIR & ROYAL) */}
        {/* ========================================================================= */}
        <div id="section-collections" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('collections')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  The Two Pillars: Noir & Royal Collections
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Card Pictures, Subtitles, and Detailed Collection Lore
                </p>
              </div>
            </div>
            {openSections.collections ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.collections && (
            <div className="p-4 sm:p-6 space-y-6 bg-[#141414]">
              {/* Overall Section Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Section Subtitle Badge
                  </label>
                  <input
                    type="text"
                    value={formData.collectionsSectionSubtitle || ''}
                    onChange={(e) => handleFieldChange('collectionsSectionSubtitle', e.target.value)}
                    placeholder="CURATED MASTER SERIES"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    value={formData.collectionsSectionTitle || ''}
                    onChange={(e) => handleFieldChange('collectionsSectionTitle', e.target.value)}
                    placeholder="The Two Pillars of Prestige"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              {/* BIG BOSS NOIR CARD */}
              <div className="p-4 bg-[#0E0E0E] border border-neutral-800 rounded-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#CCCCCC] block">
                  Series 01: BIG BOSS NOIR (Dark Stealth)
                </span>
                {renderImageField(
                  'Noir Showcase Card Image URL',
                  'noirImageUrl',
                  'Hero picture for the Big Boss Noir collection card.',
                  'https://... or /assets/aistudio/...'
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.noirTitle || ''}
                      onChange={(e) => handleFieldChange('noirTitle', e.target.value)}
                      placeholder="BIG BOSS NOIR"
                      className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.noirSubtitle || ''}
                      onChange={(e) => handleFieldChange('noirSubtitle', e.target.value)}
                      placeholder="Minimalist. Dark. Modern. Sophisticated."
                      className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Description Lore</label>
                  <textarea
                    rows={2}
                    value={formData.noirDescription || ''}
                    onChange={(e) => handleFieldChange('noirDescription', e.target.value)}
                    placeholder="Stealth forged carbon, DLC matte finishes..."
                    className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* BIG BOSS ROYAL CARD */}
              <div className="p-4 bg-[#14120B] border border-[#C9A227]/30 rounded-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E5C76B] block">
                  Series 02: BIG BOSS ROYAL (18K Imperial Gold)
                </span>
                {renderImageField(
                  'Royal Showcase Card Image URL',
                  'royalImageUrl',
                  'Hero picture for the Big Boss Royal collection card.',
                  'https://... or /assets/aistudio/...'
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.royalTitle || ''}
                      onChange={(e) => handleFieldChange('royalTitle', e.target.value)}
                      placeholder="BIG BOSS ROYAL"
                      className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.royalSubtitle || ''}
                      onChange={(e) => handleFieldChange('royalSubtitle', e.target.value)}
                      placeholder="Premium. Bold. Prestigious. Classic."
                      className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Description Lore</label>
                  <textarea
                    rows={2}
                    value={formData.royalDescription || ''}
                    onChange={(e) => handleFieldChange('royalDescription', e.target.value)}
                    placeholder="Rich 18K yellow and rose gold PVD electroplating..."
                    className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: CRAFTSMANSHIP & BIG BOSS CODE */}
        {/* ========================================================================= */}
        <div id="section-code" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('code')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  The Big Boss Code & Craftsmanship
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Horology Standards, 3 Metallurgy & Sapphire Pillars, Atelier Lore
                </p>
              </div>
            </div>
            {openSections.code ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.code && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Section Eyebrow
                  </label>
                  <input
                    type="text"
                    value={formData.craftsmanshipBadge || ''}
                    onChange={(e) => handleFieldChange('craftsmanshipBadge', e.target.value)}
                    placeholder="THE BIG BOSS CODE"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={formData.craftsmanshipTitle || ''}
                    onChange={(e) => handleFieldChange('craftsmanshipTitle', e.target.value)}
                    placeholder="Crafted Without Compromise."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Craftsmanship Statement
                </label>
                <textarea
                  rows={2}
                  value={formData.craftsmanshipDesc || ''}
                  onChange={(e) => handleFieldChange('craftsmanshipDesc', e.target.value)}
                  placeholder="We reject mass-produced mediocrity..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                />
              </div>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-[#0E0E0E] rounded border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-[#C9A227] font-bold uppercase">Pillar 1: Metallurgy</span>
                  <input
                    type="text"
                    value={formData.pillar1Title || ''}
                    onChange={(e) => handleFieldChange('pillar1Title', e.target.value)}
                    placeholder="Aerospace-Grade Metallurgy"
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={formData.pillar1Desc || ''}
                    onChange={(e) => handleFieldChange('pillar1Desc', e.target.value)}
                    placeholder="Solid 316L medical stainless steel..."
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-[11px] text-neutral-300"
                  />
                </div>

                <div className="p-3 bg-[#0E0E0E] rounded border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-[#C9A227] font-bold uppercase">Pillar 2: Crystal</span>
                  <input
                    type="text"
                    value={formData.pillar2Title || ''}
                    onChange={(e) => handleFieldChange('pillar2Title', e.target.value)}
                    placeholder="Double-Curved Sapphire"
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={formData.pillar2Desc || ''}
                    onChange={(e) => handleFieldChange('pillar2Desc', e.target.value)}
                    placeholder="Diamond-hardness sapphire crystal..."
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-[11px] text-neutral-300"
                  />
                </div>

                <div className="p-3 bg-[#0E0E0E] rounded border border-neutral-800 space-y-2">
                  <span className="text-[10px] text-[#C9A227] font-bold uppercase">Pillar 3: Calibre</span>
                  <input
                    type="text"
                    value={formData.pillar3Title || ''}
                    onChange={(e) => handleFieldChange('pillar3Title', e.target.value)}
                    placeholder="Up to 72 Hours Power Reserve"
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={formData.pillar3Desc || ''}
                    onChange={(e) => handleFieldChange('pillar3Desc', e.target.value)}
                    placeholder="High-beat automatic calibres tested..."
                    className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-[11px] text-neutral-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 6: VIP CONCIERGE, WHATSAPP & HOTLINES */}
        {/* ========================================================================= */}
        <div id="section-concierge" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('concierge')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#25D366] flex items-center justify-center border border-[#25D366]/40">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  VIP Concierge & Acquisition
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Direct Phone Numbers, WhatsApp Links & Cash on Delivery Policies
                </p>
              </div>
            </div>
            {openSections.concierge ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.concierge && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Primary Concierge Phone (Line 1)
                  </label>
                  <input
                    type="text"
                    value={formData.phones?.[0] || ''}
                    onChange={(e) => {
                      const p = [...(formData.phones || [])];
                      p[0] = e.target.value;
                      handleFieldChange('phones', p);
                    }}
                    placeholder="03098962803"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Secondary Concierge Phone (Line 2)
                  </label>
                  <input
                    type="text"
                    value={formData.phones?.[1] || ''}
                    onChange={(e) => {
                      const p = [...(formData.phones || [])];
                      p[1] = e.target.value;
                      handleFieldChange('phones', p);
                    }}
                    placeholder="0345 0434786"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    WhatsApp Direct Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsAppNumbers?.[0] || ''}
                    onChange={(e) => {
                      const w = [...(formData.whatsAppNumbers || [])];
                      w[0] = e.target.value;
                      handleFieldChange('whatsAppNumbers', w);
                    }}
                    placeholder="03098962803"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Official Boutique Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="bossbigwatches@gmail.com"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    VIP Concierge Box Title
                  </label>
                  <input
                    type="text"
                    value={formData.vipConciergeTitle || ''}
                    onChange={(e) => handleFieldChange('vipConciergeTitle', e.target.value)}
                    placeholder="VIP Concierge Service"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    WhatsApp Concierge Box Title
                  </label>
                  <input
                    type="text"
                    value={formData.vipWhatsappTitle || ''}
                    onChange={(e) => handleFieldChange('vipWhatsappTitle', e.target.value)}
                    placeholder="Instant WhatsApp Concierge"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              {/* COD Box Content */}
              <div className="p-4 bg-[#0E0E0E] rounded border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-[#E5C76B] uppercase tracking-wider">
                  Cash on Delivery & Wire Box
                </span>
                <input
                  type="text"
                  value={formData.codBoxTitle || ''}
                  onChange={(e) => handleFieldChange('codBoxTitle', e.target.value)}
                  placeholder="Secure and Flexible Luxury Acquisition"
                  className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={formData.codBoxDesc || ''}
                  onChange={(e) => handleFieldChange('codBoxDesc', e.target.value)}
                  placeholder="Inspect your luxury presentation box and documentation before completing payment..."
                  className="w-full bg-[#070707] border border-neutral-700 rounded py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 7: ABOUT PAGE & HERITAGE STORY */}
        {/* ========================================================================= */}
        <div id="section-about" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('about')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  About & Heritage Page Story
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Genesis Story, Master Watchmaker Quote, Atelier Photo
                </p>
              </div>
            </div>
            {openSections.about ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.about && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              {renderImageField(
                'Heritage Atelier Craftsmanship Photo URL',
                'aboutCraftImageUrl',
                'Displayed on the About & Heritage page beside the master story.',
                'https://... or /assets/aistudio/...'
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    About Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.aboutHeroTitle || ''}
                    onChange={(e) => handleFieldChange('aboutHeroTitle', e.target.value)}
                    placeholder="BIG BOSS WATCHES"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Story Section Headline
                  </label>
                  <input
                    type="text"
                    value={formData.aboutStoryTitle || ''}
                    onChange={(e) => handleFieldChange('aboutStoryTitle', e.target.value)}
                    placeholder="The Genesis of Authority"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Master Watchmaker Quote
                </label>
                <input
                  type="text"
                  value={formData.aboutQuote || ''}
                  onChange={(e) => handleFieldChange('aboutQuote', e.target.value)}
                  placeholder="Every component is balanced to fractions of a micron..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Story Paragraph 1</label>
                  <textarea
                    rows={2}
                    value={formData.aboutStoryP1 || ''}
                    onChange={(e) => handleFieldChange('aboutStoryP1', e.target.value)}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Story Paragraph 2</label>
                  <textarea
                    rows={2}
                    value={formData.aboutStoryP2 || ''}
                    onChange={(e) => handleFieldChange('aboutStoryP2', e.target.value)}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">Story Paragraph 3</label>
                  <textarea
                    rows={2}
                    value={formData.aboutStoryP3 || ''}
                    onChange={(e) => handleFieldChange('aboutStoryP3', e.target.value)}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-1.5 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 8: COLLECTOR REVIEWS & TESTIMONIALS */}
        {/* ========================================================================= */}
        <div id="section-testimonials" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('testimonials')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Collector Reviews & Testimonials ({formData.testimonials?.length || 0})
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Add, edit, or remove client quotes and ratings directly from mobile
                </p>
              </div>
            </div>
            {openSections.testimonials ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.testimonials && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Manage real collector testimonials:</span>
                <button
                  type="button"
                  onClick={handleAddTestimonial}
                  className="px-3 py-1.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.testimonials || []).map((t, idx) => (
                  <div key={t.id} className="p-4 bg-[#0E0E0E] rounded border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E5C76B]">Review #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Client Name</label>
                        <input
                          type="text"
                          value={t.author}
                          onChange={(e) => handleUpdateTestimonial(t.id, 'author', e.target.value)}
                          className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Location</label>
                        <input
                          type="text"
                          value={t.location}
                          onChange={(e) => handleUpdateTestimonial(t.id, 'location', e.target.value)}
                          className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">Timepiece Acquired</label>
                        <input
                          type="text"
                          value={t.watchModel}
                          onChange={(e) => handleUpdateTestimonial(t.id, 'watchModel', e.target.value)}
                          className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-0.5">Review Quote</label>
                      <textarea
                        rows={2}
                        value={t.quote}
                        onChange={(e) => handleUpdateTestimonial(t.id, 'quote', e.target.value)}
                        className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 9: FAQS & CONCIERGE ANSWERS */}
        {/* ========================================================================= */}
        <div id="section-faqs" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('faqs')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Frequently Asked Questions (FAQs) ({formData.faqs?.length || 0})
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Manage policy answers, delivery terms, and warranty explanations
                </p>
              </div>
            </div>
            {openSections.faqs ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.faqs && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Manage client Q&A records:</span>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.faqs || []).map((faq, idx) => (
                  <div key={faq.id} className="p-4 bg-[#0E0E0E] rounded border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E5C76B]">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-0.5">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                        className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-0.5">Answer</label>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                        className="w-full bg-[#070707] border border-neutral-700 rounded p-1.5 text-xs text-white leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 10: FOOTER, SOCIAL LINKS & LEGAL */}
        {/* ========================================================================= */}
        <div id="section-footer" className="bg-[#141414] border border-[#252525] rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('footer')}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#181818] hover:bg-[#1E1E1E] transition text-left cursor-pointer border-b border-[#222222]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#202020] text-[#C9A227] flex items-center justify-center border border-[#C9A227]/40">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Footer, Physical Address & Social Media
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Boutique Pavilion Location, Support Hours, Instagram, Facebook & Copyright
                </p>
              </div>
            </div>
            {openSections.footer ? <ChevronUp className="w-5 h-5 text-[#C9A227]" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {openSections.footer && (
            <div className="p-4 sm:p-6 space-y-4 bg-[#141414]">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Footer About Blurb
                </label>
                <textarea
                  rows={2}
                  value={formData.footerAbout || ''}
                  onChange={(e) => handleFieldChange('footerAbout', e.target.value)}
                  placeholder="Forged in Geneva and distributed globally..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Boutique Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Boutique Suite 10, Luxury Horology Pavilion, Beverly Arcade"
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Concierge Hours
                  </label>
                  <input
                    type="text"
                    value={formData.supportHours || ''}
                    onChange={(e) => handleFieldChange('supportHours', e.target.value)}
                    placeholder="Monday – Saturday: 10:00 AM – 8:00 PM PKT"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Expected Response Speed
                  </label>
                  <input
                    type="text"
                    value={formData.responseTime || ''}
                    onChange={(e) => handleFieldChange('responseTime', e.target.value)}
                    placeholder="Typically under 2 hours"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Twitter / X URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={formData.copyrightText || ''}
                  onChange={(e) => handleFieldChange('copyrightText', e.target.value)}
                  placeholder="© 2026 BIG BOSS WATCHES. All rights reserved."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-xs text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </form>

      {/* ========================================================================= */}
      {/* MODAL: GALLERY PICKER FOR WATCH PHOTOS & ASSETS */}
      {/* ========================================================================= */}
      {galleryTargetKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-[#C9A227]/50 rounded-sm max-w-2xl w-full p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#252525] pb-3">
              <div>
                <span className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider">
                  QUICK IMAGE SELECTOR
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Choose a Photo for {galleryTargetKey}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryTargetKey(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Tap any photo below to immediately apply it as your <strong className="text-[#E5C76B]">{galleryTargetKey}</strong>:
            </p>

            {/* User Uploaded Watch Photos */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Your Uploaded Watch Photos ({UPLOADED_WATCH_ASSETS.length})</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {UPLOADED_WATCH_ASSETS.map((asset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyGalleryImage(asset.url)}
                    className="group relative bg-[#0E0E0E] border border-neutral-800 hover:border-[#C9A227] rounded overflow-hidden p-1.5 transition text-left cursor-pointer flex flex-col justify-between"
                  >
                    <div className="aspect-square w-full rounded overflow-hidden bg-black mb-1.5 border border-neutral-900 group-hover:border-[#C9A227]/50">
                      <img
                        src={asset.url}
                        alt={asset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-300 font-medium line-clamp-1 block">
                      {asset.label}
                    </span>
                    <span className="text-[9px] text-[#C9A227] font-semibold uppercase mt-0.5 block">
                      Tap to Select →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Horology Presets */}
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Luxury Stock Horology Presets</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HOROLOGY_STOCK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyGalleryImage(preset.url)}
                    className="group relative bg-[#0E0E0E] border border-neutral-800 hover:border-[#C9A227] rounded overflow-hidden p-1.5 transition text-left cursor-pointer flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] w-full rounded overflow-hidden bg-black mb-1.5 border border-neutral-900">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-300 font-medium line-clamp-1 block">
                      {preset.label}
                    </span>
                    <span className="text-[9px] text-[#C9A227] font-semibold uppercase mt-0.5 block">
                      Tap to Select →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STICKY BOTTOM ACTION BAR FOR MOBILE-FIRST CONTROL */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-t border-[#C9A227]/40 p-3 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Mobile CMS Active</span>
              <span className="text-[10px] text-neutral-400 hidden sm:inline">Tap Save to publish changes live to the site</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const homeSection = document.getElementById('section-brand');
                homeSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-neutral-700 text-neutral-300 text-xs rounded transition hidden sm:inline-block cursor-pointer"
            >
              Scroll to Top ↑
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              disabled={saving}
              className="px-6 py-3 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow-xl hover:shadow-[#C9A227]/25 cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>Save All Website Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
