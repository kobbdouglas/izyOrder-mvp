/*
  # Create restaurants schema

  1. New Tables
    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text, restaurant name)
      - `slug` (text, unique URL identifier)
      - `logo_url` (text, logo image URL)
      - `hero_image_url` (text, hero background image URL)
      - `description_en` (text, English description)
      - `description_de` (text, German description)
      - `owner_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `restaurant_customization`
      - `restaurant_id` (uuid, references restaurants)
      - `welcome_text_en` (text)
      - `welcome_text_de` (text)
      - `primary_color` (text, hex color)
      - `secondary_color` (text, hex color)
      - `accent_color` (text, hex color)
      - `font_style` (text, enum: modern/classic/elegant)
    
    - `menu_categories`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `name_en` (text, English category name)
      - `name_de` (text, German category name)
      - `sort_order` (integer, display order)
    
    - `menu_items`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references menu_categories)
      - `name_en` (text, English item name)
      - `name_de` (text, German item name)
      - `description_en` (text, English description)
      - `description_de` (text, German description)
      - `price` (decimal, item price)
      - `image_url` (text, item image URL)
      - `is_vegetarian` (boolean)
      - `is_vegan` (boolean)
      - `spice_level` (integer, 0-3)
      - `meat_type` (text, beef/chicken/pork or null)
      - `is_sold_out` (boolean, default false)
      - `sort_order` (integer, display order)
    
    - `offers`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `title_en` (text, English offer title)
      - `title_de` (text, German offer title)
      - `description_en` (text, English description)
      - `description_de` (text, German description)
      - `discount_percentage` (integer, 1-100)
      - `valid_days` (integer array, 0-6 for Sunday-Saturday)
      - `valid_hours_start` (time)
      - `valid_hours_end` (time)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    
    - `restaurant_admins`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, references restaurants)
      - `user_id` (uuid, references auth.users)
      - `role` (text, default 'admin')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for restaurant owners to manage their data
    - Add policies for public read access to restaurant/menu data
    - Add policies for admin access control

  3. Indexes
    - Add indexes for performance on frequently queried columns
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  hero_image_url text,
  description_en text DEFAULT '',
  description_de text DEFAULT '',
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create restaurant customization table
CREATE TABLE IF NOT EXISTS restaurant_customization (
  restaurant_id uuid PRIMARY KEY REFERENCES restaurants(id) ON DELETE CASCADE,
  welcome_text_en text DEFAULT '',
  welcome_text_de text DEFAULT '',
  primary_color text DEFAULT '#f97316',
  secondary_color text DEFAULT '#059669',
  accent_color text DEFAULT '#dc2626',
  font_style text DEFAULT 'modern' CHECK (font_style IN ('modern', 'classic', 'elegant'))
);

-- Create menu categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_de text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_de text NOT NULL,
  description_en text DEFAULT '',
  description_de text DEFAULT '',
  price decimal(10,2) NOT NULL,
  image_url text,
  is_vegetarian boolean DEFAULT false,
  is_vegan boolean DEFAULT false,
  spice_level integer DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 3),
  meat_type text CHECK (meat_type IN ('beef', 'chicken', 'pork') OR meat_type IS NULL),
  is_sold_out boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_de text NOT NULL,
  description_en text DEFAULT '',
  description_de text DEFAULT '',
  discount_percentage integer NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  valid_days integer[] DEFAULT '{}',
  valid_hours_start time NOT NULL,
  valid_hours_end time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create restaurant admins table
CREATE TABLE IF NOT EXISTS restaurant_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(restaurant_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants table
CREATE POLICY "Public can read restaurants"
  ON restaurants
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Restaurant owners can manage their restaurants"
  ON restaurants
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM restaurant_admins 
      WHERE restaurant_id = restaurants.id AND user_id = auth.uid()
    )
  );

-- RLS Policies for restaurant_customization table
CREATE POLICY "Public can read restaurant customization"
  ON restaurant_customization
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Restaurant admins can manage customization"
  ON restaurant_customization
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      LEFT JOIN restaurant_admins ra ON r.id = ra.restaurant_id
      WHERE r.id = restaurant_customization.restaurant_id 
      AND (r.owner_id = auth.uid() OR ra.user_id = auth.uid())
    )
  );

-- RLS Policies for menu_categories table
CREATE POLICY "Public can read menu categories"
  ON menu_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Restaurant admins can manage categories"
  ON menu_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      LEFT JOIN restaurant_admins ra ON r.id = ra.restaurant_id
      WHERE r.id = menu_categories.restaurant_id 
      AND (r.owner_id = auth.uid() OR ra.user_id = auth.uid())
    )
  );

-- RLS Policies for menu_items table
CREATE POLICY "Public can read menu items"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Restaurant admins can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM menu_categories mc
      JOIN restaurants r ON mc.restaurant_id = r.id
      LEFT JOIN restaurant_admins ra ON r.id = ra.restaurant_id
      WHERE mc.id = menu_items.category_id 
      AND (r.owner_id = auth.uid() OR ra.user_id = auth.uid())
    )
  );

-- RLS Policies for offers table
CREATE POLICY "Public can read active offers"
  ON offers
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Restaurant admins can manage offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      LEFT JOIN restaurant_admins ra ON r.id = ra.restaurant_id
      WHERE r.id = offers.restaurant_id 
      AND (r.owner_id = auth.uid() OR ra.user_id = auth.uid())
    )
  );

-- RLS Policies for restaurant_admins table
CREATE POLICY "Restaurant owners can manage admins"
  ON restaurant_admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE id = restaurant_admins.restaurant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read their own access"
  ON restaurant_admins
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_sold_out ON menu_items(is_sold_out);
CREATE INDEX IF NOT EXISTS idx_offers_restaurant_active ON offers(restaurant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_restaurant_admins_restaurant ON restaurant_admins(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_admins_user ON restaurant_admins(user_id);

-- Create function to automatically create customization record
CREATE OR REPLACE FUNCTION create_restaurant_customization()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO restaurant_customization (restaurant_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create customization
CREATE TRIGGER trigger_create_restaurant_customization
  AFTER INSERT ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION create_restaurant_customization();