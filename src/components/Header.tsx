import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Shield, UserCheck, Bell, Search, Database } from 'lucide-react';
import { AccessRole } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenPromptStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenPromptStudio }) => {
  const { currentUser, setCurrentUser, users, citizens, landRecords } = useDatabase();

  const disputedLandCount = landRecords.filter((l) => l.disputeStatus === 'disputed').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Crest */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  Uganda LC1
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">Nakawa Division • Kampala</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                Nakawa LC1 Citizens' Records Database
              </h1>
            </div>
          </div>

          {/* Center Search Trigger */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-3.5 py-1.5 rounded-lg border border-slate-700 text-sm transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search Citizen by NIN, Name, ID...</span>
              <kbd className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Actions: Database Prompt, Alerts, Role Switcher */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPromptStudio}
              className="flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="View Model Prompt & SQL Schema"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Database & Prompt Studio</span>
            </button>

            {disputedLandCount > 0 && (
              <div className="relative" title={`${disputedLandCount} Land Dispute(s) Active`}>
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Bell className="w-4 h-4 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {disputedLandCount}
                </span>
              </div>
            )}

            {/* Current Officer / Role Switcher */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
                <div className="text-[11px] text-amber-400 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>

              <select
                value={currentUser.id}
                onChange={(e) => {
                  const selected = users.find((u) => u.id === e.target.value);
                  if (selected) setCurrentUser(selected);
                }}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                title="Switch active committee officer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
