/*
  # Add employee management and optional tax system

  1. New Tables
    - `employees` - Staff members
    
  2. Modified Tables
    - Add employee_id to orders
    - Add include_tax to restaurants (optional tax)
    
  3. Columns Added
    - orders.employee_id → Employee asignado
    - restaurants.include_tax → Mostrar impuesto en factura
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  position text NOT NULL,
  phone text,
  email text,
  salary_per_month numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON employees FOR SELECT USING (true);
CREATE POLICY "Public insert" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON employees FOR UPDATE USING (true) WITH CHECK (true);

-- Add employee_id to orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN employee_id uuid REFERENCES employees(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add include_tax to restaurants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurants' AND column_name = 'include_tax'
  ) THEN
    ALTER TABLE restaurants ADD COLUMN include_tax boolean DEFAULT false;
  END IF;
END $$;

-- Insert demo employees
WITH rest AS (SELECT id FROM restaurants WHERE name = 'Restaurante Demo' LIMIT 1)
INSERT INTO employees (restaurant_id, name, position, phone, email) VALUES
  ((SELECT id FROM rest), 'Juan Pérez', 'Mesero', '+573001234567', 'juan@restopos.co'),
  ((SELECT id FROM rest), 'María García', 'Mesera', '+573002345678', 'maria@restopos.co'),
  ((SELECT id FROM rest), 'Carlos López', 'Cajero', '+573003456789', 'carlos@restopos.co'),
  ((SELECT id FROM rest), 'Ana Martínez', 'Chef', '+573004567890', 'ana@restopos.co'),
  ((SELECT id FROM rest), 'Luis Rodríguez', 'Ayudante Cocina', '+573005678901', 'luis@restopos.co')
ON CONFLICT DO NOTHING;

-- Create detailed sales report view (by employee)
CREATE OR REPLACE VIEW employee_sales AS
SELECT
  e.id as employee_id,
  e.name as employee_name,
  e.position,
  DATE(o.opened_at) as sale_date,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_sales,
  SUM(o.tip_amount) as total_tips,
  AVG(o.total) as avg_order,
  MIN(o.total) as min_order,
  MAX(o.total) as max_order
FROM employees e
LEFT JOIN orders o ON e.id = o.employee_id AND o.status = 'paid'
GROUP BY e.id, e.name, e.position, DATE(o.opened_at);

-- Create sales by date view (detailed)
CREATE OR REPLACE VIEW sales_by_date AS
SELECT
  restaurant_id,
  DATE(opened_at) as sale_date,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  SUM(tax) as total_tax,
  SUM(tip_amount) as total_tips,
  AVG(total) as avg_order,
  COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_count,
  COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_count,
  COUNT(CASE WHEN payment_method = 'nequi' THEN 1 END) as nequi_count,
  COUNT(CASE WHEN payment_method = 'daviplata' THEN 1 END) as daviplata_count
FROM orders
WHERE status = 'paid'
GROUP BY restaurant_id, DATE(opened_at)
ORDER BY sale_date DESC;

-- Create monthly sales view
CREATE OR REPLACE VIEW sales_by_month AS
SELECT
  restaurant_id,
  DATE_TRUNC('month', opened_at)::DATE as month,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  SUM(tax) as total_tax,
  SUM(tip_amount) as total_tips,
  AVG(total) as avg_order,
  COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_count,
  COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_count,
  COUNT(CASE WHEN payment_method = 'nequi' THEN 1 END) as nequi_count,
  COUNT(CASE WHEN payment_method = 'daviplata' THEN 1 END) as daviplata_count
FROM orders
WHERE status = 'paid'
GROUP BY restaurant_id, DATE_TRUNC('month', opened_at)
ORDER BY month DESC;

-- Create yearly sales view
CREATE OR REPLACE VIEW sales_by_year AS
SELECT
  restaurant_id,
  EXTRACT(YEAR FROM opened_at)::INT as year,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  SUM(tax) as total_tax,
  SUM(tip_amount) as total_tips,
  AVG(total) as avg_order,
  COUNT(CASE WHEN payment_method = 'cash' THEN 1 END) as cash_count,
  COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_count,
  COUNT(CASE WHEN payment_method = 'nequi' THEN 1 END) as nequi_count,
  COUNT(CASE WHEN payment_method = 'daviplata' THEN 1 END) as daviplata_count
FROM orders
WHERE status = 'paid'
GROUP BY restaurant_id, EXTRACT(YEAR FROM opened_at)
ORDER BY year DESC;
