import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Users,
  Home,
  UserCheck,
  UserX,
  Baby,
  Briefcase,
  MapPin,
  AlertTriangle,
  FileText,
  FileBadge,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { CitizenCategory } from '../types';

interface DashboardProps {
  onNavigate: (tab: any) => void;
  onOpenRegisterModal: () => void;
  onSelectCitizenToView: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenRegisterModal,
  onSelectCitizenToView,
}) => {
  const { citizens, landRecords, resolutions, documents } = useDatabase();

  // Category counts
  const categoryCounts: Record<CitizenCategory, number> = {
    permanent: citizens.filter((c) => c.category === 'permanent').length,
    tenant: citizens.filter((c) => c.category === 'tenant').length,
    visitor: citizens.filter((c) => c.category === 'visitor').length,
    home_employee: citizens.filter((c) => c.category === 'home_employee').length,
    child: citizens.filter((c) => c.category === 'child').length,
  };

  const disputedPlots = landRecords.filter((l) => l.disputeStatus === 'disputed');
  const recentCitizens = [...citizens].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner: Nakawa LCI Problem Statement Solution Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Digital Governance Solution • Nakawa LC1
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Nakawa Village Citizens' & Land Governance Database
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Replacing vulnerable handwritten exercise books with secure, multi-officer digital records.
              Zero duplicate plot sales, instant resolution retrieval, and fast-track National ID recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onOpenRegisterModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Users className="w-4 h-4" />
              Register Citizen
            </button>
            <button
              onClick={() => onNavigate('database_prompt')}
              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Model Prompt & SQL
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Solving Problem Statement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">No Paper Stationary Loss</span>
              <span className="text-slate-400 text-[11px]">Eliminates photocopying and misplaced files.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Double-Sale Land Shield</span>
              <span className="text-slate-400 text-[11px]">Boundary neighbors and LC1 agreement registry.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Historical Minutes &gt; 6 Mos</span>
              <span className="text-slate-400 text-[11px]">Full-text archive accessible to all committee members.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-purple-500/10 text-purple-400 shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">1-Click NIRA & Village ID</span>
              <span className="text-slate-400 text-[11px]">Official stamped recommendation letters with QR hash.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Citizens */}
        <div
          onClick={() => onNavigate('citizen_register')}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Population
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{citizens.length}</span>
            <span className="text-xs text-emerald-400 font-medium">Registered Natives</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Nakawa LC1 households & resident register
          </p>
        </div>

        {/* Citizenship Categories */}
        <div
          onClick={() => onNavigate('citizenship_categories')}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Citizenship Types
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">5</span>
            <span className="text-xs text-slate-300">Model Categories</span>
          </div>
          <div className="mt-1 flex gap-1 text-[10px] text-slate-400">
            <span>{categoryCounts.permanent} Perm</span> • <span>{categoryCounts.tenant} Tenants</span> • <span>{categoryCounts.child} Children</span>
          </div>
        </div>

        {/* Land Plots */}
        <div
          onClick={() => onNavigate('land_registry')}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Land &amp; Bibanja Plots
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{landRecords.length}</span>
            {disputedPlots.length > 0 ? (
              <span className="text-xs text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded">
                {disputedPlots.length} Disputed
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-medium">100% Clear</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Witnessed agreements with boundary neighbors
          </p>
        </div>

        {/* Resolutions & Letters */}
        <div
          onClick={() => onNavigate('resolutions')}
          className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Council Minutes &amp; Letters
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <FileBadge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {resolutions.reduce((acc, r) => acc + r.resolutions.length, 0)}
            </span>
            <span className="text-xs text-slate-300">Resolutions</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {documents.length} verified official ID/Residence letters
          </p>
        </div>
      </div>

      {/* Conceptual Model: The 5 Citizenship Breakdown Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Citizenship Category Distribution (Fig 2.1 Model)
            </h3>
            <p className="text-xs text-slate-400">
              Disaggregated categories essential for bottom-up census &amp; local council security
            </p>
          </div>
          <button
            onClick={() => onNavigate('citizenship_categories')}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            Explore Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Permanent */}
          <div
            onClick={() => onNavigate('citizenship_categories')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Permanent</span>
              <Home className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{categoryCounts.permanent}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Native landowners &amp; elders</div>
          </div>

          {/* Tenants */}
          <div
            onClick={() => onNavigate('citizenship_categories')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tenants</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{categoryCounts.tenant}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Renting with registered landlords</div>
          </div>

          {/* Visitors */}
          <div
            onClick={() => onNavigate('citizenship_categories')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Visitors</span>
              <UserCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{categoryCounts.visitor}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Temporary guests &amp; interns</div>
          </div>

          {/* Home Employees */}
          <div
            onClick={() => onNavigate('citizenship_categories')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Home Employees</span>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{categoryCounts.home_employee}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Maids, security &amp; laborers</div>
          </div>

          {/* Children */}
          <div
            onClick={() => onNavigate('citizenship_categories')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 hover:bg-slate-800 transition-colors cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Children</span>
              <Baby className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{categoryCounts.child}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">School-age &amp; dependents</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Citizens & Land Dispute Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Citizens (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Citizen Registrations</h3>
              <p className="text-xs text-slate-400">Latest records entered into Nakawa LC1 database</p>
            </div>
            <button
              onClick={() => onNavigate('citizen_register')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All ({citizens.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5 font-semibold">Village ID &amp; Name</th>
                  <th className="pb-2.5 font-semibold">Category</th>
                  <th className="pb-2.5 font-semibold">Zone / Cell</th>
                  <th className="pb-2.5 font-semibold">NIN / ID Status</th>
                  <th className="pb-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentCitizens.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-200">{c.fullName}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{c.villageId}</div>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                          c.category === 'permanent'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : c.category === 'tenant'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : c.category === 'home_employee'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : c.category === 'visitor'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                        }`}
                      >
                        {c.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-slate-300">{c.zone}</td>
                    <td className="py-2.5 pr-2">
                      {c.nin ? (
                        <span className="font-mono text-[11px] text-slate-300">{c.nin}</span>
                      ) : (
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                          Needs NIRA ID
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onSelectCitizenToView(c.id)}
                        className="text-amber-400 hover:text-amber-300 font-medium text-[11px] bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded cursor-pointer transition-colors"
                      >
                        View File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Land Dispute Prevention Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Land Dispute Guard</h3>
            </div>
            <button
              onClick={() => onNavigate('land_registry')}
              className="text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              Registry &rarr;
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            In Nakawa LC1, paper agreements led to double sales of the same plot. Our digital registry locks
            every plot with verified boundary neighbors (N, S, E, W) and LC1 witnessed certificates.
          </p>

          {disputedPlots.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Active Land Caveat ({disputedPlots.length})
              </div>
              {disputedPlots.map((plot) => (
                <div
                  key={plot.id}
                  className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-200">{plot.plotNumber}</span>
                    <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded font-semibold uppercase">
                      Double-Sale Alert
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Location: {plot.zone} • {plot.size}
                  </div>
                  <p className="text-slate-400 text-[11px] italic mt-1">{plot.disputeNotes}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>All registered plots in Nakawa LC1 currently verified with no boundary conflicts.</span>
            </div>
          )}

          {/* Quick Stats for resolutions */}
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex justify-between py-1">
              <span>Council Resolutions Logged:</span>
              <span className="text-white font-semibold">
                {resolutions.reduce((acc, r) => acc + r.resolutions.length, 0)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Resolutions &gt; 6 Months Traceable:</span>
              <span className="text-emerald-400 font-semibold">100% Digital</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
