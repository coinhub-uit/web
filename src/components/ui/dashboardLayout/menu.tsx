'use client';
import { LuHouse } from 'react-icons/lu';
import { LuUsers } from 'react-icons/lu';
import { LuPiggyBank } from 'react-icons/lu';
import { LuChartPie } from 'react-icons/lu';
import Link from 'next/link';

// TODO: don't hard code routes
const menuItems = [
  {
    icon: LuHouse,
    label: 'Home',
    href: '/home',
  },
  {
    icon: LuUsers,
    label: 'Users',
    href: '/users',
  },
  {
    icon: LuPiggyBank,
    label: 'Saving Management',
    href: '/saving-management',
  },
  {
    icon: LuChartPie,
    label: 'Analytics & Report',
    href: '/analytics-reports',
  },
];

const Menu = () => {
  return (
    <>
      <div className="text-base-content p-1">MENU</div>
      <div>
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group hover:bg-base-300 flex items-center gap-2 rounded-lg p-2 transition-colors duration-200"
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                <ItemIcon size={20} />
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
