import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  WorkshopOrder,
  UserSession,
  CartItem,
  OrderStatus,
  PaymentMethod,
  OTPRequest,
  VehicleFitment,
  WorkshopProfile,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_WORKSHOP_ORDERS, DEMO_WORKSHOPS, INITIAL_WORKSHOPS } from '../data/mockData';

interface AppContextType {
  user: UserSession | null;
  activeOtp: OTPRequest | null;
  products: Product[];
  orders: WorkshopOrder[];
  workshops: WorkshopProfile[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  vehicleFilter: { make: string; model: string; year: string };
  setVehicleFilter: (v: { make: string; model: string; year: string }) => void;
  toast: { text: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  sendOtp: (email: string) => string;
  verifyOtp: (email: string, code: string) => boolean;
  logout: () => void;
  switchDemoUser: (email: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  submitWorkshopOrder: (params: {
    deliveryAddress: string;
    deliveryBayOrNote?: string;
    isUrgentWorkshopOrder: boolean;
    paymentMethod: PaymentMethod;
  }) => WorkshopOrder | null;
  updateProduct: (product: Product) => void;
  addProduct: (productData: Omit<Product, 'id'>) => Product;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingGuide?: string,
    adminNotes?: string
  ) => void;
  addWorkshop: (workshop: Omit<WorkshopProfile, 'id' | 'registeredDate' | 'totalOrdersCount'>) => void;
  updateWorkshop: (workshop: WorkshopProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'autorepuestos_user_v2',
  PRODUCTS: 'autorepuestos_products_v2',
  ORDERS: 'autorepuestos_orders_v2',
  WORKSHOPS: 'autorepuestos_workshops_v2',
  CART: 'autorepuestos_cart_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State Load
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      // Default to logged-in client workshop for effortless immediate test
      return DEMO_WORKSHOPS['huancasnayri@gmail.com'] as UserSession;
    } catch {
      return DEMO_WORKSHOPS['huancasnayri@gmail.com'] as UserSession;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<WorkshopOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      return INITIAL_WORKSHOP_ORDERS;
    } catch {
      return INITIAL_WORKSHOP_ORDERS;
    }
  });

  const [workshops, setWorkshops] = useState<WorkshopProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
      if (saved) return JSON.parse(saved);
      return INITIAL_WORKSHOPS;
    } catch {
      return INITIAL_WORKSHOPS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [activeOtp, setActiveOtp] = useState<OTPRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [vehicleFilter, setVehicleFilter] = useState({ make: '', model: '', year: '' });
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
    } catch (e) {
      console.error(e);
    }
  }, [workshops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // OTP Logic
  const sendOtp = (email: string): string => {
    const cleanEmail = email.trim().toLowerCase();
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const req: OTPRequest = {
      email: cleanEmail,
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    setActiveOtp(req);
    return code;
  };

  const verifyOtp = (email: string, code: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!activeOtp || activeOtp.email !== cleanEmail || activeOtp.code !== code.trim()) {
      return false;
    }
    // Code is valid
    setActiveOtp(null);

    // Check if pre-configured profile or create custom workshop
    if (DEMO_WORKSHOPS[cleanEmail]) {
      setUser(DEMO_WORKSHOPS[cleanEmail] as UserSession);
    } else {
      const isDomainAdmin = cleanEmail.includes('admin') || cleanEmail.endsWith('@autorepuestospro.com');
      const newSession: UserSession = {
        email: cleanEmail,
        role: isDomainAdmin ? 'admin' : 'client',
        workshopName: isDomainAdmin ? 'Sede Central AutoRepuestos Pro' : `Taller ${cleanEmail.split('@')[0].toUpperCase()}`,
        contactName: cleanEmail.split('@')[0],
        ruc: isDomainAdmin ? undefined : '20' + Math.floor(100000000 + Math.random() * 900000000),
        phone: '+51 9' + Math.floor(10000000 + Math.random() * 90000000),
        address: 'Dirección Registrada Taller',
        tier: 'Taller Estándar',
        creditLimit: 5000,
        availableCredit: 5000,
      };
      setUser(newSession);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const switchDemoUser = (email: string) => {
    const profile = DEMO_WORKSHOPS[email];
    if (profile) {
      setUser(profile as UserSession);
      showToast(`Cambiado a perfil: ${profile.workshopName || profile.email}`, 'info');
    }
  };

  // Calculate pricing considering bulk tiers
  const calculateEffectivePrice = (product: Product, qty: number): number => {
    let price = product.workshopPrice;
    if (product.bulkTiers && product.bulkTiers.length > 0) {
      // Find applicable tier
      const sortedTiers = [...product.bulkTiers].sort((a, b) => b.minQty - a.minQty);
      const tier = sortedTiers.find((t) => qty >= t.minQty);
      if (tier) {
        price = product.workshopPrice * (1 - tier.discountPercent / 100);
      }
    }
    return Number(price.toFixed(2));
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        const unitPrice = calculateEffectivePrice(product, newQty);
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: newQty,
                unitPrice,
                totalPrice: Number((unitPrice * newQty).toFixed(2)),
              }
            : item
        );
      } else {
        const qty = Math.min(quantity, product.stock);
        const unitPrice = calculateEffectivePrice(product, qty);
        return [
          ...prev,
          {
            product,
            quantity: qty,
            unitPrice,
            totalPrice: Number((unitPrice * qty).toFixed(2)),
          },
        ];
      }
    });
    showToast(`Agregado al pedido de taller: ${product.name.slice(0, 32)}...`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock);
          const unitPrice = calculateEffectivePrice(item.product, validQty);
          return {
            ...item,
            quantity: validQty,
            unitPrice,
            totalPrice: Number((unitPrice * validQty).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cart Totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = Number(cart.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2));
  const cartDiscount = Number(
    cart
      .reduce((acc, item) => acc + (item.product.retailPrice - item.unitPrice) * item.quantity, 0)
      .toFixed(2)
  );
  const cartTax = Number((cartSubtotal * 0.18).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));

  // Submit Order
  const submitWorkshopOrder = ({
    deliveryAddress,
    deliveryBayOrNote,
    isUrgentWorkshopOrder,
    paymentMethod,
  }: {
    deliveryAddress: string;
    deliveryBayOrNote?: string;
    isUrgentWorkshopOrder: boolean;
    paymentMethod: PaymentMethod;
  }): WorkshopOrder | null => {
    if (!user || cart.length === 0) return null;

    const orderNum = `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: WorkshopOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      workshopEmail: user.email,
      workshopName: user.workshopName || 'Taller Mecánico Cliente',
      contactPerson: user.contactName || 'Encargado de Taller',
      contactPhone: user.phone || '+51 900 000 000',
      deliveryAddress,
      deliveryBayOrNote,
      isUrgentWorkshopOrder,
      items: cart.map((item) => ({
        productId: item.product.id,
        sku: item.product.sku,
        oemCode: item.product.oemCode,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.totalPrice,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      total: cartTotal,
      status: 'pendiente',
      paymentMethod,
      trackingGuide: `GR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDelivery: isUrgentWorkshopOrder
        ? 'Hoy en aprox. 2 horas (Despacho de Urgencia en Bahía)'
        : 'Próxima ruta de reparto (Hoy antes de 18:00)',
      adminNotes: isUrgentWorkshopOrder
        ? '⚠️ ALERTA TALLER: Requiere pieza para vehículo detenido en elevador.'
        : undefined,
    };

    // Decrement product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = cart.find((c) => c.product.id === prod.id);
        if (orderedItem) {
          const newStock = Math.max(0, prod.stock - orderedItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Update order count for workshop
    setWorkshops((prev) =>
      prev.map((w) =>
        w.email.toLowerCase() === user.email.toLowerCase()
          ? { ...w, totalOrdersCount: w.totalOrdersCount + 1 }
          : w
      )
    );

    clearCart();
    showToast(`¡Pedido ${orderNum} recibido con éxito! Despacho en preparación.`, 'success');
    return newOrder;
  };

  // Workshop Management
  const addWorkshop = (workshopData: Omit<WorkshopProfile, 'id' | 'registeredDate' | 'totalOrdersCount'>) => {
    const newWs: WorkshopProfile = {
      ...workshopData,
      id: `ws-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
      totalOrdersCount: 0,
    };
    setWorkshops((prev) => [newWs, ...prev]);
    showToast(`Taller mecánico ${newWs.workshopName} registrado con éxito.`, 'success');
  };

  const updateWorkshop = (updated: WorkshopProfile) => {
    setWorkshops((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    if (user && user.email.toLowerCase() === updated.email.toLowerCase()) {
      setUser({
        ...user,
        workshopName: updated.workshopName,
        contactName: updated.contactName,
        ruc: updated.ruc,
        phone: updated.phone,
        whatsapp: updated.whatsapp,
        address: updated.address,
        tier: updated.tier,
        creditLimit: updated.creditLimit,
        availableCredit: updated.availableCredit,
      });
    }
    showToast(`Datos del taller ${updated.workshopName} actualizados.`, 'success');
  };

  // Admin Product Operations
  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Repuesto ${updated.sku} actualizado en inventario.`, 'success');
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Nuevo repuesto ${newProd.sku} registrado en catálogo.`, 'success');
    return newProd;
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Repuesto retirado del catálogo.', 'info');
  };

  // Admin Order Operations
  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingGuide?: string,
    adminNotes?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingGuide: trackingGuide || ord.trackingGuide,
            adminNotes: adminNotes !== undefined ? adminNotes : ord.adminNotes,
          };
        }
        return ord;
      })
    );
    showToast(`Pedido actualizado a estado: ${status.toUpperCase()}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeOtp,
        products,
        orders,
        workshops,
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        vehicleFilter,
        setVehicleFilter,
        toast,
        showToast,
        sendOtp,
        verifyOtp,
        logout,
        switchDemoUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        submitWorkshopOrder,
        updateProduct,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        addWorkshop,
        updateWorkshop,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
