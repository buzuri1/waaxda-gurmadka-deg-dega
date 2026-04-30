'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Flame, BarChart3, Bot, Droplets,
  Bell, Settings, Search, Shield, HelpCircle, LogOut,
  Plus
} from 'lucide-react';

const topNavItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/dhacdooyinka', label: 'Incidents' },
  { href: '/faahfaahinta', label: 'Statistics' },
  { href: '/weydii-ai', label: 'Weydii AI' },
];

const sideNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dhacdooyinka', label: 'Incidents', icon: Flame },
  { href: '/faahfaahinta', label: 'Statistics', icon: BarChart3 },
  { href: '/weydii-ai', label: 'Weydii AI', icon: Bot },
  { href: '#', label: 'Resources', icon: Droplets },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserEmail(session.user.email || 'Admin');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 bg-[#CC0000] flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
        <div className="flex items-center">
          <h1 className="text-white font-bold text-lg tracking-wider">
            MOGADISHU FIRE & EMERGENCY SERVICES
          </h1>
        </div>

        <div className="hidden md:flex items-center h-full">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white border-b-4 border-white pt-1'
                    : 'text-red-100 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-200" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#B30000] text-white placeholder-red-200 text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/50 w-64"
            />
          </div>
          <button className="text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>
          <button className="text-white">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-white/20 cursor-pointer">
             <span className="text-xs text-white">AD</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Organization Info */}
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[#CC0000]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900 leading-tight">Emergency Command</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Banadir Region</p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-1">
            {sideNavItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-[#CC0000]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 space-y-6">
            <button className="w-full bg-[#CC0000] hover:bg-[#B30000] text-white py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wide">
              <Plus className="w-4 h-4" />
              Report New Incident
            </button>
            
            <div className="pt-4 border-t border-gray-100 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <HelpCircle className="w-4 h-4" />
                Help Center
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 p-6">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-[#F8F9FA] py-4 px-6 border-t border-gray-200 mt-auto shrink-0 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="font-bold text-[#1B4FBE]">BRA Command Center</span>
              <span>© {new Date().getFullYear()} Mogadishu Fire & Emergency Services | Banadir Regional Administration</span>
            </div>
            <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
          </footer>
        </div>
      </div>
    </div>
  );
}
