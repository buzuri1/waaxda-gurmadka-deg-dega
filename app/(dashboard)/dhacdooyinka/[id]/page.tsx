'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatDate, formatNumber, parseCasualties } from '@/lib/utils';
import { ArrowLeft, Printer, MapPin, Phone, User, Clock, Droplets, Shield, Truck, Users, FileText, AlertTriangle } from 'lucide-react';

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('incidents').select('*').eq('id', id).single();
      setIncident(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div>;
  if (!incident) return <div className="text-center py-20"><AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted/40" /><p className="text-muted">Dhacdadan lama helin</p><Link href="/dhacdooyinka" className="text-official-blue text-sm mt-2 inline-block hover:underline">← Ku noqo liiska</Link></div>;

  const casualties = parseCasualties(incident.khasaaraha_nafeed);
  const statusCls: Record<string, string> = { furan: 'badge-furan', baaraandegaynaya: 'badge-baaraandegaynaya', xidhan: 'badge-xidhan' };
  const statusLabels: Record<string, string> = { furan: 'Furan', baaraandegaynaya: 'Baaraandegaynaya', xidhan: 'Xidhan' };

  const sections = [
    { title: 'Macluumaadka Guud', icon: FileText, items: [
      { label: 'Lambarka Warbixinta', value: incident.lambarka_warbixinta },
      { label: 'Taariikhda', value: formatDate(incident.taariikhda) },
      { label: 'Degmada / Goobta', value: incident.degmada },
      { label: 'Nooca Hantida', value: incident.nooca_hantida },
      { label: 'Sababta Dabka', value: incident.sababta_dabka },
    ]},
    { title: 'Macluumaadka Milkiilaha', icon: User, items: [
      { label: 'Magaca', value: incident.magaca_milkiilaha },
      { label: 'Telefoonka', value: incident.telefoon || 'Lama bixin' },
    ]},
    { title: 'Khasaaraha', icon: AlertTriangle, items: [
      { label: 'Khasaaraha Nafeed', value: incident.khasaaraha_nafeed || 'Lama diiwaangelin' },
      { label: 'Dhimashooyinka', value: String(casualties.deaths) },
      { label: 'Dhaawacyada', value: String(casualties.injuries) },
      { label: 'Khasaaraha Hantida', value: formatCurrency(Number(incident.khasaaraha_hantida)) },
    ]},
    { title: 'Ilaha La Adeegsaday', icon: Truck, items: [
      { label: 'Tirada Dabdamiyasha', value: formatNumber(incident.tirada_dabdamiyasha) + ' askari' },
      { label: 'Tirada Gaadiidka', value: formatNumber(incident.tirada_gaadiidka) + ' gaari' },
      { label: 'Biyaha La Isticmaalay', value: formatNumber(Number(incident.biyaha_la_isticmaalay)) + ' litir' },
      { label: 'Foam-ka La Isticmaalay', value: formatNumber(Number(incident.foam_la_isticmaalay)) + ' litir' },
    ]},
    { title: 'Waqtiyada', icon: Clock, items: [
      { label: 'Waqtiga Jawaabta', value: incident.waqtiga_jawaabta + ' daqiiqo' },
      { label: 'Muddada Hawlgalka', value: incident.muddada_hawlgalka + ' daqiiqo' },
      { label: 'Taliyaha Hawlgalka', value: incident.taliyaha_hawlgalka },
    ]},
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <Link href="/dhacdooyinka" className="flex items-center gap-2 text-sm text-muted hover:text-text-dark transition-colors">
          <ArrowLeft className="w-4 h-4" /> Ku noqo Liiska
        </Link>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors">
          <Printer className="w-4 h-4" /> Daabac
        </button>
      </div>

      {/* Report Header Card */}
      <div className="rounded-2xl overflow-hidden border border-border">
        <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #CC0000, #1B4FBE)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-1">Warbixinta Dhacdada</p>
              <h1 className="text-3xl font-extrabold">{incident.lambarka_warbixinta}</h1>
              <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDate(incident.taariikhda)}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{incident.degmada}</span>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusCls[incident.xaaladda]}`}>
              {statusLabels[incident.xaaladda] || incident.xaaladda}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white">
          {[
            { label: 'Khasaaraha', value: formatCurrency(Number(incident.khasaaraha_hantida)), color: '#CC0000' },
            { label: 'Dabdamiyasha', value: incident.tirada_dabdamiyasha, color: '#1B4FBE' },
            { label: 'Jawaabta', value: incident.waqtiga_jawaabta + ' daq', color: '#D97706' },
            { label: 'Hawlgalka', value: incident.muddada_hawlgalka + ' daq', color: '#16A34A' },
          ].map((s, i) => (
            <div key={i} className="p-4 text-center border-b border-r border-border last:border-r-0">
              <p className="text-[10px] text-muted uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-extrabold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gray-50/50">
            <section.icon className="w-5 h-5 text-fire-red" />
            <h3 className="font-bold text-text-dark">{section.title}</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-muted uppercase tracking-wider font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-text-dark mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Description */}
      {incident.sharaxaadda && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-text-dark mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-fire-red" />Sharaxaadda Dhacdada</h3>
          <p className="text-sm leading-relaxed text-gray-700">{incident.sharaxaadda}</p>
        </div>
      )}
    </div>
  );
}
