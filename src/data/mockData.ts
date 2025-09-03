export interface MenuItem {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: number;
  image: string;
  category: string;
  dietaryInfo: {
    vegetarian: boolean;
    vegan: boolean;
    spiceLevel: number; // 0-3
    meatType: 'beef' | 'chicken' | 'pork' | null;
  };
  soldOut: boolean;
}

export interface MenuCategory {
  id: string;
  name: Record<string, string>;
  items: MenuItem[];
}

export interface Offer {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  validDays: number[]; // 0-6 (Sunday-Saturday)
  validHours: { start: string; end: string };
  active: boolean;
  discount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: Record<string, string>;
  logo: string;
  heroImage: string;
  languages: string[];
  customization: {
    welcomeText: Record<string, string>;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontStyle: 'modern' | 'classic' | 'elegant';
  };
  menu: {
    categories: MenuCategory[];
  };
  offers: Offer[];
}

// Initialize mock data in localStorage if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem('izyorder_restaurants')) {
    const mockRestaurant: Restaurant = {
      id: 'restaurant-1',
      name: 'Bella Vista',
      description: {
        en: 'Authentic Italian cuisine with a modern twist',
        de: 'Authentische italienische Küche mit moderner Note'
      },
      logo: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
      heroImage: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
      languages: ['en', 'de'],
      customization: {
        welcomeText: {
          en: 'Experience authentic Italian flavors in every bite',
          de: 'Erleben Sie authentische italienische Aromen in jedem Bissen'
        },
        primaryColor: '#f97316', // orange-500
        secondaryColor: '#059669', // green-600
        accentColor: '#dc2626', // red-600
        fontStyle: 'modern'
      },
      menu: {
        categories: [
          {
            id: 'drinks',
            name: { en: 'Beverages', de: 'Getränke' },
            items: [
              {
                id: 'drink-1',
                name: { en: 'Italian Espresso', de: 'Italienischer Espresso' },
                description: { en: 'Rich, bold espresso made from premium Italian beans', de: 'Reichhaltiger, kräftiger Espresso aus hochwertigen italienischen Bohnen' },
                price: 3.50,
                image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
                category: 'drinks',
                dietaryInfo: { vegetarian: true, vegan: true, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'drink-2',
                name: { en: 'Fresh Orange Juice', de: 'Frischer Orangensaft' },
                description: { en: 'Freshly squeezed orange juice from organic oranges', de: 'Frisch gepresster Orangensaft aus Bio-Orangen' },
                price: 4.20,
                image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
                category: 'drinks',
                dietaryInfo: { vegetarian: true, vegan: true, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'drink-3',
                name: { en: 'Cappuccino', de: 'Cappuccino' },
                description: { en: 'Classic Italian cappuccino with steamed milk foam', de: 'Klassischer italienischer Cappuccino mit aufgeschäumter Milch' },
                price: 4.50,
                image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
                category: 'drinks',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'drink-4',
                name: { en: 'House Wine Red', de: 'Hauswein Rot' },
                description: { en: 'Local red wine from Tuscany region', de: 'Lokaler Rotwein aus der Toskana' },
                price: 6.80,
                image: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg',
                category: 'drinks',
                dietaryInfo: { vegetarian: true, vegan: true, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'drink-5',
                name: { en: 'Sparkling Water', de: 'Sprudelwasser' },
                description: { en: 'Premium Italian sparkling water', de: 'Premium italienisches Sprudelwasser' },
                price: 2.50,
                image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
                category: 'drinks',
                dietaryInfo: { vegetarian: true, vegan: true, spiceLevel: 0, meatType: null },
                soldOut: false
              }
            ]
          },
          {
            id: 'appetizers',
            name: { en: 'Appetizers', de: 'Vorspeisen' },
            items: [
              {
                id: 'app-1',
                name: { en: 'Bruschetta Trio', de: 'Bruschetta Trio' },
                description: { en: 'Three varieties of bruschetta with tomato, olive tapenade, and ricotta', de: 'Drei Variationen von Bruschetta mit Tomaten, Oliventapenade und Ricotta' },
                price: 8.90,
                image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
                category: 'appetizers',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 1, meatType: null },
                soldOut: false
              },
              {
                id: 'app-2',
                name: { en: 'Antipasto Platter', de: 'Antipasto Platte' },
                description: { en: 'Selection of Italian cured meats, cheeses, and olives', de: 'Auswahl italienischer Wurstwaren, Käse und Oliven' },
                price: 12.90,
                image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg',
                category: 'appetizers',
                dietaryInfo: { vegetarian: false, vegan: false, spiceLevel: 0, meatType: 'pork' },
                soldOut: false
              },
              {
                id: 'app-3',
                name: { en: 'Arancini', de: 'Arancini' },
                description: { en: 'Crispy risotto balls filled with mozzarella and herbs', de: 'Knusprige Risotto-Bällchen gefüllt mit Mozzarella und Kräutern' },
                price: 7.50,
                image: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg',
                category: 'appetizers',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              }
            ]
          },
          {
            id: 'mains',
            name: { en: 'Main Courses', de: 'Hauptgerichte' },
            items: [
              {
                id: 'main-1',
                name: { en: 'Grilled Salmon', de: 'Gegrillter Lachs' },
                description: { en: 'Fresh Atlantic salmon with herb butter and seasonal vegetables', de: 'Frischer Atlantiklachs mit Kräuterbutter und Saisongemüse' },
                price: 18.50,
                image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: false, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'main-2',
                name: { en: 'Beef Tenderloin', de: 'Rinderfilet' },
                description: { en: 'Premium beef tenderloin with truffle sauce and roasted potatoes', de: 'Premium Rinderfilet mit Trüffelsauce und Röstkartoffeln' },
                price: 24.90,
                image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: false, vegan: false, spiceLevel: 1, meatType: 'beef' },
                soldOut: false
              },
              {
                id: 'main-3',
                name: { en: 'Margherita Pizza', de: 'Pizza Margherita' },
                description: { en: 'Classic pizza with tomato sauce, mozzarella, and fresh basil', de: 'Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum' },
                price: 14.50,
                image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'main-4',
                name: { en: 'Chicken Parmigiana', de: 'Hähnchen Parmigiana' },
                description: { en: 'Breaded chicken breast with tomato sauce and melted cheese', de: 'Paniertes Hähnchenschnitzel mit Tomatensauce und geschmolzenem Käse' },
                price: 16.90,
                image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: false, vegan: false, spiceLevel: 1, meatType: 'chicken' },
                soldOut: false
              },
              {
                id: 'main-5',
                name: { en: 'Pasta Carbonara', de: 'Pasta Carbonara' },
                description: { en: 'Traditional Roman pasta with eggs, cheese, and pancetta', de: 'Traditionelle römische Pasta mit Eiern, Käse und Pancetta' },
                price: 13.50,
                image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: false, vegan: false, spiceLevel: 0, meatType: 'pork' },
                soldOut: false
              },
              {
                id: 'main-6',
                name: { en: 'Vegetarian Risotto', de: 'Vegetarisches Risotto' },
                description: { en: 'Creamy risotto with seasonal vegetables and parmesan', de: 'Cremiges Risotto mit Saisongemüse und Parmesan' },
                price: 15.50,
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
                category: 'mains',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              }
            ]
          },
          {
            id: 'desserts',
            name: { en: 'Desserts', de: 'Desserts' },
            items: [
              {
                id: 'dessert-1',
                name: { en: 'Tiramisu', de: 'Tiramisu' },
                description: { en: 'Classic Italian tiramisu with mascarpone and coffee', de: 'Klassisches italienisches Tiramisu mit Mascarpone und Kaffee' },
                price: 6.50,
                image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
                category: 'desserts',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'dessert-2',
                name: { en: 'Panna Cotta', de: 'Panna Cotta' },
                description: { en: 'Silky vanilla panna cotta with berry compote', de: 'Seidige Vanille-Panna Cotta mit Beerenkompott' },
                price: 5.90,
                image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
                category: 'desserts',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'dessert-3',
                name: { en: 'Gelato Selection', de: 'Gelato Auswahl' },
                description: { en: 'Three scoops of artisanal gelato - vanilla, chocolate, pistachio', de: 'Drei Kugeln handwerkliches Gelato - Vanille, Schokolade, Pistazie' },
                price: 7.20,
                image: 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg',
                category: 'desserts',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              },
              {
                id: 'dessert-4',
                name: { en: 'Chocolate Lava Cake', de: 'Schokoladen-Lava-Kuchen' },
                description: { en: 'Warm chocolate cake with molten center and vanilla ice cream', de: 'Warmer Schokoladenkuchen mit flüssigem Kern und Vanilleeis' },
                price: 8.50,
                image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
                category: 'desserts',
                dietaryInfo: { vegetarian: true, vegan: false, spiceLevel: 0, meatType: null },
                soldOut: false
              }
            ]
          }
        ]
      },
      offers: [
        {
          id: 'offer-1',
          title: { en: 'Happy Hour Special', de: 'Happy Hour Spezial' },
          description: { en: '30% off all beverages', de: '30% Rabatt auf alle Getränke' },
          validDays: [1, 2, 3, 4, 5], // Monday to Friday
          validHours: { start: '17:00', end: '19:00' },
          active: true,
          discount: 30
        },
        {
          id: 'offer-2',
          title: { en: 'Weekend Brunch', de: 'Wochenend-Brunch' },
          description: { en: 'Special brunch menu available', de: 'Spezielle Brunch-Karte verfügbar' },
          validDays: [0, 6], // Sunday and Saturday
          validHours: { start: '10:00', end: '14:00' },
          active: true,
          discount: 15
        }
      ]
    };

    localStorage.setItem('izyorder_restaurants', JSON.stringify({ 'restaurant-1': mockRestaurant }));
  }

  // Initialize admin credentials
  if (!localStorage.getItem('izyorder_admin')) {
    const adminData = {
      username: 'admin',
      password: 'password123',
      restaurantId: 'restaurant-1'
    };
    localStorage.setItem('izyorder_admin', JSON.stringify(adminData));
  }
};