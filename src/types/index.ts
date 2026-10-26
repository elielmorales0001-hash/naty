export type UserRole = 'client' | 'admin';

export interface WorkshopProfile {
  id: string;
  email: string;
  workshopName: string;
  contactName: string;
  ruc: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  baysCount: number;
  tier: 'Taller Estándar' | 'Taller Pro' | 'Taller Premium';
  creditLimit: number;
  availableCredit: number;
  registeredDate: string;
  totalOrdersCount: number;
}

export interface UserSession {
  email: string;
  role: UserRole;
  workshopName?: string;
  contactName?: string;
  ruc?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  tier?: 'Taller Estándar' | 'Taller Pro' | 'Taller Premium';
  creditLimit?: number;
  availableCredit?: number;
}

export type ProductCategory =
  | 'Frenos'
  | 'Motor & Distribución'
  | 'Suspensión & Dirección'
  | 'Filtración & Fluidos'
  | 'Transmisión & Embragues'
  | 'Sistema Eléctrico'
  | 'Herramientas & Taller';

export interface VehicleFitment {
  make: string;
  model: string;
  years: string;
  engine?: string;
}

export interface Product {
  id: string;
  sku: string;
  oemCode: string;
  name: string;
  category: ProductCategory;
  brand: string;
  description: string;
  technicalSpecs: Record<string, string>;
  compatibleVehicles: VehicleFitment[];
  retailPrice: number;
  workshopPrice: number; // Wholesale price for workshops
  bulkTiers: { minQty: number; discountPercent: number }[];
  stock: number;
  minStockAlert: number;
  locationWarehouse: string;
  imageUrl: string;
  warrantyMonths: number;
  isFeatured?: boolean;
  isOffer?: boolean;
  offerDiscountPercent?: number;
  offerBadge?: string;
  active: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  discountHighlight: string;
  targetCategory?: ProductCategory;
  validUntil: string;
  bannerColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pendiente' | 'en_preparacion' | 'despachado' | 'entregado' | 'cancelado';
export type PaymentMethod = 'credito_30_dias' | 'transferencia' | 'contra_entrega';

export interface OrderItem {
  productId: string;
  sku: string;
  oemCode: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface WorkshopOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  workshopEmail: string;
  workshopName: string;
  contactPerson: string;
  contactPhone: string;
  deliveryAddress: string;
  deliveryBayOrNote?: string;
  isUrgentWorkshopOrder: boolean;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  trackingGuide?: string;
  estimatedDelivery?: string;
  adminNotes?: string;
}

export interface OTPRequest {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}
