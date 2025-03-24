'use client';
import { LuHouse, LuUsers, LuPiggyBank, LuChartPie } from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const menuItems = [
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
  const pathName = usePathname();
  return (
    <>
      <div className="text-base-content p-1">MENU</div>
      <div>
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = pathName.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group ${isActive ? 'bg-base-300' : 'hover:bg-base-200'} flex items-center gap-2 rounded-lg p-2 transition-colors duration-200`}
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
