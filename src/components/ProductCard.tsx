import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Eye, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, user } = useApp();

  const isLowStock = product.stock <= product.minStockAlert;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Graceful fallback container
            const target = e.target as HTMLElement;
            target.style.display = 'none';
          }}
        />

        {/* OEM and Brand clean label */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          <span className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-amber-400">
            OEM: {product.oemCode.split('/')[0]}
          </span>
          {product.isOffer && (
            <span className="bg-red-600 text-white font-bold rounded px-2 py-0.5 text-[10px] font-mono shadow-md animate-pulse">
              {product.offerBadge || `OFERTA -${product.offerDiscountPercent || 20}%`}
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 text-white rounded-lg text-xs font-medium border border-slate-700 shadow-md">
            <Eye className="w-3.5 h-3.5" />
            Ficha Técnica
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators (no pill enclosures) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="text-sm font-semibold text-white line-clamp-2 hover:text-amber-400 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Vehicle Compatibility Preview */}
          <div className="mt-2 text-xs text-slate-400 line-clamp-1">
            <span className="text-slate-500">Aplica: </span>
            {product.compatibleVehicles.map((v) => `${v.make} ${v.model}`).join(', ')}
          </div>
        </div>

        {/* Pricing and Action Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                ${product.workshopPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                ${product.retailPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <span>Tarifa Mayorista Taller</span>
              {product.bulkTiers.length > 0 && (
                <span className="text-slate-400 font-mono">
                  (hasta -{product.bulkTiers[product.bulkTiers.length - 1].discountPercent}%)
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-sm ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white font-bold'
            }`}
            title={isOutOfStock ? 'Sin stock disponible' : 'Añadir al pedido del taller'}
            aria-label={`Añadir ${product.name} al pedido`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Stock status indicator */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          {isOutOfStock ? (
            <span className="text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Agotado
            </span>
          ) : isLowStock ? (
            <span className="text-amber-400 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3 h-3" /> Últimas {product.stock} un. en bodega
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {product.stock} un. disponibles
            </span>
          )}

          <span className="text-slate-500 text-[10px] font-mono">
            {product.locationWarehouse}
          </span>
        </div>
      </div>
    </div>
  );
};
