import React from 'react';
import { Eye, Shield, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface WatchCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const isNoir = product.collectionId === 'big-boss-noir';

  return (
    <div className="group relative bg-[#131313] rounded-sm border border-[#222222] hover:border-[#C9A227]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#C9A227]/5">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span
          className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs backdrop-blur-md border ${
            isNoir
              ? 'bg-black/80 text-white border-neutral-700'
              : 'bg-[#1a1608]/90 text-[#E5C76B] border-[#C9A227]/50'
          }`}
        >
          {isNoir ? 'NOIR SERIES' : 'ROYAL SERIES'}
        </span>

        {product.inStock && product.stockQuantity <= 5 ? (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-amber-950/80 text-amber-300 border border-amber-700/50">
            Allocation: {product.stockQuantity} Left
          </span>
        ) : product.inStock ? (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            In Stock
          </span>
        ) : (
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-red-950/80 text-red-400 border border-red-800/40">
            Allocation Reserved
          </span>
        )}
      </div>

      {/* Image Presentation */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-[4/4] bg-[#0E0E0E] overflow-hidden cursor-pointer flex items-center justify-center p-6 border-b border-[#1E1E1E]"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-3 bg-white text-black hover:bg-[#C9A227] rounded-full shadow-xl transition-transform hover:scale-110 cursor-pointer"
            title="Inspect Specifications"
          >
            <Eye className="w-4 h-4" />
          </button>
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="p-3 bg-[#C9A227] text-black hover:bg-[#E5C76B] rounded-full shadow-xl transition-transform hover:scale-110 cursor-pointer"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#A0A0A0] mb-1 font-mono">
            <span>{product.modelNumber}</span>
            <span>{product.specifications?.caseDiameter}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-serif text-base font-semibold text-white group-hover:text-[#E5C76B] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
            {product.specifications?.movement}
          </p>
        </div>

        {/* Price and Action */}
        <div className="mt-5 pt-4 border-t border-[#1C1C1C] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                ${effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
              Complimentary Delivery
            </span>
          </div>

          {product.inStock ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black text-[#E5C76B] border border-[#C9A227]/40 hover:border-[#C9A227] text-xs font-semibold uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag</span>
            </button>
          ) : (
            <button
              disabled
              className="px-3 py-1.5 bg-neutral-900 text-neutral-600 text-xs font-medium uppercase tracking-wider rounded-sm cursor-not-allowed border border-neutral-800"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
