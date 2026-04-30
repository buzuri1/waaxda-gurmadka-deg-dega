'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatNumber, parseCasualties } from '@/lib/utils';
import { BarChart3, Droplets, Users, Truck, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#CC0000', '#1B4FBE', '#D97706', '#16A34A', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function StatisticsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('incidents').select('*').order('taariikhda', { ascending: true });
      setIncidents(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-60 rounded-2xl" />)}</div>;

  // Monthly data
  const monthlyData = incidents.reduce((acc, inc) => {
    const d = new Date(inc.taariikhda);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const months = ['Janaayo','Febraayo','Maarso','Abriil','Maajo','Juun','Luuliyo','Agoosto','Sebtembar','Oktoobar','Nofembar','Disembar'];
    const label = months[d.getMonth()] + ' ' + d.getFullYear();
    const existing = acc.find(m => m.key === key);
    if (existing) existing.count += 1;
    else acc.push({ key, name: label, count: 1 });
    return acc;
  }, [] as { key: string; name: string; count: number }[]).sort((a, b) => a.key.localeCompare(b.key));

  // District data (top 5)
  const districtData = incidents.reduce((acc, inc) => {
    const d = inc.degmada.split(',')[0].trim();
    const existing = acc.find(x => x.name === d);
    if (existing) existing.count += 1;
    else acc.push({ name: d, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count).slice(0, 5);

  // Cause data
  const causeData = incidents.reduce((acc, inc) => {
    const existing = acc.find(x => x.name === inc.sababta_dabka);
    if (existing) existing.value += 1;
    else acc.push({ name: inc.sababta_dabka, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Avg response time by district
  const avgResponseData = Object.values(incidents.reduce((acc, inc) => {
    const d = inc.degmada.split(',')[0].trim();
    if (!acc[d]) acc[d] = { name: d, total: 0, count: 0 };
    acc[d].total += inc.waqtiga_jawaabta || 0;
    acc[d].count += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; count: number }>)).map(d => ({
    name: d.name, avg: Math.round(d.total / d.count)
  }));

  // Resource totals
  const totalWater = incidents.reduce((s, i) => s + (Number(i.biyaha_la_isticmaalay) || 0), 0);
  const totalFoam = incidents.reduce((s, i) => s + (Number(i.foam_la_isticmaalay) || 0), 0);
  const totalFirefighters = incidents.reduce((s, i) => s + (i.tirada_dabdamiyasha || 0), 0);
  const totalTrucks = incidents.reduce((s, i) => s + (i.tirada_gaadiidka || 0), 0);
  const totalDamage = incidents.reduce((s, i) => s + (Number(i.khasaaraha_hantida) || 0), 0);
  const totalDeaths = incidents.reduce((s, i) => s + parseCasualties(i.khasaaraha_nafeed).deaths, 0);
  const totalInjuries = incidents.reduce((s, i) => s + parseCasualties(i.khasaaraha_nafeed).injuries, 0);

  const exportCSV = () => {
    const headers = ['Lambarka','Taariikhda','Degmada','Nooca','Sababta','Milkiilaha','Khasaaraha ($)','Dabdamiyasha','Gaadiidka','Xaaladda'];
    const rows = incidents.map(i => [i.lambarka_warbixinta, i.taariikhda, i.degmada, i.nooca_hantida, i.sababta_dabka, i.magaca_milkiilaha, i.khasaaraha_hantida, i.tirada_dabdamiyasha, i.tirada_gaadiidka, i.xaaladda].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'dhacdooyinka-banadir.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const resourceCards = [
    { icon: Droplets, label: 'Biyaha La Isticmaalay', value: formatNumber(totalWater) + ' L', color: '#1B4FBE' },
    { icon: Droplets, label: 'Foam-ka La Isticmaalay', value: formatNumber(totalFoam) + ' L', color: '#8B5CF6' },
    { icon: Users, label: 'Wadarta Dabdamiyasha', value: formatNumber(totalFirefighters), color: '#CC0000' },
    { icon: Truck, label: 'Wadarta Gaadiidka', value: formatNumber(totalTrucks), color: '#D97706' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark">Faahfaahinta <span className="text-fire-red">•</span> Statistics</h1>
          <p className="text-muted text-sm mt-1">Falanqaynta xogta dhacdooyinka dabka</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50">
          <Download className="w-4 h-4" /> CSV Soo Deji
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Wadarta Dhacdooyinka', value: incidents.length, color: '#CC0000' },
          { label: 'Dhimashooyinka', value: totalDeaths, color: '#1A1A2E' },
          { label: 'Dhaawacyada', value: totalInjuries, color: '#D97706' },
          { label: 'Khasaaraha Guud', value: formatCurrency(totalDamage), color: '#1B4FBE' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 text-center stat-card">
            <p className="text-[10px] text-muted uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-extrabold mt-2" style={{ color: s.color }}>{typeof s.value === 'number' ? formatNumber(s.value) : s.value}</p>
          </div>
        ))}
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resourceCards.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 stat-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: r.color }}>
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wider">{r.label}</p>
              <p className="text-lg font-bold text-text-dark">{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-text-dark mb-1">Dhacdooyinka Bishiiba</h3>
          <p className="text-xs text-muted mb-4">Incidents by Month</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" name="Dhacdooyinka" fill="#CC0000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-text-dark mb-1">Shan Degmadood ee Ugu Badan</h3>
          <p className="text-xs text-muted mb-4">Top 5 Districts</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districtData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" name="Dhacdooyinka" radius={[0, 6, 6, 0]}>
                {districtData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-text-dark mb-1">Sababaha Dabka</h3>
          <p className="text-xs text-muted mb-4">Cause of Fire Breakdown</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={causeData} cx="50%" cy="50%" outerRadius={100} innerRadius={45} paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}>
                {causeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-text-dark mb-1">Celceliska Waqtiga Jawaabta</h3>
          <p className="text-xs text-muted mb-4">Average Response Time by District (min)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgResponseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="avg" name="Daqiiqo" fill="#1B4FBE" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
