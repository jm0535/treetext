import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
