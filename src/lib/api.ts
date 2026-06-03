import { supabase, Restaurant, Product, Category, Table, Order, OrderItem } from './supabase';

export async function getRestaurants() {
  const { data, error } = await supabase.from('restaurants').select('*');
  if (error) throw error;
  return data as Restaurant[];
}

export async function getRestaurantByName(name: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('name', name)
    .maybeSingle();
  if (error) throw error;
  return data as Restaurant | null;
}

export async function updateRestaurant(id: string, updates: Partial<Restaurant>) {
  const { error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function getCategories(restaurantId: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as Category[];
}

export async function getProducts(restaurantId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data as Product[];
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function getTables(restaurantId: string) {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('table_number', { ascending: true });
  if (error) throw error;
  return data as Table[];
}

export async function updateTable(id: string, updates: Partial<Table>) {
  const { error } = await supabase
    .from('tables')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function createOrder(restaurantId: string, tableId: string) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      restaurant_id: restaurantId,
      table_id: tableId,
      status: 'open',
      subtotal: 0,
      tax: 0,
      total: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Order;
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function getOrderItems(orderId: string) {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  if (error) throw error;
  return data as OrderItem[];
}

export async function addOrderItem(orderId: string, productId: string, quantity: number, unitPrice: number) {
  const { data, error } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      product_id: productId,
      quantity,
      unit_price: unitPrice,
    })
    .select()
    .single();
  if (error) throw error;
  return data as OrderItem;
}

export async function updateOrderItem(id: string, quantity: number) {
  if (quantity <= 0) {
    return deleteOrderItem(id);
  }
  const { error } = await supabase
    .from('order_items')
    .update({ quantity })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteOrderItem(id: string) {
  const { error } = await supabase
    .from('order_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function closeOrder(id: string, restaurantId: string, tableId: string, total: number) {
  await updateOrder(id, {
    status: 'paid',
    closed_at: new Date().toISOString(),
  });

  await updateTable(tableId, {
    is_occupied: false,
    current_order_id: null,
  });
}

// Analytics functions
export async function getDailySales(restaurantId: string, date?: string) {
  let query = supabase
    .from('daily_sales')
    .select('*')
    .eq('restaurant_id', restaurantId);

  if (date) {
    query = query.eq('sale_date', date);
  } else {
    const today = new Date().toISOString().split('T')[0];
    query = query.eq('sale_date', today);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProductSales(restaurantId: string) {
  const { data, error } = await supabase
    .from('product_sales')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('revenue', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPaymentAnalysis(restaurantId: string, days: number = 7) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromDateStr = fromDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('payment_analysis')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .gte('sale_date', fromDateStr)
    .order('sale_date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getHourlySales(restaurantId: string, date?: string) {
  let query = supabase
    .from('hourly_sales')
    .select('*')
    .eq('restaurant_id', restaurantId);

  if (date) {
    query = query.eq('sale_date', date);
  } else {
    const today = new Date().toISOString().split('T')[0];
    query = query.eq('sale_date', today);
  }

  const { data, error } = await query.order('hour', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getEmployees(restaurantId: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Restaurant['id'][];
}

export async function getAllEmployees(restaurantId: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getSalesByDate(restaurantId: string, date?: string) {
  let query = supabase
    .from('sales_by_date')
    .select('*')
    .eq('restaurant_id', restaurantId);

  if (date) {
    query = query.eq('sale_date', date);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSalesByMonth(restaurantId: string) {
  const { data, error } = await supabase
    .from('sales_by_month')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .limit(12);
  if (error) throw error;
  return data || [];
}

export async function getSalesByYear(restaurantId: string) {
  const { data, error } = await supabase
    .from('sales_by_year')
    .select('*')
    .eq('restaurant_id', restaurantId);
  if (error) throw error;
  return data || [];
}

export async function getEmployeeSales(restaurantId: string, date?: string) {
  let query = supabase
    .from('employee_sales')
    .select('*')
    .eq('restaurant_id', restaurantId);

  if (date) {
    query = query.eq('sale_date', date);
  }

  const { data, error } = await query.order('total_sales', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPastOrders(restaurantId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('status', 'paid')
    .order('closed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Order[];
}
