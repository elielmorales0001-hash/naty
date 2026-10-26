import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkshopProfile } from '../types';
import {
  Building2,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  CreditCard,
  User,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Copy,
  X,
  ShieldAlert,
  Lock,
} from 'lucide-react';

interface ClientsAreaViewProps {
  onBackToCatalog: () => void;
  onOpenAuth: (asAdmin?: boolean) => void;
}

export const ClientsAreaView: React.FC<ClientsAreaViewProps> = ({
  onBackToCatalog,
  onOpenAuth,
}) => {
  const { workshops, user, addWorkshop, updateWorkshop, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('Todas');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Workshop Form State
  const [newWorkshopName, setNewWorkshopName] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newRuc, setNewRuc] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Lima');
  const [newBaysCount, setNewBaysCount] = useState(4);
  const [newCreditLimit, setNewCreditLimit] = useState(8000);

  const isAdmin = user?.role === 'admin';

  // Find logged-in workshop profile if client
  const currentWorkshopProfile = user
    ? workshops.find((w) => w.email.toLowerCase() === user.email.toLowerCase()) || {
        id: 'ws-current',
        email: user.email,
        workshopName: user.workshopName || 'Mi Taller Mecánico',
        contactName: user.contactName || 'Encargado',
        ruc: user.ruc || '20601928341',
        phone: user.phone || '+51 972 554 119',
        whatsapp: user.whatsapp || user.phone || '+51 972 554 119',
        address: user.address || 'Dirección de Taller',
        city: 'Lima',
        baysCount: 6,
        tier: user.tier || 'Taller Pro',
        creditLimit: user.creditLimit || 8000,
        availableCredit: user.availableCredit || 6500,
        registeredDate: '2024-01-01',
        totalOrdersCount: 15,
      }
    : null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado: ${text}`, 'info');
  };

  const handleOpenWhatsApp = (phone: string, workshopName: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const message = encodeURIComponent(
      `Hola ${workshopName}, nos comunicamos desde AutoRepuestos Pro.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleRegisterWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkshopName || !newEmail || !newPhone) return;

    addWorkshop({
      workshopName: newWorkshopName,
      contactName: newContactName || 'Encargado de Taller',
      ruc: newRuc || '20' + Math.floor(100000000 + Math.random() * 900000000),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone,
      whatsapp: newWhatsapp || newPhone,
      address: newAddress || 'Dirección de Taller',
      city: newCity,
      baysCount: Number(newBaysCount) || 3,
      tier: 'Taller Pro',
      creditLimit: Number(newCreditLimit) || 8000,
      availableCredit: Number(newCreditLimit) || 8000,
    });

    setIsRegisterModalOpen(false);
    setNewWorkshopName('');
    setNewContactName('');
    setNewRuc('');
    setNewEmail('');
    setNewPhone('');
    setNewWhatsapp('');
    setNewAddress('');
  };

  // IF USER IS NOT ADMIN: CLIENTS ONLY SEE THEIR OWN PROFILE (PRIVACY & CONFIDENTIALITY)
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 mb-1">
            <Building2 className="w-4 h-4" />
            <span>PORTAL DEL CLIENTE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Mi Cuenta de Taller Mecánico
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Información de su taller registrado, línea de crédito comercial y canales directos de atención.
          </p>
        </div>

        {user && currentWorkshopProfile ? (
          <div className="space-y-6">
            {/* Workshop Master Profile Card */}
            <div className="p-6 sm:p-8 bg-slate-900 border-2 border-red-500/30 rounded-2xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {currentWorkshopProfile.workshopName}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">
                      RUC: {currentWorkshopProfile.ruc} · {currentWorkshopProfile.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-600 text-white shadow-sm">
                    {currentWorkshopProfile.tier}
                  </span>
                </div>
              </div>

              {/* Business Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono block">Correo Electrónico Registrado:</span>
                  <span className="text-white font-mono font-semibold text-sm">{currentWorkshopProfile.email}</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono block">Teléfono / WhatsApp de Bahía:</span>
                  <span className="text-white font-mono font-semibold text-sm">{currentWorkshopProfile.phone}</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono block">Contacto Responsable:</span>
                  <span className="text-white font-semibold text-sm">{currentWorkshopProfile.contactName}</span>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-mono block">Dirección de Entrega:</span>
                  <span className="text-white font-semibold text-sm">{currentWorkshopProfile.address}</span>
                </div>
              </div>

              {/* Credit Status */}
              <div className="p-5 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    LÍNEA DE CRÉDITO COMERCIAL ACTIVA
                  </span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    ${currentWorkshopProfile.availableCredit.toLocaleString()} USD
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Límite autorizado: ${currentWorkshopProfile.creditLimit.toLocaleString()} USD · Condiciones: 30 días sin intereses
                  </span>
                </div>

                <a
                  href="https://wa.me/51972554119?text=Hola%20AutoRepuestos%20Pro,%20deseo%20solicitar%20un%20aumento%20en%20la%20línea%20de%20crédito%20de%20mi%20taller"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Solicitar Aumento</span>
                </a>
              </div>
            </div>

            {/* Privacy notice explaining why the database is protected */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                Por política de confidencialidad comercial y protección de datos, la base de datos completa de talleres clientes sólo es visible para el administrador general de AutoRepuestos Pro.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
            <Lock className="w-10 h-10 mx-auto text-amber-500" />
            <h3 className="text-lg font-bold text-white">Inicie sesión para ver su cuenta de taller</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ingrese con su código de verificación al correo para consultar su límite de crédito, pedidos y datos registrados.
            </p>
            <button
              onClick={() => onOpenAuth(false)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Ingresar con Código al Correo
            </button>
          </div>
        )}
      </div>
    );
  }

  // IF USER IS ADMIN: FULL DATABASE ACCESS OF ALL WORKSHOPS
  const cities = ['Todas', ...Array.from(new Set(workshops.map((w) => w.city)))];

  const filteredWorkshops = workshops.filter((w) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      w.workshopName.toLowerCase().includes(q) ||
      w.email.toLowerCase().includes(q) ||
      w.phone.includes(q) ||
      w.contactName.toLowerCase().includes(q) ||
      w.ruc.includes(q);

    const matchesCity = cityFilter === 'Todas' || w.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>BASE DE DATOS EXCLUSIVA DE ADMINISTRACIÓN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Base de Datos Central de Clientes y Talleres
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión interna de correos institucionales, teléfonos de contacto directo y líneas de crédito.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Afiliar Nuevo Taller</span>
          </button>
        </div>
      </div>

      {/* Search and City Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute inset-y-0 left-3 my-auto" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por taller, correo electrónico, teléfono o RUC..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'Todas' ? 'Todas las Ciudades' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filteredWorkshops.length} talleres registrados en la base de datos
        </span>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map((workshop) => (
          <div
            key={workshop.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">
                    {workshop.workshopName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-slate-400">RUC: {workshop.ruc}</span>
                    <span>·</span>
                    <span className="text-red-400 font-medium">{workshop.city}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {workshop.tier}
                </span>
              </div>

              {/* Contact Data: Emails & Phones */}
              <div className="py-3 space-y-2 text-xs">
                {/* Contact person */}
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{workshop.contactName}</span>
                </div>

                {/* Email address with copy button */}
                <div className="flex items-center justify-between gap-1 p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="font-mono text-slate-200 truncate select-all">
                      {workshop.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(workshop.email, 'Correo electrónico')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Copiar correo"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Phone & WhatsApp with direct actions */}
                <div className="flex items-center justify-between gap-1 p-2 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono text-slate-200">{workshop.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(workshop.phone, 'Número de teléfono')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Copiar teléfono"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Physical Address */}
                <div className="flex items-start gap-2 text-slate-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-[11px] line-clamp-2">{workshop.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions and Stats */}
            <div className="pt-3 border-t border-slate-800 mt-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Línea de Crédito:</span>
                <span className="font-bold text-emerald-400">
                  ${workshop.availableCredit.toLocaleString()} / ${workshop.creditLimit.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenWhatsApp(workshop.whatsapp || workshop.phone, workshop.workshopName)}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`tel:${workshop.phone.replace(/[^\d+]/g, '')}`}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal for Workshops */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base">Afiliar Nuevo Taller a la Base de Datos</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWorkshop} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Nombre o Razón Social del Taller
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkshopName}
                    onChange={(e) => setNewWorkshopName(e.target.value)}
                    placeholder="ej. Taller Mecánico Los Andes"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    RUC / Identificación Fiscal
                  </label>
                  <input
                    type="text"
                    required
                    value={newRuc}
                    onChange={(e) => setNewRuc(e.target.value)}
                    placeholder="20601234567"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Correo Electrónico Oficial
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="taller@ejemplo.com"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Teléfono & WhatsApp de Contacto
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Nombre del Contacto / Maestro Mecánico
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="ej. Maestro Carlos Ramos"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="ej. Lima, Arequipa, Trujillo"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Dirección del Taller (Bahías de Entrega)
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Av. Principal 1234, Parque Industrial"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Número de Bahías / Elevadores
                  </label>
                  <input
                    type="number"
                    value={newBaysCount}
                    onChange={(e) => setNewBaysCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Línea de Crédito Solicitada ($)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-md"
                >
                  Registrar Taller en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
