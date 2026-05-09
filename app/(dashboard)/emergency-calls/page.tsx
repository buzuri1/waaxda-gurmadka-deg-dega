'use client';

import { useState } from 'react';
import { PhoneCall, Phone, PhoneOff, User, AlertTriangle, Clock, MapPin, History, Search } from 'lucide-react';

export default function EmergencyCallsPage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Calls</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage incoming emergency calls and caller information</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md border border-red-200">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-bold">1 Active Call</span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-green-600 hover:bg-green-700 transition-colors shadow-sm">
            <Phone className="w-4 h-4" /> Receive Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Active Call Panel */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold">Active Emergency Call</h3>
              </div>
              <span className="text-sm font-mono bg-black/20 px-2 py-1 rounded">00:45</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Caller ID</p>
                    <p className="font-bold text-gray-900">+252 61 XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Approx. Location</p>
                    <p className="font-bold text-gray-900">Hodan District, Makka Al-Mukarama Rd</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Incident Type</label>
                <select className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:border-red-500 outline-none">
                  <option>Fire Emergency</option>
                  <option>Medical Emergency</option>
                  <option>Rescue / Accident</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">High</button>
                  <button className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded border border-amber-200">Medium</button>
                  <button className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200">Low</button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 bg-[#CC0000] text-white text-sm font-bold rounded-md hover:bg-[#B30000]">Dispatch</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
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
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-gray-500">10:45 AM</td>
                    <td className="px-6 py-4 font-medium">+252 61 555 1234</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Fire Emergency</span></td>
                    <td className="px-6 py-4 text-gray-500">2m 14s</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">Resolved</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-gray-500">09:12 AM</td>
                    <td className="px-6 py-4 font-medium">+252 61 222 9876</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Medical</span></td>
                    <td className="px-6 py-4 text-gray-500">4m 05s</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">Resolved</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-gray-500">Yesterday</td>
                    <td className="px-6 py-4 font-medium">+252 61 777 4321</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1.5 text-gray-600">Info Request</span></td>
                    <td className="px-6 py-4 text-gray-500">1m 30s</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-full">Closed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
