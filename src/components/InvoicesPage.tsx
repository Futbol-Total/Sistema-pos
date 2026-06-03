import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Download, Eye, Filter, Calendar } from 'lucide-react';
import { getRestaurantByName, getPastOrders, getOrderItems } from '../lib/api';
import { Restaurant, Order, OrderItem, Product } from '../lib/supabase';
import { getProducts } from '../lib/api';

interface OrderWithItems {
  order: Order;
  items: OrderItem[];
  products: Product[];
}

export default function InvoicesPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);

        const [prods, pastOrders] = await Promise.all([
          getProducts(rest.id),
          getPastOrders(rest.id, 100),
        ]);

        setProducts(prods);

        // Get order items for each order
        const ordersWithItems = await Promise.all(
          pastOrders.map(async (order) => {
            const items = await getOrderItems(order.id);
            return {
              order,
              items,
              products: prods,
            };
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const filteredOrders = orders.filter((oi) => {
    if (filterPayment !== 'all' && oi.order.payment_method !== filterPayment) return false;
    if (filterDate && !oi.order.closed_at?.startsWith(filterDate)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <span className="text-4xl animate-bounce">📄</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container-wide section-padding py-4 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </a>
          <h1 className="font-display text-2xl font-bold text-white">Facturación y Órdenes</h1>
          <div className="text-right">
            <p className="text-xs text-slate-400">Total de órdenes: {filteredOrders.length}</p>
          </div>
        </div>
      </div>

      <div className="container-wide section-padding py-8">
        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Medio de Pago
              </label>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">Todos</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="nequi">Nequi</option>
                <option value="daviplata">Daviplata</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterPayment('all');
                  setFilterDate('');
                }}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <p className="text-slate-400">No hay órdenes que cumplan con los filtros</p>
            </div>
          ) : (
            filteredOrders.map((orderWI) => (
              <div
                key={orderWI.order.id}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-brand-400 bg-brand-500/20 px-3 py-1 rounded">
                        {orderWI.order.id.slice(0, 8)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        orderWI.order.payment_method === 'cash' ? 'bg-green-500/20 text-green-300' :
                        orderWI.order.payment_method === 'card' ? 'bg-blue-500/20 text-blue-300' :
                        orderWI.order.payment_method === 'nequi' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>
                        {orderWI.order.payment_method?.toUpperCase() || 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400">Hora</p>
                        <p className="text-sm font-semibold text-white">
                          {orderWI.order.closed_at ? new Date(orderWI.order.closed_at).toLocaleTimeString('es-CO') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Subtotal</p>
                        <p className="text-sm font-semibold text-white">
                          ${Math.round(orderWI.order.subtotal).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Impuesto</p>
                        <p className="text-sm font-semibold text-white">
                          ${Math.round(orderWI.order.tax).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Total</p>
                        <p className="text-lg font-bold text-emerald-400">
                          ${Math.round(orderWI.order.total).toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {orderWI.items.length} item(s) • Propina: ${Math.round(orderWI.order.tip_amount || 0).toLocaleString('es-CO')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setSelectedOrder(orderWI)}
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                      title="Imprimir"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Invoice Header */}
            <div className="text-center mb-6 pb-6 border-b">
              <h2 className="font-display text-2xl font-bold text-neutral-900">{restaurant?.name}</h2>
              <p className="text-sm text-neutral-500">Factura #{selectedOrder.order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-neutral-400 mt-2">
                {selectedOrder.order.closed_at ? new Date(selectedOrder.order.closed_at).toLocaleString('es-CO') : '-'}
              </p>
            </div>

            {/* Items */}
            <div className="mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 font-semibold text-neutral-700">Producto</th>
                    <th className="text-center py-2 font-semibold text-neutral-700">Cant</th>
                    <th className="text-right py-2 font-semibold text-neutral-700">Precio</th>
                    <th className="text-right py-2 font-semibold text-neutral-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => {
                    const product = selectedOrder.products.find((p) => p.id === item.product_id);
                    return (
                      <tr key={item.id} className="border-b border-neutral-100">
                        <td className="py-2 text-neutral-700">{product?.name || 'Producto'}</td>
                        <td className="text-center text-neutral-700">{item.quantity}</td>
                        <td className="text-right text-neutral-700">${Math.round(item.unit_price).toLocaleString('es-CO')}</td>
                        <td className="text-right font-semibold text-neutral-900">
                          ${Math.round(item.unit_price * item.quantity).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="font-semibold text-neutral-900">
                  ${Math.round(selectedOrder.order.subtotal).toLocaleString('es-CO')}
                </span>
              </div>
              {selectedOrder.order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Impuesto:</span>
                  <span className="font-semibold text-neutral-900">
                    ${Math.round(selectedOrder.order.tax).toLocaleString('es-CO')}
                  </span>
                </div>
              )}
              {selectedOrder.order.tip_amount && selectedOrder.order.tip_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Propina:</span>
                  <span className="font-semibold text-neutral-900">
                    ${Math.round(selectedOrder.order.tip_amount).toLocaleString('es-CO')}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-neutral-900">Total:</span>
                <span className="text-lg font-bold text-brand-600">
                  ${Math.round(selectedOrder.order.total).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="text-xs text-neutral-400">Medio de Pago</p>
              <p className="text-sm font-semibold text-neutral-900 capitalize">
                {selectedOrder.order.payment_method || 'N/A'}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
