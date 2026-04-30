'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/lib/supabase';
import { DISTRICTS, PROPERTY_TYPES, FIRE_CAUSES, STATUS_OPTIONS } from '@/lib/utils';
import { Plus, Search, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight, Filter, Loader2, ClipboardList, Calendar } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const perPage = 10;
  
  const router = useRouter();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      // Remove the query param so it doesn't trigger again on refresh
      router.replace('/dhacdooyinka', { scroll: false });
    }
  }, [searchParams, router]);

  const filtered = incidents.filter(inc => {
    const q = search.toLowerCase();
    const matchSearch = !q || inc.lambarka_warbixinta.toLowerCase().includes(q) ||
      inc.degmada.toLowerCase().includes(q) || inc.magaca_milkiilaha.toLowerCase().includes(q) ||
      inc.sababta_dabka.toLowerCase().includes(q);
    const matchDistrict = !filterDistrict || inc.degmada.includes(filterDistrict);
    const matchType = !filterType || inc.nooca_hantida === filterType;
    const matchStatus = !filterStatus || inc.xaaladda === filterStatus;
    const matchDate = !filterDate || inc.taariikhda.startsWith(filterDate);
    return matchSearch && matchDistrict && matchType && matchStatus && matchDate;
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
    if (status === 'furan') {
      return <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#CC0000] tracking-wider">DEGDEG</span>;
    }
    if (status === 'baaraandegaynaya') {
      return <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] tracking-wider">SOCDA</span>;
    }
    return <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] tracking-wider">XIDHAN</span>;
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <ClipboardList className="w-6 h-6 text-[#CC0000]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dhacdooyinka Dabka</h1>
            <p className="text-gray-500 text-sm mt-0.5">Maamulka iyo la socodka dhammaan dhacdooyinka ka diiwaangashan gobolka Banaadir.</p>
          </div>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] transition-colors">
          <Plus className="w-5 h-5" /> Dhacdada Cusub Ku Dar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            placeholder="Raadi dhacdada..." 
            className="w-full bg-gray-50 pl-10 pr-4 py-2.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none">
            <option value="">Dhammaan Degmooyinka</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none">
            <option value="">Nooca Dabka</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none">
            <option value="">Xaaladda</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <div className="relative">
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none appearance-none" 
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button 
            onClick={() => {
              setSearch(''); setFilterDistrict(''); setFilterType(''); setFilterStatus(''); setFilterDate(''); setPage(1);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors active:scale-95"
          >
            <Filter className="w-4 h-4" />
            {search || filterDistrict || filterType || filterStatus || filterDate ? 'Masax' : 'Sifee'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100/50 border-b border-gray-200">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">LAMBARKA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">DEGMADA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">NOOCA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">SABABTA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">KHASAARAHA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">XAALADDA</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">FICILADA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="w-full h-8 bg-gray-100 animate-pulse rounded-md" /></td></tr>
              )) : paginated.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4"><span className="font-bold text-[#CC0000] text-sm">{inc.lambarka_warbixinta}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{inc.degmada.split(',')[0]}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inc.nooca_hantida}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inc.sababta_dabka}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inc.khasaaraha_nafeed || 'Lama oga'}</td>
                  <td className="px-6 py-4">{getStatusBadge(inc.xaaladda)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/dhacdooyinka/${inc.id}`} className="text-gray-400 hover:text-gray-600"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => openEditModal(inc)} className="text-blue-400 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(inc.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-500 text-sm">Ma jiraan dhacdooyin la helay</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <p className="text-xs text-gray-500 font-medium">Waxaa muuqda {paginated.length} ka mid ah {filtered.length} dhacdo</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
                  page === i + 1 ? 'bg-[#CC0000] text-white border border-[#CC0000]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">Ma hubtaa?</h3>
            <p className="text-sm text-gray-500 mb-6">Ma hubtaa inaad tirtiraysaa dhacdadan? Ficilkan dib looma celinayo.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50">Maya</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 rounded-md bg-[#CC0000] text-white text-sm font-bold hover:bg-[#B30000]">Haa, Tirtir</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 overflow-y-auto py-8" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editingIncident ? 'Wax Ka Beddel Dhacdada' : 'Dhacdada Cusub Ku Dar'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(f => (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required} className="w-full px-3 py-2.5 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-gray-300">
                        <option value="">Dooro...</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-gray-300 resize-none" />
                    ) : (
                      <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} required={f.required} placeholder={f.placeholder || ''} className="w-full px-3 py-2.5 rounded-md border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50">Jooji</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-md bg-[#CC0000] hover:bg-[#B30000] text-white text-sm font-bold flex items-center justify-center gap-2">
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
