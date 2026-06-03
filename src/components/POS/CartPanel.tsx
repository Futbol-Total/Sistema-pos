import { useState } from 'react';
import { Plus, Minus, Trash2, X } from 'lucide-react';
import { OrderItem, Product, Restaurant } from '../../lib/supabase';
import { updateOrderItem, deleteOrderItem } from '../../lib/api';

interface CartItem extends OrderItem {
  product?: Product;
}

interface CartPanelProps {
  items: CartItem[];
  restaurant: Restaurant;
  onCheckout: (total: number, subtotal: number, tax: number) => void;
  isProcessing: boolean;
}

export default function CartPanel({ items, restaurant, onCheckout, isProcessing }: CartPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'nequi' | 'daviplata'>('cash');

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const tax = subtotal * (restaurant.tax_percentage / 100);
  const total = subtotal + tax;
  const tip = Math.round(total * 0.1);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateOrderItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteOrderItem(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-neutral-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-100">
        <h2 className="font-semibold text-neutral-900">Cuenta</h2>
        {items.length > 0 && (
          <p className="text-xs text-neutral-400 mt-1">{items.length} item(s)</p>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-sm text-neutral-400">Selecciona artículos del menú</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {item.product?.name || 'Producto'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    ${(item.unit_price).toLocaleString('es-CO')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-neutral-400 hover:text-danger-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="flex-1 text-center text-sm font-semibold text-neutral-900">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <>
          <div className="px-4 py-4 space-y-2.5 border-t border-neutral-100 bg-neutral-50">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-semibold text-neutral-900">
                ${Math.round(subtotal).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Impuesto ({restaurant.tax_percentage}%):</span>
              <span className="font-semibold text-neutral-900">
                ${Math.round(tax).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="flex justify-between text-lg">
              <span className="font-bold text-neutral-900">Total:</span>
              <span className="font-bold text-brand-600">
                ${Math.round(total).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="text-xs text-neutral-500 bg-brand-50 rounded px-3 py-2">
              Propina sugerida (10%): <span className="font-semibold text-brand-600">${Math.round(tip).toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="px-4 py-3 border-t border-neutral-100">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide block mb-2">
              Medio de Pago
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'cash', label: 'Efectivo' },
                { value: 'card', label: 'Tarjeta' },
                { value: 'nequi', label: 'Nequi' },
                { value: 'daviplata', label: 'Daviplata' },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    paymentMethod === method.value
                      ? 'bg-brand-500 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout button */}
          <button
            onClick={() => onCheckout(Math.round(total), Math.round(subtotal), Math.round(tax))}
            disabled={isProcessing}
            className="w-full m-4 mt-3 btn-primary py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando...' : 'Cerrar Cuenta'}
          </button>
        </>
      )}
    </div>
  );
}
