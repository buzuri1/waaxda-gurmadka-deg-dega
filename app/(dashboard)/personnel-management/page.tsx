'use client';

import { Users, GraduationCap, Clock, Award, Shield, CheckCircle2, AlertCircle, Plus, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function PersonnelManagementPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [personnelList, setPersonnelList] = useState([
    { id: '1', name: 'Ahmed Ali', role: 'Firefighter', station: 'Jubba Station', status: 'On Duty', cert: 'Valid', train: 'Up to date' },
    { id: '2', name: 'Fatima Hassan', role: 'Dispatcher', station: 'HQ', status: 'Off Duty', cert: 'Valid', train: 'Pending (CPR)' },
    { id: '3', name: 'Mohamed Abdi', role: 'Rescue Specialist', station: 'Villa Somalia', status: 'On Duty', cert: 'Expiring Soon', train: 'Up to date' },
    { id: '4', name: 'Zahra Omar', role: 'Paramedic', station: 'Jubba Station', status: 'On Leave', cert: 'Valid', train: 'Up to date' },
  ]);

  const [newPerson, setNewPerson] = useState({ name: '', role: '', station: 'Jubba Station', status: 'On Duty', cert: 'Valid', train: 'Up to date' });

  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.role) return;
    setPersonnelList([...personnelList, { ...newPerson, id: Date.now().toString() }]);
    setIsModalOpen(false);
    setNewPerson({ name: '', role: '', station: 'Jubba Station', status: 'On Duty', cert: 'Valid', train: 'Up to date' });
  };

  const handleRemovePersonnel = (id: string) => {
    if (confirm('Are you sure you want to remove this personnel record?')) {
      setPersonnelList(personnelList.filter(p => p.id !== id));
    }
  };

  const filteredPersonnel = activeTab === 'all' ? personnelList : personnelList.filter(p => {
    if (activeTab === 'duty') return p.status === 'On Duty';
    if (activeTab === 'training') return p.train !== 'Up to date';
    if (activeTab === 'certs') return p.cert !== 'Valid';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage firefighters, dispatchers, duty personnel, training records, and certifications.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Personnel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Personnel</p>
              <p className="text-xl font-black">{personnelList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">On Duty</p>
              <p className="text-xl font-black">{personnelList.filter(p => p.status === 'On Duty').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Training Pending</p>
              <p className="text-xl font-black">{personnelList.filter(p => p.train !== 'Up to date').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Cert. Expiring</p>
              <p className="text-xl font-black">{personnelList.filter(p => p.cert !== 'Valid').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('all')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'all' ? 'border-[#CC0000] text-[#CC0000] bg-red-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            All Personnel
          </button>
          <button onClick={() => setActiveTab('duty')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'duty' ? 'border-[#CC0000] text-[#CC0000] bg-red-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            Duty Roster
          </button>
          <button onClick={() => setActiveTab('training')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'training' ? 'border-[#CC0000] text-[#CC0000] bg-red-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            Training Records
          </button>
          <button onClick={() => setActiveTab('certs')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'certs' ? 'border-[#CC0000] text-[#CC0000] bg-red-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            Certifications
          </button>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Name & Role</th>
                <th className="px-6 py-3 font-semibold">Station</th>
                <th className="px-6 py-3 font-semibold">Duty Status</th>
                <th className="px-6 py-3 font-semibold">Certification</th>
                <th className="px-6 py-3 font-semibold">Training</th>
                <th className="px-6 py-3 font-semibold text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPersonnel.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No personnel found.</td></tr>
              ) : (
                filteredPersonnel.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50 animate-fade-in">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{person.role}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{person.station}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold tracking-wider ${person.status === 'On Duty' ? 'bg-green-100 text-green-700' : person.status === 'On Leave' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold w-max ${person.cert === 'Valid' ? 'text-green-700' : 'text-amber-700'}`}>
                        {person.cert === 'Valid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />} {person.cert}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold w-max ${person.train === 'Up to date' ? 'text-green-700' : 'text-amber-700'}`}>
                        {person.train === 'Up to date' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />} {person.train}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleRemovePersonnel(person.id)} className="text-[#CC0000] font-bold hover:underline text-xs flex items-center justify-end gap-1 w-full"><Trash2 className="w-3 h-3" /> Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add Personnel</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddPersonnel} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Abdi Hassan" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Role / Job Title</label>
                <input required type="text" value={newPerson.role} onChange={e => setNewPerson({...newPerson, role: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Firefighter" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Station Assignment</label>
                <select value={newPerson.station} onChange={e => setNewPerson({...newPerson, station: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]">
                  <option>Jubba Station</option>
                  <option>Villa Somalia</option>
                  <option>HQ</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duty Status</label>
                  <select value={newPerson.status} onChange={e => setNewPerson({...newPerson, status: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]">
                    <option>On Duty</option>
                    <option>Off Duty</option>
                    <option>On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Certification</label>
                  <select value={newPerson.cert} onChange={e => setNewPerson({...newPerson, cert: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]">
                    <option>Valid</option>
                    <option>Expiring Soon</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#CC0000] text-white font-bold py-2 rounded-md shadow hover:bg-[#B30000]">Save Personnel</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
