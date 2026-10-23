import React, { useState } from 'react';
import {
  Crown,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenAuth: () => void;
  storeSettings?: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  storeSettings,
}) => {
  const { currentUser, userProfile, isAdmin, logoutUser } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const phone1 = storeSettings?.phones?.[0] || '03098962803';
  const phone2 = storeSettings?.phones?.[1] || '0345 0434786';
  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('collections', `search:${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'All Watches' },
    { id: 'noir', label: 'Big Boss Noir', param: 'noir' },
    { id: 'royal', label: 'Big Boss Royal', param: 'royal' },
    { id: 'about', label: 'Heritage & Craft' },
    { id: 'contact', label: 'Concierge & Support' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#C9A227]/20 transition-all">
      {/* Dynamic Announcement Banner if active */}
      {storeSettings?.announcementActive && storeSettings?.announcementText && (
        <div className="bg-[#C9A227] text-black text-xs font-bold py-1.5 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
          <span>{storeSettings.announcementText}</span>
        </div>
      )}

      {/* Top Luxury Concierge Bar */}
      <div className="bg-gradient-to-r from-[#121212] via-[#1a1710] to-[#121212] text-xs text-[#E5C76B] py-2 px-4 border-b border-[#C9A227]/15">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C9A227] uppercase">
              {storeSettings?.topBarTagline || 'GENEVA ATELIER • OFFICIAL BOUTIQUE'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#B8B8B8]">
            <a
              href={`tel:${phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-[#C9A227] transition"
              title="Call VIP Concierge"
            >
              <Phone className="w-3 h-3 text-[#C9A227]" />
              <span className="hidden md:inline">VIP Concierge:</span> {phone1}
            </a>
            <span className="hidden md:inline text-neutral-600">|</span>
            <a
              href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent('Hello ' + (storeSettings?.brandTitle || 'BIG BOSS') + ', I am inquiring about your luxury timepieces.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#25D366] hover:text-[#2fe675] transition font-medium"
            >
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Slogan */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          {storeSettings?.logoUrl ? (
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] border border-[#C9A227]/40 flex items-center justify-center shadow-lg group-hover:border-[#C9A227] transition-colors overflow-hidden">
              <img
                src={storeSettings.logoUrl}
                alt={storeSettings.brandTitle || 'Big Boss Watches'}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#1C1C1C] to-[#0A0A0A] border border-[#C9A227]/40 flex items-center justify-center shadow-lg group-hover:border-[#C9A227] transition-colors">
              <Crown className="w-5 h-5 text-[#C9A227] group-hover:scale-110 transition-transform" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-white group-hover:text-[#E5C76B] transition-colors">
              {storeSettings?.brandTitle || 'BIG BOSS'}
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#C9A227] font-semibold uppercase -mt-0.5">
              {storeSettings?.brandSubtitle || 'WATCHES • GENEVA'}
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              (link.id === 'home' && currentPage === 'home') ||
              (link.id === 'about' && currentPage === 'about') ||
              (link.id === 'contact' && currentPage === 'contact') ||
              (link.id === 'collections' && currentPage === 'collections' && !link.param) ||
              (link.id === 'noir' && currentPage === 'collections-noir') ||
              (link.id === 'royal' && currentPage === 'collections-royal');

            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.param) {
                    onNavigate('collections', link.param);
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className={`text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-[#C9A227]'
                    : 'text-[#CCCCCC] hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A227]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-[#CCCCCC] hover:text-[#C9A227] transition rounded-full hover:bg-white/5 cursor-pointer"
            title="Search Timepieces"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin Dashboard Badge (if logged in as admin) */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded border transition cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-[#C9A227] text-black border-[#C9A227]'
                  : 'bg-[#C9A227]/10 text-[#E5C76B] border-[#C9A227]/40 hover:bg-[#C9A227]/20 hover:border-[#C9A227]'
              }`}
              title="Admin Management Suite"
            >
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span className="hidden sm:inline">Admin Studio</span>
            </button>
          )}

          {/* User Account Menu */}
          <div className="relative">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 text-xs font-medium text-[#CCCCCC] hover:text-white rounded border border-transparent hover:border-[#C9A227]/30 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] font-serif font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate text-neutral-300">
                    {currentUser.displayName || 'Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#151515] border border-[#C9A227]/30 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-[#2A2A2A]">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {currentUser.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#C9A227]/20 text-[#E5C76B] border border-[#C9A227]/40 rounded">
                          Master Administrator
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                    >
                      My Profile & Orders
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#E5C76B] hover:bg-neutral-800 transition cursor-pointer font-medium"
                      >
                        Boutique Administration
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-neutral-800 transition cursor-pointer border-t border-[#2A2A2A] mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 p-2 text-xs uppercase tracking-wider font-semibold text-[#CCCCCC] hover:text-[#C9A227] transition cursor-pointer rounded hover:bg-white/5"
                title="Customer Sign In"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-[#171717] hover:bg-[#202020] text-white border border-[#C9A227]/30 hover:border-[#C9A227] rounded-sm transition cursor-pointer group"
            title="View Shopping Bag"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#E5C76B] group-hover:scale-105 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#C9A227] text-black font-bold text-[11px] rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101010] border-b border-[#C9A227]/30 px-6 py-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.param) {
                    onNavigate('collections', link.param);
                  } else {
                    onNavigate(link.id);
                  }
                }}
                className="text-left text-sm uppercase tracking-widest font-medium text-neutral-200 hover:text-[#C9A227] py-2 border-b border-neutral-800"
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="text-left text-sm uppercase tracking-widest font-semibold text-[#E5C76B] py-2 border-b border-neutral-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}

            <div className="pt-2 flex flex-col gap-2 text-xs text-neutral-400">
              <p className="text-white font-medium uppercase tracking-wider">Contact Concierge:</p>
              <a href={`tel:${phone1.replace(/\s+/g, '')}`} className="hover:text-[#C9A227]">
                Phone 1: {phone1}
              </a>
              <a href={`tel:${phone2.replace(/\s+/g, '')}`} className="hover:text-[#C9A227]">
                Phone 2: {phone2}
              </a>
              <a
                href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] font-medium"
              >
                Chat on WhatsApp ({whatsapp1})
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-[#151515] border border-[#C9A227]/50 rounded-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-serif text-xl text-white mb-1">Search BIG BOSS Collection</h3>
            <p className="text-xs text-neutral-400 mb-6">Search by timepiece model, collection name, or complications.</p>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Tourbillon, Chronograph, Imperial Gold, Noir, Skeleton..."
                className="w-full bg-[#0B0B0B] border border-[#C9A227]/40 rounded-sm py-3.5 pl-4 pr-12 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A227]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-[#C9A227] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#E5C76B] transition"
              >
                Search
              </button>
            </form>
            <div className="mt-4 flex items-center gap-2 flex-wrap text-xs text-neutral-400">
              <span>Popular searches:</span>
              <button
                onClick={() => {
                  setSearchQuery('Tourbillon');
                  onNavigate('collections', 'search:Tourbillon');
                  setSearchOpen(false);
                }}
                className="px-2 py-1 bg-neutral-800 hover:text-[#C9A227] rounded text-neutral-300"
              >
                Tourbillon
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Imperial');
                  onNavigate('collections', 'search:Imperial');
                  setSearchOpen(false);
                }}
                className="px-2 py-1 bg-neutral-800 hover:text-[#C9A227] rounded text-neutral-300"
              >
                Imperial Gold
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Diver');
                  onNavigate('collections', 'search:Diver');
                  setSearchOpen(false);
                }}
                className="px-2 py-1 bg-neutral-800 hover:text-[#C9A227] rounded text-neutral-300"
              >
                Deep Sea Diver
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Skeleton');
                  onNavigate('collections', 'search:Skeleton');
                  setSearchOpen(false);
                }}
                className="px-2 py-1 bg-neutral-800 hover:text-[#C9A227] rounded text-neutral-300"
              >
                Skeleton
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
