'use client';
import { Bell, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
      <div className="text-sm text-neutral-500">
        {/* breadcrumb */}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-neutral-100">
          <Bell className="h-4 w-4 text-neutral-600" />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100">
          <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">O</div>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        </button>
      </div>
    </header>
  );
}
