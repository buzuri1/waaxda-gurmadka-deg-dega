'use client';

import { ShieldCheck, Users, HardDrive, Key, FileText, Settings, Database } from 'lucide-react';

export default function AdministrationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500 text-sm mt-0.5">System settings, user management, and security controls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Users & Roles</h3>
          <p className="text-sm text-gray-500">Manage dispatcher accounts, assign roles, and control access permissions.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Security & Permissions</h3>
          <p className="text-sm text-gray-500">Configure multi-factor authentication, IP whitelisting, and password policies.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Backup & Restore</h3>
          <p className="text-sm text-gray-500">Manage database backups, schedule automated exports, and restore data.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Audit Logs</h3>
          <p className="text-sm text-gray-500">Review system activity, user actions, and security events for compliance.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">System Settings</h3>
          <p className="text-sm text-gray-500">Configure global application preferences, notification integrations, and API keys.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="font-bold text-sm text-gray-900">Database Connection</p>
              <p className="text-xs text-gray-500">Supabase Postgres DB</p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Operational
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="font-bold text-sm text-gray-900">SMS Gateway</p>
              <p className="text-xs text-gray-500">Twilio Integration</p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
