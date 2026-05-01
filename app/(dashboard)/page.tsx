'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatDate, formatNumber, parseCasualties } from '@/lib/utils';
import {
  Flame, Skull, HeartPulse, DollarSign,
  TrendingUp, ArrowRight, Clock, Users, Truck, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CHART_COLORS = ['#CC0000', '#1B4FBE', '#D97706', '#16A34A', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('taariikhda', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalIncidents = incidents.length;
  const totalDeaths = incidents.reduce((sum, inc) => sum + parseCasualties(inc.khasaaraha_nafeed).deaths, 0);
  const totalInjuries = incidents.reduce((sum, inc) => sum + parseCasualties(inc.khasaaraha_nafeed).injuries, 0);
  const totalDamage = incidents.reduce((sum, inc) => sum + (Number(inc.khasaaraha_hantida) || 0), 0);

  // District chart data
  const districtData = incidents.reduce((acc, inc) => {
    const district = inc.degmada.split(',')[0].trim();
    const existing = acc.find((d) => d.name === district);
    if (existing) existing.count += 1;
    else acc.push({ name: district, count: 1 });
    return acc;
  }, [] as { name: string; count: number }[]).sort((a, b) => b.count - a.count);

  // Type chart data
  const typeData = incidents.reduce((acc, inc) => {
    const existing = acc.find((d) => d.name === inc.nooca_hantida);
    if (existing) existing.value += 1;
    else acc.push({ name: inc.nooca_hantida, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Response time data
  const responseData = incidents
    .filter(inc => inc.waqtiga_jawaabta)
    .map(inc => ({
      name: inc.lambarka_warbixinta,
      time: inc.waqtiga_jawaabta,
    }))
    .reverse();

  // Firefighters data
  const firefighterData = incidents.map(inc => ({
    name: inc.lambarka_warbixinta,
    firefighters: inc.tirada_dabdamiyasha,
    trucks: inc.tirada_gaadiidka,
  })).reverse();

  const recentIncidents = incidents.slice(0, 5);

  const stats = [
    {
      title: 'Wadarta Dhacdooyinka',
      subtitle: 'Total Incidents',
      value: totalIncidents,
      icon: Flame,
      gradient: 'linear-gradient(135deg, #CC0000, #FF4444)',
      bgLight: '#FEE2E2',
    },
    {
      title: 'Dhimashooyinka',
      subtitle: 'Total Deaths',
      value: totalDeaths,
      icon: Skull,
      gradient: 'linear-gradient(135deg, #1A1A2E, #374151)',
      bgLight: '#F3F4F6',
    },
    {
      title: 'Dhaawacyada',
      subtitle: 'Total Injuries',
      value: totalInjuries,
      icon: HeartPulse,
      gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
      bgLight: '#FEF3C7',
    },
    {
      title: 'Khasaaraha Hantida',
      subtitle: 'Property Damage',
      value: formatCurrency(totalDamage),
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #1B4FBE, #3B82F6)',
      bgLight: '#DBEAFE',
    },
  ];

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      furan: 'badge-furan',
      baaraandegaynaya: 'badge-baaraandegaynaya',
      xidhan: 'badge-xidhan',
    };
    const labels: Record<string, string> = {
      furan: 'Furan',
      baaraandegaynaya: 'Baaraandegaynaya',
      xidhan: 'Xidhan',
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${classes[status] || 'badge-xidhan'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark">
            Dashboard <span className="text-fire-red">•</span> Guriga
          </h1>
          <p className="text-muted text-sm mt-1">
            Dulmar guud oo ku saabsan dhacdooyinka dabka ee Gobolka Banadir
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted bg-white px-4 py-2 rounded-xl border border-border">
          <Clock className="w-4 h-4" />
          Cusbooneysiintii ugu dambeysay: {formatDate(new Date().toISOString())}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="stat-card bg-white rounded-2xl p-5 animate-fade-in relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-[10px] text-muted/60 mt-0.5">{stat.subtitle}</p>
                <p className="text-2xl md:text-3xl font-extrabold mt-3 text-text-dark">
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: stat.gradient }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: stat.gradient }} />
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents by District */}
        <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-text-dark mb-1">Dhacdooyinka Degmadaha</h3>
          <p className="text-xs text-muted mb-4">Incidents by District</p>
          <div className="h-[300px] w-full flex items-center justify-center">
            {districtData.length === 0 ? (
              <p className="text-gray-400 font-medium">Xog ma jirto</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" name="Dhacdooyinka" radius={[0, 6, 6, 0]}>
                    {districtData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Incidents by Type */}
        <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-bold text-text-dark mb-1">Nooca Dhacdooyinka</h3>
          <p className="text-xs text-muted mb-4">Incidents by Property Type</p>
          <div className="h-[300px] w-full flex items-center justify-center">
            {typeData.length === 0 ? (
              <p className="text-gray-400 font-medium">Xog ma jirto</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={true}
                  >
                    {typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time */}
        <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-bold text-text-dark mb-1">Waqtiga Jawaabta</h3>
          <p className="text-xs text-muted mb-4">Response Time Trend (minutes)</p>
          <div className="h-[280px] w-full flex items-center justify-center">
            {responseData.length === 0 ? (
              <p className="text-gray-400 font-medium">Xog ma jirto</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line
                    type="monotone"
                    dataKey="time"
                    name="Daqiiqo"
                    stroke="#CC0000"
                    strokeWidth={3}
                    dot={{ fill: '#CC0000', r: 5 }}
                    activeDot={{ r: 7, stroke: '#CC0000', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Firefighters & Trucks */}
        <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="font-bold text-text-dark mb-1">Ilaha La Adeegsaday</h3>
          <p className="text-xs text-muted mb-4">Resources Deployed per Incident</p>
          <div className="h-[280px] w-full flex items-center justify-center">
            {firefighterData.length === 0 ? (
              <p className="text-gray-400 font-medium">Xog ma jirto</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={firefighterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="firefighters" name="Dabdamiyasha" fill="#CC0000" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="trucks" name="Gaadiidka" fill="#1B4FBE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div>
            <h3 className="font-bold text-text-dark">Dhacdooyinkii Ugu Dambeeyay</h3>
            <p className="text-xs text-muted mt-0.5">Recent Incidents</p>
          </div>
          <Link
            href="/dhacdooyinka"
            className="flex items-center gap-1 text-sm font-semibold text-fire-red hover:text-fire-red-dark transition-colors"
          >
            Dhammaan Arag
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Lambarka</th>
                <th className="text-left">Taariikhda</th>
                <th className="text-left">Degmada</th>
                <th className="text-left">Nooca</th>
                <th className="text-left">Sababta</th>
                <th className="text-right">Khasaaraha ($)</th>
                <th className="text-center">Xaaladda</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map((inc) => (
                <tr key={inc.id} className="cursor-pointer hover:bg-gray-50/50">
                  <td>
                    <Link href={`/dhacdooyinka/${inc.id}`} className="font-semibold text-official-blue hover:underline">
                      {inc.lambarka_warbixinta}
                    </Link>
                  </td>
                  <td className="text-muted text-xs">{formatDate(inc.taariikhda)}</td>
                  <td className="font-medium">{inc.degmada.split(',')[0]}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">
                      {inc.nooca_hantida}
                    </span>
                  </td>
                  <td className="text-sm">{inc.sababta_dabka}</td>
                  <td className="text-right font-semibold">{formatCurrency(Number(inc.khasaaraha_hantida))}</td>
                  <td className="text-center">{getStatusBadge(inc.xaaladda)}</td>
                </tr>
              ))}
              {recentIncidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted/40" />
                    Ma jiraan dhacdooyin la diiwaangeliyay
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
