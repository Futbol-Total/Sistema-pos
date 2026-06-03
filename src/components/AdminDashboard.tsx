import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Zap, Edit2, Save, X } from 'lucide-react';
import { getRestaurantByName, getCategories, getProducts, updateProduct, getDailySales, getProductSales, getPaymentAnalysis, getPastOrders, getOrderItems, getAllEmployees } from '../lib/api';
import { Restaurant, Category, Product, Order, Employee } from '../lib/supabase';

interface DailySalesData {
  total_orders: number;
  total_revenue: number;
  total_tips: number;
  avg_order_value: number;
  cash_orders: number;
  card_orders: number;
  nequi_orders: number;
  daviplata_orders: number;
}

interface ProductSaleData {
  id: string;
  name: string;
  times_sold: number;
  revenue: number;
  total_quantity: number;
}

export default function AdminDashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailySales, setDailySales] = useState<DailySalesData | null>(null);
  const [topProducts, setTopProducts] = useState<ProductSaleData[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const [restaurantEdit, setRestaurantEdit] = useState(false);
  const [restaurantFormData, setRestaurantFormData] = useState<Partial<Restaurant>>({});

  useEffect(() => {
    const initialize = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);
        setRestaurantFormData(rest);

        const [prods, sales, topProds, orders, emps] = await Promise.all([
          getProducts(rest.id),
          getDailySales(rest.id),
          getProductSales(rest.id),
          getPastOrders(rest.id),
          getAllEmployees(rest.id),
        ]);

        setProducts(prods);
        setDailySales(sales as any);
        setTopProducts((topProds as any)?.slice(0, 5) || []);
        setPastOrders(orders);
        setEmployees(emps || []);
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(initialize, 5000);
    initialize();
    return () => clearInterval(interval);
  }, []);

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setEditFormData(product);
  };

  const handleSaveProduct = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-4xl">📊</span>
          </div>
          <p className="text-neutral-300 font-medium">Cargando Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Órdenes Hoy',
      value: dailySales?.total_orders || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Ingresos Totales',
      value: `$${Math.round(dailySales?.total_revenue || 0).toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Ticket Promedio',
      value: `$${Math.round(dailySales?.avg_order_value || 0).toLocaleString('es-CO')}`,
      icon: TrendingUp,
      color: 'from-brand-500 to-brand-600',
    },
    {
      label: 'Propinas Recibidas',
      value: `$${Math.round(dailySales?.total_tips || 0).toLocaleString('es-CO')}`,
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container-wide section-padding py-6 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </a>
          <h1 className="font-display text-3xl font-bold text-white">{restaurant?.name}</h1>
          <div className="flex gap-2">
            <a href="/invoices" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
              📄 Facturas
            </a>
            <a href="/reports" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
              📊 Reportes
            </a>
            <a href="/demo" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors">
              POS →
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide section-padding py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative group`}
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm font-medium">{stat.label}</span>
                  <stat.icon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              Productos Más Vendidos
            </h2>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, idx) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-brand-400 bg-brand-500/20 px-2 py-1 rounded">#{idx + 1}</span>
                        <span className="font-semibold text-white">{product.name}</span>
                      </div>
                      <p className="text-xs text-slate-400">{product.times_sold} ventas • {product.total_quantity} unidades</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">${Math.round(product.revenue).toLocaleString('es-CO')}</div>
                      <p className="text-xs text-slate-400">ingresos</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-8">Sin datos de ventas aún</p>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Medios de Pago</h2>
            <div className="space-y-3">
              {[
                { method: 'Efectivo', count: dailySales?.cash_orders || 0, color: 'from-green-500 to-green-600' },
                { method: 'Tarjeta', count: dailySales?.card_orders || 0, color: 'from-blue-500 to-blue-600' },
                { method: 'Nequi', count: dailySales?.nequi_orders || 0, color: 'from-purple-500 to-purple-600' },
                { method: 'Daviplata', count: dailySales?.daviplata_orders || 0, color: 'from-orange-500 to-orange-600' },
              ].map((item) => (
                <div key={item.method} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">{item.method}</span>
                    <span className="text-lg font-bold text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${((item.count / (dailySales?.total_orders || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Órdenes Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Orden ID</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Mesero</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Subtotal</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Impuesto</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Pago</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Hora</th>
                </tr>
              </thead>
              <tbody>
                {pastOrders.length > 0 ? (
                  pastOrders.map((order) => {
                    const emp = employees.find((e) => e.id === order.employee_id);
                    return (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-slate-300">{emp?.name || '-'}</td>
                        <td className="px-4 py-3 text-slate-300">${Math.round(order.subtotal).toLocaleString('es-CO')}</td>
                        <td className="px-4 py-3 text-slate-300">${Math.round(order.tax).toLocaleString('es-CO')}</td>
                        <td className="px-4 py-3 font-bold text-emerald-400">${Math.round(order.total).toLocaleString('es-CO')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.payment_method === 'cash' ? 'bg-green-500/20 text-green-300' :
                            order.payment_method === 'card' ? 'bg-blue-500/20 text-blue-300' :
                            order.payment_method === 'nequi' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-orange-500/20 text-orange-300'
                          }`}>
                            {order.payment_method || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {order.closed_at ? new Date(order.closed_at).toLocaleTimeString('es-CO') : '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Sin órdenes completadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Management */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Gestionar Productos</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`border rounded-xl p-5 transition-all ${
                  editingId === product.id
                    ? 'bg-brand-500/10 border-brand-400'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {editingId === product.id ? (
                  // Edit form
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase block mb-2">Nombre</label>
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase block mb-2">Precio</label>
                        <input
                          type="number"
                          value={editFormData.price || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-2">Descripción</label>
                      <input
                        type="text"
                        value={editFormData.description || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveProduct}
                        className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display view
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-slate-400 mb-2">{product.description}</p>
                      )}
                      <p className="text-xs text-slate-500">Precio: ${product.price.toLocaleString('es-CO')}</p>
                    </div>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-brand-400 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
