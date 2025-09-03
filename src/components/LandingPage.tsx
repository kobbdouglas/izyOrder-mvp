import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Menu, Globe, Star, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">IzyOrder</h1>
            </div>
            <Link
              to="/admin"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Restaurant Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Digital Menus
            <span className="block text-orange-500">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create beautiful, multilingual digital menus for your restaurant. 
            Manage your offerings, track availability, and engage customers with special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/signup"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ChefHat className="w-5 h-5" />
              <span>Start Your Restaurant</span>
            </Link>
            <Link
              to="/restaurant/bella-vista"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-orange-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Menu className="w-5 h-5" />
              <span>View Demo Menu</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to manage your restaurant's digital presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multilingual Support</h3>
              <p className="text-gray-600">
                Serve customers in multiple languages with seamless translation support for menus and content.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Menu className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Menu Management</h3>
              <p className="text-gray-600">
                Update prices, descriptions, and availability in real-time. Mark items as sold out instantly.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Special Offers</h3>
              <p className="text-gray-600">
                Create time-based promotions and discounts to drive customer engagement and sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Experience our demo restaurant menu
            </p>
            <Link
              to="/restaurant/bella-vista"
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <span>View Bella Vista Menu</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg"
              alt="Restaurant interior"
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bella Vista</h3>
              <p className="text-gray-600 mb-6">
                Authentic Italian cuisine with a modern twist. Experience our demo restaurant 
                with multilingual menus, dietary information, and special offers.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Multilingual
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Dietary Info
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Special Offers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join restaurants worldwide who are already using IzyOrder to create 
            amazing digital menu experiences for their customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin/signup"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/admin"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-3">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <span className="text-gray-600">© 2025 IzyOrder. Digital menus made simple.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;