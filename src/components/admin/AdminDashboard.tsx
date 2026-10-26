import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, WorkshopOrder, OrderStatus, WorkshopProfile } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import {
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Building2,
  Mail,
  Phone,
  MessageCircle,
  Copy,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToCatalog: () => void;
  onOpenAuth: (asAdmin?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToCatalog,
  onOpenAuth,
}) => {
  const {
    user,
    products,
    orders,
    workshops,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    updateWorkshop,
    switchDemoUser,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'pricing' | 'orders' | 'clients'>('inventory');

  // Inventory & Pricing state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders state
  const [orderWorkshopFilter, setOrderWorkshopFilter] = useState('Todos');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Todos');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<WorkshopOrder | null>(null);
  const [dispatchGuideInput, setDispatchGuideInput] = useState('');

  // If user is not admin, display friendly access barrier with immediate switch
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Área Restringida a la Administración
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Este módulo está reservado para la gestión interna de almacén, control de precios mayoristas y asignación de despachos por cada taller mecánico.
        </p>

        <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto text-left">
          <span className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wider">
            Para evaluar o ingresar como administrador:
          </span>
          <button
            onClick={() => switchDemoUser('admin@autorepuestospro.com')}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md mb-3"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Entrar directo como Administrador Central</span>
          </button>
          <button
            onClick={() => onOpenAuth(true)}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <span>Ingresar con código por correo (admin@autorepuestospro.com)</span>
          </button>
        </div>

        <button
          onClick={onBackToCatalog}
          className="mt-6 text-xs text-slate-400 hover:text-white underline cursor-pointer"
        >
          Volver a la vista del cliente
        </button>
      </div>
    );
  }

  // Admin Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.workshopPrice, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado').length;
  const urgentOrdersCount = orders.filter((o) => o.isUrgentWorkshopOrder && o.status !== 'entregado').length;

  // Filtered products for Inventory & Pricing
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.oemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'Todos' || p.category === categoryFilter;
    const matchesLowStock = !showLowStockOnly || p.stock <= p.minStockAlert;

    return matchesSearch && matchesCat && matchesLowStock;
  });

  // Workshop list for order filter
  const uniqueWorkshops = Array.from(new Set(orders.map((o) => o.workshopName)));

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesWorkshop =
      orderWorkshopFilter === 'Todos' || o.workshopName === orderWorkshopFilter;
    const matchesStatus = orderStatusFilter === 'Todos' || o.status === orderStatusFilter;
    return matchesWorkshop && matchesStatus;
  });

  const handleQuickStockChange = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    updateProduct({ ...prod, stock: newStock });
  };

  const handlePriceUpdate = (productId: string, field: 'workshopPrice' | 'retailPrice', value: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    updateProduct({ ...prod, [field]: value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/image_1399edb9.png"
            alt="Logo AutoRepuestos Pro"
            className="w-12 h-12 rounded-full border border-red-500/50 shadow-md object-contain shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>PANEL DE CONTROL ADMINISTRATIVO EXCLUSIVO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Gestión: Inventarios, Precios, Pedidos y Clientes
            </h1>
            <p className="text-xs text-slate-400">
              Control de almacén, tarifas mayoristas para talleres mecánicos y cartera de clientes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="px-3.5 py-2 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Ver Tienda como Cliente
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block">Total Repuestos (SKUs)</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {products.length}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            {totalStockUnits} unidades físicas
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block">Valorización Inventario</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            ${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Costo mayorista base</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block">Pedidos Activos Talleres</span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
            {activeOrdersCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            En preparación o ruta
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 block">Talleres Afiliados</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">
            {workshops.length}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Clientes registrados
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono text-slate-400 block">Urgencias en Bahía</span>
          <span
            className={`text-2xl font-bold font-mono mt-1 block ${
              urgentOrdersCount > 0 ? 'text-red-400' : 'text-slate-300'
            }`}
          >
            {urgentOrdersCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Atención prioritaria 2h
          </span>
        </div>
      </div>

      {/* Segmented Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-fit">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Inventarios ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Precios & Tarifas B2B</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Pedidos por Taller ({orders.length})</span>
          {activeOrdersCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                activeTab === 'orders' ? 'bg-slate-950 text-red-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {activeOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'clients'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Base de Datos Clientes ({workshops.length})</span>
        </button>
      </div>

      {/* TAB 1: GESTIÓN DE INVENTARIOS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute inset-y-0 left-3 my-auto" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por SKU, código OEM o nombre de repuesto..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="Todos">Todas las Categorías</option>
                <option value="Frenos">Frenos</option>
                <option value="Motor & Distribución">Motor & Distribución</option>
                <option value="Suspensión & Dirección">Suspensión & Dirección</option>
                <option value="Filtración & Fluidos">Filtración & Fluidos</option>
                <option value="Transmisión & Embragues">Transmisión & Embragues</option>
                <option value="Sistema Eléctrico">Sistema Eléctrico</option>
                <option value="Herramientas & Taller">Herramientas & Taller</option>
              </select>

              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`px-3 py-2 text-xs rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  showLowStockOnly
                    ? 'bg-red-950/60 border-red-500/60 text-red-300 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Solo Stock Bajo ({lowStockCount})</span>
              </button>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Repuesto</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">SKU / OEM</th>
                    <th className="p-3.5">Repuesto & Marca</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5 text-center">Stock Físico</th>
                    <th className="p-3.5">Ubicación Bodega</th>
                    <th className="p-3.5 text-right">Precio Taller</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((prod) => {
                    const isLow = prod.stock <= prod.minStockAlert;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-amber-400 block">{prod.sku}</span>
                          <span className="text-[11px] text-slate-500">OEM: {prod.oemCode}</span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded bg-slate-950 shrink-0 border border-slate-800"
                              onError={(e) => {
                                const target = e.target as HTMLElement;
                                target.style.display = 'none';
                              }}
                            />
                            <div>
                              <span className="font-semibold text-white block max-w-xs truncate">
                                {prod.name}
                              </span>
                              <span className="text-slate-400 text-[11px]">{prod.brand}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-400">{prod.category}</td>

                        {/* Stock Adjustment Controls */}
                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg p-1">
                            <button
                              onClick={() => handleQuickStockChange(prod.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                              title="Reducir stock -1"
                            >
                              -
                            </button>
                            <span
                              className={`w-9 text-center font-mono font-bold ${
                                prod.stock === 0
                                  ? 'text-red-400'
                                  : isLow
                                  ? 'text-amber-400'
                                  : 'text-white'
                              }`}
                            >
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleQuickStockChange(prod.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                              title="Aumentar stock +1"
                            >
                              +
                            </button>
                          </div>
                          {isLow && (
                            <span className="block text-[10px] text-red-400 font-mono mt-1">
                              Mín: {prod.minStockAlert} un.
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {prod.locationWarehouse}
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold text-white">
                          ${prod.workshopPrice.toFixed(2)}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Editar repuesto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Retirar repuesto ${prod.sku} del catálogo?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Eliminar repuesto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DE PRECIOS */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Lista de Precios y Márgenes para Talleres
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Edite los precios base y la tarifa mayorista para cada taller mecánico. Los cambios aplican de inmediato en la tienda online.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">SKU / OEM</th>
                    <th className="p-3.5">Repuesto</th>
                    <th className="p-3.5">Precio Público Regular ($)</th>
                    <th className="p-3.5">Tarifa Mayorista Taller ($)</th>
                    <th className="p-3.5 text-center">Descuento Taller</th>
                    <th className="p-3.5">Escala por Volumen</th>
                    <th className="p-3.5 text-center">Oferta / Promoción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((prod) => {
                    const discountPercent = Math.round(
                      ((prod.retailPrice - prod.workshopPrice) / prod.retailPrice) * 100
                    );
                    return (
                      <tr key={prod.id} className="hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono">
                          <span className="font-bold text-red-400 block">{prod.sku}</span>
                          <span className="text-[11px] text-slate-500">{prod.oemCode}</span>
                        </td>

                        <td className="p-3.5 font-medium text-white max-w-xs truncate">
                          {prod.name}
                        </td>

                        {/* Retail price editable */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1 font-mono">
                            <span className="text-slate-500">$</span>
                            <input
                              type="number"
                              step="0.5"
                              value={prod.retailPrice}
                              onChange={(e) =>
                                handlePriceUpdate(
                                  prod.id,
                                  'retailPrice',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 text-xs font-mono"
                            />
                          </div>
                        </td>

                        {/* Workshop price editable */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1 font-mono">
                            <span className="text-red-500 font-bold">$</span>
                            <input
                              type="number"
                              step="0.5"
                              value={prod.workshopPrice}
                              onChange={(e) =>
                                handlePriceUpdate(
                                  prod.id,
                                  'workshopPrice',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-24 px-2 py-1 bg-slate-800 border border-red-500/50 rounded text-red-400 font-bold text-xs font-mono"
                            />
                          </div>
                        </td>

                        {/* Discount */}
                        <td className="p-3.5 text-center font-mono">
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {discountPercent}% OFF
                          </span>
                        </td>

                        {/* Bulk Tiers */}
                        <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                          {prod.bulkTiers && prod.bulkTiers.length > 0 ? (
                            <span>
                              {prod.bulkTiers
                                .map((t) => `${t.minQty}+ un: -${t.discountPercent}%`)
                                .join(' | ')}
                            </span>
                          ) : (
                            <span className="text-slate-600">Sin escala adicional</span>
                          )}
                        </td>

                        {/* Ofertas Switch for Admin */}
                        <td className="p-3.5 text-center">
                          {prod.isOffer ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                                {prod.offerBadge || 'OFERTA ACTIVA'}
                              </span>
                              <button
                                onClick={() => {
                                  updateProduct({
                                    ...prod,
                                    isOffer: false,
                                  });
                                  showToast(`Oferta desactivada para ${prod.sku}`, 'info');
                                }}
                                className="text-[10px] text-slate-400 hover:text-red-400 underline cursor-pointer"
                                title="Desactivar promoción"
                              >
                                Quitar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const desc = prompt(
                                  `Porcentaje de descuento para oferta en ${prod.sku}:`,
                                  '25'
                                );
                                if (desc) {
                                  updateProduct({
                                    ...prod,
                                    isOffer: true,
                                    offerDiscountPercent: Number(desc) || 25,
                                    offerBadge: `OFERTA TALLER -${desc}%`,
                                  });
                                  showToast(`¡Oferta activada para ${prod.sku}!`, 'success');
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 rounded text-[11px] transition-colors cursor-pointer border border-slate-700"
                            >
                              + Activar Oferta
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GESTIÓN DE PEDIDOS POR TALLER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Orders Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap gap-2.5 items-center">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Filtrar por Taller Cliente:
                </label>
                <select
                  value={orderWorkshopFilter}
                  onChange={(e) => setOrderWorkshopFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="Todos">Todos los Talleres</option>
                  {uniqueWorkshops.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Filtrar por Estado:
                </label>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="Todos">Todos los Estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_preparacion">En Preparación</option>
                  <option value="despachado">Despachado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Mostrando {filteredOrders.length} de {orders.length} pedidos
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">N° Pedido / Fecha</th>
                    <th className="p-3.5">Taller Mecánico & Contacto</th>
                    <th className="p-3.5">Destino / Bahía de Taller</th>
                    <th className="p-3.5 text-center">Ítems</th>
                    <th className="p-3.5 text-right">Total</th>
                    <th className="p-3.5 text-center">Estado Actual</th>
                    <th className="p-3.5 text-center">Acción de Despacho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400">{ord.orderNumber}</span>
                          {ord.isUrgentWorkshopOrder && (
                            <span className="p-1 rounded bg-red-950 text-red-400 font-bold text-[10px]" title="Repuesto Urgente en Bahía">
                              URGENTE
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-white block">{ord.workshopName}</span>
                        <span className="text-[11px] text-slate-400 block">{ord.contactPerson} ({ord.contactPhone})</span>
                        <span className="text-[10px] text-slate-500 font-mono">{ord.workshopEmail}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-300 block max-w-xs truncate">{ord.deliveryAddress}</span>
                        {ord.deliveryBayOrNote && (
                          <span className="text-[11px] text-amber-400/90 font-mono block">
                            {ord.deliveryBayOrNote}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold">
                        {ord.items.reduce((sum, it) => sum + it.quantity, 0)} piezas
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-white">
                        ${ord.total.toFixed(2)}
                      </td>

                      {/* Status badge */}
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                            ord.status === 'pendiente'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : ord.status === 'en_preparacion'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : ord.status === 'despachado'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {ord.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>

                      {/* Status workflow transitions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {ord.status === 'pendiente' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(ord.id, 'en_preparacion', ord.trackingGuide, 'En preparación por operario de almacén')
                              }
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Pasar a Preparación
                            </button>
                          )}

                          {ord.status === 'en_preparacion' && (
                            <button
                              onClick={() => {
                                const guide = prompt('Ingrese el número de Guía de Remisión / Despacho:', ord.trackingGuide || `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                                if (guide) {
                                  updateOrderStatus(ord.id, 'despachado', guide, 'Despachado en ruta de entrega a taller');
                                }
                              }}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Despachar a Taller
                            </button>
                          )}

                          {ord.status === 'despachado' && (
                            <button
                              onClick={() =>
                                updateOrderStatus(ord.id, 'entregado', ord.trackingGuide, 'Entregado con firma conforme en bahía de taller')
                              }
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Marcar Entregado
                            </button>
                          )}

                          {ord.status === 'entregado' && (
                            <span className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Ver desglose completo del pedido"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GESTIÓN DE ÁREA DE CLIENTES (TALLERES MECÁNICOS) */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Directorio y Cartera de Talleres Mecánicos Clientes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consulte y administre la información de contacto (correos, números telefónicos, WhatsApp, direcciones y crédito) de cada taller.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Taller / RUC</th>
                    <th className="p-3.5">Contacto Principal</th>
                    <th className="p-3.5">Correo Electrónico</th>
                    <th className="p-3.5">Teléfono / WhatsApp</th>
                    <th className="p-3.5">Dirección / Ciudad</th>
                    <th className="p-3.5 text-right">Línea de Crédito</th>
                    <th className="p-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {workshops.map((ws) => (
                    <tr key={ws.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{ws.workshopName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">RUC: {ws.ruc}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-200 block font-medium">{ws.contactName}</span>
                        <span className="text-[11px] text-slate-500">{ws.baysCount} bahías</span>
                      </td>

                      <td className="p-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="text-slate-200 select-all">{ws.email}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ws.email);
                              showToast(`Correo copiado: ${ws.email}`, 'info');
                            }}
                            className="p-1 text-slate-500 hover:text-white"
                            title="Copiar correo"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-slate-200">{ws.phone}</span>
                          <button
                            onClick={() => {
                              const cleanPhone = (ws.whatsapp || ws.phone).replace(/[^\d]/g, '');
                              window.open(
                                `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(ws.workshopName)},%20nos%20comunicamos%20desde%20AutoRepuestos%20Pro.`,
                                '_blank'
                              );
                            }}
                            className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/40"
                            title="Chatear por WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-emerald-400" />
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="text-slate-300 block max-w-xs truncate">{ws.address}</span>
                        <span className="text-[11px] text-red-400 font-semibold">{ws.city}</span>
                      </td>

                      <td className="p-3.5 text-right font-mono">
                        <span className="text-emerald-400 font-bold block">
                          ${ws.availableCredit.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Límite: ${ws.creditLimit.toLocaleString()}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            const newLimit = prompt(
                              `Modificar línea de crédito para ${ws.workshopName} ($ USD):`,
                              ws.creditLimit.toString()
                            );
                            if (newLimit && !isNaN(Number(newLimit))) {
                              const parsed = Number(newLimit);
                              updateWorkshop({
                                ...ws,
                                creditLimit: parsed,
                                availableCredit: parsed,
                              });
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
                        >
                          Ajustar Crédito
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={(data) => {
          if (editingProduct) {
            updateProduct(data as Product);
          } else {
            addProduct(data as Omit<Product, 'id'>);
          }
        }}
        productToEdit={editingProduct}
      />

      {/* Order Details Modal for Admin */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  Detalle del Pedido {selectedOrderDetails.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Taller: {selectedOrderDetails.workshopName}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div>Dirección: <span className="text-white">{selectedOrderDetails.deliveryAddress}</span></div>
                <div>Bahía / Atención: <span className="text-amber-400">{selectedOrderDetails.deliveryBayOrNote || 'General'}</span></div>
                <div>Guía: <span className="text-white">{selectedOrderDetails.trackingGuide || 'Sin asignar'}</span></div>
                <div>Condición: <span className="text-white capitalize">{selectedOrderDetails.paymentMethod.replace(/_/g, ' ')}</span></div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 text-[10px]">
                    <tr>
                      <th className="p-2">OEM / SKU</th>
                      <th className="p-2">Repuesto</th>
                      <th className="p-2 text-center">Cant</th>
                      <th className="p-2 text-right">P. Unit</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedOrderDetails.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-amber-400">{it.oemCode}</td>
                        <td className="p-2 text-white">{it.name}</td>
                        <td className="p-2 text-center font-bold">{it.quantity}</td>
                        <td className="p-2 text-right">${it.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right font-bold text-white">${it.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-white p-2">
                <span>TOTAL PEDIDO TALLER:</span>
                <span className="text-amber-400 text-base">${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
