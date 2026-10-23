import React, { useEffect, useState } from 'react';
import {
  Clock,
  Crown,
  FileText,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  RefreshCw,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../services/storeService';
import { Order } from '../types';

interface AccountPageProps {
  onOpenAuth: () => void;
  onNavigateContact: (orderNumber?: string) => void;
  onNavigateHome: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onOpenAuth,
  onNavigateContact,
  onNavigateHome,
}) => {
  const { currentUser, userProfile, isAdmin, logoutUser, saveUserProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Address edit state
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [street, setStreet] = useState(userProfile?.shippingAddress?.street || '');
  const [city, setCity] = useState(userProfile?.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(userProfile?.shippingAddress?.postalCode || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
      setStreet(userProfile.shippingAddress?.street || '');
      setCity(userProfile.shippingAddress?.city || '');
      setPostalCode(userProfile.shippingAddress?.postalCode || '');
    }
  }, [userProfile]);

  const loadOrders = async () => {
    if (!currentUser) return;
    setLoadingOrders(true);
    try {
      const userOrders = await getOrdersByUser(currentUser.uid);
      setOrders(userOrders);
    } catch (err) {
      console.warn('Could not fetch user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser?.uid]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);
    try {
      await saveUserProfile({
        displayName,
        phone,
        shippingAddress: {
          street,
          city,
          postalCode,
          country: 'Pakistan / International',
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-[#0B0B0B] text-white min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#131313] border border-[#C9A227]/40 rounded-sm p-8 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-sm bg-[#1A1A1A] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
            <Crown className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wider">
            Client Account Portal
          </h2>
          <p className="text-xs text-neutral-400 mt-2 mb-6 leading-relaxed">
            Please sign in to view your timepiece orders, real-time dispatch milestones, and saved concierge details.
          </p>
          <div className="space-y-3">
            <button
              onClick={onOpenAuth}
              className="w-full py-3 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-widest rounded-sm transition cursor-pointer"
            >
              Sign In / Register
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs uppercase tracking-wider rounded-sm transition cursor-pointer"
            >
              Return to Boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'processing':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'shipped':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'delivered':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'cancelled':
        return 'bg-red-950 text-red-300 border-red-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* User Greeting Header */}
        <div className="bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-[#1C180E] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] font-serif text-2xl font-bold">
              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-serif text-2xl font-bold text-white">
                  {currentUser.displayName || 'Distinguished Client'}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#C9A227]/20 text-[#E5C76B] border border-[#C9A227]/40 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-semibold rounded flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-[#222222] mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-semibold transition cursor-pointer relative ${
              activeTab === 'orders'
                ? 'text-[#C9A227]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Order History ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A227]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs uppercase tracking-[0.2em] font-semibold transition cursor-pointer relative ${
              activeTab === 'profile'
                ? 'text-[#C9A227]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Saved Delivery Coordinates
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A227]" />
            )}
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                Real-time allocations linked to your verified account
              </span>
              <button
                onClick={loadOrders}
                className="text-xs text-[#C9A227] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Status</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-xs text-neutral-400">
                Retrieving your timepiece records...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#131313] border border-[#222222] rounded-sm p-12 text-center">
                <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-white">No Prior Orders Found</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  When you acquire timepieces from BIG BOSS WATCHES, your orders and dispatch updates will appear here.
                </p>
                <button
                  onClick={onNavigateHome}
                  className="mt-6 px-6 py-2.5 bg-[#C9A227] text-black font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#E5C76B] transition cursor-pointer"
                >
                  Explore Timepieces
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#131313] border border-[#222222] rounded-sm p-6 space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#E5C76B]">
                          #{ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          Status: {ord.orderStatus}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Date: {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-neutral-400 block">Total Due</span>
                      <span className="font-serif text-lg font-bold text-white">
                        ${ord.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#1D1D1D]">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xs border border-neutral-800 bg-black shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-mono text-[#A8841B] block">
                              {item.modelNumber}
                            </span>
                            <h4 className="font-serif font-semibold text-white">{item.name}</h4>
                            <span className="text-neutral-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono font-semibold text-neutral-200">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Tracking Info */}
                  <div className="pt-3 border-t border-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-400">
                      <p>
                        Destination: <strong className="text-white">{ord.shippingAddress}, {ord.city}</strong>
                      </p>
                      {ord.trackingNumber && (
                        <p className="mt-0.5 text-[#E5C76B] font-mono">
                          Tracking: {ord.carrier ? `${ord.carrier}: ` : ''}{ord.trackingNumber}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onNavigateContact(ord.orderNumber)}
                      className="px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#C9A227]/40 hover:border-[#C9A227] text-[#C9A227] rounded text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire Regarding Order</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile Coordinates */}
        {activeTab === 'profile' && (
          <div className="bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8 max-w-2xl">
            <h3 className="font-serif text-lg font-semibold text-white mb-1">
              Client Delivery Profile
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Saved addresses are automatically referenced during future timepiece allocations.
            </p>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs rounded">
                Profile coordinates updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Street Address / Residence
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street / Suite / House"
                  className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Update Coordinates'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
