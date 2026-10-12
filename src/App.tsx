import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/Navbar';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { SmmPage } from './pages/SmmPage';
import { AdsPage } from './pages/AdsPage';
import { WebsitePage } from './pages/WebsitePage';
import { PaymentPage } from './pages/PaymentPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { FaqPage } from './pages/FaqPage';
import { TermsPage } from './pages/TermsPage';
import { DollarPage } from './pages/DollarPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSmmServicesPage } from './pages/admin/AdminSmmServicesPage';
import { AdminWebsitePackagesPage } from './pages/admin/AdminWebsitePackagesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  const { currentPath, navigate, settings } = useApp();
  const { isAdminAuthenticated, isAuthLoading } = useAdminAuth();

  const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  const isAdminSection = cleanPath.startsWith('/admin') && cleanPath !== '/admin/login';
  const isAdminPath = cleanPath.startsWith('/admin');

  // Maintenance Mode Guard: If enabled and visitor is not accessing admin routes or authenticated as admin
  if (settings.maintenanceMode?.enabled && !isAdminPath && !isAdminAuthenticated) {
    return <MaintenancePage />;
  }

  // Admin route guard
  if (isAdminSection) {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#030817]">
          <div className="w-8 h-8 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin" />
        </div>
      );
    }
    if (!isAdminAuthenticated) {
      return <AdminLoginPage />;
    }
  }

  const renderContent = () => {
    switch (cleanPath) {
      case '/':
        return <HomePage />;
      case '/smm':
        return <SmmPage />;
      case '/ads':
        return <AdsPage />;
      case '/website':
        return <WebsitePage />;
      case '/dollar':
        return <DollarPage />;
      case '/payment':
        return <PaymentPage />;
      case '/track-order':
        return <TrackOrderPage />;
      case '/faq':
        return <FaqPage />;
      case '/terms':
        return <TermsPage />;
      case '/admin/login':
        return isAdminAuthenticated ? <AdminDashboardPage /> : <AdminLoginPage />;
      case '/admin':
        return <AdminDashboardPage />;
      case '/admin/smm-services':
        return <AdminSmmServicesPage />;
      case '/admin/website-packages':
        return <AdminWebsitePackagesPage />;
      case '/admin/reviews':
        return <AdminReviewsPage />;
      case '/admin/settings':
        return <AdminSettingsPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030817] text-[#eef4ff]">
      {!isAdminSection && <AnnouncementBar />}
      <Navbar />
      <main className="flex-1 w-full">{renderContent()}</main>
      {!isAdminSection && <Footer />}
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AdminAuthProvider>
        <AppRouter />
      </AdminAuthProvider>
    </AppProvider>
  );
}
