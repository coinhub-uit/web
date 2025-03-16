'use client';
import { useEffect, useState } from 'react';
import ToggleThemesButton from '../themes/toggleThemesButton';
import { menuItems } from './menu';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPage = menuItems.find((item) => pathName.startsWith(item.href));
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex items-center">
        {isSmallScreen && (
          <button
            className="btn btn-square btn-ghost"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
      </div>
      <text className="ml-5 flex-1 text-2xl font-semibold">
        {mounted ? currentPage?.label : 'Dashboard'}
      </text>
      <ToggleThemesButton />
      <div className="dropdown dropdown-end mr-3 ml-3">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content rounded-box bg-base-100 z-[1] mt-3 w-52 p-2 shadow"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
