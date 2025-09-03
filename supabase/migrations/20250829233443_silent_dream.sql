/*
  # Fix RLS Policy Infinite Recursion

  1. Problem
    - The restaurants table RLS policy references restaurant_admins
    - When getUserRestaurant() queries restaurant_admins, it also queries restaurants
    - This creates infinite recursion

  2. Solution
    - Simplify the restaurants table policies to avoid circular references
    - Use direct owner_id check for restaurants
    - Keep restaurant_admins policies separate and simple

  3. Changes
    - Drop existing problematic policies
    - Create new simplified policies without circular dependencies
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Restaurant owners can manage their restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurant admins can manage offers" ON offers;
DROP POLICY IF EXISTS "Restaurant admins can manage categories" ON menu_categories;
DROP POLICY IF EXISTS "Restaurant admins can manage menu items" ON menu_items;
DROP POLICY IF EXISTS "Restaurant admins can manage customization" ON restaurant_customization;

-- Create simplified restaurant policies without circular references
CREATE POLICY "Restaurant owners can manage their restaurants"
  ON restaurants
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Create simplified policies for other tables
CREATE POLICY "Restaurant owners can manage offers"
  ON offers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = offers.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = offers.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can manage categories"
  ON menu_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = menu_categories.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = menu_categories.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      JOIN menu_categories mc ON r.id = mc.restaurant_id
      WHERE mc.id = menu_items.category_id 
      AND r.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      JOIN menu_categories mc ON r.id = mc.restaurant_id
      WHERE mc.id = menu_items.category_id 
      AND r.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can manage customization"
  ON restaurant_customization
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_customization.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = restaurant_customization.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );