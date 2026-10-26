import React from 'react';
import { ShieldCheck, Truck, Wrench, Award, CheckCircle2, Clock, Users, Building, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onGoToCatalog: () => void;
  onGoToClientsArea: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToCatalog, onGoToClientsArea }) => {
  return (
    <div className="py-12 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner / Presentation */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-black p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>Especialistas en el Canal Mayorista de Talleres Mecánicos</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Quiénes Somos en <span className="text-red-500">AutoRepuestos Pro</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Somos una empresa líder dedicada a la importación, distribución mayorista y comercialización de repuestos y accesorios automotrices de alta tecnología, enfocada exclusivamente en resolver las necesidades críticas de los talleres mecánicos, centros de colisión y flotas comerciales.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={onGoToCatalog}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-red-950/40"
                >
                  Explorar Catálogo de Repuestos
                </button>
                <button
                  onClick={onGoToClientsArea}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-slate-700"
                >
                  Ver Área de Clientes & Talleres
                </button>
              </div>
            </div>

            {/* Official Logo Display */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-3 rounded-full bg-gradient-to-tr from-red-600/30 to-slate-800/80 border-2 border-red-500/40 shadow-2xl">
                <img
                  src="/assets/aistudio/image_1399edb9.png"
                  alt="Logo Oficial AutoRepuestos Pro"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="w-12 h-12 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nuestra Misión</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Abastecer con rapidez, precisión técnica y máxima fiabilidad a los talleres mecánicos de todo el país, garantizando repuestos 100% compatibles, stock continuo en bodega y condiciones comerciales flexibles que impulsen la rentabilidad de cada taller cliente.
            </p>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="w-12 h-12 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Nuestra Visión</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consolidarnos como el ecosistema integral preferido por los profesionales del automóvil, reconocidos por nuestra innovación tecnológica, entrega inmediata en bahía de trabajo y asesoría personalizada de técnicos a mecánicos.
            </p>
          </div>
        </div>

        {/* Pilares Diferenciales para Talleres */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              ¿Por qué los mejores talleres mecánicos confían en AutoRepuestos Pro?
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Diseñamos cada proceso logístico y comercial pensando en los retos diarios de los maestros mecánicos e ingenieros de taller.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Despacho Urgente en Bahía</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entrega prioritaria en 2 horas para vehículos detenidos en elevador. Reducimos al mínimo los tiempos muertos en su taller.
              </p>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Garantía Directa de Fábrica</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todas nuestras piezas cuentan con garantía escrita de 12 a 36 meses. Cambio inmediato en mostrador ante fallas de material.
              </p>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Crédito Comercial a 30 Días</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Facilitamos líneas de financiamiento a talleres afiliados para que atiendan a sus clientes sin descapitalizarse.
              </p>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Asesoría Técnica por WhatsApp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Validación de códigos OEM, números de chasis (VIN) y compatibilidad directa con ingenieros automotrices.
              </p>
            </div>
          </div>
        </div>

        {/* Infraestructura y Bodega */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Centro de Distribución Central</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Almacén central climatizado con más de 3,500 m² de estantería industrial y flota propia de motos y furgones para entrega en el día.
            </p>
            <div className="flex gap-6 text-xs font-mono text-slate-300 pt-2">
              <div><span className="text-red-400 font-bold text-sm block">18,500+</span> Repuestos en Stock</div>
              <div><span className="text-red-400 font-bold text-sm block">120+</span> Talleres Afiliados</div>
              <div><span className="text-red-400 font-bold text-sm block">99.4%</span> Precisión en Despachos</div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onGoToCatalog}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Ver Catálogo Activo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
