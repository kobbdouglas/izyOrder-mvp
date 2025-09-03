import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Save, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';

const OffersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restaurant, loading, createOffer, updateOffer, deleteOffer } = useRestaurant();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: { en: '', de: '' },
    description: { en: '', de: '' },
    validDays: [] as number[],
    validHours: { start: '09:00', end: '22:00' },
    active: true,
    discount: 10
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
  }, [user, navigate]);

  const resetForm = () => {
    setFormData({
      title: { en: '', de: '' },
      description: { en: '', de: '' },
      validDays: [],
      validHours: { start: '09:00', end: '22:00' },
      active: true,
      discount: 10
    });
    setEditingOffer(null);
    setShowForm(false);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setFormData({
      title: { en: offer.title_en, de: offer.title_de },
      description: { en: offer.description_en, de: offer.description_de },
      validDays: offer.valid_days,
      validHours: { start: offer.valid_hours_start, end: offer.valid_hours_end },
      active: offer.is_active,
      discount: offer.discount_percentage
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    const offerData = {
      title: formData.title,
      description: formData.description,
      validDays: formData.validDays,
      validHours: formData.validHours,
      active: formData.active,
      discount: formData.discount
    };

    if (editingOffer) {
      await updateOffer(editingOffer.id, offerData);
    } else {
      await createOffer(offerData);
    }

    resetForm();
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    await deleteOffer(offerId);
  };

  const toggleDay = (day: number) => {
    const newDays = formData.validDays.includes(day)
      ? formData.validDays.filter(d => d !== day)
      : [...formData.validDays, day];
    setFormData({ ...formData, validDays: newDays });
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
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Offers Management</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Offer</span>
          </button>
        </div>
      </div>

      {/* Offers List */}
      <div className="p-4">
        <div className="space-y-4">
          {restaurant.offers?.map((offer: any) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.title_en}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      offer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{offer.description_en}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{offer.valid_hours_start} - {offer.valid_hours_end}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {offer.valid_days.map((day: number) => dayNames[day].slice(0, 3)).join(', ')}
                      </span>
                    </div>
                    <div className="font-semibold text-orange-600">
                      {offer.discount_percentage}% OFF
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {(!restaurant.offers || restaurant.offers.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No offers created yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Create Your First Offer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Offer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
              </h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title, en: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter offer title in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (German)
                  </label>
                  <input
                    type="text"
                    value={formData.title.de}
                    onChange={(e) => setFormData({
                      ...formData,
                      title: { ...formData.title, de: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter offer title in German"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, en: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter offer description in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (German)
                  </label>
                  <textarea
                    value={formData.description.de}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: { ...formData.description, de: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter offer description in German"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({
                      ...formData,
                      discount: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Valid Hours */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.validHours.start}
                      onChange={(e) => setFormData({
                        ...formData,
                        validHours: { ...formData.validHours, start: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.validHours.end}
                      onChange={(e) => setFormData({
                        ...formData,
                        validHours: { ...formData.validHours, end: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Valid Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          formData.validDays.includes(index)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingOffer ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;