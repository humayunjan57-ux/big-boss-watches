import React, { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { PolicyPages } from './pages/PolicyPages';
import { ProductDetailPage } from './pages/ProductDetailPage';
import {
  getCollections,
  getProducts,
  getStoreSettings,
  initializeStoreData,
  subscribeToStoreSettings,
} from './services/storeService';
import { Collection, Order, Product, StoreSettings } from './types';

function MainApp() {
  const { addToCart, setIsCartOpen } = useCart();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [contactOrderNumber, setContactOrderNumber] = useState<string>('');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Firestore Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | undefined>(undefined);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Initial Data Fetch & Firestore Bootstrap + Real-Time Subscriptions
  useEffect(() => {
    const init = async () => {
      try {
        await initializeStoreData();
        const [prods, colls, settings] = await Promise.all([
          getProducts(),
          getCollections(),
          getStoreSettings(),
        ]);
        setProducts(prods);
        setCollections(colls);
        setStoreSettings(settings);
      } catch (err) {
        console.warn('Initialization notice:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    init();

    // Subscribe to live store settings & CMS content changes from Firestore
    const unsubscribeSettings = subscribeToStoreSettings((liveSettings) => {
      setStoreSettings(liveSettings);
    });

    return () => {
      unsubscribeSettings();
    };
  }, []);

  // Scroll to top on page transition
  const handleNavigate = (page: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
    setPageParam(param);

    if (page === 'contact' && param) {
      setContactOrderNumber(param);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('product-detail');
  };

  const handleInstantBuy = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('order-confirmation');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col font-sans selection:bg-[#C9A227] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
        storeSettings={storeSettings}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            collections={collections}
            storeSettings={storeSettings}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            products={products}
            collections={collections}
            initialFilter={pageParam || 'all'}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            storeSettings={storeSettings}
            onBack={() => handleNavigate('collections')}
            onSelectProduct={handleSelectProduct}
            onInstantBuy={handleInstantBuy}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            storeSettings={storeSettings}
            onOrderSuccess={handleOrderSuccess}
            onCancel={() => handleNavigate('collections')}
          />
        )}

        {currentPage === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            storeSettings={storeSettings}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            onOpenAuth={() => setAuthModalOpen(true)}
            onNavigateContact={(ordNum) => handleNavigate('contact', ordNum)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            storeSettings={storeSettings}
            initialOrderNumber={contactOrderNumber}
            onNavigateFAQ={() => handleNavigate('policy-faq')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} storeSettings={storeSettings} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard />
        )}

        {currentPage === 'policy-faq' && (
          <PolicyPages
            policyType="faq"
            storeSettings={storeSettings}
            onBack={() => handleNavigate('home')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'policy-shipping' && (
          <PolicyPages
            policyType="shipping"
            storeSettings={storeSettings}
            onBack={() => handleNavigate('home')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'policy-returns' && (
          <PolicyPages
            policyType="returns"
            storeSettings={storeSettings}
            onBack={() => handleNavigate('home')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'policy-privacy' && (
          <PolicyPages
            policyType="privacy"
            storeSettings={storeSettings}
            onBack={() => handleNavigate('home')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'policy-terms' && (
          <PolicyPages
            policyType="terms"
            storeSettings={storeSettings}
            onBack={() => handleNavigate('home')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}
      </main>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        onCheckout={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentPage('checkout');
        }}
        onExplore={() => handleNavigate('collections')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Boutique Footer */}
      <Footer
        onNavigate={handleNavigate}
        storeSettings={storeSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
