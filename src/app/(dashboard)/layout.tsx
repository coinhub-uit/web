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
      if (window.innerWidth < 900) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    if (isSidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-base-100 fixed inset-y-0 left-0 z-50 w-64 min-w-[200px] p-4 shadow-lg transition-transform duration-500 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:w-1/6 md:translate-x-0`}
      >
        <Sidebar />
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSidebarOpen(false)}
          role="button"
          tabIndex={0}
        ></div>
      )}
      <div className="bg-base-200 flex flex-grow flex-col">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-grow overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
