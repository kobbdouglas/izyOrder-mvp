import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';
import AdminDashboard from './components/admin/AdminDashboard';
import MenuManagement from './components/admin/MenuManagement';
import OffersManagement from './components/admin/OffersManagement';
import RestaurantSettings from './components/admin/RestaurantSettings';
import CustomerWelcome from './components/customer/CustomerWelcome';
import CustomerMenu from './components/customer/CustomerMenu';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <RestaurantProvider mode="admin">
                  <AdminDashboard />
                </RestaurantProvider>
              } 
            />
            <Route 
              path="/admin/menu" 
              element={
                <RestaurantProvider mode="admin">
                  <MenuManagement />
                </RestaurantProvider>
              } 
            />
            <Route 
              path="/admin/offers" 
              element={
                <RestaurantProvider mode="admin">
                  <OffersManagement />
                </RestaurantProvider>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <RestaurantProvider mode="admin">
                  <RestaurantSettings />
                </RestaurantProvider>
              } 
            />
            
            {/* Customer Routes */}
            <Route 
              path="/restaurant/:restaurantId" 
              element={
                <RestaurantProvider mode="customer">
                  <CustomerWelcome />
                </RestaurantProvider>
              } 
            />
            <Route 
              path="/restaurant/:restaurantId/menu" 
              element={
                <RestaurantProvider mode="customer">
                  <CustomerMenu />
                </RestaurantProvider>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;