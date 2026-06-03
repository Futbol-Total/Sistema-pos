/*
  # Fix employee sales views to use correct columns and filters
  
  1. Updated Views
    - employee_sales: Fixed to use closed_at and add restaurant_id filter
    - sales_by_date: Fixed to use closed_at instead of opened_at
    - sales_by_month: Fixed to use closed_at instead of opened_at
    - sales_by_year: Fixed to use closed_at instead of opened_at
*/

-- Drop and recreate employee_sales view with restaurant filter
DROP VIEW IF EXISTS employee_sales;
CREATE OR REPLACE VIEW employee_sales AS
SELECT
  e.restaurant_id,
  e.id as employee_id,
  e.name as employee_name,
  e.position,
  DATE(o.closed_at) as sale_date,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_sales,
  SUM(o.tip_amount) as total_tips,
  AVG(o.total) as avg_order,
  MIN(o.total) as min_order,
  MAX(o.total) as max_order
FROM employees e
LEFT JOIN orders o ON e.id = o.employee_id AND o.status = 'paid' AND o.closed_at IS NOT NULL
GROUP BY e.restaurant_id, e.id, e.name, e.position, DATE(o.closed_at);

-- Fix sales_by_date view
DROP VIEW IF EXISTS sales_by_date;
CREATE OR REPLACE VIEW sales_by_date AS
SELECT
  restaurant_id,
  DATE(closed_at) as sale_date,
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
WHERE status = 'paid' AND closed_at IS NOT NULL
GROUP BY restaurant_id, DATE(closed_at)
ORDER BY sale_date DESC;

-- Fix sales_by_month view
DROP VIEW IF EXISTS sales_by_month;
CREATE OR REPLACE VIEW sales_by_month AS
SELECT
  restaurant_id,
  TO_CHAR(DATE_TRUNC('month', closed_at), 'YYYY-MM') as month,
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
WHERE status = 'paid' AND closed_at IS NOT NULL
GROUP BY restaurant_id, DATE_TRUNC('month', closed_at)
ORDER BY month DESC;

-- Fix sales_by_year view
DROP VIEW IF EXISTS sales_by_year;
CREATE OR REPLACE VIEW sales_by_year AS
SELECT
  restaurant_id,
  EXTRACT(YEAR FROM closed_at)::INT as year,
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
WHERE status = 'paid' AND closed_at IS NOT NULL
GROUP BY restaurant_id, EXTRACT(YEAR FROM closed_at)
ORDER BY year DESC;
