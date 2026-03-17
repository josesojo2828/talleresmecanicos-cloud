"use client";

import { usePathname } from 'next/navigation';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className={isDashboard ? 'dashboard-theme' : 'public-theme'}>
      {children}
    </div>
  );
};
