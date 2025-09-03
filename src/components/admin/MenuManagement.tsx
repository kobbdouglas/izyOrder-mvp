import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, ToggleLeft, ToggleRight, Save, Plus, FolderPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import DietaryIcons from '../shared/DietaryIcons';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restaurant, loading, updateMenuItem, toggleSoldOut, createCategory, createMenuItem } = useRestaurant();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categoryForm, setCategoryForm] = useState({
    name_en: '',
    name_de: '',
    sort_order: 0
  });
  const [itemForm, setItemForm] = useState({
    name_en: '',
    name_de: '',
    description_en: '',
    description_de: '',
    price: 0,
    image_url: '',
    is_vegetarian: false,
    is_vegan: false,
    spice_level: 0,
    meat_type: null as string | null
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
  }, [user, navigate]);

  const handleToggleSoldOut = async (item: any) => {
    await toggleSoldOut(item.id);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditForm({
      name_en: item.name_en,
      name_de: item.name_de,
      description_en: item.description_en,
      description_de: item.description_de,
      price: item.price
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    await updateMenuItem(editingItem.id, {
      name_en: editForm.name_en,
      name_de: editForm.name_de,
      description_en: editForm.description_en,
      description_de: editForm.description_de,
      price: editForm.price
    });
    
    setEditingItem(null);
    setEditForm({});
  };

  const handleAddCategory = () => {
    setShowCategoryForm(true);
    setCategoryForm({
      name_en: '',
      name_de: '',
      sort_order: restaurant?.menu_categories?.length || 0
    });
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name_en.trim() || !categoryForm.name_de.trim()) {
      alert('Please fill in both English and German names');
      return;
    }

    const success = await createCategory(categoryForm);
    
    if (success) {
      setShowCategoryForm(false);
      setCategoryForm({ name_en: '', name_de: '', sort_order: 0 });
    } else {
      alert('Failed to create category. Please try again.');
    }
  };

  const handleAddMenuItem = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowItemForm(true);
    setItemForm({
      name_en: '',
      name_de: '',
      description_en: '',
      description_de: '',
      price: 0,
      image_url: '',
      is_vegetarian: false,
      is_vegan: false,
      spice_level: 0,
      meat_type: null
    });
  };

  const handleSaveMenuItem = async () => {
    if (!itemForm.name_en.trim() || !itemForm.name_de.trim() || itemForm.price <= 0) {
      alert('Please fill in required fields (names and price)');
      return;
    }

    const success = await createMenuItem(selectedCategoryId, itemForm);
    
    if (success) {
      setShowItemForm(false);
      setSelectedCategoryId('');
      setItemForm({
        name_en: '',
        name_de: '',
        description_en: '',
        description_de: '',
        price: 0,
        image_url: '',
        is_vegetarian: false,
        is_vegan: false,
        spice_level: 0,
        meat_type: null
      });
    } else {
      alert('Failed to create menu item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">Menu Management</h1>
              <p className="text-sm text-gray-600">{restaurant.name}</p>
            </div>
          </div>
          <button
            onClick={handleAddCategory}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Empty State */}
        {(!restaurant.menu_categories || restaurant.menu_categories.length === 0) && (
          <div className="text-center py-12">
            <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Menu Categories Yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first menu category to organize your items.</p>
            <button
              onClick={handleAddCategory}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <FolderPlus className="w-5 h-5" />
              <span>Create First Category</span>
            </button>
          </div>
        )}

        {/* Categories */}
        {restaurant.menu_categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {category.name_en} ({category.menu_items.length} items)
                </h2>
                <button
                  onClick={() => handleAddMenuItem(category.id)}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
            
            {/* Empty Category State */}
            {category.menu_items.length === 0 && (
              <div className="p-8 text-center">
                <Plus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No items in this category yet</p>
                <button
                  onClick={() => handleAddMenuItem(category.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Item</span>
                </button>
              </div>
            )}

            {/* Menu Items */}
            <div className="divide-y">
              {category.menu_items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={item.name_en}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name_en}
                        </h3>
                        <span className="text-lg font-bold text-orange-600 ml-4">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description_en}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {item.is_vegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Vegetarian
                            </span>
                          )}
                          {item.is_vegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Vegan
                            </span>
                          )}
                          {item.spice_level > 0 && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              Spicy {item.spice_level}/3
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleToggleSoldOut(item)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              item.is_sold_out
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {item.is_sold_out ? (
                              <>
                                <ToggleLeft className="w-4 h-4" />
                                <span>Sold Out</span>
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-4 h-4" />
                                <span>Available</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Menu Item</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (English)
                  </label>
                  <input
                    type="text"
                    value={editForm.name_en || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      name_en: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (German)
                  </label>
                  <input
                    type="text"
                    value={editForm.name_de || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      name_de: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={editForm.description_en || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      description_en: e.target.value
                    })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (German)
                  </label>
                  <textarea
                    value={editForm.description_de || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      description_de: e.target.value
                    })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      price: parseFloat(e.target.value) || 0
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Category</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name (English)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name_en}
                    onChange={(e) => setCategoryForm({
                      ...categoryForm,
                      name_en: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Appetizers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name (German)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name_de}
                    onChange={(e) => setCategoryForm({
                      ...categoryForm,
                      name_de: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Vorspeisen"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Menu Item</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name (English)
                    </label>
                    <input
                      type="text"
                      value={itemForm.name_en}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        name_en: e.target.value
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Caesar Salad"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name (German)
                    </label>
                    <input
                      type="text"
                      value={itemForm.name_de}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        name_de: e.target.value
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Caesar Salat"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English)
                    </label>
                    <textarea
                      value={itemForm.description_en}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        description_en: e.target.value
                      })}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe the item..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (German)
                    </label>
                    <textarea
                      value={itemForm.description_de}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        description_de: e.target.value
                      })}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Beschreiben Sie das Gericht..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        price: parseFloat(e.target.value) || 0
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={itemForm.image_url}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        image_url: e.target.value
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spice Level (0-3)
                    </label>
                    <select
                      value={itemForm.spice_level}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        spice_level: parseInt(e.target.value)
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={0}>Not Spicy</option>
                      <option value={1}>Mild</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Hot</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meat Type (Optional)
                    </label>
                    <select
                      value={itemForm.meat_type || ''}
                      onChange={(e) => setItemForm({
                        ...itemForm,
                        meat_type: e.target.value || null
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">No Meat</option>
                      <option value="beef">Beef</option>
                      <option value="chicken">Chicken</option>
                      <option value="pork">Pork</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Options
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={itemForm.is_vegetarian}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            is_vegetarian: e.target.checked,
                            is_vegan: e.target.checked ? itemForm.is_vegan : false
                          })}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={itemForm.is_vegan}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            is_vegan: e.target.checked,
                            is_vegetarian: e.target.checked ? true : itemForm.is_vegetarian
                          })}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Vegan</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowItemForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMenuItem}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Create Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;