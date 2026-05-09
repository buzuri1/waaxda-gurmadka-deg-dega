'use client';

import { Building2, MapPin, Navigation, Truck, Users } from 'lucide-react';
import Image from 'next/image';

export default function FireStationsPage() {
  const stations = [
    {
      id: 'jubba',
      name: 'Jubba Fire Station (HQ)',
      location: 'Shibis District',
      description: 'The main headquarters for Mogadishu Fire & Emergency Services.',
      trucks: 6,
      personnel: 45,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'villa',
      name: 'Villa Somalia Fire Station',
      location: 'Wardhiigley District',
      description: 'Strategic fire station located near the presidential palace to ensure rapid response to critical areas.',
      trucks: 4,
      personnel: 30,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1582216584285-802526e0881c?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fire Stations</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage and view details for active fire stations in Banadir</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stations.map(station => (
          <div key={station.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:border-[#CC0000] transition-colors">
            <div className="h-48 relative w-full bg-gray-200">
              <Image src={station.image} alt={station.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500 text-white mb-2 tracking-wider uppercase">{station.status}</span>
                <h3 className="text-xl font-bold text-white">{station.name}</h3>
                <p className="text-white/80 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {station.location}</p>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-6 flex-1">{station.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#CC0000]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Fire Trucks</p>
                    <p className="text-lg font-black">{station.trucks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Personnel</p>
                    <p className="text-lg font-black">{station.personnel}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <button className="w-full py-2 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" /> View on Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
