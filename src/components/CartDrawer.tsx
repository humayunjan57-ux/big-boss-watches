import React from 'react';
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExplore }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-[#C9A227]/30 text-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
              <h2 className="font-serif text-lg font-semibold tracking-wider text-white">
                Boutique Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#1C1C1C] border border-[#C9A227]/25 flex items-center justify-center text-[#C9A227] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-75" />
                </div>
                <h3 className="font-serif text-lg text-white">Your Bag is Empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mt-2 mb-6">
                  Experience the precision and power of the Big Boss Noir and Royal horology collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExplore();
                  }}
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition cursor-pointer"
                >
                  Explore Timepieces
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 bg-[#171717] rounded-sm border border-[#242424] flex gap-4 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xs border border-neutral-800 bg-[#0B0B0B] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#A8841B] uppercase tracking-wider">
                          {item.modelNumber}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-neutral-500 hover:text-red-400 transition cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs font-serif text-[#E5C76B] mt-0.5">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#222222]">
                      <div className="flex items-center border border-neutral-700 rounded bg-[#0F0F0F]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:text-[#C9A227] transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          className="p-1 hover:text-[#C9A227] transition disabled:opacity-30 disabled:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-semibold text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 bg-[#0E0E0E] border-t border-[#222222] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span>Insured White-Glove Courier</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  </span>
                  <span className="text-[#C9A227] uppercase font-semibold text-[11px]">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="pt-2 border-t border-[#1F1F1F] flex justify-between text-sm font-bold">
                  <span className="font-serif text-white">Estimated Total</span>
                  <span className="font-serif text-lg text-[#E5C76B]">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#C9A227]/20"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest">
                Protected by 256-Bit SSL • Concierge Verification
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
