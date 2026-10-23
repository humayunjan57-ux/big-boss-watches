import React from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  storeSettings?: StoreSettings;
  onNavigate: (page: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  storeSettings,
  onNavigate,
}) => {
  const [copied, setCopied] = React.useState(false);

  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Hello BIG BOSS WATCHES, I have placed Order #${order.orderNumber} for $${order.total.toLocaleString()}. My name is ${order.customerName}. Please confirm allocation and dispatch timeline.`;

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header Box */}
        <div className="bg-[#131313] border border-[#C9A227]/40 rounded-sm p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#1C180E] border-2 border-[#C9A227] flex items-center justify-center mx-auto mb-5 text-[#C9A227]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-1">
            HAUTE HORLOGERIE ALLOCATION SECURED
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
            Order Confirmed
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mt-3 leading-relaxed">
            Thank you, <strong className="text-white">{order.customerName}</strong>. Your luxury timepiece order has been recorded in the BIG BOSS WATCHES vault ledger.
          </p>

          {/* Order Reference Box */}
          <div className="mt-8 p-4 bg-[#0B0B0B] border border-[#2A2A2A] rounded-sm max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                Order Tracking Reference
              </span>
              <span className="font-mono text-lg font-bold text-[#E5C76B]">
                {order.orderNumber}
              </span>
            </div>
            <button
              onClick={copyOrderNumber}
              className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-xs text-neutral-200 rounded border border-neutral-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Instant WhatsApp Confirmation CTA */}
          <div className="mt-8 pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm on WhatsApp ({whatsapp1})</span>
            </a>

            <button
              onClick={() => onNavigate('account')}
              className="w-full sm:w-auto px-6 py-3 bg-[#1C1C1C] hover:bg-[#282828] text-white border border-[#C9A227]/40 text-xs font-semibold uppercase tracking-wider rounded-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C9A227]" />
              <span>View in Client Portal</span>
            </button>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="mt-8 bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-lg font-semibold text-white border-b border-[#202020] pb-3">
            Summary of Allocated Timepieces
          </h3>

          <div className="divide-y divide-[#1F1F1F]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xs border border-neutral-800 bg-black"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-[#A8841B] block">
                      {item.modelNumber}
                    </span>
                    <h4 className="font-serif font-semibold text-white">{item.name}</h4>
                    <span className="text-neutral-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-serif font-bold text-white text-sm">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#202020] space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Courier Delivery</span>
              <span className="text-[#C9A227] font-semibold uppercase">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#202020]">
              <span className="font-serif">Total Due</span>
              <span className="font-serif text-lg text-[#E5C76B]">
                ${order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#202020] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-400">
            <div>
              <p className="text-white font-semibold uppercase tracking-wider text-[11px] mb-1">
                Delivery Destination:
              </p>
              <p>{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}, {order.postalCode}</p>
              <p>Phone: {order.customerPhone}</p>
            </div>
            <div>
              <p className="text-white font-semibold uppercase tracking-wider text-[11px] mb-1">
                Payment Protocol:
              </p>
              <p className="capitalize text-white">
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery (Doorstep Verification)'
                  : 'VIP Direct Wire / Concierge Transfer'}
              </p>
              <p className="mt-1">
                Order Status:{' '}
                <span className="text-[#C9A227] font-semibold uppercase">
                  {order.orderStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs uppercase tracking-widest text-[#C9A227] hover:underline cursor-pointer"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
