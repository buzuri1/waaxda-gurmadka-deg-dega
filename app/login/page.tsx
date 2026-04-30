'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Flame, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Email ama password-ka waa khalad. Fadlan isku day mar kale.');
        return;
      }

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Khalad ayaa dhacay. Fadlan isku day mar kale.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F1729 0%, #1B4FBE 50%, #0F1729 100%)' }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #CC0000, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1B4FBE, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-5 animate-pulse"
          style={{ background: 'radial-gradient(circle, #FF6600, transparent)', filter: 'blur(40px)', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(204,0,0,0.2), rgba(27,79,190,0.2))', border: '2px solid rgba(255,255,255,0.2)' }}>
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const icon = document.createElement('div');
                      icon.innerHTML = '🔥';
                      icon.style.fontSize = '40px';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-fire-red rounded-full flex items-center justify-center animate-pulse-glow">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Gurmadka Deg Dega ee Gobolka Banadir
          </h1>
          <p className="text-blue-200 text-sm font-medium">
            Nidaamka Maareynta Dabka — Banadir
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-blue-300 uppercase tracking-widest font-medium">
              Nidaam Dawladeed
            </span>
            <Shield className="w-4 h-4 text-blue-300" />
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl animate-fade-in"
          style={{ animationDelay: '0.2s', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Email-ka
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@banadir.gov.so"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 text-sm transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-2">
                Password-ka
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-400 text-sm transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm text-red-200 animate-fade-in"
                style={{ background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #CC0000, #990000)', boxShadow: '0 4px 20px rgba(204, 0, 0, 0.4)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Waa la galayaa...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Gal Nidaamka
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-blue-300/50 mt-8">
          © {new Date().getFullYear()} Maamulka Gobolka Banadir — Dhammaan xuquuqda way xifdigan yihiin
        </p>
      </div>
    </div>
  );
}
