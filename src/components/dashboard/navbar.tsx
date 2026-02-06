import Logo from "../shared/logo";
import UserMenuItem from "./user-menu-item";
import MenuList from "./menu-list";

interface DashboardNavbarProps {
    username: string;
    fullName: string;
    menuItems: { name: string; href: string }[];
}

export default function DashboardNavbar({ username, fullName, menuItems }: DashboardNavbarProps) {
  return (
    <nav className="sticky top-0 h-screen w-64 border-r border-muted flex-col justify-between p-6 bg-background hidden lg:flex">
      <section className="flex flex-col gap-6">
        <Logo />
        <MenuList items={menuItems} />
      </section>
      <UserMenuItem username={username} fullName={fullName} />
    </nav>
  );
}