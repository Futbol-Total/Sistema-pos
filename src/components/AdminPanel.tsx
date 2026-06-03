import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { getRestaurantByName, getCategories, getProducts, updateProduct } from '../lib/api';
import { Restaurant, Category, Product } from '../lib/supabase';

export default function AdminPanel() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    const initialize = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);

        const [cats, prods] = await Promise.all([
          getCategories(rest.id),
          getProducts(rest.id),
        ]);

        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditFormData(product);
  };

  const handleSave = async () => {
    if (!editingId || !editFormData.name) return;
    try {
      await updateProduct(editingId, editFormData);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...editFormData } : p))
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">⚙️</span>
          </div>
          <p className="text-neutral-600 font-medium">Cargando Panel de Administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container-wide section-padding py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Volver a Inicio
          </a>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Panel de Administración</h1>
          <a href="/demo" className="text-brand-600 hover:text-brand-700 font-medium text-sm">
            Ver POS Demo →
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide section-padding py-8">
        <div className="card p-8">
          <h2 className="font-display text-3xl font-bold text-neutral-900 mb-2">
            Editar Menú — {restaurant?.name}
          </h2>
          <p className="text-neutral-500 mb-6">
            Personaliza los productos, precios y categorías de tu restaurante demo
          </p>

          {/* Products List */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`border rounded-xl p-5 transition-all ${
                  editingId === product.id
                    ? 'bg-brand-50 border-brand-300'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {editingId === product.id ? (
                  // Edit form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-600 uppercase block mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-600 uppercase block mb-1">
                          Precio
                        </label>
                        <input
                          type="number"
                          value={editFormData.price || 0}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 uppercase block mb-1">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={editFormData.description || ''}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display view
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-neutral-500 mb-2">{product.description}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-brand-600">
                          ${product.price.toLocaleString('es-CO')}
                        </span>
                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                          {categories.find((c) => c.id === product.category_id)?.name || 'Sin categoría'}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            product.is_available
                              ? 'bg-success-100 text-success-700'
                              : 'bg-danger-100 text-danger-700'
                          }`}
                        >
                          {product.is_available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-brand-600 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-neutral-500">No hay productos disponibles</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="card p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Cómo usar esta interfaz</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Edita nombres, precios y descripciones de productos</li>
              <li>✓ Los cambios se guardan automáticamente en la base de datos</li>
              <li>✓ Vuelve al POS Demo para ver los cambios en tiempo real</li>
              <li>✓ Prueba tomando una orden con los productos actualizados</li>
            </ul>
          </div>
          <div className="card p-6 bg-brand-50 border-brand-200">
            <h3 className="font-semibold text-brand-900 mb-2">Próximos pasos</h3>
            <ul className="text-sm text-brand-800 space-y-2">
              <li>1. Personaliza el menú con tus productos reales</li>
              <li>2. Ve al POS Demo y prueba una orden completa</li>
              <li>3. Completa el cierre de caja con diferentes medios de pago</li>
              <li>4. Muestra la funcionalidad al restaurantero</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
