'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Pencil, Trash2, X, Loader2, RefreshCw } from 'lucide-react';

type ShiftGroup = {
  id: number;
  magaca: string;
  sharax: string;
  waqtiga_bilowga: string;
  waqtiga_dhammaadka: string;
  is_active: boolean;
  shaqalaha?: Employee[];
};

type Employee = {
  id: number;
  magaca_buuxa: string;
  lambarka_shaqaale: string;
  xirfadda: string;
  telefoon: string;
  iimaylka: string;
  koox_id: number;
  xaaladda: string;
  shift_groups?: ShiftGroup;
};

const XIRFADAHA = ['Taliyaha', 'Dabdamiye', 'Wadaha Gaari', 'Kaaliyaha Gurmadka', 'Xog-hayaha', 'Kale'];
const XAALADAHA = ['firfircoon', 'nasanaya', 'muddo-dheer'];

const statusBadge = (s: string) => {
  if (s === 'firfircoon') return <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800">🟢 Firfircoon</span>;
  if (s === 'nasanaya') return <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">🟡 Nasanaya</span>;
  return <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">🔴 Muddo-dheer</span>;
};

const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function ShaqalahPage() {
  const [groups, setGroups] = useState<ShiftGroup[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [changingShift, setChangingShift] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState({
    magaca_buuxa: '', lambarka_shaqaale: '', xirfadda: '', telefoon: '',
    iimaylka: '', koox_id: '', xaaladda: 'firfircoon',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [gRes, eRes] = await Promise.all([
      fetch('/api/shift-groups'),
      fetch('/api/shaqalaha'),
    ]);
    const gData = await gRes.json();
    const eData = await eRes.json();
    setGroups(Array.isArray(gData) ? gData : []);
    setEmployees(Array.isArray(eData) ? eData : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activeGroup = groups.find(g => g.is_active);

  const openAdd = () => {
    setEditEmp(null);
    setForm({ magaca_buuxa: '', lambarka_shaqaale: `EMP-${String(employees.length + 1).padStart(3, '0')}`, xirfadda: '', telefoon: '', iimaylka: '', koox_id: '', xaaladda: 'firfircoon' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditEmp(emp);
    setForm({
      magaca_buuxa: emp.magaca_buuxa, lambarka_shaqaale: emp.lambarka_shaqaale,
      xirfadda: emp.xirfadda, telefoon: emp.telefoon || '', iimaylka: emp.iimaylka || '',
      koox_id: String(emp.koox_id), xaaladda: emp.xaaladda,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, koox_id: parseInt(form.koox_id) };
      const url = editEmp ? '/api/shaqalaha' : '/api/shaqalaha';
      const method = editEmp ? 'PUT' : 'POST';
      const body = editEmp ? { ...payload, id: editEmp.id } : payload;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      showToast('✅ Shaqaalaha si guul leh ayaa loo keydsaday!');
      setShowModal(false);
      fetchAll();
    } catch {
      showToast('❌ Khalad ayaa dhacay. Markale isku day.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/shaqalaha?id=${id}`, { method: 'DELETE' });
    if (res.ok) { showToast('✅ Shaqaalaha la tirtiray.'); fetchAll(); }
    else showToast('❌ Khalad ayaa dhacay.', 'error');
    setDeleteConfirm(null);
  };

  const handleStatusChange = async (emp: Employee, newStatus: string) => {
    await fetch('/api/shaqalaha', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: emp.id, xaaladda: newStatus }),
    });
    fetchAll();
  };

  const handleShiftChange = async () => {
    if (!selectedGroupId) return;
    setChangingShift(true);
    await fetch('/api/shift-groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeGroupId: selectedGroupId }),
    });
    showToast('✅ Kooxda hawlgalka waa la bedelay!');
    setChangingShift(false);
    setShowShiftModal(false);
    fetchAll();
  };

  const filtered = filterStatus ? employees.filter(e => e.xaaladda === filterStatus) : employees;
  const counts = {
    firfircoon: employees.filter(e => e.xaaladda === 'firfircoon').length,
    nasanaya: employees.filter(e => e.xaaladda === 'nasanaya').length,
    'muddo-dheer': employees.filter(e => e.xaaladda === 'muddo-dheer').length,
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[300] px-5 py-3 rounded-lg shadow-lg text-sm font-bold text-white transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <Users className="w-6 h-6 text-[#CC0000]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xogta Shaqalaha</h1>
            <p className="text-gray-500 text-sm mt-0.5">Maaraynta shaqaalaha kooxaha gurmadka deg dega</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] transition-colors">
          <Plus className="w-5 h-5" /> Shaqaale Cusub Ku Dar
        </button>
      </div>

      {/* Active Shift Banner */}
      {activeGroup && (
        <div className="bg-[#CC0000] rounded-lg p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-1">🟢 KOOXDA HADDA SHAQAYNAYSA</p>
            <p className="text-2xl font-extrabold">KOOX {activeGroup.magaca} — {activeGroup.sharax}</p>
            <p className="text-red-100 text-sm mt-1">
              {activeGroup.waqtiga_bilowga} - {activeGroup.waqtiga_dhammaadka} · {employees.filter(e => e.koox_id === activeGroup.id && e.xaaladda === 'firfircoon').length} shaqaale firfircoon
            </p>
          </div>
          <button onClick={() => { setSelectedGroupId(activeGroup.id); setShowShiftModal(true); }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Beddel Kooxda
          </button>
        </div>
      )}

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 h-48 animate-pulse" />
        )) : groups.map((group) => {
          const groupEmps = employees.filter(e => e.koox_id === group.id);
          return (
            <div key={group.id} className={`bg-white border rounded-lg overflow-hidden ${group.is_active ? 'border-[#CC0000] border-l-4' : 'border-gray-200'}`}>
              <div className={`px-5 py-4 border-b ${group.is_active ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-500">
                      {group.is_active ? '🟢' : '⚫'} KOOX {group.magaca}
                    </span>
                    <p className="font-bold text-gray-900">{group.sharax}</p>
                    <p className="text-xs text-gray-500">{group.waqtiga_bilowga} - {group.waqtiga_dhammaadka}</p>
                  </div>
                  <span className="text-2xl font-black text-gray-300">{groupEmps.length}</span>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                {groupEmps.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Shaqaale ma jiro</p>
                ) : groupEmps.slice(0, 5).map(emp => (
                  <div key={emp.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#CC0000] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {initials(emp.magaca_buuxa)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{emp.magaca_buuxa}</p>
                      <p className="text-[10px] text-gray-500">{emp.xirfadda}</p>
                    </div>
                    {statusBadge(emp.xaaladda)}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100">
                <button onClick={() => { setForm(f => ({ ...f, koox_id: String(group.id) })); openAdd(); }}
                  className="w-full text-xs font-bold text-[#CC0000] hover:text-[#B30000] text-center">
                  + Shaqaale Ku Dar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {(['', 'firfircoon', 'nasanaya', 'muddo-dheer'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-md text-sm font-bold border transition-colors ${filterStatus === s
              ? s === '' ? 'bg-gray-900 text-white border-gray-900'
                : s === 'firfircoon' ? 'bg-green-600 text-white border-green-600'
                  : s === 'nasanaya' ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            {s === '' ? `Dhammaan (${employees.length})` : s === 'firfircoon' ? `🟢 Firfircoon (${counts.firfircoon})` : s === 'nasanaya' ? `🟡 Nasanaya (${counts.nasanaya})` : `🔴 Muddo-dheer (${counts['muddo-dheer']})`}
          </button>
        ))}
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['LAMBARKA', 'MAGACA', 'XIRFADDA', 'KOOXDA', 'TELEFOON', 'XAALADDA', 'FICILADA'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-6 bg-gray-100 animate-pulse rounded" /></td></tr>
              )) : filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-[#CC0000]">{emp.lambarka_shaqaale}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1B4FBE] flex items-center justify-center text-white text-[10px] font-bold shrink-0">{initials(emp.magaca_buuxa)}</div>
                      <span className="text-sm font-medium text-gray-900">{emp.magaca_buuxa}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{emp.xirfadda}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded">KOOX {groups.find(g => g.id === emp.koox_id)?.magaca || '?'}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{emp.telefoon || '—'}</td>
                  <td className="px-5 py-3">{statusBadge(emp.xaaladda)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(emp)} className="text-blue-400 hover:text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <select
                        value={emp.xaaladda}
                        onChange={e => handleStatusChange(emp, e.target.value)}
                        className="text-[11px] border border-gray-200 rounded px-1 py-0.5 text-gray-600 outline-none"
                      >
                        {XAALADAHA.map(x => <option key={x} value={x}>{x}</option>)}
                      </select>
                      <button onClick={() => setDeleteConfirm(emp.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Shaqaale ma jiro</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg">{editEmp ? 'Wax Ka Beddel Shaqaalaha' : 'Shaqaale Cusub Ku Dar'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Magaca Buuxa *</label>
                  <input required value={form.magaca_buuxa} onChange={e => setForm(f => ({ ...f, magaca_buuxa: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lambarka Shaqaale *</label>
                  <input required value={form.lambarka_shaqaale} onChange={e => setForm(f => ({ ...f, lambarka_shaqaale: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Xirfadda *</label>
                  <select required value={form.xirfadda} onChange={e => setForm(f => ({ ...f, xirfadda: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none bg-white">
                    <option value="">Dooro...</option>
                    {XIRFADAHA.map(x => <option key={x}>{x}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Telefoonka</label>
                  <input value={form.telefoon} onChange={e => setForm(f => ({ ...f, telefoon: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Iimaylka</label>
                  <input type="email" value={form.iimaylka} onChange={e => setForm(f => ({ ...f, iimaylka: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Kooxda *</label>
                  <div className="flex gap-2">
                    {groups.map(g => (
                      <label key={g.id} className={`flex-1 text-center py-2 rounded-md border text-sm font-bold cursor-pointer transition-colors ${form.koox_id === String(g.id) ? 'bg-[#CC0000] text-white border-[#CC0000]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="koox" value={String(g.id)} checked={form.koox_id === String(g.id)} onChange={e => setForm(f => ({ ...f, koox_id: e.target.value }))} className="hidden" />
                        KOOX {g.magaca}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Xaaladda *</label>
                  <div className="flex gap-1">
                    {XAALADAHA.map(x => (
                      <label key={x} className={`flex-1 text-center py-2 rounded-md border text-[11px] font-bold cursor-pointer transition-colors ${form.xaaladda === x ? x === 'firfircoon' ? 'bg-green-600 text-white border-green-600' : x === 'nasanaya' ? 'bg-amber-500 text-white border-amber-500' : 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                        <input type="radio" name="xaaladda" value={x} checked={form.xaaladda === x} onChange={e => setForm(f => ({ ...f, xaaladda: e.target.value }))} className="hidden" />
                        {x === 'firfircoon' ? '🟢' : x === 'nasanaya' ? '🟡' : '🔴'} {x}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50">Jooji</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#CC0000] hover:bg-[#B30000] text-white rounded-md text-sm font-bold flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Keydinaya...</> : 'Keydi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">Ma hubtaa?</h3>
            <p className="text-sm text-gray-500 mb-5">Ma hubtaa inaad tirtiraysaa shaqaaluhu? Ficilkan dib looma celinayo.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-medium">Maya</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-[#CC0000] text-white rounded-md text-sm font-bold">Haa, Tirtir</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowShiftModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Beddel Kooxda Hawlgalka</h3>
            <div className="space-y-2 mb-5">
              {groups.map(g => (
                <label key={g.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedGroupId === g.id ? 'border-[#CC0000] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="shift" value={g.id} checked={selectedGroupId === g.id} onChange={() => setSelectedGroupId(g.id)} />
                  <div>
                    <p className="font-bold text-sm">KOOX {g.magaca} — {g.sharax}</p>
                    <p className="text-xs text-gray-500">{g.waqtiga_bilowga} - {g.waqtiga_dhammaadka}</p>
                  </div>
                  {g.is_active && <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Hadda</span>}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowShiftModal(false)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm font-medium">Jooji</button>
              <button onClick={handleShiftChange} disabled={changingShift || !selectedGroupId} className="flex-1 py-2 bg-[#CC0000] text-white rounded-md text-sm font-bold flex items-center justify-center gap-2">
                {changingShift ? <><Loader2 className="w-4 h-4 animate-spin" /> Beddelaaya...</> : 'Xaqiiji'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
