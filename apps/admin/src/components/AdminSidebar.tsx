'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, CreditCard, Settings } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/restaurants', icon: Store, label: 'Restaurants' },
  { href: '/plans', icon: CreditCard, label: 'Plans' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-neutral-900 flex flex-col">
      <div className="p-5 border-b border-neutral-700">
        <span className="font-display font-bold text-brand-500 text-lg">DineNova</span>
        <p className="text-neutral-400 text-xs mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-brand-500 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
