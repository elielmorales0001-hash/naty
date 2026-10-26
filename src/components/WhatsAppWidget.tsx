import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Clock, ShieldCheck, Zap } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const CONTACT_CHANNELS = [
    {
      role: 'Asesoría Técnica & Compatibilidad OEM',
      name: 'Ing. Nayri Huancas',
      phone: '+51 972 554 119',
      rawNumber: '51972554119',
      description: 'Consultas de códigos OEM, chasis VIN y equivalencias para mecánicos.',
      defaultMessage: 'Hola AutoRepuestos Pro, requiero asesoría técnica para cotizar repuestos para mi taller mecánico.',
      badge: 'Online',
      badgeColor: 'text-emerald-400',
    },
    {
      role: 'Despacho Urgente en Bahía (2h)',
      name: 'Coordinador de Rutas y Urgencias',
      phone: '+51 984 210 345',
      rawNumber: '51984210345',
      description: 'Prioridad máxima para vehículos detenidos en elevador o puente de trabajo.',
      defaultMessage: 'Hola, tengo una emergencia en bahía con vehículo detenido y requiero despacho prioritario.',
      badge: 'Prioritario 2h',
      badgeColor: 'text-amber-400',
    },
    {
      role: 'Créditos, Facturación & Cobranzas',
      name: 'Área de Administración de Clientes',
      phone: '+51 991 304 882',
      rawNumber: '51991304882',
      description: 'Líneas de crédito a 30 días, facturas electrónicas y estados de cuenta.',
      defaultMessage: 'Hola, deseo consultar sobre mi línea de crédito de taller o facturación electrónica.',
      badge: 'Administración',
      badgeColor: 'text-blue-400',
    },
  ];

  const handleOpenWhatsApp = (rawNumber: string, message: string) => {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${rawNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-400/40"
          title="Atención directa por WhatsApp para Talleres"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            WhatsApp Talleres
          </span>
        </button>
      )}

      {/* Expanded Menu Modal/Flyout */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col">
          {/* Header */}
          <div className="bg-emerald-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Líneas WhatsApp de Taller</h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Respuesta inmediata en horario de bahía
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Channels List */}
          <div className="p-3.5 space-y-2.5 max-h-[420px] overflow-y-auto">
            {CONTACT_CHANNELS.map((ch, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenWhatsApp(ch.rawNumber, ch.defaultMessage)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors block">
                      {ch.role}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                      {ch.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 ${ch.badgeColor}`}>
                    {ch.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  {ch.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">{ch.phone}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 group-hover:text-emerald-300">
                    Chatear <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Notice */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-400">
            AutoRepuestos Pro · Atención de Lunes a Sábado de 07:30 a 19:00 hrs
          </div>
        </div>
      )}
    </div>
  );
};
