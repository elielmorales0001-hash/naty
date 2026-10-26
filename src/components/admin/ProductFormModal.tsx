import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  productToEdit?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Frenos',
  'Motor & Distribución',
  'Suspensión & Dirección',
  'Filtración & Fluidos',
  'Transmisión & Embragues',
  'Sistema Eléctrico',
  'Herramientas & Taller',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [sku, setSku] = useState('');
  const [oemCode, setOemCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Frenos');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState(0);
  const [workshopPrice, setWorkshopPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [minStockAlert, setMinStockAlert] = useState(5);
  const [locationWarehouse, setLocationWarehouse] = useState('Zona A - Almacén Central');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/part_disc_brakes_1793048711690.jpg');
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  // Technical Specs
  const [specs, setSpecs] = useState<Array<{ key: string; val: string }>>([
    { key: 'Material', val: 'Acero de aleación automotriz' },
    { key: 'Posición', val: 'Eje Delantero' },
  ]);

  // Compatible Vehicles
  const [compatibles, setCompatibles] = useState<Array<{ make: string; model: string; years: string }>>([
    { make: 'Toyota', model: 'Hilux', years: '2016 - 2024' },
  ]);

  useEffect(() => {
    if (productToEdit) {
      setSku(productToEdit.sku);
      setOemCode(productToEdit.oemCode);
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setBrand(productToEdit.brand);
      setDescription(productToEdit.description);
      setRetailPrice(productToEdit.retailPrice);
      setWorkshopPrice(productToEdit.workshopPrice);
      setStock(productToEdit.stock);
      setMinStockAlert(productToEdit.minStockAlert);
      setLocationWarehouse(productToEdit.locationWarehouse);
      setImageUrl(productToEdit.imageUrl);
      setWarrantyMonths(productToEdit.warrantyMonths);
      setSpecs(Object.entries(productToEdit.technicalSpecs).map(([key, val]) => ({ key, val })));
      setCompatibles(
        productToEdit.compatibleVehicles.map((c) => ({
          make: c.make,
          model: c.model,
          years: c.years,
        }))
      );
    } else {
      // Default clean values for new product
      setSku(`ARP-REP-${Math.floor(1000 + Math.random() * 9000)}`);
      setOemCode('');
      setName('');
      setCategory('Frenos');
      setBrand('');
      setDescription('');
      setRetailPrice(80);
      setWorkshopPrice(55);
      setStock(15);
      setMinStockAlert(5);
      setLocationWarehouse('Zona A - Estantería 02');
      setImageUrl('/src/assets/images/part_disc_brakes_1793048711690.jpg');
      setWarrantyMonths(12);
      setSpecs([{ key: 'Material', val: 'Aleación OEM' }]);
      setCompatibles([{ make: 'Toyota', model: 'Hilux', years: '2015 - 2024' }]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techSpecsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) techSpecsObj[s.key.trim()] = s.val.trim();
    });

    const payload = {
      ...(productToEdit ? { id: productToEdit.id } : {}),
      sku: sku.trim() || `ARP-${Date.now()}`,
      oemCode: oemCode.trim() || 'OEM-PENDING',
      name: name.trim() || 'Repuesto Automotriz Pro',
      category,
      brand: brand.trim() || 'Genérico OEM',
      description: description.trim() || 'Componente automotriz para servicio de taller mecánico.',
      technicalSpecs: techSpecsObj,
      compatibleVehicles: compatibles.map((c) => ({
        make: c.make,
        model: c.model,
        years: c.years,
      })),
      retailPrice: Number(retailPrice),
      workshopPrice: Number(workshopPrice),
      bulkTiers: [
        { minQty: 4, discountPercent: 8 },
        { minQty: 10, discountPercent: 15 },
      ],
      stock: Number(stock),
      minStockAlert: Number(minStockAlert),
      locationWarehouse,
      imageUrl,
      warrantyMonths: Number(warrantyMonths),
      active: true,
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {productToEdit ? `Editar Repuesto: ${productToEdit.sku}` : 'Registrar Nuevo Repuesto en Almacén'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Código SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Código OEM Original
              </label>
              <input
                type="text"
                value={oemCode}
                onChange={(e) => setOemCode(e.target.value)}
                placeholder="ej. 43512-0K080"
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre Comercial del Repuesto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="ej. Pastillas de Freno Cerámicas Delanteras"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Marca Fabricante
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                placeholder="ej. Brembo, Bosch, Mann-Filter"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Precio Regular Público ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Precio Mayorista Taller ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={workshopPrice}
                onChange={(e) => setWorkshopPrice(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-amber-500/50 rounded-lg text-amber-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Stock Físico Actual
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Umbral Alerta Mínima
              </label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Ubicación en Almacén
              </label>
              <input
                type="text"
                value={locationWarehouse}
                onChange={(e) => setLocationWarehouse(e.target.value)}
                placeholder="ej. Pasillo A - Estante 03"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Descripción Técnica y Aplicación
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="Detalles de fabricación, composición y tolerancias para mecánicos..."
            />
          </div>

          {/* Technical Specs dynamic list */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-200 uppercase tracking-wider">
                Especificaciones de Montaje
              </span>
              <button
                type="button"
                onClick={() => setSpecs([...specs, { key: '', val: '' }])}
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar campo
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((sp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={sp.key}
                    placeholder="Parámetro (ej. Diámetro)"
                    onChange={(e) => {
                      const next = [...specs];
                      next[idx].key = e.target.value;
                      setSpecs(next);
                    }}
                    className="w-1/2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                  />
                  <input
                    type="text"
                    value={sp.val}
                    placeholder="Valor (ej. 297 mm)"
                    onChange={(e) => {
                      const next = [...specs];
                      next[idx].val = e.target.value;
                      setSpecs(next);
                    }}
                    className="w-1/2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                  />
                  {specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit bar */}
          <div className="border-t border-slate-800 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en Inventario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
