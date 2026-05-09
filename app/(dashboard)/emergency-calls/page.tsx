'use client';

import { useState } from 'react';
import { PhoneCall, Phone, PhoneOff, User, AlertTriangle, MapPin, Search, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function EmergencyCallsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [activeCall, setActiveCall] = useState<{ id: number, phone: string, location: string, type: string, priority: string, time: string } | null>(null);
  
  const [history, setHistory] = useState([
    { id: 1, time: '10:45 AM', caller: '+252 61 555 1234', type: 'Fire Emergency', duration: '2m 14s', status: 'Resolved' },
    { id: 2, time: '09:12 AM', caller: '+252 61 222 9876', type: 'Medical Emergency', duration: '4m 05s', status: 'Resolved' },
    { id: 3, time: 'Yesterday', caller: '+252 61 777 4321', type: 'Info Request', duration: '1m 30s', status: 'Closed' },
  ]);

  const handleReceiveCall = () => {
    setActiveCall({
      id: Date.now(),
      phone: `+252 61 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      location: 'Unknown Location (Tracing...)',
      type: 'Fire Emergency',
      priority: 'High',
      time: new Date().toLocaleTimeString(),
    });
    setActiveTab('active');
  };

  const handleEndCall = (status: 'Resolved' | 'Closed') => {
    if (activeCall) {
      setHistory(prev => [
        {
          id: activeCall.id,
          time: activeCall.time,
          caller: activeCall.phone,
          type: activeCall.type,
          duration: 'Just now',
          status: status
        },
        ...prev
      ]);
      setActiveCall(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Calls</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage incoming emergency calls and caller information</p>
        </div>
        <div className="flex gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 ${activeCall ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'} rounded-md border`}>
            <div className={`w-2 h-2 rounded-full ${activeCall ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-bold">{activeCall ? '1 Active Call' : 'No Active Calls'}</span>
          </div>
          <button onClick={handleReceiveCall} disabled={!!activeCall} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-green-600 hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Phone className="w-4 h-4" /> Receive Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Active Call Panel */}
          {activeCall ? (
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden shadow-md animate-fade-in ring-2 ring-red-100">
              <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                  <h3 className="font-bold">Active Emergency Call</h3>
                </div>
                <span className="text-sm font-mono bg-black/20 px-2 py-1 rounded">Live</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Caller ID</p>
                      <p className="font-bold text-gray-900">{activeCall.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500">Approx. Location</p>
                      <p className="font-bold text-gray-900">{activeCall.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Incident Type</label>
                  <select 
                    value={activeCall.type}
                    onChange={(e) => setActiveCall({...activeCall, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:border-red-500 outline-none"
                  >
                    <option>Fire Emergency</option>
                    <option>Medical Emergency</option>
                    <option>Rescue / Accident</option>
                    <option>Info Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setActiveCall({...activeCall, priority: 'High'})} className={`px-3 py-1.5 text-xs font-bold rounded border ${activeCall.priority === 'High' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>High</button>
                    <button onClick={() => setActiveCall({...activeCall, priority: 'Medium'})} className={`px-3 py-1.5 text-xs font-bold rounded border ${activeCall.priority === 'Medium' ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>Medium</button>
                    <button onClick={() => setActiveCall({...activeCall, priority: 'Low'})} className={`px-3 py-1.5 text-xs font-bold rounded border ${activeCall.priority === 'Low' ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>Low</button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleEndCall('Resolved')} className="flex-1 py-2 bg-[#CC0000] text-white text-sm font-bold rounded-md hover:bg-[#B30000] transition-colors">Dispatch & Resolve</button>
                  <button onClick={() => handleEndCall('Closed')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors" title="End Call">
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed h-64 flex flex-col items-center justify-center text-gray-400">
              <Phone className="w-12 h-12 mb-3 text-gray-300" />
              <p className="font-medium text-sm">No Active Calls</p>
              <p className="text-xs mt-1">Waiting for incoming emergencies...</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {/* Call History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="border-b border-gray-100">
              <div className="flex gap-6 px-6">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'active' ? 'border-[#CC0000] text-[#CC0000]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Recent Calls
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#CC0000] text-[#CC0000]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Call History
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search by number or location..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:bg-white focus:border-gray-300" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Time</th>
                    <th className="px-6 py-3 font-semibold">Caller</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Duration</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {history.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 text-gray-500">{call.time}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{call.caller}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className={`w-3.5 h-3.5 ${call.type.includes('Fire') ? 'text-red-500' : call.type.includes('Medical') ? 'text-amber-500' : 'text-gray-400'}`} />
                          {call.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{call.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${call.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">No call history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
