import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Crown,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/storeService';
import { Order, PaymentMethod, StoreSettings } from '../types';

interface CheckoutPageProps {
  storeSettings?: StoreSettings;
  onOrderSuccess: (order: Order) => void;
  onCancel: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  storeSettings,
  onOrderSuccess,
  onCancel,
}) => {
  const { currentUser, userProfile } = useAuth();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  // Customer Information
  const [customerName, setCustomerName] = useState(
    userProfile?.displayName || currentUser?.displayName || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    userProfile?.email || currentUser?.email || ''
  );
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState(
    userProfile?.shippingAddress?.street || ''
  );
  const [city, setCity] = useState(userProfile?.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(
    userProfile?.shippingAddress?.postalCode || ''
  );
  const [notes, setNotes] = useState('');

  // Payment Options
  const codEnabled = storeSettings?.codEnabled ?? true;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    codEnabled ? 'cod' : 'bank_transfer_concierge'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-[#0B0B0B] text-white min-h-[70vh] flex flex-col items-center justify-center p-8">
        <h2 className="font-serif text-2xl text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-400 mt-2 mb-6">
          Please add a timepiece to your bag before proceeding to checkout.
        </p>
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-[#C9A227] text-black text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
        >
          Return to Timepieces
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setError('Please provide your complete name, email address, and phone number.');
      return;
    }

    if (!shippingAddress.trim() || !city.trim()) {
      setError('Please specify your street address and delivery city.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        modelNumber: i.modelNumber,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        subtotal: i.price * i.quantity,
      }));

      const newOrder = await createOrder({
        userId: currentUser ? currentUser.uid : 'guest',
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        city: city.trim(),
        postalCode: postalCode.trim() || 'N/A',
        notes: notes.trim(),
        items: orderItems,
        subtotal,
        shippingFee,
        discount: 0,
        total,
        paymentMethod,
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
      });

      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setError(err.message || 'We were unable to process your order allocation. Please verify your details or contact our concierge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-[#C9A227] transition mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Boutique</span>
        </button>

        <div className="text-center sm:text-left mb-8 pb-6 border-b border-[#222222]">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
            ACQUISITION & COURIER DISPATCH
          </span>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">
            VIP Secure Checkout
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complimentary armored courier delivery with insured hand-off and certified authenticity papers.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xs bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Checkout Notice:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Customer & Shipping Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Client Identity */}
            <div className="bg-[#131313] p-6 rounded-sm border border-[#222222] space-y-4">
              <div className="flex items-center gap-2 text-white font-serif text-sm font-semibold border-b border-[#202020] pb-3">
                <User className="w-4 h-4 text-[#C9A227]" />
                <span>1. Client Identity & Communication</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Email Address (For Invoices) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="client@luxury.com"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Phone Number (For Delivery) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Destination Address */}
            <div className="bg-[#131313] p-6 rounded-sm border border-[#222222] space-y-4">
              <div className="flex items-center gap-2 text-white font-serif text-sm font-semibold border-b border-[#202020] pb-3">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span>2. Insured Delivery Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Street Address / Residence / Suite *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House 42, Horology Avenue, Executive District"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Islamabad / Lahore / Karachi / International"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="44000"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2.5 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Special Concierge / Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with executive security, request custom presentation box"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 px-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Protocol */}
            <div className="bg-[#131313] p-6 rounded-sm border border-[#222222] space-y-4">
              <div className="flex items-center gap-2 text-white font-serif text-sm font-semibold border-b border-[#202020] pb-3">
                <CreditCard className="w-4 h-4 text-[#C9A227]" />
                <span>3. Payment Protocol Selection</span>
              </div>

              <div className="space-y-3">
                {codEnabled && (
                  <label
                    className={`block p-4 rounded-sm border transition cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-[#1C180E] border-[#C9A227]'
                        : 'bg-[#101010] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-[#C9A227]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold text-white">
                            Cash on Delivery (VIP Inspection at Doorstep)
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Available
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          Inspect your luxury presentation case, certificates, and timepiece before releasing funds to our verified courier.
                        </p>
                      </div>
                    </div>
                  </label>
                )}

                <label
                  className={`block p-4 rounded-sm border transition cursor-pointer ${
                    paymentMethod === 'bank_transfer_concierge'
                      ? 'bg-[#1C180E] border-[#C9A227]'
                      : 'bg-[#101010] border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer_concierge"
                      checked={paymentMethod === 'bank_transfer_concierge'}
                      onChange={() => setPaymentMethod('bank_transfer_concierge')}
                      className="mt-1 accent-[#C9A227]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-semibold text-white">
                          VIP Direct Wire & Concierge Card Transfer
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Our boutique will reserve your allocation and dispatch official wire coordinates to your email. Verification is executed securely on our trusted backend.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#131313] p-6 rounded-sm border border-[#222222] sticky top-28 space-y-5">
              <h3 className="font-serif text-base font-semibold text-white border-b border-[#202020] pb-3">
                Timepiece Allocation Summary
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xs border border-neutral-800 bg-black shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#A8841B]">
                          {item.modelNumber}
                        </span>
                        <h4 className="font-serif font-semibold text-white line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center text-neutral-400 font-mono">
                        <span>Qty: {item.quantity}</span>
                        <span className="text-white font-semibold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="border-t border-[#202020] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Allocation Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Insured Armored Courier</span>
                  <span className="text-[#C9A227] font-semibold uppercase text-[11px]">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Authenticity Certificate & Box</span>
                  <span className="text-[#C9A227] font-semibold uppercase text-[11px]">
                    INCLUDED
                  </span>
                </div>
                <div className="border-t border-[#202020] pt-3 flex justify-between text-sm font-bold">
                  <span className="font-serif text-white">Final Total Due</span>
                  <span className="font-serif text-xl text-[#E5C76B]">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-[0.25em] rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Securing Allocation...' : 'Confirm Order & Dispatch'}</span>
              </button>

              <div className="text-[10px] text-neutral-500 text-center space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Backed by BIG BOSS WATCHES 5-Year Global Guarantee</span>
                </p>
                <p>Transactions securely recorded in Cloud Firestore database</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
