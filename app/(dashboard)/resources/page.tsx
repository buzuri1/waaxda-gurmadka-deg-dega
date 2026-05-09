'use client';

import { Wrench, Shield, Truck, Stethoscope, Droplets, PenTool, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('vehicles');

  const tabs = [
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'equipment', label: 'Rescue & Fire Equipment', icon: Wrench },
    { id: 'scba', label: 'SCBA Gear', icon: Shield },
    { id: 'medical', label: 'Medical Supplies', icon: Stethoscope },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources & Equipments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage availability and maintenance of all department assets</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm">
          <PenTool className="w-4 h-4" /> Add New Asset
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
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

        <div className="p-6 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">Total Assets</p>
              <p className="text-2xl font-black mt-1">142</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">Available</p>
              <p className="text-2xl font-black mt-1 text-green-600">118</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">In Use</p>
              <p className="text-2xl font-black mt-1 text-blue-600">15</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">Maintenance</p>
              <p className="text-2xl font-black mt-1 text-amber-600">9</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Asset ID / Name</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">Engine 01</p>
                    <p className="text-xs text-gray-500 mt-0.5">Type 1 Fire Engine</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Vehicle</td>
                  <td className="px-6 py-4 text-gray-600">Jubba Station</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs font-bold w-max">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#1B4FBE] font-bold hover:underline">Manage</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">Medic 02</p>
                    <p className="text-xs text-gray-500 mt-0.5">Ambulance</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Vehicle</td>
                  <td className="px-6 py-4 text-gray-600">Villa Somalia Station</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-xs font-bold w-max">
                      <AlertCircle className="w-3.5 h-3.5" /> Maintenance
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#1B4FBE] font-bold hover:underline">Manage</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">Hose Set A-4</p>
                    <p className="text-xs text-gray-500 mt-0.5">1.5" Attack Line</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">Hose & Nozzles</td>
                  <td className="px-6 py-4 text-gray-600">Engine 01</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full text-xs font-bold w-max">
                      <Droplets className="w-3.5 h-3.5" /> In Use
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#1B4FBE] font-bold hover:underline">Manage</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
