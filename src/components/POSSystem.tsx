import { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { getRestaurantByName, getCategories, getProducts, getTables, getOrderItems, createOrder, closeOrder } from '../lib/api';
import { Restaurant, Category, Product, Table, Order, OrderItem } from '../lib/supabase';
import TablesGrid from './POS/TablesGrid';
import Menu from './POS/Menu';
import CartPanel from './POS/CartPanel';
import CheckoutModal from './POS/CheckoutModal';

interface CartItem extends OrderItem {
  product?: Product;
}

export default function POSSystem() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ total: 0, subtotal: 0, tax: 0 });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize POS system
  useEffect(() => {
    const initializePOS = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);

        const [cats, prods, tbls] = await Promise.all([
          getCategories(rest.id),
          getProducts(rest.id),
          getTables(rest.id),
        ]);

        setCategories(cats);
        setProducts(prods);
        setTables(tbls);
      } catch (error) {
        console.error('Error initializing POS:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePOS();
  }, []);

  // Load cart items when order changes
  useEffect(() => {
    if (!currentOrder) {
      setCartItems([]);
      return;
    }

    const loadCartItems = async () => {
      try {
        const items = await getOrderItems(currentOrder.id);
        const enrichedItems: CartItem[] = items.map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.product_id),
        }));
        setCartItems(enrichedItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };

    loadCartItems();

    // Refresh cart every 2 seconds
    const interval = setInterval(loadCartItems, 2000);
    return () => clearInterval(interval);
  }, [currentOrder, products]);

  const handleSelectTable = async (tableId: string) => {
    if (currentOrder && selectedTableId === currentOrder.table_id) {
      // Continue with same order
      return;
    }

    try {
      setSelectedTableId(tableId);
      const order = await createOrder(restaurant!.id, tableId);
      setCurrentOrder(order);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedTableId(null);
    setCurrentOrder(null);
    setCartItems([]);
  };

  const handleCheckout = async (total: number, subtotal: number, tax: number) => {
    setCheckoutData({ total, subtotal, tax });
    setShowCheckout(true);
  };

  const handleConfirmCheckout = async () => {
    if (!currentOrder || !selectedTableId) return;

    setIsProcessing(true);
    try {
      await closeOrder(
        currentOrder.id,
        restaurant!.id,
        selectedTableId,
        checkoutData.total
      );
      handleClearSelection();
    } catch (error) {
      console.error('Error closing order:', error);
    } finally {
      setIsProcessing(false);
      setShowCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🍽️</span>
          </div>
          <p className="text-neutral-600 font-medium">Cargando Sistema POS...</p>
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
          <h1 className="font-display text-2xl font-bold text-neutral-900">{restaurant?.name}</h1>
          <a href="/admin" className="text-brand-600 hover:text-brand-700 font-medium text-sm">
            Panel de Admin →
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="container-wide section-padding py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tables */}
            <div className="card p-6">
              <TablesGrid
                tables={tables}
                selectedTableId={selectedTableId}
                onSelectTable={handleSelectTable}
                onClearSelection={handleClearSelection}
              />
            </div>

            {/* Menu */}
            {selectedTableId && currentOrder && (
              <div className="card p-6">
                <Menu
                  categories={categories}
                  products={products}
                  orderId={currentOrder.id}
                  onItemAdded={() => {
                    // Cart will refresh automatically
                  }}
                />
              </div>
            )}

            {!selectedTableId && (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-4">👋</div>
                <p className="text-neutral-500 text-lg">Selecciona una mesa para empezar a tomar pedidos</p>
              </div>
            )}
          </div>

          {/* Right: Cart */}
          {selectedTableId && currentOrder && (
            <CartPanel
              items={cartItems}
              restaurant={restaurant!}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        total={checkoutData.total}
        subtotal={checkoutData.subtotal}
        tax={checkoutData.tax}
        onConfirm={handleConfirmCheckout}
        onClose={() => setShowCheckout(false)}
        isProcessing={isProcessing}
      />
    </div>
  );
}
