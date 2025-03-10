'use client';
import React, { useRef } from 'react';
import { HomeIcon, HomeIconHandle } from './icons/home';
import { UsersIcon } from './icons/users';
import { CircleDollarSignIcon } from './icons/money';
import { ChartPieIcon } from './icons/chart';
import Link from 'next/link';

const menuItems = [
  {
    icon: HomeIcon, // Change to reference the component directly
    label: 'Home',
    href: '/home',
  },
  {
    icon: UsersIcon,
    label: 'Users',
    href: '/users',
  },
  {
    icon: CircleDollarSignIcon,
    label: 'Saving Management',
    href: '/saving-management',
  },
  {
    icon: ChartPieIcon,
    label: 'Analytics & Report',
    href: '/analytics-reports',
  },
];

const Menu = () => {
  const homeIconRef = useRef<HomeIconHandle>(null);

  const handleMouseEnter = () => {
    homeIconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    homeIconRef.current?.stopAnimation();
  };

  return (
    <>
      <div className="text-base-content p-1">MENU</div>
      <div>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group hover:bg-base-300 flex items-center gap-2 rounded-lg p-2 transition-colors duration-200"
              onMouseEnter={
                item.label === 'Home' ? handleMouseEnter : undefined
              }
              onMouseLeave={
                item.label === 'Home' ? handleMouseLeave : undefined
              }
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {item.label === 'Home' ? (
                  <HomeIcon ref={homeIconRef} size={20} />
                ) : (
                  <IconComponent size={20} />
                )}
              </div>
              <span className="text-base-content">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Menu;
