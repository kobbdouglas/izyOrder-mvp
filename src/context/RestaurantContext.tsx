import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getRestaurantBySlug, 
  getUserRestaurant, 
  updateMenuItem as updateMenuItemService,
  toggleSoldOut as toggleSoldOutService,
  createOffer as createOfferService,
  updateOfferById,
  deleteOfferById,
  updateRestaurantCustomization as updateCustomizationService,
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  createMenuItem as createMenuItemService
} from '../services/restaurantService';

interface RestaurantContextType {
  restaurant: any;
  loading: boolean;
  error: string | null;
  updateMenuItem: (itemId: string, updates: any) => Promise<boolean>;
  toggleSoldOut: (itemId: string) => Promise<boolean>;
  createOffer: (offerData: any) => Promise<boolean>;
  updateOffer: (offerId: string, offerData: any) => Promise<boolean>;
  deleteOffer: (offerId: string) => Promise<boolean>;
  updateCustomization: (customization: any) => Promise<boolean>;
  createCategory: (categoryData: any) => Promise<boolean>;
  updateCategory: (categoryId: string, categoryData: any) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  createMenuItem: (categoryId: string, itemData: any) => Promise<boolean>;
  refreshRestaurant: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
  mode: 'customer' | 'admin';
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children, mode }) => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);

      let restaurantData;
      
      if (mode === 'customer' && restaurantId) {
        // Customer mode: load by slug
        const result = await getRestaurantBySlug(restaurantId);
        if (result.success) {
          restaurantData = result.data;
        } else {
          throw new Error(result.error);
        }
      } else if (mode === 'admin') {
        // Admin mode: load user's restaurant
        const result = await getUserRestaurant();
        if (result.success) {
          restaurantData = result.data;
        } else {
          throw new Error(result.error);
        }
      }

      if (!restaurantData) {
        setError('Restaurant not found');
        return;
      }

      setRestaurant(restaurantData);
    } catch (err) {
      console.error('Error loading restaurant:', err);
      setError(err.message || 'Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId, mode]);

  const updateMenuItem = async (itemId: string, updates: any) => {
    const success = await updateMenuItemService(itemId, updates);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const toggleSoldOut = async (itemId: string) => {
    const success = await toggleSoldOutService(itemId);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const createOffer = async (offerData: any) => {
    if (!restaurant) return false;
    const success = await createOfferService(restaurant.id, offerData);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const updateOffer = async (offerId: string, offerData: any) => {
    const success = await updateOfferById(offerId, offerData);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const deleteOffer = async (offerId: string) => {
    const success = await deleteOfferById(offerId);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const updateCustomization = async (customization: any) => {
    if (!restaurant) return false;
    const success = await updateCustomizationService(restaurant.id, customization);
    if (success) {
      await loadRestaurant(); // Refresh data
    }
    return success;
  };

  const createCategory = async (categoryData: any) => {
    if (!restaurant) return false;
    const result = await createCategoryService(restaurant.id, categoryData);
    if (result.success) {
      await loadRestaurant(); // Refresh data
    }
    return result.success;
  };

  const updateCategory = async (categoryId: string, categoryData: any) => {
    const result = await updateCategoryService(categoryId, categoryData);
    if (result.success) {
      await loadRestaurant(); // Refresh data
    }
    return result.success;
  };

  const deleteCategory = async (categoryId: string) => {
    const result = await deleteCategoryService(categoryId);
    if (result.success) {
      await loadRestaurant(); // Refresh data
    }
    return result.success;
  };

  const createMenuItem = async (categoryId: string, itemData: any) => {
    const result = await createMenuItemService(categoryId, itemData);
    if (result.success) {
      await loadRestaurant(); // Refresh data
    }
    return result.success;
  };

  return (
    <RestaurantContext.Provider value={{
      restaurant,
      loading,
      error,
      updateMenuItem,
      toggleSoldOut,
      createOffer,
      updateOffer,
      deleteOffer,
      updateCustomization,
      createCategory,
      updateCategory,
      deleteCategory,
      createMenuItem,
      refreshRestaurant: loadRestaurant
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};