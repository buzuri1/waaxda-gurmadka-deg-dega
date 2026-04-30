'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { formatCurrency, formatDate, DISTRICTS, PROPERTY_TYPES, FIRE_CAUSES, STATUS_OPTIONS } from '@/lib/utils';
import { Plus, Search, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const perPage = 10;

  const [form, setForm] = useState({
    lambarka_warbixinta: '', taariikhda: '', degmada: '', nooca_hantida: '',
    sababta_dabka: '', magaca_milkiilaha: '', telefoon: '', khasaaraha_nafeed: '',
    khasaaraha_hantida: '', tirada_dabdamiyasha: '', tirada_gaadiidka: '',
    waqtiga_jawaabta: '', muddada_hawlgalka: '', biyaha_la_isticmaalay: '',
    foam_la_isticmaalay: '', taliyaha_hawlgalka: '', sharaxaadda: '', xaaladda: 'furan',
  });

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('incidents').select('*').order('taariikhda', { ascending: false });
    setIncidents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const filtered = incidents.filter(inc => {
    const q = search.toLowerCase();
    const matchSearch = !q || inc.lambarka_warbixinta.toLowerCase().includes(q) ||
      inc.degmada.toLowerCase().includes(q) || inc.magaca_milkiilaha.toLowerCase().includes(q);
    const matchDistrict = !filterDistrict || inc.degmada.includes(filterDistrict);
    const matchType = !filterType || inc.nooca_hantida === filterType;
    const matchStatus = !filterStatus || inc.xaaladda === filterStatus;
    return matchSearch && matchDistrict && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openAddModal = () => {
    setEditingIncident(null);
    setForm({ lambarka_warbixinta: '', taariikhda: '', degmada: '', nooca_hantida: '', sababta_dabka: '', magaca_milkiilaha: '', telefoon: '', khasaaraha_nafeed: '', khasaaraha_hantida: '', tirada_dabdamiyasha: '', tirada_gaadiidka: '', waqtiga_jawaabta: '', muddada_hawlgalka: '', biyaha_la_isticmaalay: '', foam_la_isticmaalay: '', taliyaha_hawlgalka: '', sharaxaadda: '', xaaladda: 'furan' });
    setShowModal(true);
  };

  const openEditModal = (inc: Incident) => {
    setEditingIncident(inc);
    setForm({
      lambarka_warbixinta: inc.lambarka_warbixinta, taariikhda: inc.taariikhda?.slice(0, 16) || '',
      degmada: inc.degmada, nooca_hantida: inc.nooca_hantida, sababta_dabka: inc.sababta_dabka,
      magaca_milkiilaha: inc.magaca_milkiilaha, telefoon: inc.telefoon || '',
      khasaaraha_nafeed: inc.khasaaraha_nafeed || '', khasaaraha_hantida: String(inc.khasaaraha_hantida || ''),
      tirada_dabdamiyasha: String(inc.tirada_dabdamiyasha || ''), tirada_gaadiidka: String(inc.tirada_gaadiidka || ''),
      waqtiga_jawaabta: String(inc.waqtiga_jawaabta || ''), muddada_hawlgalka: String(inc.muddada_hawlgalka || ''),
      biyaha_la_isticmaalay: String(inc.biyaha_la_isticmaalay || ''), foam_la_isticmaalay: String(inc.foam_la_isticmaalay || ''),
      taliyaha_hawlgalka: inc.taliyaha_hawlgalka || '', sharaxaadda: inc.sharaxaadda || '', xaaladda: inc.xaaladda,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      khasaaraha_hantida: parseFloat(form.khasaaraha_hantida) || 0,
      tirada_dabdamiyasha: parseInt(form.tirada_dabdamiyasha) || 0,
      tirada_gaadiidka: parseInt(form.tirada_gaadiidka) || 0,
      waqtiga_jawaabta: parseInt(form.waqtiga_jawaabta) || 0,
      muddada_hawlgalka: parseInt(form.muddada_hawlgalka) || 0,
      biyaha_la_isticmaalay: parseFloat(form.biyaha_la_isticmaalay) || 0,
      foam_la_isticmaalay: parseFloat(form.foam_la_isticmaalay) || 0,
      updated_at: new Date().toISOString(),
    };
    if (editingIncident) {
      await supabase.from('incidents').update(payload).eq('id', editingIncident.id);
    } else {
      await supabase.from('incidents').insert(payload);
    }
    setSaving(false);
    setShowModal(false);
    fetchIncidents();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('incidents').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchIncidents();
  };

  const getStatusBadge = (status: string) => {
    const cls: Record<string, string> = { furan: 'badge-furan', baaraandegaynaya: 'badge-baaraandegaynaya', xidhan: 'badge-xidhan' };
    const labels: Record<string, string> = { furan: 'Furan', baaraandegaynaya: 'Baaraandegaynaya', xidhan: 'Xidhan' };
    return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cls[status] || ''}`}>{labels[status] || status}</span>;
  };

  const formFields = [
    { key: 'lambarka_warbixinta', label: 'Lambarka Warbixinta *', type: 'text', required: true },
    { key: 'taariikhda', label: 'Taariikhda iyo Waqtiga *', type: 'datetime-local', required: true },
    { key: 'degmada', label: 'Degmada / Goobta *', type: 'text', required: true },
    { key: 'nooca_hantida', label: 'Nooca Hantida *', type: 'select', options: PROPERTY_TYPES, required: true },
    { key: 'sababta_dabka', label: 'Sababta Dabka *', type: 'select', options: FIRE_CAUSES, required: true },
    { key: 'magaca_milkiilaha', label: 'Magaca Milkiilaha *', type: 'text', required: true },
    { key: 'telefoon', label: 'Telefoonka', type: 'text' },
    { key: 'khasaaraha_nafeed', label: 'Khasaaraha Nafeed', type: 'text', placeholder: '0 dhimasho / 0 dhaawac' },
    { key: 'khasaaraha_hantida', label: 'Khasaaraha Hantida ($)', type: 'number' },
    { key: 'tirada_dabdamiyasha', label: 'Tirada Dabdamiyasha', type: 'number' },
    { key: 'tirada_gaadiidka', label: 'Tirada Gaadiidka', type: 'number' },
    { key: 'waqtiga_jawaabta', label: 'Waqtiga Jawaabta (daqiiqo)', type: 'number' },
    { key: 'muddada_hawlgalka', label: 'Muddada Hawlgalka (daqiiqo)', type: 'number' },
    { key: 'biyaha_la_isticmaalay', label: 'Biyaha La Isticmaalay (Litir)', type: 'number' },
    { key: 'foam_la_isticmaalay', label: 'Foam-ka La Isticmaalay (Litir)', type: 'number' },
    { key: 'taliyaha_hawlgalka', label: 'Taliyaha Hawlgalka', type: 'text' },
    { key: 'xaaladda', label: 'Xaaladda', type: 'select', options: ['furan', 'baaraandegaynaya', 'xidhan'] },
    { key: 'sharaxaadda', label: 'Sharaxaadda Dhacdada', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark">Dhacdooyinka <span className="text-fire-red">•</span> Incidents</h1>
          <p className="text-muted text-sm mt-1">Liiska dhammaan dhacdooyinka dabka</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #CC0000, #990000)' }}>
          <Plus className="w-5 h-5" /> Dhacdada Cusub Ku Dar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Raadi dhacdada..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm" />
          </div>
          <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl border border-border text-sm bg-white">
            <option value="">Dhammaan Degmadaha</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl border border-border text-sm bg-white">
            <option value="">Dhammaan Noocyada</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-xl border border-border text-sm bg-white">
            <option value="">Dhammaan Xaaladaha</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Lambarka</th>
                <th className="text-left">Taariikhda</th>
                <th className="text-left">Degmada</th>
                <th className="text-left">Nooca</th>
                <th className="text-left">Sababta</th>
                <th className="text-left">Milkiilaha</th>
                <th className="text-right">Khasaaraha ($)</th>
                <th className="text-center">Xaaladda</th>
                <th className="text-center">Ficilada</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={9}><div className="skeleton h-8 rounded-lg" /></td></tr>
              )) : paginated.map(inc => (
                <tr key={inc.id}>
                  <td><span className="font-semibold text-official-blue">{inc.lambarka_warbixinta}</span></td>
                  <td className="text-xs text-muted">{formatDate(inc.taariikhda)}</td>
                  <td className="font-medium text-sm">{inc.degmada.split(',')[0]}</td>
                  <td><span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs">{inc.nooca_hantida}</span></td>
                  <td className="text-sm">{inc.sababta_dabka}</td>
                  <td className="text-sm">{inc.magaca_milkiilaha}</td>
                  <td className="text-right font-semibold">{formatCurrency(Number(inc.khasaaraha_hantida))}</td>
                  <td className="text-center">{getStatusBadge(inc.xaaladda)}</td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/dhacdooyinka/${inc.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-official-blue transition-colors" title="Arag"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => openEditModal(inc)} className="p-1.5 rounded-lg hover:bg-amber-50 text-warning transition-colors" title="Wax ka beddel"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(inc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-danger transition-colors" title="Tirtir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-muted">Ma jiraan dhacdooyin la helay</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted">{filtered.length} dhacdadood — Bog {page}/{totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-border hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">Ma hubtaa?</h3>
            <p className="text-sm text-muted mb-6">Ma hubtaa inaad tirtiraysaa dhacdadan? Ficilkan dib looma celinayo.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50">Maya</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-red-700">Haa, Tirtir</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-bold text-lg">{editingIncident ? 'Wax Ka Beddel Dhacdada' : 'Dhacdada Cusub Ku Dar'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(f => (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-muted mb-1.5">{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required} className="w-full px-3 py-2.5 rounded-xl border border-border text-sm bg-white">
                        <option value="">Dooro...</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border text-sm resize-none" />
                    ) : (
                      <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required} placeholder={f.placeholder || ''} className="w-full px-3 py-2.5 rounded-xl border border-border text-sm" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50">Jooji</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #CC0000, #990000)' }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Waa la keydinayaa...</> : editingIncident ? 'Cusboonaysii' : 'Keydi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
