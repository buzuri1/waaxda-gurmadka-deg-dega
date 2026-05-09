'use client';

import { ShieldCheck, Users, HardDrive, Key, FileText, Settings, Database, ArrowLeft, Plus, Download, RefreshCw, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdministrationPage() {
  const [activeView, setActiveView] = useState<'main' | 'users' | 'security' | 'backup' | 'audit' | 'settings'>('main');

  // Dummy State for Users
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@banadirfire.so', role: 'Super Admin', status: 'Active' },
    { id: 2, name: 'Hassan Ali', email: 'hassan@banadirfire.so', role: 'Dispatcher', status: 'Active' },
    { id: 3, name: 'Aisha Jama', email: 'aisha@banadirfire.so', role: 'Station Commander', status: 'Inactive' },
  ]);

  // Dummy State for Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 101, action: 'User Login', user: 'Admin User', time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: '192.168.1.45', status: 'Success' },
    { id: 102, action: 'Incident Created', user: 'Hassan Ali', time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), ip: '192.168.1.12', status: 'Success' },
    { id: 103, action: 'Failed Login', user: 'Unknown', time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), ip: '10.0.0.5', status: 'Failed' },
    { id: 104, action: 'Asset Updated', user: 'Admin User', time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), ip: '192.168.1.45', status: 'Success' },
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportBackup = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ backup: "database_dump", users, auditLogs, date: new Date().toISOString() }));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `banadir_fire_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setIsExporting(false);
      
      // Log the action
      setAuditLogs(prev => [{ id: Date.now(), action: 'Database Backup Exported', user: 'Admin User', time: new Date().toISOString(), ip: '127.0.0.1', status: 'Success' }, ...prev]);
    }, 1500);
  };

  const renderMain = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => setActiveView('users')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Users & Roles</h3>
          <p className="text-sm text-gray-500">Manage dispatcher accounts, assign roles, and control access permissions.</p>
        </div>

        <div onClick={() => setActiveView('security')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Security & Permissions</h3>
          <p className="text-sm text-gray-500">Configure multi-factor authentication, IP whitelisting, and password policies.</p>
        </div>

        <div onClick={() => setActiveView('backup')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Backup & Restore</h3>
          <p className="text-sm text-gray-500">Manage database backups, schedule automated exports, and restore data.</p>
        </div>

        <div onClick={() => setActiveView('audit')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Audit Logs</h3>
          <p className="text-sm text-gray-500">Review system activity, user actions, and security events for compliance.</p>
        </div>

        <div onClick={() => setActiveView('settings')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#CC0000] hover:shadow-md transition-all cursor-pointer group">
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
    </>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-900">Manage Users</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white rounded-md text-sm font-bold shadow hover:bg-[#B30000]">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 font-bold hover:underline text-xs">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-900">System Audit Logs</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#CC0000]" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 font-semibold">Timestamp</th>
              <th className="px-6 py-3 font-semibold">Action</th>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">IP Address</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(log.time).toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{log.action}</td>
                <td className="px-6 py-4 text-gray-600">{log.user}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
      <h3 className="font-bold text-gray-900 mb-2">Database Backup</h3>
      <p className="text-sm text-gray-500 mb-6">Export a complete JSON dump of your current system database, including all incidents, users, and audit logs.</p>
      
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-purple-600" />
          <div>
            <p className="font-bold text-gray-900 text-sm">System Database Dump</p>
            <p className="text-xs text-gray-500 mt-0.5">Approx. 4.2 MB • JSON Format</p>
          </div>
        </div>
        <button 
          onClick={handleExportBackup} 
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-md shadow hover:bg-black disabled:opacity-50 transition-all"
        >
          {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isExporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-bold text-amber-800 text-sm mb-1">Warning</h4>
        <p className="text-xs text-amber-700">Database backups contain sensitive information. Ensure you store downloaded files securely and in compliance with data protection policies.</p>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (activeView) {
      case 'users': return 'Manage Users & Roles';
      case 'audit': return 'System Audit Logs';
      case 'backup': return 'Backup & Restore';
      case 'security': return 'Security Settings';
      case 'settings': return 'System Settings';
      default: return 'Administration';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {activeView !== 'main' && (
          <button onClick={() => setActiveView('main')} className="p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{activeView === 'main' ? 'System settings, user management, and security controls' : 'Administration Dashboard'}</p>
        </div>
      </div>

      {activeView === 'main' && renderMain()}
      {activeView === 'users' && renderUsers()}
      {activeView === 'audit' && renderAudit()}
      {activeView === 'backup' && renderBackup()}
      {(activeView === 'security' || activeView === 'settings') && (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200 border-dashed text-gray-500 font-medium">
          <Settings className="w-8 h-8 mx-auto mb-3 text-gray-300 animate-spin-slow" />
          This module is currently being updated in version 2.0.
        </div>
      )}
    </div>
  );
}
