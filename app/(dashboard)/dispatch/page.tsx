'use client';

import { Radio, Truck, Stethoscope, LifeBuoy, MapPin, Activity, Navigation, CheckCircle2 } from 'lucide-react';

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch Center</h1>
          <p className="text-gray-500 text-sm mt-0.5">Assign units and track active response teams</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-bold shadow-sm hover:bg-gray-50">
            <Radio className="w-4 h-4" /> Radio Comms
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm">
            <Navigation className="w-4 h-4" /> Dispatch Unit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unit Status Cards */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Fire Trucks</p>
              <p className="text-xl font-black">4/10 <span className="text-xs font-normal text-gray-400">Available</span></p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Ambulances</p>
              <p className="text-xl font-black">2/5 <span className="text-xs font-normal text-gray-400">Available</span></p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Rescue Teams</p>
              <p className="text-xl font-black">1/3 <span className="text-xs font-normal text-gray-400">Available</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Active Deployments</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Engine 01, Ladder 04</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> Hodan District, Makka Al-Mukarama</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-600">On Scene</p>
                    <p className="text-[10px] text-gray-400">Arrived 5m ago</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-200">Update</button>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Medic 02</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> Wadajir District</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-bold text-blue-600">En Route</p>
                    <p className="text-[10px] text-gray-400">ETA: 3 mins</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-200">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Quick Assign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Incident</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:border-[#CC0000] outline-none">
                  <option>INC-4829 - Fire at Hodan</option>
                  <option>INC-4830 - Accident at Wadajir</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Units</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 border border-gray-100 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-[#CC0000]" />
                    <span className="text-sm font-medium">Engine 03 (Jubba Station)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-gray-100 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-[#CC0000]" />
                    <span className="text-sm font-medium">Medic 01 (Villa Somalia)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-gray-100 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-[#CC0000]" />
                    <span className="text-sm font-medium">Rescue 01 (Jubba Station)</span>
                  </label>
                </div>
              </div>

              <button className="w-full py-2.5 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-black transition-colors">
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
