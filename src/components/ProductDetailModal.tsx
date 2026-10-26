import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { X, Shield, Wrench, CheckCircle, Car, MapPin, Plus, Minus, ShoppingBag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white transition-colors p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Grid: Left Image, Right Essential Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-[4/3] relative flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono text-amber-400">
                OEM: {product.oemCode}
              </div>
            </div>

            {/* Title, Brand, Pricing */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-200">{product.brand}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-400">{product.sku}</span>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">
                  {product.name}
                </h2>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Price block */}
                <div className="mt-4 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold font-mono text-white">
                      ${product.workshopPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-500 line-through font-mono">
                      ${product.retailPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Ahorro Taller: ${(product.retailPrice - product.workshopPrice).toFixed(2)}
                    </span>
                  </div>
                  <span className="block text-xs text-slate-400 mt-1">
                    Tarifa especial B2B para mecánicos registrados (+ IGV / Impuestos en facturación)
                  </span>
                </div>

                {/* Warehouse Location & Stock */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
                  <div className="flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ubicación: {product.locationWarehouse}</span>
                  </div>
                  <div className="font-mono">
                    Stock en Bodega: <span className="font-bold text-slate-200">{product.stock} un.</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Add Button */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4">
                <div className="flex items-center border border-slate-700 bg-slate-800 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold font-mono text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al Pedido de Taller ({quantity} un.)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Wholesale Discount Tiers */}
          {product.bulkTiers && product.bulkTiers.length > 0 && (
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Escala de Descuentos por Volumen de Taller
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {product.bulkTiers.map((tier, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg">
                    <span className="font-semibold text-white block">Desde {tier.minQty} unidades</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {tier.discountPercent}% OFF adicional (${(product.workshopPrice * (1 - tier.discountPercent / 100)).toFixed(2)} / un)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          <div className="border-t border-slate-800 pt-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-amber-500" />
              Especificaciones Técnicas de Montaje
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(product.technicalSpecs).map(([key, val]) => (
                <div key={key} className="flex justify-between p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                  <span className="text-slate-400">{key}:</span>
                  <span className="font-semibold text-slate-200 font-mono text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatible Vehicles */}
          <div className="border-t border-slate-800 pt-5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-amber-500" />
              Aplicación y Vehículos Compatibles
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5">Marca</th>
                    <th className="p-2.5">Modelo</th>
                    <th className="p-2.5">Años de Producción</th>
                    <th className="p-2.5">Motorización</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {product.compatibleVehicles.map((veh, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-semibold text-white">{veh.make}</td>
                      <td className="p-2.5">{veh.model}</td>
                      <td className="p-2.5 font-mono">{veh.years}</td>
                      <td className="p-2.5 text-slate-400">{veh.engine || 'General'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warranty & Returns Policy for Workshops */}
          <div className="border-t border-slate-800 pt-5 flex items-center gap-3 text-xs text-slate-400">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">Garantía Directa de Fábrica: {product.warrantyMonths} Meses.</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cambio inmediato en mostrador ante fallas de material o fabricación. Soporte técnico directo para mecánicos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
