'use client';

import { useState } from 'react';
import { ClipboardCheck, Building, AlertTriangle, Calendar, FileText, CheckSquare, ShieldCheck, Plus, Search, MapPin, X, Trash2 } from 'lucide-react';

export default function FireInspectionPage() {
  const [activeTab, setActiveTab] = useState('building-inspections');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // States for each category
  const [inspections, setInspections] = useState([
    { id: 'INSP-001', building: 'Mogadishu Mall', address: 'Hamar Weyne', date: '2026-05-01', inspector: 'Ahmed Nur', status: 'Passed' },
    { id: 'INSP-002', building: 'Banadir Hospital', address: 'Hodhan', date: '2026-05-05', inspector: 'Hassan Ali', status: 'Pending' },
  ]);

  const [violations, setViolations] = useState([
    { id: 'V-101', building: 'Jazeera Hotel', issue: 'Blocked Fire Exits', severity: 'High', status: 'Unresolved' },
    { id: 'V-102', building: 'Bakaara Market Block B', issue: 'Exposed Wiring', severity: 'Critical', status: 'Resolved' },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 'SCH-1', building: 'Aden Adde Airport Terminal', date: '2026-05-15', inspector: 'Ali Yasin' },
  ]);

  const [permits, setPermits] = useState([
    { id: 'PERM-991', building: 'Sahafi Hotel', type: 'Commercial Occupancy', issueDate: '2025-01-10', expiryDate: '2026-01-10', status: 'Active' },
  ]);

  const tabs = [
    { id: 'building-inspections', label: 'Building Inspections', icon: Building },
    { id: 'violations', label: 'Safety Violations', icon: AlertTriangle },
    { id: 'scheduling', label: 'Inspection Scheduling', icon: Calendar },
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'permits', label: 'Occupancy Permits', icon: CheckSquare },
    { id: 'certificates', label: 'Compliance Certificates', icon: ShieldCheck },
    { id: 'risk', label: 'Risk Assessment', icon: Search },
  ];

  // Form states
  const [newEntry, setNewEntry] = useState<any>({});

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'building-inspections') {
      setInspections([...inspections, { ...newEntry, id: `INSP-00${inspections.length + 3}`, status: 'Pending' }]);
    } else if (activeTab === 'violations') {
      setViolations([...violations, { ...newEntry, id: `V-10${violations.length + 3}`, status: 'Unresolved' }]);
    } else if (activeTab === 'scheduling') {
      setSchedules([...schedules, { ...newEntry, id: `SCH-${schedules.length + 2}` }]);
    } else if (activeTab === 'permits') {
      setPermits([...permits, { ...newEntry, id: `PERM-99${permits.length + 2}`, status: 'Active' }]);
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
            <ClipboardCheck className="w-8 h-8 text-[#CC0000]" />
            Fire Inspection & Prevention
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage building safety, compliance, and risk assessments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm transition-colors">
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
                  ? 'border-[#CC0000] text-[#CC0000] bg-red-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-50/50 min-h-[400px]">
          {/* Building Inspections Tab */}
          {activeTab === 'building-inspections' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Insp ID / Building</th>
                    <th className="px-6 py-3 font-semibold">Address</th>
                    <th className="px-6 py-3 font-semibold">Date & Inspector</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {inspections.map(insp => (
                    <tr key={insp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{insp.building}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{insp.id}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3"/> {insp.address}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{insp.date}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{insp.inspector}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${insp.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {insp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteEntry(insp.id, inspections, setInspections)} className="text-[#CC0000] font-bold hover:underline text-xs"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  ))}
                  {inspections.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No inspections found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Violations Tab */}
          {activeTab === 'violations' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Violation ID / Building</th>
                    <th className="px-6 py-3 font-semibold">Issue Identified</th>
                    <th className="px-6 py-3 font-semibold">Severity</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {violations.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{v.building}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{v.id}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{v.issue}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${v.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {v.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${v.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteEntry(v.id, violations, setViolations)} className="text-[#CC0000] font-bold hover:underline text-xs"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  ))}
                  {violations.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No violations found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Scheduling Tab */}
          {activeTab === 'scheduling' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {schedules.map(sch => (
                <div key={sch.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteEntry(sch.id, schedules, setSchedules)} className="text-[#CC0000]"><Trash2 className="w-4 h-4"/></button>
                  </div>
                  <Calendar className="w-8 h-8 text-[#1B4FBE] mb-3" />
                  <h3 className="font-bold text-gray-900 text-lg">{sch.building}</h3>
                  <p className="text-sm text-gray-500 mt-1">Scheduled for: <span className="font-bold text-gray-800">{sch.date}</span></p>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Inspector:</span>
                    <span className="font-bold text-gray-900">{sch.inspector}</span>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No inspections scheduled.</p>}
            </div>
          )}

          {/* Permits Tab */}
          {activeTab === 'permits' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Permit Number</th>
                    <th className="px-6 py-3 font-semibold">Building</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Expiry Date</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {permits.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">{p.id}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{p.building}</td>
                      <td className="px-6 py-4 text-gray-600">{p.type}</td>
                      <td className="px-6 py-4 text-gray-900">{p.expiryDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteEntry(p.id, permits, setPermits)} className="text-[#CC0000] font-bold hover:underline text-xs"><Trash2 className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  ))}
                  {permits.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No permits found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Placeholders for others */}
          {['reports', 'certificates', 'risk'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center py-12 text-gray-500 animate-fade-in">
               <FileText className="w-16 h-16 text-gray-300 mb-4" />
               <p className="font-medium text-lg">No records available yet.</p>
               <p className="text-sm">Click "Add New Record" to populate this section.</p>
             </div>
          )}

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add New Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddEntry} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Building/Location Name</label>
                <input required type="text" onChange={e => setNewEntry({...newEntry, building: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Mogadishu Mall" />
              </div>
              
              {activeTab === 'building-inspections' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, address: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Hamar Weyne" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Inspector Name</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, inspector: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="Inspector Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" />
                  </div>
                </>
              )}

              {activeTab === 'violations' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Issue</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, issue: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Blocked Exit" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Severity</label>
                    <select required onChange={e => setNewEntry({...newEntry, severity: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]">
                      <option value="">Select Severity</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'scheduling' && (
                <>
                   <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Inspector</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, inspector: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="Inspector Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" />
                  </div>
                </>
              )}

              {activeTab === 'permits' && (
                <>
                   <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Permit Type</label>
                    <input required type="text" onChange={e => setNewEntry({...newEntry, type: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Commercial Occupancy" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                    <input required type="date" onChange={e => setNewEntry({...newEntry, expiryDate: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" />
                  </div>
                </>
              )}

              {['reports', 'certificates', 'risk'].includes(activeTab) && (
                 <p className="text-sm text-gray-500 py-2">Adding records for this section is currently supported via the main terminal.</p>
              )}

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#CC0000] text-white font-bold py-2 rounded-md shadow hover:bg-[#B30000]">Save Record</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
