'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Home, FileText, BarChart3, Bot, Database,
  LogOut, Menu, X, Flame, ChevronDown, User
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Guriga', icon: Home },
  { href: '/dhacdooyinka', label: 'Dhacdooyinka', icon: FileText },
  { href: '/faahfaahinta', label: 'Faahfaahinta', icon: BarChart3 },
  { href: '/weydii-ai', label: 'Weydii AI', icon: Bot },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 no-print"
        style={{ background: 'linear-gradient(135deg, #CC0000, #990000)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/15 group-hover:bg-white/25 transition-colors">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span style="font-size:20px">🔥</span>';
                    }
                  }}
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-white font-bold text-sm leading-tight">
                  Gurmadka Deg Dega
                </h1>
                <p className="text-red-100/70 text-[10px] font-medium">
                  Gobolka Banadir
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Nav Links (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Ka Bax Nidaamka
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white shadow-xl animate-slide-left"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-red-50 text-fire-red'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
