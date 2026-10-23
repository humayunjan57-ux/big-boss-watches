import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Flame,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { WatchCard } from '../components/WatchCard';
import { Collection, Product, StoreSettings } from '../types';

interface HomePageProps {
  products: Product[];
  collections: Collection[];
  storeSettings?: StoreSettings;
  onNavigate: (page: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  collections,
  storeSettings,
  onNavigate,
  onSelectProduct,
}) => {
  const featuredProducts = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.isNewArrival);

  const noirCollection = collections.find((c) => c.id === 'big-boss-noir');
  const royalCollection = collections.find((c) => c.id === 'big-boss-royal');

  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';

  return (
    <div className="bg-[#0B0B0B] text-white overflow-hidden">
      {/* Cinematic Master Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#070707] px-4 sm:px-6 lg:px-8 border-b border-[#C9A227]/20">
        {/* Background Image with Cinematic Dark Mask */}
        <div className="absolute inset-0 z-0">
          <img
            src={storeSettings?.heroImageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=90'}
            alt={storeSettings?.businessName || 'Big Boss Watches Luxury Horology'}
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B0B0B]/40 to-[#0B0B0B]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center py-20">
          {/* Insignia & Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181818]/90 border border-[#C9A227]/50 backdrop-blur-md mb-8 shadow-xl">
            {storeSettings?.crestUrl ? (
              <img src={storeSettings.crestUrl} alt="Crest" className="w-5 h-5 object-contain" />
            ) : (
              <Crown className="w-4 h-4 text-[#C9A227]" />
            )}
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#E5C76B] uppercase">
              {storeSettings?.heroBadge || 'GENEVA HOROLOGICAL EXCELLENCE • 2026 ALLOCATIONS'}
            </span>
          </div>

          {/* Brand Name */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] text-white uppercase drop-shadow-2xl">
            {storeSettings?.brandTitle || 'BIG BOSS'}
            <span className="block text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.3em] text-[#C9A227] mt-2">
              {storeSettings?.brandSubtitle || 'WATCHES'}
            </span>
          </h1>

          {/* Slogan */}
          <p className="font-serif text-lg sm:text-2xl text-neutral-200 tracking-[0.35em] uppercase font-bold mt-6 text-[#FFF6D6]">
            {storeSettings?.slogan || 'TIME, REDEFINED.'}
          </p>

          {/* Statement */}
          <p className="text-xs sm:text-sm text-[#C9A227] tracking-[0.3em] uppercase font-semibold mt-2">
            {storeSettings?.brandStatement || 'PRECISION. POWER. PRESTIGE.'}
          </p>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto mt-6 leading-relaxed font-light">
            {storeSettings?.heroDescription || 'Engineered for modern leaders who command destiny. Forged in DLC obsidian steel, 18K yellow gold, and sapphire crystal with Swiss-caliber mechanical chronometry.'}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('collections')}
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-[0.25em] rounded-sm transition-all duration-300 shadow-xl hover:shadow-[#C9A227]/30 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>{storeSettings?.heroPrimaryBtnText || 'Shop All Timepieces'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('collections-preview');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#141414]/90 hover:bg-[#202020] text-white border border-[#C9A227]/50 hover:border-[#C9A227] font-semibold text-xs uppercase tracking-[0.25em] rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{storeSettings?.heroSecondaryBtnText || 'Explore Collections'}</span>
            </button>
          </div>

          {/* Quick Support Ticker / Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-t border-[#1C1C1C] pt-6">
            {(storeSettings?.trustBadges && storeSettings.trustBadges.length > 0 ? storeSettings.trustBadges : [
              'Complimentary Insured Courier',
              '5-Year International Warranty',
              'Cash on Delivery Available',
            ]).map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal Collections Preview Section */}
      <section id="collections-preview" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-2">
            {storeSettings?.collectionsSectionSubtitle || 'CURATED MASTER SERIES'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-white">
            {storeSettings?.collectionsSectionTitle || 'The Two Pillars of Prestige'}
          </h2>
          <div className="w-24 h-0.5 bg-[#C9A227] mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mt-4">
            {storeSettings?.collectionsSectionDesc || 'Discover the minimalist stealth of Big Boss Noir and the sovereign majesty of Big Boss Royal.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BIG BOSS NOIR */}
          <div className="group relative bg-[#121212] rounded-sm border border-neutral-800 hover:border-neutral-500 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={storeSettings?.noirImageUrl || noirCollection?.heroImage || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85'}
                alt={storeSettings?.noirTitle || 'BIG BOSS NOIR Collection'}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/90 border border-neutral-700 text-white text-[10px] font-bold tracking-widest uppercase">
                  MONOCHROMATIC OBSIDIAN
                </span>
              </div>
            </div>

            <div className="p-8 relative -mt-12 z-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {storeSettings?.noirTitle || 'BIG BOSS NOIR'}
                </h3>
                <p className="font-serif text-xs text-[#C9A227] tracking-widest uppercase mt-1">
                  {storeSettings?.noirSubtitle || 'Minimalist. Dark. Modern. Sophisticated.'}
                </p>
                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  {storeSettings?.noirDescription || 'Stealth forged carbon, Diamond-Like Carbon (DLC) matte finishes, and ultra-luminescent sapphire dials. Designed for visionary operators who move in silence and command decisive power.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-mono">
                  Limited Series
                </span>
                <button
                  onClick={() => onNavigate('collections', 'noir')}
                  className="px-6 py-2.5 bg-neutral-900 group-hover:bg-white text-white group-hover:text-black border border-neutral-700 text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Noir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* BIG BOSS ROYAL */}
          <div className="group relative bg-[#14120B] rounded-sm border border-[#C9A227]/30 hover:border-[#C9A227] transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={storeSettings?.royalImageUrl || royalCollection?.heroImage || 'https://images.unsplash.com/photo-1547996160-71dfabbce574?auto=format&fit=crop&w=1400&q=85'}
                alt={storeSettings?.royalTitle || 'BIG BOSS ROYAL Collection'}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14120B] via-[#14120B]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#1a1608]/90 border border-[#C9A227]/60 text-[#E5C76B] text-[10px] font-bold tracking-widest uppercase">
                  18K GOLD & SUNBURST
                </span>
              </div>
            </div>

            <div className="p-8 relative -mt-12 z-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {storeSettings?.royalTitle || 'BIG BOSS ROYAL'}
                </h3>
                <p className="font-serif text-xs text-[#E5C76B] tracking-widest uppercase mt-1">
                  {storeSettings?.royalSubtitle || 'Premium. Bold. Prestigious. Classic.'}
                </p>
                <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
                  {storeSettings?.royalDescription || 'Rich 18K yellow and rose gold PVD electroplating, fluted coin-edge bezels, sunburst emerald dials, and open exhibition casebacks displaying master tourbillon complications.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#292212] flex items-center justify-between">
                <span className="text-xs text-[#A8841B] uppercase tracking-wider font-mono">
                  Royal Masterpieces
                </span>
                <button
                  onClick={() => onNavigate('collections', 'royal')}
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Explore Royal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Timepieces Showcase */}
      <section className="py-20 bg-[#0E0E0E] border-y border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] flex items-center gap-1.5 mb-2">
                <Flame className="w-4 h-4" />
                ICONIC TIMEPIECES
              </span>
              <h2 className="font-serif text-3xl font-bold text-white tracking-wider">
                Featured & Master Releases
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Each watch is hand-calibrated and delivered with a certified certificate of authenticity.
              </p>
            </div>

            <button
              onClick={() => onNavigate('collections')}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227] hover:text-[#E5C76B] flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <WatchCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Master Horology Pillars Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-2">
              {storeSettings?.craftsmanshipBadge || 'THE BIG BOSS CODE'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              {storeSettings?.craftsmanshipTitle || 'Crafted Without Compromise.'}
            </h2>
            <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
              {storeSettings?.craftsmanshipDesc || 'We reject mass-produced mediocrity. BIG BOSS WATCHES manufactures each timepiece with the same tolerances required by aerospace engineering and Swiss haute horology.'}
            </p>

            <div className="mt-8 flex flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider">
                    {storeSettings?.pillar1Title || 'Aerospace-Grade Metallurgy'}
                  </h4>
                  <p className="text-neutral-400 mt-0.5">
                    {storeSettings?.pillar1Desc || 'Solid 316L medical stainless steel and multi-layer DLC scratch resistant coatings.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider">
                    {storeSettings?.pillar2Title || 'Double-Curved Sapphire'}
                  </h4>
                  <p className="text-neutral-400 mt-0.5">
                    {storeSettings?.pillar2Desc || 'Diamond-hardness sapphire crystal with dual anti-reflective inner coating.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider">
                    {storeSettings?.pillar3Title || 'Up to 72 Hours Power Reserve'}
                  </h4>
                  <p className="text-neutral-400 mt-0.5">
                    {storeSettings?.pillar3Desc || 'High-beat automatic calibres tested across 5 individual positions for supreme accuracy.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#141414] border border-[#252525] p-6 rounded-sm relative overflow-hidden group hover:border-[#C9A227]/40 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-[#1F1F1F] text-[#C9A227] flex items-center justify-center mb-4">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                {storeSettings?.vipConciergeTitle || 'VIP Concierge Service'}
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {storeSettings?.vipConciergeDesc || 'Connect directly with our master horologist consultants via phone or WhatsApp for custom sizing, technical questions, or bespoke orders.'}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="text-xs text-[#C9A227] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {phone1}</span>
                </a>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#252525] p-6 rounded-sm relative overflow-hidden group hover:border-[#C9A227]/40 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-[#1F1F1F] text-[#25D366] flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                {storeSettings?.vipWhatsappTitle || 'Instant WhatsApp Concierge'}
              </h3>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {storeSettings?.vipWhatsappDesc || 'Have a question regarding watch specifications, availability, or immediate dispatch? Speak directly to our luxury support team in real-time.'}
              </p>
              <div className="mt-4">
                <a
                  href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello ' + (storeSettings?.brandTitle || 'BIG BOSS') + ', I would like to inquire about a timepiece.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp: {whatsapp1}</span>
                </a>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#252525] p-6 rounded-sm sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[10px] text-[#C9A227] uppercase tracking-widest font-semibold block">
                  CASH ON DELIVERY & BANK WIRE
                </span>
                <h4 className="font-serif text-lg text-white font-bold mt-1">
                  {storeSettings?.codBoxTitle || 'Secure and Flexible Luxury Acquisition'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-md">
                  {storeSettings?.codBoxDesc || 'Inspect your luxury presentation box and documentation before completing payment at your doorstep, where enabled.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('collections')}
                className="px-6 py-3 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition shrink-0 cursor-pointer"
              >
                Acquire a Timepiece
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Collector Testimonials Section */}
      {storeSettings?.testimonials && storeSettings.testimonials.length > 0 && (
        <section className="py-20 bg-[#0E0E0E] border-t border-[#1C1C1C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-2">
                COLLECTOR TESTIMONIALS
              </span>
              <h2 className="font-serif text-3xl font-bold text-white tracking-wider">
                Voices of Supreme Prestige
              </h2>
              <div className="w-20 h-0.5 bg-[#C9A227] mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storeSettings.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#141414] border border-[#252525] p-6 rounded-sm flex flex-col justify-between hover:border-[#C9A227]/40 transition"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#C9A227] mb-3">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-serif text-sm font-bold text-white">{t.author}</p>
                      <p className="text-[10px] text-neutral-500">{t.location} • <span className="text-[#C9A227]">{t.watchModel}</span></p>
                    </div>
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Preview */}
      {storeSettings?.faqs && storeSettings.faqs.length > 0 && (
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1C]">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-2">
              CONCIERGE INQUIRIES
            </span>
            <h2 className="font-serif text-3xl font-bold text-white tracking-wider">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-0.5 bg-[#C9A227] mx-auto mt-3" />
          </div>

          <div className="space-y-4">
            {storeSettings.faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#121212] border border-[#222222] p-5 rounded-sm hover:border-[#C9A227]/30 transition"
              >
                <h4 className="font-serif text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <span className="text-[#C9A227]">Q:</span> {faq.question}
                </h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed pl-5 border-l border-[#C9A227]/30">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
