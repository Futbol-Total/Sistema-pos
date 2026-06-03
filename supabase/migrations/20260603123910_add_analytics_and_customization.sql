/*
  # Add analytics and customization support to POS

  1. Add restaurant customization fields
  2. Add order history tracking
  3. Add daily sales views for analytics
  
  Security: All tables maintain RLS policies
*/

-- Update restaurants table with customization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'primary_color'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN primary_color text DEFAULT '#f97316';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'secondary_color'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN secondary_color text DEFAULT '#1e293b';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN logo_url text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'total_sales'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN total_sales numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'total_orders'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN total_orders int DEFAULT 0;
  END IF;
END $$;

-- Add order timing fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tip_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN tip_amount numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'order_duration_minutes'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_duration_minutes int;
  END IF;
END $$;

-- Create daily sales summary view
CREATE OR REPLACE VIEW daily_sales AS
SELECT
  DATE(opened_at) as sale_date,
  restaurant_id,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  SUM(tax) as total_tax,
  SUM(tip_amount) as total_tips,
  AVG(total) as avg_order_value,
  MIN(total) as min_order,
  MAX(total) as max_order,
  COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_orders,
  COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_orders,
  COUNT(CASE WHEN payment_method = 'nequi' THEN 1 END) as nequi_orders,
  COUNT(CASE WHEN payment_method = 'daviplata' THEN 1 END) as daviplata_orders
FROM orders
WHERE status = 'paid'
GROUP BY DATE(opened_at), restaurant_id;

-- Create product popularity view
CREATE OR REPLACE VIEW product_sales AS
SELECT
  p.id,
  p.name,
  p.category_id,
  c.name as category_name,
  COUNT(oi.id) as times_sold,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.quantity * oi.unit_price) as revenue,
  AVG(oi.unit_price) as avg_price,
  p.restaurant_id
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE o.status = 'paid' OR o.status IS NULL
GROUP BY p.id, p.name, p.category_id, c.name, p.restaurant_id;

-- Create payment method analysis view
CREATE OR REPLACE VIEW payment_analysis AS
SELECT
  restaurant_id,
  DATE(opened_at) as sale_date,
  payment_method,
  COUNT(*) as count,
  SUM(total) as total_amount,
  AVG(total) as avg_amount
FROM orders
WHERE status = 'paid'
GROUP BY restaurant_id, DATE(opened_at), payment_method;

-- Create hourly sales view
CREATE OR REPLACE VIEW hourly_sales AS
SELECT
  restaurant_id,
  DATE(opened_at) as sale_date,
  EXTRACT(HOUR FROM opened_at) as hour,
  COUNT(*) as orders,
  SUM(total) as revenue,
  AVG(total) as avg_order
FROM orders
WHERE status = 'paid'
GROUP BY restaurant_id, DATE(opened_at), EXTRACT(HOUR FROM opened_at);
