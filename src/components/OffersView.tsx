import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { INITIAL_PROMOTIONS } from '../data/mockData';
import { Tag, Sparkles, Clock, Percent, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';

interface OffersViewProps {
  onOpenDetail: (product: Product) => void;
  onGoToCatalog: () => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ onOpenDetail, onGoToCatalog }) => {
  const { products, addToCart } = useApp();

  // Filter only products that have isOffer flag
  const offerProducts = products.filter((p) => p.isOffer);

  return (
    <div className="py-8 bg-slate-950 text-slate-100 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs font-bold text-red-400">
              <Percent className="w-3.5 h-3.5" />
              <span>Ofertas y Descuentos Exclusivos para Talleres Mecánicos</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Campañas Mayoristas: Ahorro de hasta <span className="text-red-500">35% OFF</span> en Bahía
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Precios promocionales en repuestos de alta rotación para maximizar el margen de ganancia de su taller mecánico. Descuentos aplicados directamente en su carrito y compatibles con su línea de crédito a 30 días.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Stock 100% Garantizado
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" /> Despacho en 2h para Emergencias
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Promotion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className={`p-6 rounded-2xl border border-slate-800 bg-gradient-to-br ${promo.bannerColor} shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-600 text-white shadow-sm">
                    {promo.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {promo.validUntil}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {promo.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {promo.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 font-mono">
                  {promo.discountHighlight}
                </span>

                <a
                  href={`https://wa.me/51972554119?text=Hola%20AutoRepuestos%20Pro,%20deseo%20aprovechar%20la%20promoción:%20${encodeURIComponent(promo.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>Consultar</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Discounted Products Grid Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-500" />
                <span>Repuestos en Liquidación y Oferta de Temporada</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Piezas con precios rebajados listos para despacho inmediato a su taller.
              </p>
            </div>

            <button
              onClick={onGoToCatalog}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        </div>

        {/* Workshop Bulk Discount Notice */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              ¿Requiere compras por volumen para su taller o flota?
            </h4>
            <p className="text-xs text-slate-400 max-w-xl">
              Cotice listas completas de repuestos para abastecimiento mensual de bahía con descuentos adicionales de hasta 20% sobre tarifa mayorista.
            </p>
          </div>

          <a
            href="https://wa.me/51972554119?text=Hola%20AutoRepuestos%20Pro,%20solicito%20cotización%20por%20volumen%20mayorista%20para%20mi%20taller%20mecánico"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Cotizar por Volumen en WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
