import React from 'react';
import { Award, Compass, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutPageProps {
  onNavigate: (page: string, param?: string) => void;
  storeSettings?: StoreSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, storeSettings }) => {
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1A1A1A] border border-[#C9A227]/40 text-[#E5C76B] text-[11px] font-semibold tracking-[0.3em] uppercase">
            <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{storeSettings?.aboutHeroSubtitle || 'GENEVA HOROLOGICAL TRADITION'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white">
            {storeSettings?.aboutHeroTitle || storeSettings?.brandTitle || 'BIG BOSS WATCHES'}
          </h1>

          <p className="font-serif text-base sm:text-lg tracking-[0.35em] text-[#C9A227] uppercase font-bold">
            {storeSettings?.slogan || 'TIME, REDEFINED.'}
          </p>

          <p className="text-xs sm:text-sm text-[#E5C76B] tracking-[0.25em] uppercase font-semibold">
            {storeSettings?.brandStatement || 'PRECISION. POWER. PRESTIGE.'}
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed pt-2">
            {storeSettings?.heroDescription || 'Forged in Geneva and distributed to connoisseurs of supreme achievement. We craft timepieces not merely to count minutes, but to declare undisputed authority.'}
          </p>
        </div>

        {/* Narrative & Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-t border-[#1F1F1F] pt-16">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#C9A227]/30 bg-black">
            <img
              src={storeSettings?.aboutCraftImageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85'}
              alt="Horology Craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-neutral-300 font-serif italic">
              "{storeSettings?.aboutQuote || 'Every component is balanced to fractions of a micron, mirroring the calculated exactitude of leaders.'}"
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              {storeSettings?.aboutStoryTitle || 'The Genesis of Authority'}
            </h2>
            <p>
              {storeSettings?.aboutStoryP1 || 'In an era dominated by transient digital devices and planned obsolescence, BIG BOSS WATCHES was founded on an unapologetic premise: true power is permanent.'}
            </p>
            <p>
              {storeSettings?.aboutStoryP2 || 'Inspired by classical Swiss horology and fortified with aerospace materials, our master watchmakers combine centuries-old finishing techniques with high-tensile 316L medical stainless steel, Diamond-Like Carbon (DLC) crystalline coatings, and scratchproof curved sapphire crystals.'}
            </p>
            <p>
              {storeSettings?.aboutStoryP3 || 'Each timepiece requires upwards of 140 meticulous manufacturing stages, including hand-beveled bridges, perlage circular graining, and multi-position chronometric testing.'}
            </p>
          </div>
        </div>

        {/* Two Sovereign Pillars */}
        <div className="border-t border-[#1F1F1F] pt-16">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-2">
              DUAL MANIFESTATIONS
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              The Two Dialectics of Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-[#121212] border border-neutral-800 p-8 rounded-sm space-y-4 hover:border-neutral-600 transition">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                SERIES 01
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {storeSettings?.noirTitle || 'BIG BOSS NOIR'}
              </h3>
              <p className="font-serif text-xs text-[#C9A227] uppercase tracking-wider">
                {storeSettings?.noirSubtitle || 'Stealth. Minimalist. Unflinching.'}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {storeSettings?.noirDescription || 'Obsidian matte textures, titanium cores, and high-contrast night luminescence. Designed for covert operations, boardroom battles, and visionaries who move without hesitation.'}
              </p>
              <button
                onClick={() => onNavigate('collections', 'noir')}
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#C9A227] inline-block pt-2 cursor-pointer"
              >
                Inspect Noir Pieces →
              </button>
            </div>

            <div className="bg-[#14120B] border border-[#C9A227]/30 p-8 rounded-sm space-y-4 hover:border-[#C9A227] transition">
              <span className="text-xs font-mono text-[#A8841B] uppercase tracking-widest">
                SERIES 02
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {storeSettings?.royalTitle || 'BIG BOSS ROYAL'}
              </h3>
              <p className="font-serif text-xs text-[#E5C76B] uppercase tracking-wider">
                {storeSettings?.royalSubtitle || 'Sovereign. Prestigious. Glorious.'}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {storeSettings?.royalDescription || '18K yellow and rose gold PVD electroplating, fluted bezels, sunburst emerald dials, and open tourbillon skeletons. Made for triumphant moments of legacy and dynastic triumph.'}
              </p>
              <button
                onClick={() => onNavigate('collections', 'royal')}
                className="text-xs font-bold uppercase tracking-wider text-[#E5C76B] hover:text-white inline-block pt-2 cursor-pointer"
              >
                Inspect Royal Pieces →
              </button>
            </div>
          </div>
        </div>

        {/* Commitment to Quality */}
        <div className="bg-[#141414] border border-[#262626] p-8 sm:p-12 rounded-sm text-center space-y-6">
          <Crown className="w-10 h-10 text-[#C9A227] mx-auto" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            The 5-Year Master Horology Guarantee
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Every BIG BOSS timepiece comes with an individualized serialized warranty card and access to our global certified concierge network. If your movement falters in any way under normal operation, our Geneva-trained horologists will restore it to chronometric perfection.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition cursor-pointer"
            >
              Contact Master Horologist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
