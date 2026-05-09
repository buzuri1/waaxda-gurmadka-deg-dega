'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Radio, Mail, MessageCircle, Megaphone, Send } from 'lucide-react';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('radio');
  const [inputValue, setInputValue] = useState('');
  
  const [radioLogs, setRadioLogs] = useState([
    { id: 1, sender: 'Engine 03', time: '10:42 AM', text: 'Dispatch, Engine 03 is on scene at Makka Al-Mukarama. We have heavy smoke showing from the second floor. Pulling lines now.', type: 'unit' },
    { id: 2, sender: 'Dispatch', time: '10:43 AM', text: 'Copy that Engine 03. Medic 01 is en route to your location. ETA 2 minutes.', type: 'dispatch' }
  ]);

  const [smsLogs, setSmsLogs] = useState([
    { id: 1, to: 'All Personnel (Off-Duty)', time: 'Yesterday, 14:30', text: 'URGENT: All off-duty personnel requested to report to Jubba Station immediately. Major incident protocol activated.', stats: 'Sent to 84 recipients • 80 Delivered' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [radioLogs, smsLogs, activeTab]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    if (activeTab === 'radio') {
      setRadioLogs(prev => [...prev, {
        id: Date.now(),
        sender: 'Dispatch',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: inputValue,
        type: 'dispatch'
      }]);
    } else if (activeTab === 'sms') {
      setSmsLogs(prev => [...prev, {
        id: Date.now(),
        to: 'Custom Group',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: inputValue,
        stats: 'Sending...'
      }]);
      // Simulate delivery update
      setTimeout(() => {
        setSmsLogs(prev => prev.map(log => log.text === inputValue ? { ...log, stats: 'Delivered' } : log));
      }, 2000);
    }
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage radio logs, alerts, notifications, and announcements</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-white text-sm bg-[#CC0000] hover:bg-[#B30000] shadow-sm">
          <Megaphone className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('radio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'radio' ? 'bg-[#CC0000] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Radio className="w-4 h-4" /> Radio Logs
          </button>
          <button 
            onClick={() => setActiveTab('sms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'sms' ? 'bg-[#CC0000] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <MessageCircle className="w-4 h-4" /> SMS Alerts
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'email' ? 'bg-[#CC0000] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Mail className="w-4 h-4" /> Email Notifications
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'announcements' ? 'bg-[#CC0000] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Megaphone className="w-4 h-4" /> Emergency Announcements
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 capitalize">{activeTab.replace('-', ' ')} Feed</h3>
              {activeTab === 'radio' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-green-700">Listening to Channel 1</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'radio' && radioLogs.map(log => (
                <div key={log.id} className={`${log.type === 'dispatch' ? 'bg-blue-50 border-blue-100 ml-8' : 'bg-gray-50 border-gray-100 mr-8'} rounded-lg p-3 border animate-fade-in`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold text-sm ${log.type === 'dispatch' ? 'text-[#CC0000]' : 'text-[#1B4FBE]'}`}>{log.sender}</span>
                    <span className={`text-xs ${log.type === 'dispatch' ? 'text-blue-400' : 'text-gray-400'}`}>{log.time}</span>
                  </div>
                  <p className={`text-sm font-mono ${log.type === 'dispatch' ? 'text-blue-900' : 'text-gray-700'}`}>{log.text}</p>
                </div>
              ))}

              {activeTab === 'sms' && smsLogs.map(log => (
                <div key={log.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm animate-fade-in">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">To: {log.to}</span>
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{log.text}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    {log.stats}
                  </div>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Only for Radio/SMS) */}
            {(activeTab === 'radio' || activeTab === 'sms') && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Type your ${activeTab === 'radio' ? 'transmission' : 'message'}...`} 
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#CC0000]" 
                  />
                  <button type="submit" disabled={!inputValue.trim()} className="px-6 py-2 bg-[#1B4FBE] text-white font-bold rounded-md text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
