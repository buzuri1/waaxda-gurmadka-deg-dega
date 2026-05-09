'use client';

import { Users, GraduationCap, Clock, Award, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function PersonnelManagementPage() {
  const [activeTab, setActiveTab] = useState('all');

  const personnelList = [
    { id: '1', name: 'Ahmed Ali', role: 'Firefighter', station: 'Jubba Station', status: 'On Duty', cert: 'Valid', train: 'Up to date' },
    { id: '2', name: 'Fatima Hassan', role: 'Dispatcher', station: 'HQ', status: 'Off Duty', cert: 'Valid', train: 'Pending (CPR)' },
    { id: '3', name: 'Mohamed Abdi', role: 'Rescue Specialist', station: 'Villa Somalia', status: 'On Duty', cert: 'Expiring Soon', train: 'Up to date' },
    { id: '4', name: 'Zahra Omar', role: 'Paramedic', station: 'Jubba Station', status: 'On Leave', cert: 'Valid', train: 'Up to date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage firefighters, dispatchers, duty personnel, training records, and certifications.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm">
          <Users className="w-4 h-4" /> Add Personnel
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
              <p className="text-xl font-black">245</p>
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
              <p className="text-xl font-black">84</p>
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
              <p className="text-xl font-black">12</p>
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
              <p className="text-xl font-black">5</p>
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
              {personnelList.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
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
                    <button className="text-[#1B4FBE] font-bold hover:underline">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
