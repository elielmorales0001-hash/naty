import React from 'react';
import { useApp } from '../context/AppContext';
import { Car, Search, X, Filter } from 'lucide-react';

const POPULAR_MAKES = ['Todas las Marcas', 'Toyota', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Volkswagen', 'Ford', 'Mitsubishi'];

export const VehicleFilter: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    vehicleFilter,
    setVehicleFilter,
  } = useApp();

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === 'Todas las Marcas' ? '' : e.target.value;
    setVehicleFilter({ ...vehicleFilter, make: val });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleFilter({ ...vehicleFilter, model: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleFilter({ ...vehicleFilter, year: e.target.value });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setVehicleFilter({ make: '', model: '', year: '' });
  };

  const hasActiveFilters = searchQuery !== '' || vehicleFilter.make !== '' || vehicleFilter.model !== '' || vehicleFilter.year !== '';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search input for OEM / Part name */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por Código OEM (ej. 43512-0K080), SKU o nombre del repuesto..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Compatibility Filters: Make */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:w-[480px]">
          <div>
            <select
              value={vehicleFilter.make || 'Todas las Marcas'}
              onChange={handleMakeChange}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {POPULAR_MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              value={vehicleFilter.model}
              onChange={handleModelChange}
              placeholder="Modelo (ej. Hilux)"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              value={vehicleFilter.year}
              onChange={handleYearChange}
              placeholder="Año (ej. 2018)"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Workshop Quick Fitment Tip */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <Car className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Filtro de compatibilidad directa para bahía de taller. Ingrese el modelo o código OEM de la pieza desmontada.</span>
      </div>
    </div>
  );
};
