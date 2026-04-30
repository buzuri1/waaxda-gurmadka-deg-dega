'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatDate, parseCasualties } from '@/lib/utils';
import { 
  Printer, Calendar, MapPin, FileText, Info, AlertTriangle, 
  Map, Droplet, Clock, Hourglass, Box, Image as ImageIcon 
} from 'lucide-react';

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('incidents').select('*').eq('id', id).single();
      setIncident(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="w-full h-40 bg-gray-100 animate-pulse rounded-md" />)}</div>;
  if (!incident) return <div className="text-center py-20 text-gray-500">Dhacdadan lama helin.</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header Red Card */}
      <div className="bg-[#CC0000] rounded-md p-6 text-white flex flex-col md:flex-row md:items-center justify-between shadow-sm relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{incident.lambarka_warbixinta}</h1>
            <span className="px-2 py-1 rounded bg-white/20 text-[10px] font-bold tracking-wider uppercase border border-white/30">
              {incident.xaaladda}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(incident.taariikhda)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{incident.degmada}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{incident.nooca_hantida}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.print()} 
          className="mt-4 md:mt-0 z-10 bg-[#1B4FBE] hover:bg-[#153D94] text-white px-5 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Faahfaahinta Guud */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-5 h-5 text-[#1B4FBE]" />
              <h2 className="text-lg font-bold text-gray-900">Faahfaahinta Guud</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm text-gray-500">Sababta Dabka</span>
                <span className="text-sm font-bold text-gray-900">{incident.sababta_dabka}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm text-gray-500">Milkiilaha</span>
                <span className="text-sm font-bold text-gray-900">{incident.magaca_milkiilaha}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm text-gray-500">Telefoon</span>
                <span className="text-sm font-bold text-gray-900">{incident.telefoon || 'Lama garanayo'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Taliyaha Hawlgalka</span>
                <span className="text-sm font-bold text-[#CC0000]">{incident.taliyaha_hawlgalka || 'Lama xusin'}</span>
              </div>
            </div>
          </div>

          {/* Khasaaraha Geystay */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-bold text-gray-900">Khasaaraha Geystay</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-md p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 border border-[#FECACA]">
                  <AlertTriangle className="w-6 h-6 text-[#CC0000]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#CC0000] tracking-wider uppercase mb-1">Khasaaraha Nafeed</p>
                  <p className="text-lg font-bold text-gray-900">{incident.khasaaraha_nafeed || 'Lama soo warin'}</p>
                </div>
              </div>
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-md p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 border border-[#BAE6FD]">
                  <FileText className="w-6 h-6 text-[#0369A1]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#0369A1] tracking-wider uppercase mb-1">Khasaaraha Hantida</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(Number(incident.khasaaraha_hantida))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sharaxaadda Hawlgalka */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Sharaxaadda Hawlgalka</h2>
            </div>
            
            {incident.sharaxaadda ? (
              <div className="border-l-4 border-[#CC0000] pl-4 mb-6">
                <p className="text-gray-700 italic text-[15px]">&quot;{incident.sharaxaadda}&quot;</p>
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6">Lama bixin sharaxaad faahfaahsan.</p>
            )}

            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-video bg-gray-900 rounded-sm overflow-hidden flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="aspect-video bg-gray-800 rounded-sm overflow-hidden flex items-center justify-center">
                 <span className="text-2xl">🚒</span>
              </div>
              <div className="aspect-video bg-gray-700 rounded-sm overflow-hidden flex items-center justify-center">
                 <span className="text-2xl">👨‍🚒</span>
              </div>
              <div className="aspect-video bg-gray-100 rounded-sm border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                 <span className="text-xs font-bold text-gray-400">+12 PHOTOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Map Placeholder */}
          <div className="bg-[#1A2744] h-48 rounded-md relative overflow-hidden flex items-center justify-center">
            {/* Fake Map Elements */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute right-0 top-0 w-32 h-full bg-[#EAB308] opacity-90 transform skew-x-12 translate-x-10"></div>
            
            <MapPin className="w-16 h-16 text-white z-10 drop-shadow-lg" />
            
            <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded text-[10px] font-bold text-gray-900 z-10 shadow-sm">
              2.0349° N, 45.3117° E
            </div>
          </div>

          {/* Agabka la Isticmaalay */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Box className="w-5 h-5 text-[#CC0000]" />
              <h2 className="text-lg font-bold text-gray-900">Agabka la Isticmaalay</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-center">
                 <div className="text-[#CC0000] mb-2 flex justify-center"><Truck className="w-6 h-6" /></div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">DAB DAMIYASHA</p>
                 <p className="text-2xl font-black text-gray-900">{incident.tirada_dabdamiyasha || 0}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-center">
                 <div className="text-[#1B4FBE] mb-2 flex justify-center"><AlertTriangle className="w-6 h-6" /></div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">GAADIID</p>
                 <p className="text-2xl font-black text-gray-900">{incident.tirada_gaadiidka || 0}</p>
              </div>
            </div>

            <div className="bg-[#0F1729] rounded-md p-4 space-y-4 mb-4">
               <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs tracking-widest text-gray-400">JAWAABTII</span>
                  </div>
                  <span className="text-sm font-bold">{incident.waqtiga_jawaabta || 0} daqiiqo</span>
               </div>
               <div className="flex items-center justify-between text-white border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-gray-400" />
                    <span className="text-xs tracking-widest text-gray-400">HAWLGALKA</span>
                  </div>
                  <span className="text-sm font-bold">{incident.muddada_hawlgalka || 0} daqiiqo</span>
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-md">
                 <div className="flex items-center gap-2">
                   <Droplet className="w-4 h-4 text-[#1B4FBE]" />
                   <span className="text-sm font-bold text-gray-700">Biyo</span>
                 </div>
                 <span className="text-sm font-bold text-[#1B4FBE]">{incident.biyaha_la_isticmaalay || 0}L</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-md">
                 <div className="flex items-center gap-2">
                   <Droplet className="w-4 h-4 text-[#CC0000]" />
                   <span className="text-sm font-bold text-gray-700">Foam</span>
                 </div>
                 <span className="text-sm font-bold text-[#CC0000]">{incident.foam_la_isticmaalay || 0}L</span>
               </div>
            </div>
          </div>

          {/* Log-ga Hawlgalka */}
          <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-6">Log-ga Hawlgalka</h2>
             <div className="relative border-l border-gray-200 ml-3 space-y-6">
                <div className="relative pl-6">
                   <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                   <p className="text-xs font-bold text-gray-900">21:00 PM</p>
                   <p className="text-xs text-gray-500 mt-0.5">Wicitaankii u horeeyay</p>
                </div>
                <div className="relative pl-6">
                   <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#CC0000]"></span>
                   <p className="text-xs font-bold text-gray-900">21:12 PM</p>
                   <p className="text-xs text-gray-500 mt-0.5">Gaadiidka ayaa goobta gaaray</p>
                </div>
                <div className="relative pl-6">
                   <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
                   <p className="text-xs font-bold text-gray-900">00:12 AM</p>
                   <p className="text-xs text-gray-500 mt-0.5">Dabka ayaa gebi ahaanba la demiyay</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
