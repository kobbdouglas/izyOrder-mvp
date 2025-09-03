import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];
type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type Offer = Database['public']['Tables']['offers']['Row'];

export const createRestaurant = async (restaurantData: {
  name: string;
  slug: string;
  slug: string;
  description_en?: string;
  description_de?: string;
  logo_url?: string;
  hero_image_url?: string;
}) => {
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('restaurants')
      .insert([{
        ...restaurantData,
        owner_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return { success: false, error: error.message };
  }
};

export const getRestaurantBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_customization(*),
        menu_categories(
          *,
          menu_items(*)
        ),
        offers(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return { success: false, error: error.message };
  }
};

export const getUserRestaurant = async (userId: string) => {
  // Get current user first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('Auth error:', authError);
    return { success: false, error: 'Authentication failed' };
  }
  
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }
  
  console.log('Current user ID:', user.id); // Debug log
  
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        restaurant_customization(*),
        menu_categories(
          *,
          menu_items(*)
        ),
        offers(*)
      `)
      .eq('owner_id', user.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('Restaurant data:', data); // Debug log
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user restaurant:', error);
    return { success: false, error: error.message };
  }
};

export const updateMenuItem = async (itemId: string, updates: {
  name_en?: string;
  name_de?: string;
  description_en?: string;
  description_de?: string;
  price?: number;
}) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    return false;
  }
};

export const toggleSoldOut = async (itemId: string) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    // First get current status
    const { data: currentItem, error: fetchError } = await supabase
      .from('menu_items')
      .select('is_sold_out')
      .eq('id', itemId)
      .single();

    if (fetchError) throw fetchError;

    // Toggle the status
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_sold_out: !currentItem.is_sold_out })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling sold out status:', error);
    return false;
  }
};

export const createOffer = async (restaurantId: string, offerData: {
  title: { en: string; de: string };
  description: { en: string; de: string };
  discount: number;
  validDays: number[];
  validHours: { start: string; end: string };
  active: boolean;
}) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('offers')
      .insert([{
        restaurant_id: restaurantId,
        title_en: offerData.title.en,
        title_de: offerData.title.de,
        description_en: offerData.description.en,
        description_de: offerData.description.de,
        discount_percentage: offerData.discount,
        valid_days: offerData.validDays,
        valid_hours_start: offerData.validHours.start,
        valid_hours_end: offerData.validHours.end,
        is_active: offerData.active
      }])
      .select()
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating offer:', error);
    return false;
  }
};

export const updateOfferById = async (offerId: string, offerData: {
  title: { en: string; de: string };
  description: { en: string; de: string };
  discount: number;
  validDays: number[];
  validHours: { start: string; end: string };
  active: boolean;
}) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('offers')
      .update({
        title_en: offerData.title.en,
        title_de: offerData.title.de,
        description_en: offerData.description.en,
        description_de: offerData.description.de,
        discount_percentage: offerData.discount,
        valid_days: offerData.validDays,
        valid_hours_start: offerData.validHours.start,
        valid_hours_end: offerData.validHours.end,
        is_active: offerData.active
      })
      .eq('id', offerId)
      .select()
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating offer:', error);
    return false;
  }
};

export const deleteOfferById = async (offerId: string) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', offerId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting offer:', error);
    return false;
  }
};

export const updateRestaurantCustomization = async (restaurantId: string, updates: {
  welcome_text_en?: string;
  welcome_text_de?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_style?: string;
}) => {
  // Get current user to ensure authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('restaurant_customization')
      .update(updates)
      .eq('restaurant_id', restaurantId)
      .select()
      .single();

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating restaurant customization:', error);
    return false;
  }
};

export const createCategory = async (categoryData: {
  restaurant_id: string;
  name_en: string;
  name_de: string;
  sort_order?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
};

export const updateCategory = async (categoryId: string, updates: {
  name_en?: string;
  name_de?: string;
  sort_order?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};

export const createMenuItem = async (itemData: {
  category_id: string;
  name_en: string;
  name_de: string;
  description_en?: string;
  description_de?: string;
  price: number;
  image_url?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  spice_level?: number;
  meat_type?: string | null;
  sort_order?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating menu item:', error);
    return { success: false, error: error.message };
  }
};