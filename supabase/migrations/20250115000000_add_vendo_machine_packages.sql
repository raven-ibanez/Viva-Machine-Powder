/*
  # Add Vendo Machine Packages
  
  1. New Category
    - Add 'hot-cold-2in1' category for Hot & Cold 2-in-1 machines
  
  2. New Menu Items
    - Package 2-A: Hot & Cold 2-in-1 Vendo Machine (₱50,999)
    - Package 1-A: Hot Coffee Vendo Machine NEW MODEL (₱24,999)
    - Package A: Hot Coffee Vendo Machine BEST SELLER (₱20,999)
*/

-- Add new category for Hot & Cold 2-in-1 machines
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('hot-cold-2in1', 'Hot & Cold 2-in-1', '🌡️', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Package 2-A (Hot & Cold 2in1)
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, discount_price, discount_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Brandnew Hot & Cold Vendo - Complete Set',
  'Hot & Cold Vendo Machine (Bottom Load), Universal Coinslot (accepts all types of coins, old & new), 17 different 1kg flavors for Hot and Cold drinks (Milky Chocolate, Choco Hazelnut, Caramel Macchiato, Cappuccino, 3in1, White Coffee, Cucumber, Red Iced Tea, Lemon Iced Tea, Dalandan, Calamansi, Gulaman, Pineapple, Blue Lemonade), 10oz Cups (1,000pcs), Water Gallon, LED Light Signage (Coffee Choco), Power Supply AVR.',
  50999.00,
  'hot-cold-2in1',
  true,
  true,
  null,
  null,
  false,
  now(),
  now()
);

-- Insert Package 1-A (NEW MODEL)
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, discount_price, discount_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Brandnew Hot Coffee Vendo - Complete Set',
  'Coffee Vendo Machine (NEW MODEL), Universal Coinslot (installed), 6 different 1kg coffee flavors (Milky Chocolate, Choco Hazelnut, Caramel Macchiato, Cappuccino, 3in1, White Coffee), 6.5oz Cups (1,000pcs), Water Gallon, LED Light Signage (Coffee Choco). Advantages: No more back pain, buhat, water leak, pest, ground, trick.',
  24999.00,
  'hot-coffee',
  true,
  true,
  null,
  null,
  false,
  now(),
  now()
);

-- Insert Package A (BEST SELLER)
INSERT INTO menu_items (id, name, description, base_price, category, popular, available, image_url, discount_price, discount_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Brandnew Complete Set (BEST SELLER)',
  'Coffee Vendo Machine, Universal Coinslot (installed), 6 different 1kg coffee flavors (Milky Chocolate, Choco Hazelnut, Caramel Macchiato, Cappuccino, 3in1, White Coffee), 6.5oz Cups (1,000pcs), Water Gallon, LED Light Signage (Coffee Choco), Tarpaulin, Manual Booklet, Sets of flavor & price sticker, Extra Fuse. FREE Customized!',
  20999.00,
  'hot-coffee',
  true,
  true,
  null,
  null,
  false,
  now(),
  now()
);

