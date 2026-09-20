import React from 'react';
import {
  Home,
  Users,
  UserPlus,
  Search,
  Tag,
  MapPin,
  FileText,
  FileBadge,
  ShieldAlert,
  BarChart3,
  Database,
  Layers,
  LogOut,
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export type NavigationTab =
  | 'home'
  | 'citizen_register'
  | 'citizen_search'
  | 'citizenship_categories'
  | 'land_registry'
  | 'resolutions'
  | 'documents'
  | 'users_access'
  | 'census_report'
  | 'database_prompt';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenRegisterModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenRegisterModal,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { citizens, landRecords, currentUser } = useDatabase();

  const disputedCount = landRecords.filter((l) => l.disputeStatus === 'disputed').length;

  const navItems = [
    {
      id: 'home' as NavigationTab,
      label: 'Home Page',
      icon: Home,
      badge: null,
    },
    {
      id: 'citizen_register' as NavigationTab,
      label: 'Citizen Register',
      icon: Users,
      badge: citizens.length,
    },
    {
      id: 'citizen_search' as NavigationTab,
      label: 'Citizen Search',
      icon: Search,
      badge: null,
    },
    {
      id: 'citizenship_categories' as NavigationTab,
      label: 'Citizenship Types',
      icon: Tag,
      badge: '5 Types',
    },
    {
      id: 'land_registry' as NavigationTab,
      label: 'Land & Plots Registry',
      icon: MapPin,
      badge: disputedCount > 0 ? `${disputedCount} Alert` : `${landRecords.length}`,
      alert: disputedCount > 0,
    },
    {
      id: 'resolutions' as NavigationTab,
      label: 'Minutes & Resolutions',
      icon: FileText,
      badge: null,
    },
    {
      id: 'documents' as NavigationTab,
      label: 'Official Letters & IDs',
      icon: FileBadge,
      badge: null,
    },
    {
      id: 'census_report' as NavigationTab,
      label: 'Parish Census Report',
      icon: BarChart3,
      badge: 'Bottom-Up',
    },
    {
      id: 'users_access' as NavigationTab,
      label: 'Users & Access Level',
      icon: ShieldAlert,
      badge: null,
    },
    {
      id: 'database_prompt' as NavigationTab,
      label: 'Database & Prompt Studio',
      icon: Database,
      badge: 'Model Prompts',
      highlight: true,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-40 md:z-10 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Action Button: Register Citizen (From Conceptual Model: Register Citizen) */}
          <button
            onClick={() => {
              onOpenRegisterModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="text-sm">Register New Citizen</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Conceptual Model Flow
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                      : item.highlight
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/40'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-amber-400'
                          : item.highlight
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        item.alert
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                          : item.highlight
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Active role summary */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Jurisdiction:</span>
            <span className="text-slate-200 font-medium">Nakawa Parish, LC1</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Storage:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Local DB
            </span>
          </div>
          <div className="pt-1 text-[10px] text-slate-400 text-center">
            Uganda Local Gov Act Cap 243
          </div>
        </div>
      </aside>
    </>
  );
};
