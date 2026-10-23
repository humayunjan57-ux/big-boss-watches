export interface ProductSpecifications {
  movement: string;          // e.g., "Swiss Automatic Calibre BB-901"
  caseDiameter: string;      // e.g., "42 mm"
  caseMaterial: string;      // e.g., "DLC Coated 316L Stainless Steel" / "18K Gold PVD & Brushed Steel"
  dialColor: string;         // e.g., "Obsidian Matte Black with Super-LumiNova"
  strapMaterial: string;     // e.g., "Grade A Vulcanized FKM Rubber" / "Solid Stainless Steel Oyster Link"
  waterResistance: string;   // e.g., "200M / 20 ATM"
  glassType: string;         // e.g., "Anti-Reflective Double Curved Sapphire Crystal"
  powerReserve?: string;     // e.g., "48 Hours"
  bezel?: string;            // e.g., "Ceramic Unidirectional Rotating Bezel"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  modelNumber: string;
  collectionId: 'big-boss-noir' | 'big-boss-royal';
  price: number;
  salePrice?: number;
  description: string;
  story?: string;
  specifications: ProductSpecifications;
  images: string[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  isNewArrival: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: 'big-boss-noir' | 'big-boss-royal';
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  heroImage: string;
  accentColor: string;
  active: boolean;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  name: string;
  modelNumber: string;
  collectionId: 'big-boss-noir' | 'big-boss-royal';
  price: number;
  image: string;
  quantity: number;
  stockQuantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  modelNumber: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'pending_verification';
export type PaymentMethod = 'cod' | 'bank_transfer_concierge';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string; // auth uid or 'guest'
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt?: string;
}

export type InquiryCategory =
  | 'Product Information'
  | 'Order Status'
  | 'Shipping and Delivery'
  | 'Returns and Exchanges'
  | 'Payment Issues'
  | 'Warranty and Repairs'
  | 'Complaints and Feedback'
  | 'Business Partnerships'
  | 'Other Questions';

export type InquiryStatus = 'New' | 'In Progress' | 'Awaiting Customer' | 'Resolved' | 'Closed';

export interface ContactReply {
  sender: string;
  message: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: InquiryCategory;
  orderNumber?: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  status: InquiryStatus;
  assignedAdmin?: string;
  adminNotes?: string;
  responseHistory?: ContactReply[];
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  businessName: string;
  slogan: string;
  brandStatement: string;
  email: string;
  phones: string[];
  whatsAppNumbers: string[];
  address: string;
  supportHours: string;
  responseTime: string;
  currency: string;
  shippingFee: number;
  codEnabled: boolean;
  onlinePaymentNote: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  announcementText?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  adminEmails?: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt?: string;
}
