import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  deleteDoc
} from 'firebase/firestore';
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/initialData';
import {
  auth,
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase/config';
import {
  Collection,
  ContactMessage,
  InquiryStatus,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from '../types';

let isSeeding = false;

/**
 * Ensures the database contains the initial luxury watch catalog, collections, and boutique settings.
 */
export async function initializeStoreData(force = false): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Check or initialize Store Settings
    const settingsRef = doc(db, 'settings', 'store');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists() || force) {
      await setDoc(settingsRef, INITIAL_STORE_SETTINGS, { merge: true });
    } else {
      const data = settingsSnap.data() as StoreSettings;
      if (data.announcementText && data.announcementText.includes('EXCLUSIVE 2026 HOROLOGY RELEASE')) {
        await setDoc(settingsRef, { announcementText: '' }, { merge: true });
      }
    }

    // 2. Check or initialize Collections
    const collectionsRef = collection(db, 'collections');
    const collSnap = await getDocs(collectionsRef);
    if (collSnap.empty || force) {
      for (const coll of INITIAL_COLLECTIONS) {
        await setDoc(doc(db, 'collections', coll.id), coll);
      }
    }

    // 3. Check or initialize Products
    const productsRef = collection(db, 'products');
    const prodSnap = await getDocs(productsRef);
    if (prodSnap.empty || force) {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    // 4. Ensure bootstrap admin document exists
    const adminRef = doc(db, 'admins', 'super-admin');
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        email: BOOTSTRAP_ADMIN_EMAIL,
        role: 'super-admin',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('Initial store bootstrap notice (rules may require signed-in admin for writes):', error);
  } finally {
    isSeeding = false;
  }
}

// ========================
// ZERO-DELAY LOCAL CACHE HELPERS
// ========================
const CACHE_KEY_SETTINGS = 'bbw_cached_store_settings';
const CACHE_KEY_PRODUCTS = 'bbw_cached_products';
const CACHE_KEY_COLLECTIONS = 'bbw_cached_collections';

export function getCachedStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return INITIAL_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem(CACHE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...INITIAL_STORE_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_STORE_SETTINGS;
}

export function setCachedStoreSettings(settings: Partial<StoreSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCachedStoreSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(CACHE_KEY_SETTINGS, JSON.stringify(updated));
  } catch (e) {
    // fallback
  }
}

export function getCachedProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(CACHE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_PRODUCTS;
}

export function setCachedProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    // fallback
  }
}

export function getCachedCollections(): Collection[] {
  if (typeof window === 'undefined') return INITIAL_COLLECTIONS;
  try {
    const raw = localStorage.getItem(CACHE_KEY_COLLECTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_COLLECTIONS;
}

export function setCachedCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY_COLLECTIONS, JSON.stringify(collections));
  } catch (e) {
    // fallback
  }
}

// ========================
// PRODUCTS & COLLECTIONS
// ========================

export async function getProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const q = query(collection(db, path), where('active', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return getCachedProducts();
    }

    const prods = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
    setCachedProducts(prods);
    return prods;
  } catch (error) {
    console.warn('Serving cached luxury timepiece catalog:', error);
    return getCachedProducts();
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const path = 'products';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      return getCachedProducts();
    }
    const prods = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
    setCachedProducts(prods);
    return prods;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const path = `products/${id}`;
  try {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Product, 'id'>) };
    }
    const cached = getCachedProducts();
    const found = cached.find(p => p.id === id);
    return found || null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const path = 'products';
  try {
    const q = query(collection(db, path), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...(d.data() as Omit<Product, 'id'>) };
    }
    const cached = getCachedProducts();
    const found = cached.find(p => p.slug === slug);
    return found || null;
  } catch (error) {
    const cached = getCachedProducts();
    const found = cached.find(p => p.slug === slug);
    return found || null;
  }
}

export async function getCollections(): Promise<Collection[]> {
  const path = 'collections';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      return getCachedCollections();
    }
    const colls = snapshot.docs.map(d => ({ id: d.id as 'big-boss-noir' | 'big-boss-royal', ...(d.data() as Omit<Collection, 'id'>) }));
    setCachedCollections(colls);
    return colls;
  } catch (error) {
    return getCachedCollections();
  }
}

/**
 * Helper to recursively remove undefined properties before saving to Firestore.
 * Prevents Firestore "Unsupported field value: undefined" runtime errors.
 */
function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = cleanFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'products';
  try {
    const newId = product.slug || `bb-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    // Optimistic cache update
    const currentCached = getCachedProducts();
    setCachedProducts([newProduct, ...currentCached.filter(p => p.id !== newId)]);

    const cleaned = cleanFirestoreData(newProduct);
    await setDoc(doc(db, path, newId), cleaned);
    return newId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const path = `products/${id}`;
  try {
    // Optimistic cache update
    const currentCached = getCachedProducts();
    setCachedProducts(currentCached.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));

    const ref = doc(db, 'products', id);
    const cleaned = cleanFirestoreData({
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    // Use setDoc with merge: true so if the watch came from initial static catalog, it creates/updates seamlessly
    await setDoc(ref, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    // Optimistic cache update
    const currentCached = getCachedProducts();
    setCachedProducts(currentCached.filter(p => p.id !== id));

    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================
// STORE SETTINGS
// ========================

export async function getStoreSettings(): Promise<StoreSettings> {
  const path = 'settings/store';
  try {
    const snap = await getDoc(doc(db, 'settings', 'store'));
    if (snap.exists()) {
      const data = snap.data() as Partial<StoreSettings>;
      if (data.announcementText && data.announcementText.includes('EXCLUSIVE 2026 HOROLOGY RELEASE')) {
        data.announcementText = '';
      }
      const fullSettings = { ...INITIAL_STORE_SETTINGS, ...data };
      setCachedStoreSettings(fullSettings);
      return fullSettings;
    }
    return getCachedStoreSettings();
  } catch (error) {
    return getCachedStoreSettings();
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  const path = 'settings/store';
  try {
    // Write-through immediate cache update so changes apply instantly
    setCachedStoreSettings(settings);

    const cleaned = cleanFirestoreData(settings);
    await setDoc(doc(db, 'settings', 'store'), cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes in real-time to store settings and site CMS content.
 */
export function subscribeToStoreSettings(callback: (settings: StoreSettings) => void): () => void {
  const settingsRef = doc(db, 'settings', 'store');
  return onSnapshot(settingsRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as Partial<StoreSettings>;
      if (data.announcementText && data.announcementText.includes('EXCLUSIVE 2026 HOROLOGY RELEASE')) {
        data.announcementText = '';
      }
      const merged = { ...INITIAL_STORE_SETTINGS, ...data };
      setCachedStoreSettings(merged);
      callback(merged);
    } else {
      const fallback = getCachedStoreSettings();
      callback(fallback);
    }
  }, (err) => {
    console.warn('Real-time settings listener notice:', err);
  });
}

// ========================
// ORDERS & CHECKOUT
// ========================

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
  const path = 'orders';
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = `BBW-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const createdAt = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    createdAt,
  };

  try {
    // Concurrency safe transaction: validate inventory and reduce stock
    await runTransaction(db, async (transaction) => {
      // 1. Verify item stocks
      for (const item of newOrder.items) {
        const productRef = doc(db, 'products', item.productId);
        const productSnap = await transaction.get(productRef);
        if (productSnap.exists()) {
          const prodData = productSnap.data() as Product;
          if (prodData.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}. Only ${prodData.stockQuantity} remaining.`);
          }
          const updatedStock = prodData.stockQuantity - item.quantity;
          transaction.update(productRef, {
            stockQuantity: updatedStock,
            inStock: updatedStock > 0,
            updatedAt: createdAt,
          });
        }
      }

      // 2. Commit the order
      const orderRef = doc(db, path, orderId);
      transaction.set(orderRef, newOrder);
    });

    return newOrder;
  } catch (error) {
    // If transaction failed due to network or rules, attempt direct write fallback
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      throw error;
    }
    try {
      await setDoc(doc(db, path, orderId), newOrder);
      return newOrder;
    } catch (innerError) {
      handleFirestoreError(innerError, OperationType.CREATE, path);
    }
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
  } catch (error) {
    // If order by index is not yet built, query without ordering
    try {
      const qFallback = query(collection(db, path), where('userId', '==', userId));
      const snap = await getDocs(qFallback);
      const orders = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (innerErr) {
      handleFirestoreError(innerErr, OperationType.LIST, path);
    }
  }
}

export async function getAllOrdersAdmin(): Promise<Order[]> {
  const path = 'orders';
  try {
    const snap = await getDocs(collection(db, path));
    const orders = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  options?: { trackingNumber?: string; carrier?: string }
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const ref = doc(db, 'orders', orderId);
    await updateDoc(ref, {
      orderStatus,
      ...(options?.trackingNumber ? { trackingNumber: options.trackingNumber } : {}),
      ...(options?.carrier ? { carrier: options.carrier } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ========================
// CUSTOMER SUPPORT INQUIRIES
// ========================

export async function createContactMessage(
  messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<{ id: string; referenceNumber: string }> {
  const path = 'contactMessages';
  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const createdAt = new Date().toISOString();

  const newMessage: ContactMessage = {
    ...messageData,
    id,
    status: 'New',
    createdAt,
    responseHistory: [],
  };

  try {
    await setDoc(doc(db, path, id), newMessage);
    return { id, referenceNumber: id.toUpperCase() };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getAllContactMessagesAdmin(): Promise<ContactMessage[]> {
  const path = 'contactMessages';
  try {
    const snap = await getDocs(collection(db, path));
    const messages = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: InquiryStatus,
  adminNotes?: string
): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    const ref = doc(db, 'contactMessages', id);
    await updateDoc(ref, {
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addContactMessageReply(
  id: string,
  replyText: string,
  sender: string = 'BIG BOSS WATCHES Concierge'
): Promise<void> {
  const path = `contactMessages/${id}`;
  try {
    const ref = doc(db, 'contactMessages', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Inquiry not found');

    const data = snap.data() as ContactMessage;
    const history = data.responseHistory || [];
    const newReply = {
      sender,
      message: replyText,
      timestamp: new Date().toISOString(),
    };

    await updateDoc(ref, {
      responseHistory: [...history, newReply],
      status: 'In Progress',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
