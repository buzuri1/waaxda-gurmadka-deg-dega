'use client';

import { Map as MapIcon, Layers, Navigation, Crosshair, Users, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function LiveMapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
          <p className="text-gray-500 text-sm mt-0.5">Real-time GPS tracking of incidents and active units</p>
        </div>
        <div className="flex bg-white rounded-md border border-gray-200 p-1 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm font-bold rounded ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('incidents')}
            className={`px-4 py-1.5 text-sm font-bold rounded flex items-center gap-1.5 ${filter === 'incidents' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Incidents
          </button>
          <button 
            onClick={() => setFilter('units')}
            className={`px-4 py-1.5 text-sm font-bold rounded flex items-center gap-1.5 ${filter === 'units' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Navigation className="w-3.5 h-3.5" /> Units
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden flex">
        {/* Mockup Map Area */}
        <div className="flex-1 relative bg-[#e5e3df]">
          {/* Faux Map Background - Using a grid to simulate a map layout */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 bg-white rounded-md shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">
              <span className="text-xl font-bold leading-none">+</span>
            </button>
            <button className="w-10 h-10 bg-white rounded-md shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">
              <span className="text-xl font-bold leading-none">-</span>
            </button>
            <button className="w-10 h-10 bg-white rounded-md shadow flex items-center justify-center text-gray-700 hover:bg-gray-50 mt-4">
              <Crosshair className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <button className="px-4 py-2 bg-white rounded-md shadow flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
              <Layers className="w-4 h-4" /> Layers
            </button>
          </div>

          {/* Map Markers */}
          {(filter === 'all' || filter === 'incidents') && (
            <>
              <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow-md border border-red-200 mb-1 whitespace-nowrap">INC-4829 (Fire)</div>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center relative shadow-lg">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  <AlertTriangle className="w-4 h-4 text-red-600 relative z-10" />
                </div>
              </div>
            </>
          )}

          {(filter === 'all' || filter === 'units') && (
            <>
              <div className="absolute top-[45%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow-md border border-blue-200 mb-1 whitespace-nowrap">Engine 03</div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-white px-2 py-1 rounded text-xs font-bold shadow-md border border-green-200 mb-1 whitespace-nowrap">Medic 01</div>
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-lg border-2 border-white">
                  <Navigation className="w-4 h-4 text-white transform rotate-45" />
                </div>
              </div>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-gray-200 text-sm font-bold text-gray-700">
            Map Data © OpenStreetMap contributors, Banadir Regional Administration
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-[#CC0000]" /> Map Details
            </h3>
          </div>
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Active Incidents</h4>
              <div className="space-y-3">
                <div className="p-3 border border-red-100 bg-red-50 rounded-lg cursor-pointer hover:border-red-300">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-red-700 text-sm">INC-4829</span>
                    <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded text-red-600">FIRE</span>
                  </div>
                  <p className="text-xs text-red-900/70">Hodan District, Makka Al-Mukarama</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Active Units</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-sm text-gray-700">Engine 03</span>
                  </div>
                  <span className="text-xs text-gray-500">30km/h</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-bold text-sm text-gray-700">Medic 01</span>
                  </div>
                  <span className="text-xs text-gray-500">Stationary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
