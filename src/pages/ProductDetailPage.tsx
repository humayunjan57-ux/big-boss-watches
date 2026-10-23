import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Heart,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { WatchCard } from '../components/WatchCard';
import { useCart } from '../context/CartContext';
import { Product, StoreSettings } from '../types';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  storeSettings?: StoreSettings;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onInstantBuy: (product: Product, quantity: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  storeSettings,
  onBack,
  onSelectProduct,
  onInstantBuy,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const isNoir = product.collectionId === 'big-boss-noir';

  const whatsapp1 = storeSettings?.whatsAppNumbers?.[0] || '03098962803';
  const phone1 = storeSettings?.phones?.[0] || '03098962803';

  // Related products from same collection
  const related = allProducts
    .filter((p) => p.id !== product.id && p.collectionId === product.collectionId)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const formattedWhatsAppInquiry = `Hello BIG BOSS WATCHES, I am inquiring about the ${product.name} (Model: ${product.modelNumber}). Is this timepiece available for immediate dispatch?`;

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-[#C9A227] transition mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timepieces</span>
        </button>

        {/* Product Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image View */}
            <div className="relative aspect-[4/3] sm:aspect-[1/1] bg-[#121212] rounded-sm border border-[#222222] overflow-hidden flex items-center justify-center p-8 group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain max-h-[500px] group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute top-4 left-4">
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-xs backdrop-blur-md border ${
                    isNoir
                      ? 'bg-black/90 text-white border-neutral-700'
                      : 'bg-[#1a1608]/90 text-[#E5C76B] border-[#C9A227]/50'
                  }`}
                >
                  {isNoir ? 'NOIR SERIES' : 'ROYAL SERIES'}
                </span>
              </div>

              {product.featured && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-[#C9A227] text-black rounded-xs">
                    FLAGSHIP ALLOCATION
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden bg-[#141414] border-2 transition cursor-pointer shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#C9A227]'
                        : 'border-[#222222] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurance Strip under Gallery */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#1C1C1C] text-center text-xs">
              <div className="p-3 bg-[#131313] rounded-sm border border-[#202020]">
                <ShieldCheck className="w-5 h-5 text-[#C9A227] mx-auto mb-1.5" />
                <span className="text-white font-semibold block text-[11px] uppercase">
                  5-Year Warranty
                </span>
                <span className="text-neutral-400 text-[10px]">Swiss Standards</span>
              </div>
              <div className="p-3 bg-[#131313] rounded-sm border border-[#202020]">
                <Truck className="w-5 h-5 text-[#C9A227] mx-auto mb-1.5" />
                <span className="text-white font-semibold block text-[11px] uppercase">
                  Insured Delivery
                </span>
                <span className="text-neutral-400 text-[10px]">Armored Transport</span>
              </div>
              <div className="p-3 bg-[#131313] rounded-sm border border-[#202020]">
                <RotateCcw className="w-5 h-5 text-[#C9A227] mx-auto mb-1.5" />
                <span className="text-white font-semibold block text-[11px] uppercase">
                  7-Day Inspection
                </span>
                <span className="text-neutral-400 text-[10px]">Guaranteed Authenticity</span>
              </div>
            </div>
          </div>

          {/* Right: Product Spec & Purchase Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                <span className="text-[#C9A227] font-semibold tracking-wider">
                  MODEL: {product.modelNumber}
                </span>
                <span>CALIBRE: {product.specifications?.caseDiameter}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-serif text-3xl font-bold text-white">
                  ${effectivePrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-base text-neutral-500 line-through">
                    ${product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#C9A227]/15 text-[#E5C76B] border border-[#C9A227]/30">
                  Complimentary Insured Courier
                </span>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-4 flex items-center gap-2">
                {product.inStock && product.stockQuantity > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock — Ready for immediate allocation ({product.stockQuantity} remaining)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Currently Out of Stock / Allocation Reserved
                  </span>
                )}
              </div>
            </div>

            {/* Description & Story */}
            <div className="border-t border-[#1C1C1C] pt-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {product.description}
              </p>

              {product.story && (
                <div className="mt-3 p-3 bg-[#141414] border-l-2 border-[#C9A227] rounded-r-sm text-xs text-neutral-400 italic">
                  "{product.story}"
                </div>
              )}
            </div>

            {/* Quantity Selector and Purchase Actions */}
            {product.inStock && product.stockQuantity > 0 ? (
              <div className="border-t border-[#1C1C1C] pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-neutral-700 rounded bg-[#111111]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-[#C9A227] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                      className="p-2 hover:text-[#C9A227] transition disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    Max: {product.stockQuantity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#C9A227]/50 hover:border-[#C9A227] text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => onInstantBuy(product, quantity)}
                    className="w-full py-3.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#C9A227]/25"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {addedNotice && (
                  <div className="p-2.5 bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs rounded text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Timepiece successfully added to your boutique bag!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded text-center">
                <p className="text-xs text-neutral-400">
                  This allocation is presently claimed. Please contact our concierge to reserve the upcoming release.
                </p>
              </div>
            )}

            {/* Direct Concierge WhatsApp & Call Buttons */}
            <div className="border-t border-[#1C1C1C] pt-6">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                Direct Horologist Assistance
              </span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/92${whatsapp1.replace(/\D/g, '').replace(/^0/, '')}?text=${encodeURIComponent(formattedWhatsAppInquiry)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-xs font-semibold rounded-sm flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>

                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 bg-[#111111] hover:bg-[#1A1A1A] border border-neutral-700 hover:border-[#C9A227] text-neutral-200 text-xs font-semibold rounded-sm flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span>Call {phone1}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Technical Specifications Grid */}
        <section className="mt-20 pt-12 border-t border-[#222222]">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A227] block mb-1">
              HAUTE HORLOGERIE BLUEPRINT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Technical Specifications
            </h2>
            <div className="w-16 h-0.5 bg-[#C9A227] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Movement Architecture
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.movement || 'Swiss Calibre Automatic'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Case Metallurgy & Finish
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.caseMaterial || 'Grade 316L Surgical Steel'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Case Diameter
              </span>
              <p className="font-semibold text-white text-xs mt-1 font-mono">
                {product.specifications?.caseDiameter || '42 mm'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Dial Presentation
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.dialColor || 'Obsidian Sunburst Dial'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Strap & Clasp System
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.strapMaterial || 'Solid Stainless Steel Link'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Water Resistance Rating
              </span>
              <p className="font-semibold text-white text-xs mt-1 font-mono">
                {product.specifications?.waterResistance || '100M / 10 ATM'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Crystal Optics
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.glassType || 'Double-Curved Scratchproof Sapphire'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Power Reserve
              </span>
              <p className="font-semibold text-white text-xs mt-1 font-mono">
                {product.specifications?.powerReserve || '48 Hours'}
              </p>
            </div>

            <div className="p-4 bg-[#131313] border border-[#222222] rounded-sm">
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">
                Bezel Execution
              </span>
              <p className="font-semibold text-white text-xs mt-1">
                {product.specifications?.bezel || 'Hand-Finished Fixed Bezel'}
              </p>
            </div>
          </div>
        </section>

        {/* Related Timepieces */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#222222]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#C9A227] block">
                  EXPLORE SIBLING PIECES
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  More from {isNoir ? 'BIG BOSS NOIR' : 'BIG BOSS ROYAL'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <WatchCard
                  key={rel.id}
                  product={rel}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
