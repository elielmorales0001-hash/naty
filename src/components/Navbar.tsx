import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ShieldCheck, User, LogOut, MessageCircle, Building2, Info } from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'offers' | 'about' | 'clients' | 'orders' | 'admin';
  onNavigate: (view: 'catalog' | 'offers' | 'about' | 'clients' | 'orders' | 'admin') => void;
  onOpenCart: () => void;
  onOpenAuth: (asAdmin?: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth,
}) => {
  const { user, cartCount, logout } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-18">
        {/* Zone 1: Brand Wordmark with Official Logo */}
        <button
          onClick={() => onNavigate('catalog')}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <img
            src="/assets/aistudio/image_1399edb9.png"
            alt="AutoRepuestos Pro Logo"
            className="w-11 h-11 object-contain rounded-full border-2 border-red-500/40 shadow-lg group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
              AutoRepuestos <span className="text-red-500">PRO</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Mayorista para Talleres Mecánicos
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentView === 'catalog' ? 'text-red-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Catálogo
          </button>

          {/* New Prominent Ofertas & Descuentos tab requested by user */}
          <button
            onClick={() => onNavigate('offers')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentView === 'offers' ? 'text-red-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold text-white">Ofertas & Descuentos</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentView === 'about' ? 'text-red-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Quiénes Somos
          </button>

          {/* Only shown for client: their own workshop account */}
          {user && user.role === 'client' && (
            <>
              <button
                onClick={() => onNavigate('clients')}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
                  currentView === 'clients' ? 'text-red-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-red-500" />
                <span>Mi Taller</span>
              </button>

              <button
                onClick={() => onNavigate('orders')}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
                  currentView === 'orders' ? 'text-red-400 font-semibold' : 'text-slate-400'
                }`}
              >
                Mis Pedidos
              </button>
            </>
          )}

          {/* Admin panel link */}
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              currentView === 'admin' ? 'text-red-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Zone 3: WhatsApp, User Session & Shopping Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick WhatsApp header link */}
          <a
            href="https://wa.me/51972554119?text=Hola%20AutoRepuestos%20Pro,%20deseo%20consultar%20por%20un%20repuesto%20para%20mi%20taller"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 text-xs font-semibold transition-colors cursor-pointer"
            title="Atención directa por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* User state */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                  {user.workshopName || user.email}
                </span>
                <span className="text-[10px] text-red-400 font-mono">
                  {user.role === 'admin' ? 'Admin Central' : user.tier || 'Taller Pro'}
                </span>
              </div>

              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Ingresar con Código
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-md shadow-red-950/50"
            aria-label="Abrir Carrito de compras"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-red-600 font-mono rounded text-[11px] font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
