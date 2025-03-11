import Menu from '@/components/ui/menu';
import ThemeSwitcherButton from '@/components/ui/themes/themeSwitcherButton';
import Logo from '@/components/ui/logo';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen">
      <div className="bg-base-200 flex w-[14%] flex-col items-center p-4 md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Logo />
        <Menu />
        <ThemeSwitcherButton />
      </div>
      <div className="w-[86%] bg-blue-200 md:w-[92%] lg:w-[84%] xl:w-[86%]">
        {children}
      </div>
    </div>
  );
}
