'use client';

import { Wrench, Shield, Truck, Stethoscope, Droplets, PenTool, CheckCircle2, AlertCircle, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [assets, setAssets] = useState([
    { id: 1, name: 'Engine 01', type: 'Type 1 Fire Engine', category: 'vehicles', location: 'Jubba Station', status: 'Available' },
    { id: 2, name: 'Medic 02', type: 'Ambulance', category: 'vehicles', location: 'Villa Somalia Station', status: 'Maintenance' },
    { id: 3, name: 'Hose Set A-4', type: '1.5" Attack Line', category: 'equipment', location: 'Engine 01', status: 'In Use' },
    { id: 4, name: 'SCBA Pack 12', type: 'Oxygen Gear', category: 'scba', location: 'Jubba Station', status: 'Available' },
    { id: 5, name: 'Defibrillator M1', type: 'Medical Kit', category: 'medical', location: 'Medic 02', status: 'Available' }
  ]);

  const [newAsset, setNewAsset] = useState({ name: '', type: '', location: '', status: 'Available' });

  const tabs = [
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'equipment', label: 'Rescue & Fire Equipment', icon: Wrench },
    { id: 'scba', label: 'SCBA Gear', icon: Shield },
    { id: 'medical', label: 'Medical Supplies', icon: Stethoscope },
  ];

  const filteredAssets = assets.filter(a => a.category === activeTab);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.type) return;
    
    setAssets([...assets, { ...newAsset, id: Date.now(), category: activeTab }]);
    setIsModalOpen(false);
    setNewAsset({ name: '', type: '', location: '', status: 'Available' });
  };

  const handleRemoveAsset = (id: number) => {
    if(confirm('Are you sure you want to remove this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources & Equipments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage availability and maintenance of all department assets</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add New Asset
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
              <p className="text-2xl font-black mt-1">{assets.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">Available</p>
              <p className="text-2xl font-black mt-1 text-green-600">{assets.filter(a => a.status === 'Available').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">In Use</p>
              <p className="text-2xl font-black mt-1 text-blue-600">{assets.filter(a => a.status === 'In Use').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase">Maintenance</p>
              <p className="text-2xl font-black mt-1 text-amber-600">{assets.filter(a => a.status === 'Maintenance').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Asset ID / Name</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAssets.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">No assets found in this category.</td></tr>
                ) : (
                  filteredAssets.map(asset => (
                    <tr key={asset.id} className="hover:bg-gray-50 animate-fade-in">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{asset.type}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{asset.location}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold w-max ${asset.status === 'Available' ? 'bg-green-100 text-green-700' : asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {asset.status === 'Available' ? <CheckCircle2 className="w-3.5 h-3.5" /> : asset.status === 'Maintenance' ? <AlertCircle className="w-3.5 h-3.5" /> : <Droplets className="w-3.5 h-3.5" />} {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleRemoveAsset(asset.id)} className="text-[#CC0000] font-bold hover:underline text-xs flex items-center justify-end gap-1 w-full"><Trash2 className="w-3 h-3" /> Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add New {activeTab.replace(/s$/, '')}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAsset} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Asset Name</label>
                <input required type="text" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Engine 05" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Type/Description</label>
                <input required type="text" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Type 1 Engine" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location / Assigned to</label>
                <input type="text" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]" placeholder="e.g. Jubba Station" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select value={newAsset.status} onChange={e => setNewAsset({...newAsset, status: e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:border-[#CC0000]">
                  <option>Available</option>
                  <option>In Use</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#CC0000] text-white font-bold py-2 rounded-md shadow hover:bg-[#B30000]">Save Asset</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-md hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
