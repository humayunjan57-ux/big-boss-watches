import React, { useMemo, useState } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { WatchCard } from '../components/WatchCard';
import { Collection, Product } from '../types';

interface CollectionsPageProps {
  products: Product[];
  collections: Collection[];
  initialFilter?: string; // 'all' | 'noir' | 'royal' | 'featured' | 'new' | 'search:query'
  onSelectProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  products,
  collections,
  initialFilter = 'all',
  onSelectProduct,
}) => {
  // Parse initial query
  let defaultCollection = 'all';
  let defaultSearch = '';

  if (initialFilter === 'noir') defaultCollection = 'big-boss-noir';
  else if (initialFilter === 'royal') defaultCollection = 'big-boss-royal';
  else if (initialFilter.startsWith('search:')) {
    defaultSearch = decodeURIComponent(initialFilter.replace('search:', ''));
  }

  const [selectedCollection, setSelectedCollection] = useState<string>(defaultCollection);
  const [searchQuery, setSearchQuery] = useState<string>(defaultSearch);
  const [selectedMovement, setSelectedMovement] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Extract movements
  const movements = useMemo(() => {
    return ['Automatic', 'Tourbillon', 'Chronograph', 'Skeleton'];
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Collection filter
      if (selectedCollection !== 'all' && product.collectionId !== selectedCollection) {
        return false;
      }

      // Stock filter
      if (inStockOnly && (!product.inStock || product.stockQuantity <= 0)) {
        return false;
      }

      // Price filter
      const effectivePrice = product.salePrice ?? product.price;
      if (effectivePrice > priceMax) {
        return false;
      }

      // Movement filter
      if (selectedMovement !== 'all') {
        const mov = product.specifications?.movement?.toLowerCase() || '';
        const name = product.name.toLowerCase();
        if (!mov.includes(selectedMovement.toLowerCase()) && !name.includes(selectedMovement.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesModel = product.modelNumber.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesMov = product.specifications?.movement?.toLowerCase().includes(q);
        if (!matchesName && !matchesModel && !matchesDesc && !matchesMov) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCollection, inStockOnly, priceMax, selectedMovement, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCollection('all');
    setSearchQuery('');
    setSelectedMovement('all');
    setInStockOnly(false);
    setPriceMax(10000);
    setSortBy('featured');
  };

  const activeCollectionObj = collections.find((c) => c.id === selectedCollection);

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="mb-10 text-center sm:text-left border-b border-[#222222] pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
                HAUTE HORLOGERIE REPOSITORY
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                {activeCollectionObj ? activeCollectionObj.name : 'Master Watch Catalog'}
              </h1>
              <p className="text-xs text-neutral-400 mt-2 max-w-2xl leading-relaxed">
                {activeCollectionObj
                  ? activeCollectionObj.description
                  : 'Examine our complete portfolio of Swiss-caliber precision timepieces, crafted in obsidian DLC steel and 18K imperial gold.'}
              </p>
            </div>

            <div className="flex items-center gap-3 self-center sm:self-auto">
              <span className="text-xs text-neutral-400 font-mono">
                Showing <strong className="text-white">{filteredProducts.length}</strong> timepieces
              </span>
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="lg:hidden px-3 py-1.5 bg-[#171717] border border-[#C9A227]/40 text-[#E5C76B] text-xs font-semibold rounded flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout with Sidebar & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`lg:block ${
              showFiltersMobile ? 'block mb-6' : 'hidden'
            } bg-[#131313] p-6 rounded-sm border border-[#222222] space-y-6 self-start sticky top-28`}
          >
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <div className="flex items-center gap-2 text-white font-serif text-sm font-semibold">
                <Filter className="w-4 h-4 text-[#C9A227]" />
                <span>Refine Portfolio</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[10px] text-neutral-400 hover:text-[#C9A227] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                Search Model
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Tourbillon, Chrono..."
                  className="w-full bg-[#0A0A0A] border border-neutral-700 focus:border-[#C9A227] rounded-sm py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Collection Selector */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                Collection Series
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCollection('all')}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition flex items-center justify-between cursor-pointer ${
                    selectedCollection === 'all'
                      ? 'bg-[#C9A227] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>All Series</span>
                  <span className="text-[10px] opacity-75">{products.length}</span>
                </button>
                <button
                  onClick={() => setSelectedCollection('big-boss-noir')}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition flex items-center justify-between cursor-pointer ${
                    selectedCollection === 'big-boss-noir'
                      ? 'bg-[#C9A227] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>BIG BOSS NOIR</span>
                  <span className="text-[10px] opacity-75">
                    {products.filter((p) => p.collectionId === 'big-boss-noir').length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedCollection('big-boss-royal')}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition flex items-center justify-between cursor-pointer ${
                    selectedCollection === 'big-boss-royal'
                      ? 'bg-[#C9A227] text-black font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>BIG BOSS ROYAL</span>
                  <span className="text-[10px] opacity-75">
                    {products.filter((p) => p.collectionId === 'big-boss-royal').length}
                  </span>
                </button>
              </div>
            </div>

            {/* Movement Filter */}
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                Movement Architecture
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedMovement('all')}
                  className={`px-2 py-1.5 text-[11px] rounded text-center transition cursor-pointer ${
                    selectedMovement === 'all'
                      ? 'bg-neutral-700 text-white font-semibold'
                      : 'bg-[#0E0E0E] text-neutral-400 hover:text-white'
                  }`}
                >
                  All Types
                </button>
                {movements.map((mov) => (
                  <button
                    key={mov}
                    onClick={() => setSelectedMovement(mov)}
                    className={`px-2 py-1.5 text-[11px] rounded text-center transition cursor-pointer truncate ${
                      selectedMovement === mov
                        ? 'bg-[#C9A227] text-black font-semibold'
                        : 'bg-[#0E0E0E] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mov}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Price Limit
                </label>
                <span className="text-xs font-mono text-[#E5C76B] font-semibold">
                  Up to ${priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="10000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#C9A227] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                <span>$2,000</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-2 border-t border-[#202020]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-700 text-[#C9A227] focus:ring-0"
                />
                <span>In Stock & Ready to Dispatch Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort Bar */}
            <div className="bg-[#131313] px-4 py-3 rounded-sm border border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-400">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Direct allocation from Geneva vault</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-neutral-400">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#0B0B0B] border border-neutral-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#C9A227] cursor-pointer"
                >
                  <option value="featured">Featured Allocations</option>
                  <option value="newest">Newest 2026 Novelties</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#121212] border border-[#222222] rounded-sm p-16 text-center">
                <h3 className="font-serif text-xl text-white">No Matching Timepieces Found</h3>
                <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto">
                  No watches met your selected filter criteria. Try adjusting your price range, movement type, or search keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#C9A227] text-black font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#E5C76B] transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <WatchCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
