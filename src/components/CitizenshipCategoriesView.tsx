import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { CitizenCategory, Citizen } from '../types';
import {
  Home,
  Users,
  UserCheck,
  Briefcase,
  Baby,
  ShieldCheck,
  Eye,
  FileBadge,
  Phone,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface CitizenshipCategoriesViewProps {
  onViewCitizenDossier: (id: string) => void;
  onIssueLetter: (citizen: Citizen) => void;
}

export const CitizenshipCategoriesView: React.FC<CitizenshipCategoriesViewProps> = ({
  onViewCitizenDossier,
  onIssueLetter,
}) => {
  const { citizens } = useDatabase();
  const [activeCategory, setActiveCategory] = useState<CitizenCategory>('permanent');

  const categoryCitizens = citizens.filter((c) => c.category === activeCategory);

  const categories = [
    {
      id: 'permanent' as CitizenCategory,
      title: 'Permanent Residents',
      icon: Home,
      color: 'emerald',
      description:
        'Indigenes, native residents, and registered property owners with established homes in Nakawa LC1.',
      count: citizens.filter((c) => c.category === 'permanent').length,
    },
    {
      id: 'tenant' as CitizenCategory,
      title: 'Tenants (Renters)',
      icon: Users,
      color: 'blue',
      description:
        'Individuals residing in rented apartments, houses, or commercial quarters under a registered landlord.',
      count: citizens.filter((c) => c.category === 'tenant').length,
    },
    {
      id: 'visitor' as CitizenCategory,
      title: 'Visitors (Temporary)',
      icon: UserCheck,
      color: 'amber',
      description:
        'Guests, visiting interns, and short-term occupants staying for less than 6 months under a host resident.',
      count: citizens.filter((c) => c.category === 'visitor').length,
    },
    {
      id: 'home_employee' as CitizenCategory,
      title: 'Home Employees',
      icon: Briefcase,
      color: 'purple',
      description:
        'Domestic workers, private security guards, and caretakers registered under the LC1 Defense Office.',
      count: citizens.filter((c) => c.category === 'home_employee').length,
    },
    {
      id: 'child' as CitizenCategory,
      title: 'Children & Dependents',
      icon: Baby,
      color: 'pink',
      description:
        'Minors (under 18 years) and schooling dependents registered under a household head for census & immunization.',
      count: citizens.filter((c) => c.category === 'child').length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Section 2.1 Model Architecture
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Citizenship Classification &amp; Categories
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
          The conceptual model disaggregates village residents into 5 distinct legal tiers to ensure complete
          security profiling, landlord accountability, and targeted social services delivery.
        </p>

        {/* 5 Tabs corresponding to Fig 2.1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
                <div
                  className={`text-xs font-bold mt-2 truncate ${
                    isSelected ? 'text-amber-300' : 'text-slate-200'
                  }`}
                >
                  {cat.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Specific Insights & Records List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white capitalize flex items-center gap-2">
              <span>{activeCategory.replace('_', ' ')} Directory</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {categoryCitizens.length} Record(s)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {categories.find((c) => c.id === activeCategory)?.description}
            </p>
          </div>
        </div>

        {/* List of citizens in this category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {categoryCitizens.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
              No citizens registered under this category yet.
            </div>
          ) : (
            categoryCitizens.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 space-y-3 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.fullName}</h4>
                    <div className="text-xs text-amber-400 font-mono">{c.villageId}</div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onIssueLetter(c)}
                      className="p-1.5 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 cursor-pointer"
                      title="Issue Official Letter"
                    >
                      <FileBadge className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewCitizenDossier(c.id)}
                      className="p-1.5 rounded bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="View Full File"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-700/40">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Zone / Cell:</span>
                    <span>{c.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Household No:</span>
                    <span className="font-mono">{c.householdNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">NIN / National ID:</span>
                    <span className="font-mono text-slate-200">
                      {c.nin || 'Pending Verification'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Contact:</span>
                    <span className="font-mono">{c.phone}</span>
                  </div>
                </div>

                {/* Specific field highlight per category */}
                {activeCategory === 'tenant' && (
                  <div className="bg-blue-950/40 border border-blue-800/50 rounded p-2 text-xs text-blue-200">
                    <span className="text-slate-400 block text-[10px]">Landlord Account:</span>
                    <span className="font-semibold">{c.landlordName || 'Unassigned'}</span>
                    {c.landlordPhone && <span className="text-[11px] block">{c.landlordPhone}</span>}
                  </div>
                )}

                {activeCategory === 'home_employee' && (
                  <div className="bg-purple-950/40 border border-purple-800/50 rounded p-2 text-xs text-purple-200">
                    <span className="text-slate-400 block text-[10px]">Employer / Host:</span>
                    <span className="font-semibold">{c.landlordName || 'Unassigned'}</span>
                    <span className="text-[10px] text-purple-300 block">Duty: {c.occupation}</span>
                  </div>
                )}

                {activeCategory === 'visitor' && (
                  <div className="bg-amber-950/40 border border-amber-800/50 rounded p-2 text-xs text-amber-200">
                    <span className="text-slate-400 block text-[10px]">Host in Nakawa:</span>
                    <span className="font-semibold">{c.landlordName || 'Host Member'}</span>
                    <span className="text-[10px] text-amber-300 block">Internship / Stay</span>
                  </div>
                )}

                {activeCategory === 'child' && (
                  <div className="bg-pink-950/40 border border-pink-800/50 rounded p-2 text-xs text-pink-200">
                    <span className="text-slate-400 block text-[10px]">Education &amp; Health:</span>
                    <span>{c.occupation}</span> •{' '}
                    <span className="capitalize">{c.healthProfile.immunizationStatus} Immunized</span>
                  </div>
                )}

                {activeCategory === 'permanent' && (
                  <div className="bg-emerald-950/40 border border-emerald-800/50 rounded p-2 text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Property Status:</span>
                      <span>{c.isLandowner ? 'Registered Landowner' : 'Family Heir'}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
