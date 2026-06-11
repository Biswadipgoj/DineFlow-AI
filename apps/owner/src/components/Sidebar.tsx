'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, MapPin, Users, BarChart2, Settings, Bot, Megaphone, Package } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/tables', icon: MapPin, label: 'Tables' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/staff', icon: Users, label: 'Staff' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/ai', icon: Bot, label: 'AI Assistant' },
  { href: '/marketing', icon: Megaphone, label: 'Marketing' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <span className="font-display font-bold text-brand-600 text-xl">DineNova</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}>
              <Icon className={`h-4 w-4 ${active ? 'text-brand-500' : ''}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
