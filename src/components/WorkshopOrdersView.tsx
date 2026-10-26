import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkshopOrder } from '../types';
import { Package, Clock, Truck, CheckCircle2, AlertTriangle, FileText, Printer, ArrowLeft } from 'lucide-react';

interface WorkshopOrdersViewProps {
  onBackToCatalog: () => void;
}

export const WorkshopOrdersView: React.FC<WorkshopOrdersViewProps> = ({ onBackToCatalog }) => {
  const { orders, user } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<WorkshopOrder | null>(null);

  // Filter orders for the logged in workshop
  const myOrders = orders.filter((o) => {
    if (!user) return true;
    if (user.role === 'admin') return true;
    return o.workshopEmail.toLowerCase() === user.email.toLowerCase();
  });

  const getStatusBadge = (status: WorkshopOrder['status']) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pendiente de Validación
          </span>
        );
      case 'en_preparacion':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="w-3.5 h-3.5" />
            En Preparación en Almacén
          </span>
        );
      case 'despachado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Truck className="w-3.5 h-3.5" />
            En Ruta a su Taller
          </span>
        );
      case 'entregado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Entregado Conforme
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  const getStatusStepIndex = (status: WorkshopOrder['status']) => {
    switch (status) {
      case 'pendiente':
        return 0;
      case 'en_preparacion':
        return 1;
      case 'despachado':
        return 2;
      case 'entregado':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-medium mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo de Repuestos
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pedidos de {user?.workshopName || 'Mi Taller'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Seguimiento en tiempo real de despachos, guías de remisión y piezas en tránsito a bahía.
          </p>
        </div>

        {user && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
            <span className="text-slate-400 block">Línea de Crédito Taller:</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${user.availableCredit?.toLocaleString() || '10,000'} / ${user.creditLimit?.toLocaleString() || '15,000'}
            </span>
          </div>
        )}
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Package className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-white">No tiene pedidos registrados aún</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Seleccione repuestos del catálogo para solicitar entrega programada o urgente en su taller.
          </p>
          <button
            onClick={onBackToCatalog}
            className="mt-5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Ir al Catálogo de Repuestos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const stepIdx = getStatusStepIndex(order.status);
            const steps = [
              { label: 'Recibido', desc: 'Validación técnica' },
              { label: 'Preparación', desc: 'Picking en almacén' },
              { label: 'En Ruta', desc: 'Despacho a taller' },
              { label: 'Entregado', desc: 'Recepción en bahía' },
            ];

            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {order.orderNumber}
                      </span>
                      {order.isUrgentWorkshopOrder && (
                        <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[11px] font-bold text-red-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Urgente en Bahía (2h)
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Generado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-bold font-mono tabular-nums text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="py-5">
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 -z-0" />
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-amber-500 transition-all duration-500 -z-0"
                      style={{ width: `${(stepIdx / 3) * 100}%` }}
                    />

                    <div className="grid grid-cols-4 relative z-10 text-center">
                      {steps.map((st, i) => {
                        const isDone = i <= stepIdx;
                        const isCurrent = i === stepIdx;
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-amber-500 text-slate-950 ring-4 ring-slate-900'
                                  : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900'
                              } ${isCurrent ? 'ring-amber-500/30 ring-8' : ''}`}
                            >
                              {i + 1}
                            </div>
                            <span
                              className={`text-xs font-medium mt-2 ${
                                isDone ? 'text-white' : 'text-slate-500'
                              }`}
                            >
                              {st.label}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:block">
                              {st.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dispatch Details & Estimated Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block font-mono">Guía de Remisión:</span>
                    <span className="font-semibold text-slate-200 font-mono">
                      {order.trackingGuide || 'Pendiente de asignación'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono">Tiempo Estimado:</span>
                    <span className="font-semibold text-amber-400">
                      {order.estimatedDelivery || 'Coordinando ruta'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono">Bahía / Entrega:</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {order.deliveryBayOrNote || order.deliveryAddress}
                    </span>
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/50 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Código OEM / SKU</th>
                        <th className="p-2.5">Repuesto</th>
                        <th className="p-2.5 text-center">Cantidad</th>
                        <th className="p-2.5 text-right">Precio Taller</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {order.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20">
                          <td className="p-2.5 font-mono text-amber-400">
                            {it.oemCode} <span className="text-slate-500">({it.sku})</span>
                          </td>
                          <td className="p-2.5 font-medium text-white">{it.name}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{it.quantity}</td>
                          <td className="p-2.5 text-right font-mono">${it.unitPrice.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-white">
                            ${it.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Print Dispatch Slip button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Condición de Pago: <span className="text-slate-200 capitalize font-medium">{order.paymentMethod.replace(/_/g, ' ')}</span>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer text-xs font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Hoja de Despacho</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatch Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Guía de Despacho y Remisión #{selectedOrder.trackingGuide || selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XClose />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Emisor:</span>
                  <span className="font-bold text-white">AutoRepuestos Pro S.A.C.</span>
                  <span className="block text-slate-400">RUC: 20608912301</span>
                  <span className="block text-slate-400">Almacén Central Parque Automotriz</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Taller Destino:</span>
                  <span className="font-bold text-white">{selectedOrder.workshopName}</span>
                  <span className="block text-slate-400">{selectedOrder.deliveryAddress}</span>
                  <span className="block text-slate-400">Atención: {selectedOrder.deliveryBayOrNote}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1">
                  <span>DESCRIPCIÓN DE PIEZA</span>
                  <span>CANT / TOTAL</span>
                </div>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{it.quantity}x {it.name} ({it.oemCode})</span>
                    <span>${it.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-2 mt-2 flex justify-between font-bold text-amber-400 text-sm">
                  <span>TOTAL A ENTREGAR:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Documento
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
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

const XClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
