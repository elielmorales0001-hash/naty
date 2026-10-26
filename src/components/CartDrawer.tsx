import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, AlertTriangle, Truck, CreditCard, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onOpenAuth,
}) => {
  const {
    cart,
    user,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    submitWorkshopOrder,
  } = useApp();

  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || 'Av. Los Mecánicos 1420, Bahía Central'
  );
  const [deliveryBayOrNote, setDeliveryBayOrNote] = useState('Bahía 2 - Atención Maestro de Taller');
  const [isUrgent, setIsUrgent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credito_30_dias');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const workshop = user?.workshopName || 'Taller Mecánico';
    const itemsList = cart
      .map(
        (it) =>
          `• ${it.quantity}x ${it.product.name} (OEM: ${it.product.oemCode}) - $${it.totalPrice.toFixed(2)}`
      )
      .join('%0A');

    const msg = `*PEDIDO DE TALLER - AUTOREPUESTOS PRO*%0A` +
      `*Taller:* ${encodeURIComponent(workshop)}%0A` +
      `*Dirección:* ${encodeURIComponent(deliveryAddress)}%0A` +
      `*Bahía/Nota:* ${encodeURIComponent(deliveryBayOrNote)}%0A` +
      `*Prioridad:* ${isUrgent ? 'URGENTE EN BAHÍA (2 HORAS)' : 'Normal'}%0A` +
      `*Condición:* ${encodeURIComponent(paymentMethod.replace(/_/g, ' '))}%0A%0A` +
      `*ÍTEMS SOLICITADOS:*%0A${itemsList}%0A%0A` +
      `*TOTAL:* $${cartTotal.toFixed(2)} USD%0A%0A` +
      `Solicito confirmar recepción y despacho inmediato a bahía.`;

    window.open(`https://wa.me/51972554119?text=${msg}`, '_blank');
  };

  const handleCheckout = () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const order = submitWorkshopOrder({
        deliveryAddress,
        deliveryBayOrNote,
        isUrgentWorkshopOrder: isUrgent,
        paymentMethod,
      });
      setIsSubmitting(false);
      if (order) {
        onClose();
        onOrderSuccess(order.id);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white text-base">Pedido de Taller</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {cartCount} piezas
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <Truck className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-white">El pedido está vacío</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Agregue repuestos desde el catálogo con tarifas exclusivas para talleres mecánicos.
                </p>
              </div>
            ) : (
              <>
                {/* Urgent Repair Banner Option */}
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Despacho de Urgencia en Bahía (2h)
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Para vehículos detenidos en elevador. Se asigna unidad motorizada prioritaria.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-slate-900 shrink-0 border border-slate-800"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-amber-400 block truncate">
                          OEM: {item.product.oemCode}
                        </span>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          ${item.unitPrice.toFixed(2)}{' '}
                          <span className="text-[10px] text-slate-500">c/u</span>
                        </div>

                        {/* Stepper & Total */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-700 bg-slate-800 rounded">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="px-1.5 py-0.5 text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-1.5 py-0.5 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-white">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                              title="Eliminar ítem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Dirección de Entrega en Taller
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Dirección del taller mecánico"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Bahía / Observación para Despachador
                    </label>
                    <input
                      type="text"
                      value={deliveryBayOrNote}
                      onChange={(e) => setDeliveryBayOrNote(e.target.value)}
                      placeholder="Ej. Bahía 3 - Recibe Maestro Mario"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>

                  {/* Payment terms */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Condición de Pago Taller
                    </label>
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'credito_30_dias'}
                            onChange={() => setPaymentMethod('credito_30_dias')}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-white text-xs font-medium">Línea de Crédito 30 Días</span>
                        </div>
                        {user?.availableCredit && (
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Disp: ${user.availableCredit}
                          </span>
                        )}
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded bg-slate-800/80 border border-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'transferencia'}
                          onChange={() => setPaymentMethod('transferencia')}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-white text-xs font-medium">Transferencia Inmediata (BCP / BBVA)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded bg-slate-800/80 border border-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'contra_entrega'}
                          onChange={() => setPaymentMethod('contra_entrega')}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-white text-xs font-medium">Pago Contra Entrega en Taller</span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950">
              <div className="space-y-1.5 text-xs mb-3 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Repuestos:</span>
                  <span className="text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Ahorro Mayorista Taller:</span>
                    <span>-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Impuestos (18% IGV):</span>
                  <span className="text-white">${(cartSubtotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total a Pagar / Cargar:</span>
                  <span className="text-amber-400 text-base">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Procesando despacho...'
                    ) : (
                      <>
                        <span>Confirmar Pedido en Sistema</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSendWhatsAppOrder}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Enviar Pedido Directo por WhatsApp</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Ingresar con Código para Confirmar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSendWhatsAppOrder}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Pedir por WhatsApp sin Registrarse</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
