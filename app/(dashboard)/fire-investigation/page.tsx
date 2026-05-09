'use client';

import { useState } from 'react';
import { FileSearch, Search, FileText, Camera, Users, FolderOpen, AlertCircle, Archive, Plus, MapPin, X, Trash2, Clock } from 'lucide-react';

export default function FireInvestigationPage() {
  const [activeTab, setActiveTab] = useState('cause-investigation');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for each category
  const [investigations, setInvestigations] = useState([
    { id: 'INV-001', incidentId: 'MF-005', location: 'Karaan', status: 'In Progress', investigator: 'Abdi Hassan', date: '2026-05-02' },
    { id: 'INV-002', incidentId: 'MF-008', location: 'Dharkenley', status: 'Concluded', investigator: 'Mohamed Ali', date: '2026-04-20' },
  ]);

  const [evidence, setEvidence] = useState([
    { id: 'EV-101', investigationId: 'INV-001', type: 'Physical', description: 'Burnt wire casing', collectedBy: 'Abdi Hassan', date: '2026-05-03' },
    { id: 'EV-102', investigationId: 'INV-001', type: 'Digital', description: 'CCTV Footage from neighboring shop', collectedBy: 'Abdi Hassan', date: '2026-05-03' },
  ]);

  const [witnesses, setWitnesses] = useState([
    { id: 'WIT-01', investigationId: 'INV-001', name: 'Amina Yusuf', contact: '0615000005', statement: 'Saw smoke coming from the back room before the fire alarm went off.', date: '2026-05-02' },
  ]);

  const [archives, setArchives] = useState([
    { id: 'ARC-2025-01', title: 'Bakaara Market Major Fire Case', dateClosed: '2025-11-15', conclusion: 'Electrical Fault' },
  ]);

  const tabs = [
    { id: 'cause-investigation', label: 'Cause Investigation', icon: Search },
    { id: 'reports', label: 'Investigation Reports', icon: FileText },
    { id: 'evidence', label: 'Evidence Collection', icon: Camera },
    { id: 'witnesses', label: 'Witness Statements', icon: Users },
    { id: 'scene', label: 'Scene Documentation', icon: FolderOpen },
    { id: 'status', label: 'Investigation Status', icon: AlertCircle },
    { id: 'archive', label: 'Case Archive', icon: Archive },
  ];

  // Form states
  const [newEntry, setNewEntry] = useState<any>({});

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'cause-investigation') {
      setInvestigations([...investigations, { ...newEntry, id: `INV-00${investigations.length + 3}`, status: 'Open' }]);
    } else if (activeTab === 'evidence') {
      setEvidence([...evidence, { ...newEntry, id: `EV-10${evidence.length + 3}` }]);
    } else if (activeTab === 'witnesses') {
      setWitnesses([...witnesses, { ...newEntry, id: `WIT-0${witnesses.length + 2}` }]);
    } else if (activeTab === 'archive') {
      setArchives([...archives, { ...newEntry, id: `ARC-${new Date().getFullYear()}-${archives.length + 2}` }]);
    }
    setIsModalOpen(false);
    setNewEntry({});
  };

  const deleteEntry = (id: string, stateArray: any[], setStateMethod: any) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setStateMethod(stateArray.filter((item: any) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileSearch className="w-8 h-8 text-[#1B4FBE]" />
            Fire Investigation
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Determine fire origins, collect evidence, and manage investigation cases.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#1B4FBE] hover:bg-blue-800 shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add New Record
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#1B4FBE] text-[#1B4FBE] bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-50/50 min-h-[400px]">
          
          {/* Cause Investigation Tab */}
          {activeTab === 'cause-investigation' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Case ID / Incident</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold">Date & Investigator</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {investigations.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{inv.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">Linked: {inv.incidentId}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3"/> {inv.location}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{inv.date}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{inv.investigator}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${inv.status === 'Concluded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteEntry(inv.id, investigations, setInvestigations)} className="text-[#CC0000] font-bold hover:underline text-xs"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  ))}
                  {investigations.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No active investigations.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Evidence Collection Tab */}
          {activeTab === 'evidence' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {evidence.map(ev => (
                <div key={ev.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteEntry(ev.id, evidence, setEvidence)} className="text-[#CC0000]"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <Camera className="w-8 h-8 text-[#D97706] mb-3" />
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold uppercase rounded-md mb-2 inline-block">{ev.type}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">{ev.description}</h3>
                  <p className="text-xs text-gray-500 mt-2">Case: <span className="font-mono text-gray-800">{ev.investigationId}</span></p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">{ev.date}</span>
                    <span className="font-bold text-gray-900">{ev.collectedBy}</span>
                  </div>
                </div>
              ))}
              {evidence.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No evidence logged.</p>}
            </div>
          )}

          {/* Witnesses Tab */}
          {activeTab === 'witnesses' && (
            <div className="space-y-4 animate-fade-in">
              {witnesses.map(wit => (
                <div key={wit.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{wit.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Contact: {wit.contact} • Case: {wit.investigationId}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {wit.date}</span>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md">
                      <p className="text-sm text-gray-700 italic">"{wit.statement}"</p>
                    </div>
                  </div>
                  <button onClick={() => deleteEntry(wit.id, witnesses, setWitnesses)} className="text-[#CC0000] p-2 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              {witnesses.length === 0 && <p className="text-center text-gray-500 py-8">No witness statements recorded.</p>}
            </div>
          )}

          {/* Archive Tab */}
          {activeTab === 'archive' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Archive ID</th>
                    <th className="px-6 py-3 font-semibold">Case Title</th>
                    <th className="px-6 py-3 font-semibold">Conclusion</th>
                    <th className="px-6 py-3 font-semibold">Date Closed</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {archives.map(arc => (
                    <tr key={arc.id} className="hover:bg-gray-50 opacity-80">
                      <td className="px-6 py-4 font-mono font-bold text-gray-600">{arc.id}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">{arc.title}</td>
                      <td className="px-6 py-4 text-gray-600">{arc.conclusion}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{arc.dateClosed}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteEntry(arc.id, archives, setArchives)} className="text-[#CC0000] font-bold hover:underline text-xs"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  ))}
                  {archives.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">Archive is empty.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Placeholders for others */}
          {['reports', 'scene', 'status'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center py-12 text-gray-500 animate-fade-in">
               <FileText className="w-16 h-16 text-gray-300 mb-4" />
               <p className="font-medium text-lg">Detailed view coming soon.</p>
               <p className="text-sm">Information will be synchronized with the central database.</p>
             </div>
          )}

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#1B4FBE] text-white">
              <h3 className="font-bold">Add New Investigation Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddEntry} className="p-4 space-y-4">
              
              {activeTab === 'cause-investigation' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Incident ID (Link)</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, incidentId: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" placeholder="e.g. MF-015" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, location: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" placeholder="District / Address" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Investigator</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, investigator: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date Started</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                </>
              )}

              {activeTab === 'evidence' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Investigation ID</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, investigationId: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" placeholder="e.g. INV-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Evidence Type</label>
                    <select required onChange={e => setNewEntry({...newEntry, type: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]">
                      <option value="">Select Type</option>
                      <option>Physical</option>
                      <option>Digital</option>
                      <option>Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, description: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date Collected</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                </>
              )}

              {activeTab === 'witnesses' && (
                <>
                   <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Witness Name</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, name: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Details</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, contact: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Statement</label>
                    <textarea required rows={3} onChange={e => setNewEntry({...newEntry, statement: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <input type="hidden" onChange={() => setNewEntry({...newEntry, date: new Date().toISOString().split('T')[0]})} />
                </>
              )}

              {activeTab === 'archive' && (
                <>
                   <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Case Title</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, title: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Conclusion / Outcome</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, conclusion: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date Closed</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, dateClosed: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#1B4FBE]" />
                  </div>
                </>
              )}

              {['reports', 'scene', 'status'].includes(activeTab) && (
                 <p className="text-sm text-gray-500 py-2">Please select an active sub-module to add records.</p>
              )}

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#1B4FBE] text-white font-bold py-2 rounded-md shadow hover:bg-blue-800">Save Record</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
