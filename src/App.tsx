import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { VehicleFilter } from './components/VehicleFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { WorkshopOrdersView } from './components/WorkshopOrdersView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { ClientsAreaView } from './components/ClientsAreaView';
import { OffersView } from './components/OffersView';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Product, ProductCategory } from './types';
import {
  Wrench,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  MessageCircle,
  Tag,
  Percent,
} from 'lucide-react';

const CATEGORIES = [
  'Todos',
  'Frenos',
  'Motor & Distribución',
  'Suspensión & Dirección',
  'Filtración & Fluidos',
  'Transmisión & Embragues',
  'Sistema Eléctrico',
  'Herramientas & Taller',
];

const MainContent: React.FC = () => {
  const {
    products,
    user,
    searchQuery,
    vehicleFilter,
    selectedCategory,
    setSelectedCategory,
    toast,
  } = useApp();

  const [currentView, setCurrentView] = useState<'catalog' | 'offers' | 'about' | 'clients' | 'orders' | 'admin'>('catalog');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authAdminDefault, setAuthAdminDefault] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by Search, Vehicle Compatibility, and Category
  const filteredProducts = products.filter((p) => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchOem = p.oemCode.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchOem && !matchBrand) return false;
    }

    // 2. Category
    if (selectedCategory !== 'Todos' && p.category !== selectedCategory) {
      return false;
    }

    // 2b. Only Offers Toggle
    if (showOnlyOffers && !p.isOffer) {
      return false;
    }

    // 3. Vehicle Compatibility Filter
    if (vehicleFilter.make) {
      const matchMake = p.compatibleVehicles.some(
        (v) =>
          v.make.toLowerCase().includes(vehicleFilter.make.toLowerCase()) ||
          v.make.toLowerCase() === 'universal'
      );
      if (!matchMake) return false;
    }

    if (vehicleFilter.model) {
      const matchModel = p.compatibleVehicles.some(
        (v) =>
          v.model.toLowerCase().includes(vehicleFilter.model.toLowerCase()) ||
          v.make.toLowerCase() === 'universal'
      );
      if (!matchModel) return false;
    }

    if (vehicleFilter.year) {
      const matchYear = p.compatibleVehicles.some(
        (v) =>
          v.years.includes(vehicleFilter.year) ||
          v.make.toLowerCase() === 'universal'
      );
      if (!matchYear) return false;
    }

    return true;
  });

  const handleOpenAuth = (asAdmin = false) => {
    setAuthAdminDefault(asAdmin);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl shadow-2xl animate-bounce-subtle">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toast.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />}
          <span className="font-medium">{toast.text}</span>
        </div>
      )}

      {/* Top Bar Navigation with Official Logo */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => handleOpenAuth(false)}
      />

      {/* Main Body Routing */}
      {currentView === 'offers' ? (
        <main className="flex-1">
          <OffersView
            onOpenDetail={(prod) => setSelectedProduct(prod)}
            onGoToCatalog={() => {
              setCurrentView('catalog');
              setShowOnlyOffers(true);
            }}
          />
        </main>
      ) : currentView === 'about' ? (
        <main className="flex-1">
          <AboutSection
            onGoToCatalog={() => setCurrentView('catalog')}
            onGoToClientsArea={() => setCurrentView('clients')}
          />
        </main>
      ) : currentView === 'clients' ? (
        <main className="flex-1">
          <ClientsAreaView
            onBackToCatalog={() => setCurrentView('catalog')}
            onOpenAuth={() => handleOpenAuth(false)}
          />
        </main>
      ) : currentView === 'orders' ? (
        <main className="flex-1">
          <WorkshopOrdersView onBackToCatalog={() => setCurrentView('catalog')} />
        </main>
      ) : currentView === 'admin' ? (
        <main className="flex-1">
          <AdminDashboard
            onBackToCatalog={() => setCurrentView('catalog')}
            onOpenAuth={handleOpenAuth}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Storefront Hero Section */}
          <section className="relative border-b border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Hero Copy */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Canal Mayorista Exclusivo para Talleres Mecánicos</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Repuestos y Accesorios para Bahía con Despacho Inmediato
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Suministro técnico directo de componentes OEM y recambio de alto rendimiento. Acceda con su correo para cotizar con tarifas de taller, compras a crédito a 30 días y despacho urgente en 2 horas para vehículos en elevador.
                  </p>

                  {/* Workshop Profile Snapshot if logged in */}
                  {user && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs max-w-lg">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-semibold text-white block">
                            Conectado: {user.workshopName || user.email}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {user.role === 'admin' ? 'Administrador Central' : `RUC: ${user.ruc || '20601928341'} · ${user.tier || 'Taller Pro'}`}
                          </span>
                        </div>
                      </div>
                      {user.availableCredit && (
                        <div className="text-right font-mono">
                          <span className="text-[10px] text-slate-500 block">Crédito Disponible:</span>
                          <span className="text-emerald-400 font-bold">${user.availableCredit.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Feature Badges & WhatsApp Trigger */}
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                      Garantía Técnica 12-36 Meses
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-4 h-4 text-red-500" />
                      Despacho Urgente en Bahía 2h
                    </span>
                    <a
                      href="https://wa.me/51972554119?text=Hola%20AutoRepuestos%20Pro,%20solicito%20atención%20inmediata%20para%20mi%20taller"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-emerald-400" />
                      WhatsApp Técnico Directo
                    </a>
                  </div>
                </div>

                {/* Hero Warehouse Photo with Logo Overlay */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-[16/10] bg-slate-950 group">
                    <img
                      src="/src/assets/images/hero_auto_warehouse_1793048711023.jpg"
                      alt="Centro de distribución AutoRepuestos Pro"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    {/* Corner Logo Watermark */}
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-full border border-red-500/40">
                      <img
                        src="/assets/aistudio/image_1399edb9.png"
                        alt="Logo"
                        className="w-10 h-10 object-contain rounded-full"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-4">
                      <div className="text-xs">
                        <span className="font-mono text-red-400 block font-bold">
                          Centro de Logística & Picking
                        </span>
                        <span className="text-slate-300 text-[11px]">
                          Más de 15,000 referencias en stock físico con entrega programada
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Vehicle Compatibility & Search Filter */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            <VehicleFilter />
          </section>

          {/* Catalog & Category Navigation */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Category Filter Tabs with Ofertas Switch */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-800 overflow-x-auto">
              <div className="flex items-center gap-1.5 shrink-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat && !showOnlyOffers
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowOnlyOffers(!showOnlyOffers)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                    showOnlyOffers
                      ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                      : 'bg-slate-900 border-red-500/40 text-red-400 hover:bg-red-950/30'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Solo Ofertas & Descuentos ({products.filter((p) => p.isOffer).length})</span>
                </button>

                <span className="text-xs text-slate-500 font-mono hidden md:block">
                  {filteredProducts.length} repuestos
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Wrench className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-base font-semibold text-white">
                  No se encontraron repuestos con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Intente buscar por otro modelo, año o verifique el código OEM ingresado.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todos');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* WhatsApp Floating Action Widget */}
      <WhatsAppWidget />

      {/* Footer with Logo & Contact Details */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            {/* Logo and About preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/image_1399edb9.png"
                  alt="AutoRepuestos Pro"
                  className="w-12 h-12 object-contain rounded-full border border-red-500/50"
                />
                <div>
                  <span className="font-extrabold text-white text-base block leading-tight">
                    AutoRepuestos <span className="text-red-500">PRO</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Distribución Mayorista
                  </span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empresa especializada en el abastecimiento técnico y continuo para talleres mecánicos, centros de colisión y flotas comerciales.
              </p>
            </div>

            {/* Direct Contact Numbers & WhatsApp */}
            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Contacto & WhatsApp Talleres
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href="https://wa.me/51972554119"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 font-mono"
                  >
                    WhatsApp Bahías: +51 972 554 119
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Central: +51 (01) 680-9900</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="font-mono">pedidos@autorepuestospro.com</span>
                </li>
                <li className="text-[11px] text-slate-500">
                  Horario de Bahía: Lunes a Sábado 07:30 - 19:00 hrs
                </li>
              </ul>
            </div>

            {/* Commercial terms */}
            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Condiciones Comerciales
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>· Crédito Taller a 30 días sin intereses</li>
                <li>· Facturación electrónica inmediata</li>
                <li>· Devoluciones por incompatibilidad sin costo</li>
                <li>· Garantía de fabricante 12 a 36 meses</li>
              </ul>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">
                Secciones de la Plataforma
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="block text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo de Repuestos
                </button>
                <button
                  onClick={() => setCurrentView('offers')}
                  className="block text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer"
                >
                  Ofertas & Descuentos
                </button>
                <button
                  onClick={() => setCurrentView('about')}
                  className="block text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Quiénes Somos
                </button>
                {user && user.role === 'client' && (
                  <button
                    onClick={() => setCurrentView('clients')}
                    className="block text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Mi Cuenta de Taller
                  </button>
                )}
                <button
                  onClick={() => setCurrentView('admin')}
                  className="block text-slate-400 hover:text-red-400 transition-colors font-medium cursor-pointer"
                >
                  Panel de Administración (Base de Datos)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <span>© 2026 AutoRepuestos Pro S.A.C. Todos los derechos reservados.</span>
            <span>Sistema Mayorista y Logística para Talleres Mecánicos</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(orderId) => {
          setCurrentView('orders');
        }}
        onOpenAuth={() => handleOpenAuth(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultAdmin={authAdminDefault}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
