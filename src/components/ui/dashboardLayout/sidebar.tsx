'use client';
import Logo from './logo';
import Menu from './menu';

const Sidebar = () => {
  return (
    <div className="flex h-full min-w-[180px] flex-col items-center">
      <Logo />
      <Menu />
    </div>
  );
};

export default Sidebar;
