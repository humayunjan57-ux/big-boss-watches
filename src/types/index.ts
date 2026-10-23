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

export interface TestimonialItem {
  id: string;
  author: string;
  location: string;
  watchModel: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface StoreSettings {
  businessName: string;
  brandTitle?: string;
  brandSubtitle?: string;
  logoUrl?: string;
  crestUrl?: string;
  topBarTagline?: string;
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
  announcementActive?: boolean;

  // Hero Section
  heroBadge?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroPrimaryBtnText?: string;
  heroSecondaryBtnText?: string;
  trustBadges?: string[];

  // Collections Showcase
  collectionsSectionTitle?: string;
  collectionsSectionSubtitle?: string;
  collectionsSectionDesc?: string;
  noirTitle?: string;
  noirSubtitle?: string;
  noirDescription?: string;
  noirImageUrl?: string;
  royalTitle?: string;
  royalSubtitle?: string;
  royalDescription?: string;
  royalImageUrl?: string;

  // The Big Boss Code & Craftsmanship
  craftsmanshipBadge?: string;
  craftsmanshipTitle?: string;
  craftsmanshipDesc?: string;
  craftsmanshipImageUrl?: string;
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Title?: string;
  pillar3Desc?: string;

  // VIP Concierge & Acquisition
  vipConciergeTitle?: string;
  vipConciergeDesc?: string;
  vipWhatsappTitle?: string;
  vipWhatsappDesc?: string;
  codBoxTitle?: string;
  codBoxDesc?: string;

  // About Page
  aboutHeroTitle?: string;
  aboutHeroSubtitle?: string;
  aboutStoryTitle?: string;
  aboutStoryP1?: string;
  aboutStoryP2?: string;
  aboutStoryP3?: string;
  aboutQuote?: string;
  aboutCraftImageUrl?: string;

  // Testimonials & FAQs
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];

  // Footer & Legal
  footerAbout?: string;
  copyrightText?: string;

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
