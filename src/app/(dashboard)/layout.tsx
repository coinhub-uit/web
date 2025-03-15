'use client';
import Navbar from '@/components/ui/dashboardLayout/navbar';
import Sidebar from '@/components/ui/dashboardLayout/sidebar';

import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-base-100 fixed inset-y-0 left-0 z-50 w-64 min-w-[200px] p-4 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:w-1/6 md:translate-x-0`}
      >
        <Sidebar />
      </aside>
      <div className="flex flex-grow flex-col bg-blue-200">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}
