'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Flame, BarChart3, Bot, Droplets,
  Bell, Settings, Search, Shield, HelpCircle, LogOut,
  Plus, Users, X, Check
} from 'lucide-react';

const topNavItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/dhacdooyinka', label: 'Incidents' },
  { href: '/faahfaahinta', label: 'Statistics' },
  { href: '/weydii-ai', label: 'Weydii AI' },
  { href: '/shaqalaha', label: 'Shaqalaha' },
];

const sideNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dhacdooyinka', label: 'Incidents', icon: Flame },
  { href: '/faahfaahinta', label: 'Statistics', icon: BarChart3 },
  { href: '/weydii-ai', label: 'Weydii AI', icon: Bot },
  { href: '/shaqalaha', label: 'Xogta Shaqalaha', icon: Users },
  { href: '#', label: 'Resources', icon: Droplets },
];

type Notification = {
  id: string;
  type: 'incident' | 'commit';
  title: string;
  description: string;
  time: string;
  read: boolean;
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff} ilbiriqsi ka hor`;
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiiqo ka hor`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saac ka hor`;
  return `${Math.floor(diff / 86400)} maalin ka hor`;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);
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
      if (!session) router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Load read IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notif_read_ids');
      if (stored) setReadIds(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data: Notification[] = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Notification fetch error:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close notif panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
    try { localStorage.setItem('notif_read_ids', JSON.stringify([...allIds])); } catch {}
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 bg-[#CC0000] flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:bg-[#B30000] p-1.5 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          <h1 className="text-white font-bold text-sm md:text-lg tracking-wider truncate">
            MOGADISHU FIRE & EMERGENCY SERVICES
          </h1>
        </div>

        <div className="hidden lg:flex items-center h-full">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center px-4 text-sm font-medium transition-colors ${
                  isActive ? 'text-white border-b-4 border-white pt-1' : 'text-red-100 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          <div className="relative hidden xl:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-200" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#B30000] text-white placeholder-red-200 text-sm rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/50 w-48 xl:w-64"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative hidden sm:block" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="text-white relative hover:text-red-200 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full text-[10px] font-bold text-gray-900 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[200] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#CC0000]" />
                    <span className="font-bold text-sm text-gray-900">Ogeysiisyada</span>
                    {unreadCount > 0 && (
                      <span className="bg-[#CC0000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </div>
                  <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">Ogeysiis ma jiro</div>
                  ) : (
                    notifications.map((n) => {
                      const isRead = readIds.has(n.id);
                      return (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!isRead ? 'bg-red-50/30' : ''}`}>
                          <div className="flex items-start gap-2">
                            <span className="text-base mt-0.5">{n.type === 'incident' ? '🔥' : '⚙️'}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${!isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{n.description}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.time)}</p>
                            </div>
                            {!isRead && <span className="w-2 h-2 bg-[#CC0000] rounded-full mt-1.5 shrink-0" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={markAllRead}
                    className="w-full text-center text-xs font-bold text-[#CC0000] hover:text-[#B30000] transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Xidh Dhammaan
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="text-white hover:text-red-200 transition-colors hidden sm:block">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-white/20 cursor-pointer shadow-sm">
            <span className="text-xs text-white font-bold">
              {userEmail ? userEmail[0].toUpperCase() : 'A'}
            </span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside className={`absolute lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-6 h-6 text-[#CC0000]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900 leading-tight">Emergency Command</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Banadir Region</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {sideNavItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
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
            <Link
              href="/dhacdooyinka?action=new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#CC0000] hover:bg-[#B30000] text-white py-2.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-wide shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Report New Incident
            </Link>

            <div className="pt-4 border-t border-gray-100 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50">
                <HelpCircle className="w-4 h-4" />
                Help Center
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
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
