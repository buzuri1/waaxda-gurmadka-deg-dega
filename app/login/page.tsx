'use client';

import { useState, useEffect } from 'react';
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
        console.error("Login error details:", authError);
        if (authError.message.includes('Email not confirmed')) {
          setError('Fadlan xaqiiji email-kaaga (Email not confirmed). Check Supabase settings.');
        } else if (authError.message.includes('Invalid login')) {
          setError('Email ama password-ka waa khalad. Fadlan isku day mar kale.');
        } else {
          setError(`Khalad: ${authError.message}`);
        }
        return;
      }

      if (data.session) {
        // Force a hard reload so Supabase middleware cookies update correctly across the entire app
        window.location.href = '/';
      }
    } catch (err) {
      setError('Khalad ayaa dhacay. Fadlan isku day mar kale.');
    } finally {
      setLoading(false);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F1729 0%, #1B4FBE 50%, #0F1729 100%)' }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #CC0000, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1B4FBE, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-5 animate-pulse"
          style={{ background: 'radial-gradient(circle, #FF6600, transparent)', filter: 'blur(40px)', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

      {/* Raining Animation Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.5 + Math.random() * 0.7}s`,
              animationDelay: `${Math.random() * 2}s`,
              height: `${10 + Math.random() * 20}px`,
              opacity: 0.1 + Math.random() * 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 py-8">
        {/* Slideshow Gallery */}
        <div className="w-full h-48 mb-8 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10 animate-fade-in">
          {slides.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ))}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-6 bg-[#CC0000]' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg p-1"
                style={{ border: '3px solid rgba(255,255,255,0.2)' }}>
                <img 
                  src="/images/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
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
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-fire-red rounded-full flex items-center justify-center animate-pulse-glow shadow-md border-2 border-[#1B4FBE]">
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
