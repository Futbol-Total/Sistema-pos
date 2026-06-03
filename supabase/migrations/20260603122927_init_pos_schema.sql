/*
  # Initialize POS System Schema

  1. New Tables
    - `restaurants` - Restaurant configuration
    - `products` - Menu items
    - `tables` - Dining tables
    - `orders` - Customer orders
    - `order_items` - Order line items

  2. Security
    - Enable RLS on all tables
    - Allow public read/write for demo purposes (no auth required)

  3. Initial Data
    - Sample restaurant with demo products and tables
*/

-- Restaurant
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  currency text DEFAULT 'COP',
  tax_percentage numeric DEFAULT 8,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Public insert" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON restaurants FOR UPDATE USING (true) WITH CHECK (true);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON categories FOR UPDATE USING (true) WITH CHECK (true);

-- Products/Menu Items
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON products FOR UPDATE USING (true) WITH CHECK (true);

-- Tables/Mesas
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number int NOT NULL,
  capacity int DEFAULT 2,
  is_occupied boolean DEFAULT false,
  current_order_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON tables FOR SELECT USING (true);
CREATE POLICY "Public insert" ON tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON tables FOR UPDATE USING (true) WITH CHECK (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id uuid NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  status text DEFAULT 'open',
  subtotal numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  total numeric DEFAULT 0,
  payment_method text,
  notes text,
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity int DEFAULT 1,
  unit_price numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON order_items FOR UPDATE USING (true) WITH CHECK (true);

-- Insert demo restaurant
INSERT INTO restaurants (name, currency, tax_percentage) VALUES
  ('Restaurante Demo', 'COP', 8)
ON CONFLICT DO NOTHING;

-- Insert categories for demo
WITH rest AS (SELECT id FROM restaurants WHERE name = 'Restaurante Demo' LIMIT 1)
INSERT INTO categories (restaurant_id, name, icon, sort_order) VALUES
  ((SELECT id FROM rest), 'Platillos Fuertes', 'Utensils', 0),
  ((SELECT id FROM rest), 'Bebidas', 'Wine', 1),
  ((SELECT id FROM rest), 'Postres', 'Cake', 2)
ON CONFLICT DO NOTHING;

-- Insert demo products
WITH rest AS (SELECT id FROM restaurants WHERE name = 'Restaurante Demo' LIMIT 1),
cat_main AS (SELECT id FROM categories WHERE restaurant_id = (SELECT id FROM rest) AND name = 'Platillos Fuertes' LIMIT 1),
cat_drinks AS (SELECT id FROM categories WHERE restaurant_id = (SELECT id FROM rest) AND name = 'Bebidas' LIMIT 1)
INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, sort_order) VALUES
  ((SELECT id FROM rest), (SELECT id FROM cat_main), 'Punta de Anca', 'Carne a la parrilla con papas y ensalada', 65000, true, 0),
  ((SELECT id FROM rest), (SELECT id FROM cat_main), 'Desgranado', 'Pollo desmenuzado con verduras', 45000, true, 1),
  ((SELECT id FROM rest), (SELECT id FROM cat_main), 'Hamburguesa de la Casa', 'Hamburguesa artesanal con queso y tocineta', 35000, true, 2),
  ((SELECT id FROM rest), (SELECT id FROM cat_drinks), 'Limonada de Coco', 'Bebida fresca de coco natural', 12000, true, 0),
  ((SELECT id FROM rest), (SELECT id FROM cat_drinks), 'Jugo Natural', 'Jugo de naranja recién exprimido', 8000, true, 1)
ON CONFLICT DO NOTHING;

-- Insert demo tables
WITH rest AS (SELECT id FROM restaurants WHERE name = 'Restaurante Demo' LIMIT 1)
INSERT INTO tables (restaurant_id, table_number, capacity) VALUES
  ((SELECT id FROM rest), 1, 2),
  ((SELECT id FROM rest), 2, 2),
  ((SELECT id FROM rest), 3, 4),
  ((SELECT id FROM rest), 4, 4),
  ((SELECT id FROM rest), 5, 6)
ON CONFLICT DO NOTHING;
