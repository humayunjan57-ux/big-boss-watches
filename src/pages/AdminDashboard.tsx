import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Crown,
  Edit2,
  FileText,
  Filter,
  MessageCircle,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  addContactMessageReply,
  addProduct,
  deleteProduct,
  getAllContactMessagesAdmin,
  getAllOrdersAdmin,
  getAllProductsAdmin,
  getStoreSettings,
  initializeStoreData,
  updateContactMessageStatus,
  updateOrderStatus,
  updateProduct,
  updateStoreSettings,
} from '../services/storeService';
import {
  ContactMessage,
  InquiryStatus,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('Armored Express Courier');

  // Inquiry detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<ContactMessage | null>(null);
  const [newInquiryStatus, setNewInquiryStatus] = useState<InquiryStatus>('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  // Filters & searches
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  const showNotice = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, ords, inqs, sets] = await Promise.all([
        getAllProductsAdmin(),
        getAllOrdersAdmin(),
        getAllContactMessagesAdmin(),
        getStoreSettings(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setInquiries(inqs);
      setSettings(sets);
    } catch (err) {
      console.warn('Error loading admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0B0B0B] p-4 text-white">
        <div className="max-w-md w-full bg-[#131313] border border-red-900/60 rounded-sm p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400 mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
            Unauthorized Access
          </h2>
          <p className="text-xs text-neutral-400 mt-2 mb-4 leading-relaxed">
            The Administration Suite is strictly restricted to verified BIG BOSS WATCHES personnel.
          </p>
          <p className="text-[11px] text-neutral-500 font-mono">
            Signed in as: {currentUser?.email || 'Anonymous'}
          </p>
        </div>
      </div>
    );
  }

  // Calculated Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= 3).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchEmail) return false;
    }
    return true;
  });

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((i) => {
    if (inquiryStatusFilter !== 'all' && i.status !== inquiryStatusFilter) return false;
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase();
      const matchId = i.id.toLowerCase().includes(q);
      const matchSub = i.subject.toLowerCase().includes(q);
      const matchName = i.name.toLowerCase().includes(q);
      const matchEmail = i.email.toLowerCase().includes(q);
      const matchOrd = (i.orderNumber || '').toLowerCase().includes(q);
      if (!matchId && !matchSub && !matchName && !matchEmail && !matchOrd) return false;
    }
    return true;
  });

  // Handlers
  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, newOrderStatus, {
        trackingNumber: trackingNumber.trim() || undefined,
        carrier: carrier.trim() || undefined,
      });
      showNotice(`Order #${selectedOrder.orderNumber} status updated to ${newOrderStatus}`);
      setSelectedOrder(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      await updateContactMessageStatus(selectedInquiry.id, newInquiryStatus, adminNotes);
      showNotice(`Inquiry #${selectedInquiry.id} updated`);
      setSelectedInquiry(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error updating inquiry: ${err.message}`);
    }
  };

  const handleSendInquiryReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    try {
      await addContactMessageReply(selectedInquiry.id, replyMessage.trim());
      showNotice(`Reply recorded and customer notified.`);
      setReplyMessage('');
      setSelectedInquiry(null);
      loadAllData();
    } catch (err: any) {
      alert(`Error dispatching reply: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name} from the catalog?`)) return;
    try {
      await deleteProduct(id);
      showNotice(`Deleted ${name}`);
      loadAllData();
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  const handleBootstrapSeeding = async () => {
    if (!confirm('Re-seed initial luxury timepieces and settings to Firestore? Existing items will be preserved/merged.')) return;
    try {
      await initializeStoreData(true);
      showNotice('Timepiece catalog successfully re-seeded to Firestore!');
      loadAllData();
    } catch (err: any) {
      alert(`Seeding failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-[#121212] border border-[#C9A227]/40 rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wider">
                  BIG BOSS WATCHES — ADMINISTRATION
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700 rounded">
                  Live Firestore Active
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Logged in: <strong className="text-white">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBootstrapSeeding}
              className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-neutral-700 hover:border-[#C9A227] text-neutral-300 text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
              title="Seed or verify default catalog items in database"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Seed Catalog</span>
            </button>
            <button
              onClick={loadAllData}
              className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-neutral-700 text-white rounded cursor-pointer"
              title="Refresh All Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#222222]">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: Crown },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageCircle, badge: newInquiriesCount },
            { id: 'settings', label: 'Store & Concierge Config', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm transition flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#C9A227] text-black font-bold'
                    : 'bg-[#141414] text-neutral-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-mono">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW METRICS */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  Total Catalog Sales
                </span>
                <p className="font-serif text-3xl font-bold text-[#E5C76B] mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Across {totalOrdersCount} completed allocations
                </span>
              </div>

              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  Pending Orders
                </span>
                <p className="font-serif text-3xl font-bold text-white mt-2">
                  {orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing').length}
                </p>
                <span className="text-[11px] text-amber-400 mt-1 block">
                  Awaiting courier preparation
                </span>
              </div>

              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  New Customer Inquiries
                </span>
                <p className="font-serif text-3xl font-bold text-[#25D366] mt-2">
                  {newInquiriesCount}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Require concierge response
                </span>
              </div>

              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                  Low Stock Allocations
                </span>
                <p className="font-serif text-3xl font-bold text-amber-300 mt-2">
                  {lowStockCount}
                </p>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Watches with &lt;= 3 remaining
                </span>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Orders Overview */}
              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#202020] pb-3">
                  <h3 className="font-serif text-base font-semibold text-white">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C9A227] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrder(o);
                          setNewOrderStatus(o.orderStatus);
                          setTrackingNumber(o.trackingNumber || '');
                          setCarrier(o.carrier || 'Armored Express Courier');
                        }}
                        className="p-3 bg-[#171717] hover:bg-[#1E1E1E] rounded-sm border border-[#222222] flex items-center justify-between text-xs cursor-pointer transition"
                      >
                        <div>
                          <span className="font-mono text-[#E5C76B] font-bold">
                            #{o.orderNumber}
                          </span>
                          <p className="text-white font-medium mt-0.5">{o.customerName}</p>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-white block">
                            ${o.total.toLocaleString()}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-[#C9A227]">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Inquiries Overview */}
              <div className="bg-[#131313] border border-[#222222] p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#202020] pb-3">
                  <h3 className="font-serif text-base font-semibold text-white">
                    Unresolved Concierge Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-[#C9A227] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">No customer inquiries.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setNewInquiryStatus(inq.status);
                          setAdminNotes(inq.adminNotes || '');
                        }}
                        className="p-3 bg-[#171717] hover:bg-[#1E1E1E] rounded-sm border border-[#222222] flex items-center justify-between text-xs cursor-pointer transition"
                      >
                        <div className="max-w-[75%]">
                          <span className="text-[10px] font-mono text-[#C9A227] uppercase">
                            {inq.category}
                          </span>
                          <h4 className="font-semibold text-white truncate">{inq.subject}</h4>
                          <span className="text-[10px] text-neutral-400">
                            From: {inq.name} ({inq.email})
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131313] p-4 rounded-sm border border-[#222222]">
              <span className="text-xs text-neutral-400 font-mono">
                Catalog Portfolio: <strong className="text-white">{products.length}</strong> timepieces
              </span>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Timepiece</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#131313] rounded-sm border border-[#222222] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
                      <span className="text-[#C9A227]">{p.modelNumber}</span>
                      <span className="uppercase">{p.collectionId}</span>
                    </div>

                    <div className="aspect-[4/3] bg-black rounded-xs overflow-hidden mb-3 border border-neutral-800">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-serif text-sm font-semibold text-white line-clamp-1">
                      {p.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif font-bold text-white text-base">
                        ${(p.salePrice ?? p.price).toLocaleString()}
                      </span>
                      {p.salePrice && (
                        <span className="text-xs text-neutral-500 line-through">
                          ${p.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                      {p.specifications?.movement}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-mono">
                        Stock:{' '}
                        <strong className={p.stockQuantity <= 3 ? 'text-amber-400' : 'text-emerald-400'}>
                          {p.stockQuantity}
                        </strong>
                      </span>
                      {p.featured && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#C9A227]/20 text-[#E5C76B] border border-[#C9A227]/30 rounded uppercase font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#202020] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProductModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-neutral-700 text-xs font-semibold rounded text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 border border-red-800 text-xs text-red-300 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-[#131313] p-4 rounded-sm border border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, client name, email..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 pl-9 pr-3 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-neutral-400">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#0B0B0B] border border-neutral-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#C9A227] cursor-pointer"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#131313] border border-[#222222] rounded-sm p-12 text-center text-xs text-neutral-400">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="bg-[#131313] rounded-sm border border-[#222222] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0E0E0E] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#202020]">
                    <tr>
                      <th className="py-3 px-4">Order Reference</th>
                      <th className="py-3 px-4">Client Identity</th>
                      <th className="py-3 px-4">Allocated Items</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#161616] transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#E5C76B]">
                          #{ord.orderNumber}
                          <span className="text-[10px] text-neutral-500 block font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{ord.customerName}</span>
                          <span className="text-neutral-400 text-[11px] block">{ord.customerEmail}</span>
                          <span className="text-neutral-500 text-[10px] font-mono">{ord.customerPhone}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-neutral-300">
                            {ord.items.length} timepiece{ord.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate max-w-[180px]">
                            {ord.items.map((i) => i.name).join(', ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-white text-sm">
                          ${ord.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono text-neutral-300">
                          {ord.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct Wire'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : ord.orderStatus === 'shipped'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : ord.orderStatus === 'confirmed'
                                ? 'bg-blue-950 text-blue-300 border-blue-800'
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewOrderStatus(ord.orderStatus);
                              setTrackingNumber(ord.trackingNumber || '');
                              setCarrier(ord.carrier || 'Armored Express Courier');
                            }}
                            className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black border border-[#C9A227]/40 text-[#C9A227] font-semibold rounded text-[11px] transition cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INQUIRIES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="bg-[#131313] p-4 rounded-sm border border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Search by ID, client, subject, order #..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 pl-9 pr-3 text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-neutral-400">Status:</span>
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="bg-[#0B0B0B] border border-neutral-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-[#C9A227] cursor-pointer"
                >
                  <option value="all">All Inquiries ({inquiries.length})</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting Customer">Awaiting Customer</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table */}
            {filteredInquiries.length === 0 ? (
              <div className="bg-[#131313] border border-[#222222] rounded-sm p-12 text-center text-xs text-neutral-400">
                No customer inquiries match your filter criteria.
              </div>
            ) : (
              <div className="bg-[#131313] rounded-sm border border-[#222222] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0E0E0E] text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#202020]">
                    <tr>
                      <th className="py-3 px-4">Ref ID / Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Subject & Excerpt</th>
                      <th className="py-3 px-4">Order Link</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F]">
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-[#161616] transition">
                        <td className="py-3 px-4 font-mono">
                          <span className="text-[#C9A227] font-bold block">
                            {inq.id.substring(0, 14)}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{inq.name}</span>
                          <span className="text-neutral-400 text-[11px] block">{inq.email}</span>
                          {inq.phone && (
                            <span className="text-neutral-500 text-[10px] font-mono">{inq.phone}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold text-neutral-300">
                            {inq.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-semibold text-white block truncate">{inq.subject}</span>
                          <span className="text-neutral-400 text-[11px] block truncate">{inq.message}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-300">
                          {inq.orderNumber ? `#${inq.orderNumber}` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              inq.status === 'New'
                                ? 'bg-red-950 text-red-300 border border-red-700'
                                : inq.status === 'Resolved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNewInquiryStatus(inq.status);
                              setAdminNotes(inq.adminNotes || '');
                            }}
                            className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#C9A227] hover:text-black border border-[#C9A227]/40 text-[#C9A227] font-semibold rounded text-[11px] transition cursor-pointer"
                          >
                            Review & Reply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STORE & CONCIERGE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && settings && (
          <div className="bg-[#131313] border border-[#222222] rounded-sm p-6 sm:p-8 max-w-3xl space-y-6">
            <div className="border-b border-[#202020] pb-4">
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Boutique Identity & Concierge Setup
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure official client contact numbers, email addresses, and checkout policies.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateStoreSettings(settings);
                  showNotice('Store configuration saved to Firestore!');
                } catch (err: any) {
                  alert(`Failed to save settings: ${err.message}`);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Primary Slogan
                  </label>
                  <input
                    type="text"
                    value={settings.slogan}
                    onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Official Client Support Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Primary Telephone & WhatsApp (Line 1)
                  </label>
                  <input
                    type="text"
                    value={settings.phones[0] || ''}
                    onChange={(e) => {
                      const newPhones = [...settings.phones];
                      newPhones[0] = e.target.value;
                      const newWa = [...settings.whatsAppNumbers];
                      newWa[0] = e.target.value;
                      setSettings({ ...settings, phones: newPhones, whatsAppNumbers: newWa });
                    }}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Secondary Telephone & WhatsApp (Line 2)
                  </label>
                  <input
                    type="text"
                    value={settings.phones[1] || ''}
                    onChange={(e) => {
                      const newPhones = [...settings.phones];
                      newPhones[1] = e.target.value;
                      const newWa = [...settings.whatsAppNumbers];
                      newWa[1] = e.target.value;
                      setSettings({ ...settings, phones: newPhones, whatsAppNumbers: newWa });
                    }}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Flagship Boutique Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Concierge Hours
                  </label>
                  <input
                    type="text"
                    value={settings.supportHours}
                    onChange={(e) => setSettings({ ...settings, supportHours: e.target.value })}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Expected Response Speed
                  </label>
                  <input
                    type="text"
                    value={settings.responseTime}
                    onChange={(e) => setSettings({ ...settings, responseTime: e.target.value })}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Header Announcement Bar Text
                </label>
                <input
                  type="text"
                  value={settings.announcementText || ''}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded-sm py-2 px-3 text-white focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* COD Toggle */}
              <div className="p-4 bg-[#181818] rounded-sm border border-neutral-700 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Enable Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-neutral-400">
                    Permits clients to inspect timepieces before releasing funds at doorstep.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#C9A227] cursor-pointer"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer"
                >
                  Save Boutique Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ORDER DETAILS & STATUS UPDATE */}
        {/* ========================================================================= */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141414] border border-[#C9A227]/40 rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Order Inspection
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase text-neutral-300">
                  Allocated Timepieces:
                </span>
                <div className="divide-y divide-[#202020] bg-[#0E0E0E] p-3 rounded border border-neutral-800">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <span className="text-neutral-400 text-[10px] font-mono">
                            {item.modelNumber} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client & Shipping Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#0E0E0E] p-4 rounded border border-neutral-800">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                    Client Details
                  </span>
                  <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                  <p className="text-neutral-300">{selectedOrder.customerEmail}</p>
                  <p className="text-neutral-300 font-mono">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                    Courier Address
                  </span>
                  <p className="text-neutral-200">{selectedOrder.shippingAddress}</p>
                  <p className="text-neutral-200">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                  {selectedOrder.notes && (
                    <p className="text-amber-300 text-[11px] mt-1 italic">
                      Note: {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update Form */}
              <div className="border-t border-[#222222] pt-4 space-y-4">
                <h4 className="font-serif text-sm font-semibold text-white">
                  Update Dispatch & Milestone Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                      Order Status
                    </label>
                    <select
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                      className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                      Carrier Name
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Armored Express"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-mono mb-1">
                      Tracking Reference
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="TRK-99014"
                      className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs rounded hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdateOrderStatus}
                    className="px-5 py-2 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded"
                  >
                    Commit Status Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: INQUIRY REVIEW & REPLY */}
        {/* ========================================================================= */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141414] border border-[#C9A227]/40 rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#C9A227] uppercase">
                    {selectedInquiry.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {selectedInquiry.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Inquiry Message Box */}
              <div className="bg-[#0B0B0B] border border-neutral-800 p-4 rounded-sm space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <span>
                    From: <strong className="text-white">{selectedInquiry.name}</strong> ({selectedInquiry.email})
                  </span>
                  <span>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                </div>
                {selectedInquiry.phone && (
                  <p className="text-neutral-400 text-[11px]">
                    Phone: <span className="font-mono text-white">{selectedInquiry.phone}</span>
                  </p>
                )}
                {selectedInquiry.orderNumber && (
                  <p className="text-[#E5C76B] text-[11px] font-mono">
                    Related Order: #{selectedInquiry.orderNumber}
                  </p>
                )}
                <div className="pt-2 border-t border-[#1C1C1C]">
                  <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {/* Response History */}
              {selectedInquiry.responseHistory && selectedInquiry.responseHistory.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-semibold text-neutral-300">
                    Prior Responses:
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedInquiry.responseHistory.map((rep, idx) => (
                      <div key={idx} className="p-3 bg-[#1A1A1A] rounded text-xs border border-neutral-800">
                        <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                          <span className="font-semibold text-[#E5C76B]">{rep.sender}</span>
                          <span>{new Date(rep.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-neutral-200">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Dispatch Form */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-white">
                  Send Response to Client
                </label>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Draft your executive concierge reply to the customer..."
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C9A227]"
                />
                <button
                  onClick={handleSendInquiryReply}
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Response</span>
                </button>
              </div>

              {/* Status & Internal Notes */}
              <div className="border-t border-[#222222] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                    Inquiry Status
                  </label>
                  <select
                    value={newInquiryStatus}
                    onChange={(e) => setNewInquiryStatus(e.target.value as InquiryStatus)}
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Customer">Awaiting Customer</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">
                    Internal Staff Notes (Private)
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Staff notes visible only to admins"
                    className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs rounded hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateInquiry}
                  className="px-5 py-2 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold text-xs uppercase tracking-wider rounded"
                >
                  Save Status & Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADD / EDIT TIMEPIECE */}
        {/* ========================================================================= */}
        {productModalOpen && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => {
              setProductModalOpen(false);
              setEditingProduct(null);
            }}
            onSaveSuccess={(msg) => {
              setProductModalOpen(false);
              setEditingProduct(null);
              showNotice(msg);
              loadAllData();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Sub-component for product adding / editing
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSaveSuccess: (msg: string) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSaveSuccess }) => {
  const [name, setName] = useState(product?.name || '');
  const [modelNumber, setModelNumber] = useState(product?.modelNumber || '');
  const [collectionId, setCollectionId] = useState<'big-boss-noir' | 'big-boss-royal'>(
    product?.collectionId || 'big-boss-noir'
  );
  const [price, setPrice] = useState(product?.price?.toString() || '3500');
  const [salePrice, setSalePrice] = useState(product?.salePrice?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [story, setStory] = useState(product?.story || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '10');
  const [featured, setFeatured] = useState(product?.featured ?? true);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);

  // Specifications
  const [movement, setMovement] = useState(product?.specifications?.movement || 'Swiss Calibre Automatic (28,800 vph)');
  const [caseDiameter, setCaseDiameter] = useState(product?.specifications?.caseDiameter || '42 mm');
  const [caseMaterial, setCaseMaterial] = useState(product?.specifications?.caseMaterial || 'Grade 316L Surgical Steel DLC');
  const [dialColor, setDialColor] = useState(product?.specifications?.dialColor || 'Obsidian Matte Black');
  const [strapMaterial, setStrapMaterial] = useState(product?.specifications?.strapMaterial || 'FKM Vulcanized Rubber & Deployant');
  const [waterResistance, setWaterResistance] = useState(product?.specifications?.waterResistance || '200M / 20 ATM');
  const [glassType, setGlassType] = useState(product?.specifications?.glassType || 'Double-Curved Anti-Reflective Sapphire');
  const [powerReserve, setPowerReserve] = useState(product?.specifications?.powerReserve || '48 Hours');

  // Images
  const [imagesText, setImagesText] = useState(
    product?.images?.join('\n') ||
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85'
  );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const parsedImages = imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const parsedPrice = parseFloat(price) || 0;
      const parsedSalePrice = salePrice ? parseFloat(salePrice) : undefined;
      const parsedStock = parseInt(stockQuantity, 10) || 0;

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
        name,
        slug,
        modelNumber,
        collectionId,
        price: parsedPrice,
        ...(parsedSalePrice ? { salePrice: parsedSalePrice } : {}),
        description,
        story,
        specifications: {
          movement,
          caseDiameter,
          caseMaterial,
          dialColor,
          strapMaterial,
          waterResistance,
          glassType,
          powerReserve,
        },
        images: parsedImages.length > 0 ? parsedImages : [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85'
        ],
        stockQuantity: parsedStock,
        inStock: parsedStock > 0,
        featured,
        isNewArrival,
        active: true,
      };

      if (product) {
        await updateProduct(product.id, payload);
        onSaveSuccess(`Updated timepiece ${name}`);
      } else {
        await addProduct(payload);
        onSaveSuccess(`Added new timepiece ${name}`);
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#141414] border border-[#C9A227]/40 rounded-sm max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <h3 className="font-serif text-lg font-bold text-white">
            {product ? `Edit Timepiece: ${product.name}` : 'Add New Luxury Timepiece'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Timepiece Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Big Boss Noir Apex Chrono"
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Model Number *
              </label>
              <input
                type="text"
                required
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="BB-N05-APEX"
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Collection *
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value as any)}
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
              >
                <option value="big-boss-noir">BIG BOSS NOIR</option>
                <option value="big-boss-royal">BIG BOSS ROYAL</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Retail Price ($) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Sale Price ($)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Optional"
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
              Horology Heritage Story
            </label>
            <input
              type="text"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="e.g. Crafted in Geneva for titans of industry..."
              className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white"
            />
          </div>

          {/* Specifications */}
          <div className="border-t border-[#222222] pt-3">
            <span className="text-[11px] uppercase font-bold text-[#E5C76B] block mb-2">
              Horological Specifications
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Movement</label>
                <input
                  type="text"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Diameter</label>
                <input
                  type="text"
                  value={caseDiameter}
                  onChange={(e) => setCaseDiameter(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Case Material</label>
                <input
                  type="text"
                  value={caseMaterial}
                  onChange={(e) => setCaseMaterial(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Dial Color</label>
                <input
                  type="text"
                  value={dialColor}
                  onChange={(e) => setDialColor(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Strap</label>
                <input
                  type="text"
                  value={strapMaterial}
                  onChange={(e) => setStrapMaterial(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Water Resistance</label>
                <input
                  type="text"
                  value={waterResistance}
                  onChange={(e) => setWaterResistance(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Glass Type</label>
                <input
                  type="text"
                  value={glassType}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-0.5">Power Reserve</label>
                <input
                  type="text"
                  value={powerReserve}
                  onChange={(e) => setPowerReserve(e.target.value)}
                  className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-1.5 text-white text-[11px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 uppercase mb-1">
              Image URLs (One per line)
            </label>
            <textarea
              rows={3}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0B0B0B] border border-neutral-700 rounded p-2 text-white font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#C9A227]"
              />
              <span className="text-neutral-300">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="accent-[#C9A227]"
              />
              <span className="text-neutral-300">Mark as 2026 Novelty</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#C9A227] hover:bg-[#E5C76B] text-black font-bold uppercase tracking-wider rounded"
            >
              {saving ? 'Saving Timepiece...' : 'Save Timepiece'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
