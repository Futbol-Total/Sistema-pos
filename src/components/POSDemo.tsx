import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus, X, Settings } from 'lucide-react';
import { getRestaurantByName, getCategories, getProducts, getTables, getOrderItems, createOrder, closeOrder, addOrderItem, updateOrderItem, deleteOrderItem, getAllEmployees, updateOrder } from '../lib/api';
import { Restaurant, Category, Product, Table, Order, OrderItem, Employee } from '../lib/supabase';

interface CartItem extends OrderItem {
  product?: Product;
}

export default function POSDemo() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'nequi' | 'daviplata'>('cash');
  const [showCheckout, setShowCheckout] = useState(false);
  const [includeTax, setIncludeTax] = useState(false);
  const [customTip, setCustomTip] = useState<number | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);
        setIncludeTax(rest.include_tax || false);

        const [cats, prods, tbls, emps] = await Promise.all([
          getCategories(rest.id),
          getProducts(rest.id),
          getTables(rest.id),
          getAllEmployees(rest.id),
        ]);

        setCategories(cats);
        setProducts(prods);
        setTables(tbls);
        const servers = emps.filter((e) => e.position?.toLowerCase().includes('mesero') || e.position?.toLowerCase().includes('server'));
        setEmployees(servers.length > 0 ? servers : emps);
        if (cats.length > 0) setActiveCategory(cats[0].id);
        if (servers.length > 0) setSelectedEmployeeId(servers[0].id);
        else if (emps.length > 0) setSelectedEmployeeId(emps[0].id);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!currentOrder) {
      setCartItems([]);
      return;
    }

    const loadCart = async () => {
      try {
        const items = await getOrderItems(currentOrder.id);
        const enriched: CartItem[] = items.map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.product_id),
        }));
        setCartItems(enriched);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadCart();
    const interval = setInterval(loadCart, 2000);
    return () => clearInterval(interval);
  }, [currentOrder, products]);

  const handleSelectTable = async (tableId: string) => {
    try {
      setSelectedTableId(tableId);
      const order = await createOrder(restaurant!.id, tableId);
      if (selectedEmployeeId) {
        await updateOrder(order.id, { employee_id: selectedEmployeeId } as any);
      }
      setCurrentOrder(order);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddItem = async (product: Product) => {
    if (!currentOrder) return;
    try {
      await addOrderItem(currentOrder.id, product.id, 1, product.price);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    try {
      await updateOrderItem(itemId, newQty);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCheckout = async () => {
    if (!currentOrder || !selectedTableId) return;
    try {
      let finalTotal = currentOrder.subtotal;
      if (includeTax) {
        finalTotal += currentOrder.tax;
      }
      if (customTip && customTip > 0) {
        await updateOrder(currentOrder.id, { tip_amount: customTip } as any);
        finalTotal += customTip;
      }
      await closeOrder(currentOrder.id, restaurant!.id, selectedTableId, finalTotal);
      setSelectedTableId(null);
      setCurrentOrder(null);
      setCartItems([]);
      setShowCheckout(false);
      setCustomTip(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <span className="text-4xl animate-bounce">🍽️</span>
      </div>
    );
  }

  const filteredProducts = activeCategory ? products.filter((p) => p.category_id === activeCategory) : products;
  const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const tax = subtotal * (restaurant?.tax_percentage || 8) / 100;
  const displayTotal = includeTax ? subtotal + tax : subtotal;
  const tip = Math.round(displayTotal * 0.1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container-wide section-padding py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Salir
          </a>
          <h1 className="font-display text-2xl font-bold text-white">{restaurant?.name}</h1>
          <a href="/admin" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
            <Settings className="w-5 h-5" />
            Admin
          </a>
        </div>
      </div>

      <div className="container-wide section-padding py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-180px)]">
          {/* Main POS Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Employee Selection */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Mesero Asignado</h2>
              <select
                value={selectedEmployeeId || ''}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.position})
                  </option>
                ))}
              </select>
            </div>

            {/* Tables Selection */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Selecciona Mesa</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {tables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table.id)}
                    disabled={table.is_occupied && selectedTableId !== table.id}
                    className={`p-3 rounded-xl font-bold transition-all text-sm ${
                      selectedTableId === table.id
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/50'
                        : table.is_occupied
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🍽️</span>
                      <span>Mesa {table.table_number}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedTableId && (
              <>
                {/* Categories */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4">Categorías</h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                          activeCategory === cat.id
                            ? 'bg-brand-500 text-white'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Grid */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4">Menú</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleAddItem(product)}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-brand-400 transition-all hover:shadow-lg hover:shadow-brand-500/20 p-4"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-brand-500/0 group-hover:from-brand-500/10 group-hover:to-brand-500/10 transition-all" />
                        <div className="relative z-10">
                          <div className="w-full h-16 bg-white/5 rounded-lg mb-2 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                            🍽️
                          </div>
                          <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">{product.name}</h3>
                          <p className="text-brand-400 font-bold text-lg">${product.price.toLocaleString('es-CO')}</p>
                          <div className="mt-2 w-full px-2 py-1.5 bg-brand-500/80 rounded text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Agregar +
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart */}
          {selectedTableId && (
            <div className="bg-gradient-to-b from-brand-500 to-brand-600 rounded-2xl p-6 border border-brand-400 shadow-2xl shadow-brand-500/20 flex flex-col h-fit sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Orden Actual</h2>

              {/* Items */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-64">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl">🛒</span>
                    <p className="text-white/80 text-sm mt-2">Agrega artículos</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-white text-sm">{item.product?.name}</p>
                          <p className="text-xs text-white/70">${item.unit_price.toLocaleString('es-CO')}</p>
                        </div>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 0)}
                          className="text-white/60 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-white/20 rounded hover:bg-white/30 flex items-center justify-center text-white text-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-white/20 rounded hover:bg-white/30 flex items-center justify-center text-white text-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <>
                  {/* Totals */}
                  <div className="bg-white/10 rounded-lg p-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-white/90">
                      <span>Subtotal:</span>
                      <span>${Math.round(subtotal).toLocaleString('es-CO')}</span>
                    </div>
                    {includeTax && (
                      <div className="flex justify-between text-white/90">
                        <span>Impuesto ({restaurant?.tax_percentage}%):</span>
                        <span>${Math.round(tax).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    <div className="border-t border-white/20 pt-2 flex justify-between">
                      <span className="font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-white">${Math.round(displayTotal).toLocaleString('es-CO')}</span>
                    </div>
                    <div className="text-xs text-white/80 bg-white/5 rounded px-2 py-1">
                      Propina (10%): <span className="font-bold">${Math.round(tip).toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-white/80 uppercase block mb-2">Medio de Pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'cash', label: '💵 Efectivo' },
                        { value: 'card', label: '💳 Tarjeta' },
                        { value: 'nequi', label: '📱 Nequi' },
                        { value: 'daviplata', label: '📲 Daviplata' },
                      ].map((m: any) => (
                        <button
                          key={m.value}
                          onClick={() => setPaymentMethod(m.value)}
                          className={`px-2 py-2 rounded text-xs font-semibold transition-all ${
                            paymentMethod === m.value
                              ? 'bg-white text-brand-600'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-white text-brand-600 py-3 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg"
                  >
                    Cerrar Cuenta
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Confirmar Pago</h3>
            <div className="bg-brand-500/20 rounded-xl p-4 mb-6 border border-brand-400">
              <p className="text-brand-300 text-sm mb-1">Total a Pagar</p>
              <p className="text-4xl font-bold text-brand-400">
                ${Math.round(displayTotal + (customTip || 0)).toLocaleString('es-CO')}
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/80 text-sm">
                <span>Subtotal:</span>
                <span>${Math.round(subtotal).toLocaleString('es-CO')}</span>
              </div>
              {includeTax && (
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Impuesto:</span>
                  <span>${Math.round(tax).toLocaleString('es-CO')}</span>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-300 mb-3">Propina (Opcional)</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[0, Math.round(displayTotal * 0.1), Math.round(displayTotal * 0.15), Math.round(displayTotal * 0.2)].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setCustomTip(tip === 0 ? null : tip)}
                    className={`py-2 rounded-lg font-medium text-sm transition-all ${
                      (customTip ?? 0) === tip
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tip === 0 ? 'Ninguna' : `$${tip.toLocaleString('es-CO')}`}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={customTip ?? ''}
                  onChange={(e) => setCustomTip(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Otra cantidad"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setCustomTip(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
