// Event bus for real-time updates
export const eventBus = {
  listeners: {} as Record<string, Function[]>,
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  
  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },
  
  emit(event: string, data?: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
};

// Admin credentials management
export const getAdminCredentials = () => {
  const stored = localStorage.getItem('izyorder_admin');
  return stored ? JSON.parse(stored) : null;
};

// Restaurant data management
export const getRestaurant = (id: string) => {
  const restaurants = localStorage.getItem('izyorder_restaurants');
  if (!restaurants) return null;
  
  const restaurantsData = JSON.parse(restaurants);
  return restaurantsData[id] || null;
};

export const saveRestaurant = (restaurant: any) => {
  const restaurants = localStorage.getItem('izyorder_restaurants');
  const restaurantsData = restaurants ? JSON.parse(restaurants) : {};
  
  restaurantsData[restaurant.id] = restaurant;
  localStorage.setItem('izyorder_restaurants', JSON.stringify(restaurantsData));
  
  // Emit events for real-time updates
  eventBus.emit('restaurant-updated', restaurant);
  eventBus.emit('menu-updated', { restaurantId: restaurant.id });
  eventBus.emit('offers-updated', { restaurantId: restaurant.id });
};

// Menu item management
export const updateMenuItem = (restaurantId: string, item: any) => {
  const restaurant = getRestaurant(restaurantId);
  if (!restaurant) return;

  const category = restaurant.menu.categories.find((cat: any) =>
    cat.items.some((menuItem: any) => menuItem.id === item.id)
  );
  if (!category) return;

  const itemIndex = category.items.findIndex((menuItem: any) => menuItem.id === item.id);
  if (itemIndex === -1) return;

  category.items[itemIndex] = item;
  saveRestaurant(restaurant);
};

// Offers management
export const addOffer = (restaurantId: string, offer: any) => {
  const restaurant = getRestaurant(restaurantId);
  if (!restaurant) return;

  restaurant.offers.push(offer);
  saveRestaurant(restaurant);
};

export const updateOffer = (restaurantId: string, offer: any) => {
  const restaurant = getRestaurant(restaurantId);
  if (!restaurant) return;

  const offerIndex = restaurant.offers.findIndex((existingOffer: any) => existingOffer.id === offer.id);
  if (offerIndex === -1) return;

  restaurant.offers[offerIndex] = offer;
  saveRestaurant(restaurant);
};

export const deleteOffer = (restaurantId: string, offerId: string) => {
  const restaurant = getRestaurant(restaurantId);
  if (!restaurant) return;

  restaurant.offers = restaurant.offers.filter((offer: any) => offer.id !== offerId);
  saveRestaurant(restaurant);
};

// Restaurant customization
export const updateRestaurantCustomization = (restaurantId: string, customization: any) => {
  const restaurant = getRestaurant(restaurantId);
  if (!restaurant) return;

  restaurant.customization = { ...restaurant.customization, ...customization };
  saveRestaurant(restaurant);
};

// Utility functions
export const isValidOffer = (offer: any) => {
  if (!offer.active) return false;
  
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Check if current day is in valid days
  if (!offer.validDays.includes(currentDay)) return false;
  
  // Check if current time is within valid hours
  if (currentTime < offer.validHours.start || currentTime > offer.validHours.end) return false;
  
  return true;
};