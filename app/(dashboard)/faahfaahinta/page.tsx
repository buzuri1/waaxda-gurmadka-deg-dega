'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatNumber, parseCasualties } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart3, Droplets, Users, Truck, TrendingUp, Download, FileText, Calendar, X } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#CC0000', '#1B4FBE', '#D97706', '#16A34A', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function StatisticsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('incidents').select('*').order('taariikhda', { ascending: true });
      setIncidents(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-60 rounded-2xl" />)}</div>;

  // Filter incidents by date range
  const getFilteredIncidents = () => {
    return incidents.filter(inc => {
      const incDate = inc.taariikhda.split('T')[0];
      if (dateFrom && incDate < dateFrom) return false;
      if (dateTo && incDate > dateTo) return false;
      return true;
    });
  };

  const filteredIncidents = getFilteredIncidents();
  const hasDateFilter = dateFrom || dateTo;

  // Monthly data
  const monthlyData = filteredIncidents.reduce((acc, inc) => {
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
  const districtData = filteredIncidents.reduce((acc, inc) => {
    const d = inc.degmada.split(',')[0].trim();
    const existing = acc.find(x => x.name === d);
    if (existing) existing.count += 1;
    else acc.push({ name: d, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count).slice(0, 5);

  // Cause data
  const causeData = filteredIncidents.reduce((acc, inc) => {
    const existing = acc.find(x => x.name === inc.sababta_dabka);
    if (existing) existing.value += 1;
    else acc.push({ name: inc.sababta_dabka, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Avg response time by district
  const avgResponseData = Object.values(filteredIncidents.reduce((acc, inc) => {
    const d = inc.degmada.split(',')[0].trim();
    if (!acc[d]) acc[d] = { name: d, total: 0, count: 0 };
    acc[d].total += inc.waqtiga_jawaabta || 0;
    acc[d].count += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; count: number }>)).map(d => ({
    name: d.name, avg: Math.round(d.total / d.count)
  }));

  // Resource totals
  const totalWater = filteredIncidents.reduce((s, i) => s + (Number(i.biyaha_la_isticmaalay) || 0), 0);
  const totalFoam = filteredIncidents.reduce((s, i) => s + (Number(i.foam_la_isticmaalay) || 0), 0);
  const totalFirefighters = filteredIncidents.reduce((s, i) => s + (i.tirada_dabdamiyasha || 0), 0);
  const totalTrucks = filteredIncidents.reduce((s, i) => s + (i.tirada_gaadiidka || 0), 0);
  const totalDamage = filteredIncidents.reduce((s, i) => s + (Number(i.khasaaraha_hantida) || 0), 0);
  const totalDeaths = filteredIncidents.reduce((s, i) => s + parseCasualties(i.khasaaraha_nafeed).deaths, 0);
  const totalInjuries = filteredIncidents.reduce((s, i) => s + parseCasualties(i.khasaaraha_nafeed).injuries, 0);

  // Build date range label for export filenames and headers
  const getDateRangeLabel = () => {
    if (dateFrom && dateTo) return `${dateFrom}_ilaa_${dateTo}`;
    if (dateFrom) return `laga_bilaabo_${dateFrom}`;
    if (dateTo) return `ilaa_${dateTo}`;
    return new Date().toISOString().split('T')[0];
  };

  const getDateRangeText = () => {
    if (dateFrom && dateTo) return `${dateFrom} ilaa ${dateTo}`;
    if (dateFrom) return `Laga bilaabo ${dateFrom}`;
    if (dateTo) return `Ilaa ${dateTo}`;
    return new Date().toLocaleDateString();
  };

  const exportCSV = () => {
    const dataToExport = filteredIncidents;
    const headers = ['Lambarka', 'Taariikhda', 'Degmada', 'Nooca', 'Sababta', 'Milkiilaha', 'Khasaaraha ($)', 'Dabdamiyasha', 'Gaadiidka', 'Xaaladda'];
    
    // Helper to safely wrap fields in quotes to prevent comma splitting issues
    const escapeCsv = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
    
    const rows = dataToExport.map(i => [
      escapeCsv(i.lambarka_warbixinta),
      escapeCsv(new Date(i.taariikhda).toLocaleDateString()),
      escapeCsv(i.degmada),
      escapeCsv(i.nooca_hantida),
      escapeCsv(i.sababta_dabka),
      escapeCsv(i.magaca_milkiilaha),
      escapeCsv(i.khasaaraha_hantida),
      escapeCsv(i.tirada_dabdamiyasha),
      escapeCsv(i.tirada_gaadiidka),
      escapeCsv(i.xaaladda)
    ].join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `dhacdooyinka-banadir-${getDateRangeLabel()}.csv`; 
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const dataToExport = filteredIncidents;
    const doc = new jsPDF('landscape');
    
    // Add Title
    doc.setFontSize(20);
    doc.setTextColor('#CC0000');
    doc.text('Gurmadka Deg Dega ee Gobolka Banadir', 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor('#1B4FBE');
    doc.text(`Warbixinta Dhacdooyinka - Taariikhda: ${getDateRangeText()}`, 14, 28);
    
    doc.setFontSize(10);
    doc.setTextColor('#000000');
    doc.text(`Wadarta Dhacdooyinka: ${dataToExport.length} | Khasaaraha Guud: $${totalDamage.toLocaleString()}`, 14, 34);

    const tableColumn = ["Lambarka", "Taariikhda", "Degmada", "Nooca Hantida", "Sababta", "Khasaaraha ($)", "Shaqaalaha", "Xaaladda"];
    const tableRows: any[] = [];

    dataToExport.forEach(i => {
      const rowData = [
        i.lambarka_warbixinta,
        new Date(i.taariikhda).toLocaleDateString(),
        i.degmada,
        i.nooca_hantida,
        i.sababta_dabka,
        `$${Number(i.khasaaraha_hantida || 0).toLocaleString()}`,
        `${i.tirada_dabdamiyasha} Nin / ${i.tirada_gaadiidka} Gaari`,
        i.xaaladda
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [204, 0, 0] },
      styles: { fontSize: 8 },
    });

    doc.save(`dhacdooyinka-banadir-${getDateRangeLabel()}.pdf`);
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
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
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Picker */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(o => !o)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm ${
                hasDateFilter
                  ? 'border-[#1B4FBE] text-[#1B4FBE] bg-blue-50 hover:bg-blue-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {hasDateFilter ? (
                <span className="hidden sm:inline">
                  {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : dateFrom ? `Laga: ${dateFrom}` : `Ilaa: ${dateTo}`}
                </span>
              ) : (
                <span className="hidden sm:inline">Dooro Taariikh</span>
              )}
              {hasDateFilter && (
                <span className="w-2 h-2 bg-[#1B4FBE] rounded-full animate-pulse" />
              )}
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[200] overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#CC0000]" />
                    <span className="font-bold text-sm text-gray-900">Dooro Muddada</span>
                  </div>
                  <button onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Laga Bilaabo (From)</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#1B4FBE] focus:ring-2 focus:ring-[#1B4FBE]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Ilaa (To)</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#1B4FBE] focus:ring-2 focus:ring-[#1B4FBE]/10 transition-all"
                    />
                  </div>
                  {hasDateFilter && (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-gray-500">
                        <span className="font-bold text-[#1B4FBE]">{filteredIncidents.length}</span> dhacdooyin la helay
                      </p>
                      <button
                        onClick={clearDateFilter}
                        className="text-xs font-bold text-[#CC0000] hover:text-[#B30000] transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Masax
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4 text-green-600" /> CSV Download
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CC0000] text-sm font-bold text-white bg-[#CC0000] hover:bg-[#B30000] transition-all shadow-sm">
            <FileText className="w-4 h-4" /> PDF Download
          </button>
        </div>
      </div>

      {/* Active date filter indicator */}
      {hasDateFilter && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm animate-fade-in">
          <Calendar className="w-4 h-4 text-[#1B4FBE]" />
          <span className="text-gray-700">
            Xogta waxaa lagu sifaynayaa: <span className="font-bold text-[#1B4FBE]">{getDateRangeText()}</span>
          </span>
          <span className="text-gray-400 mx-1">•</span>
          <span className="font-bold text-gray-700">{filteredIncidents.length} dhacdooyin</span>
          <button
            onClick={clearDateFilter}
            className="ml-auto text-xs font-bold text-[#CC0000] hover:text-[#B30000] flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Masax Sifaynta
          </button>
        </div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Wadarta Dhacdooyinka', value: filteredIncidents.length, color: '#CC0000' },
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
