import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Citizen } from '../types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  FileBadge,
  MapPin,
  Phone,
  Home,
  User,
  ShieldCheck,
  Printer,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface CitizenSearchProps {
  onIssueLetter: (citizen: Citizen) => void;
  onViewCitizenDossier: (id: string) => void;
  onNavigate: (tab: any) => void;
}

export const CitizenSearch: React.FC<CitizenSearchProps> = ({
  onIssueLetter,
  onViewCitizenDossier,
  onNavigate,
}) => {
  const { citizens, landRecords } = useDatabase();
  const [query, setQuery] = useState('');

  const searchResults = query.trim()
    ? citizens.filter((c) => {
        const q = query.toLowerCase().trim();
        return (
          c.fullName.toLowerCase().includes(q) ||
          c.villageId.toLowerCase().includes(q) ||
          (c.nin && c.nin.toLowerCase().includes(q)) ||
          c.phone.includes(q) ||
          c.householdNumber.toLowerCase().includes(q) ||
          c.residentialAddress.toLowerCase().includes(q) ||
          c.occupation.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          Nakawa LC1 Official Verification Engine
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Citizen Identity &amp; Verification Search
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Instantly verify authenticity of residents, trace village records for National ID (NIRA)
          endorsements, and check land ownership without paper file delays.
        </p>

        {/* Input Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type Citizen Name, NIN, Village ID (e.g. NKW-LC1-0001), or Phone..."
            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-amber-500 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-700 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <span>Try searching:</span>
          <button
            onClick={() => setQuery('Kato')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
          >
            "Kato"
          </button>
          <button
            onClick={() => setQuery('CM84023101ABCD')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
          >
            "CM84023101ABCD" (NIN)
          </button>
          <button
            onClick={() => setQuery('NKW-LC1-0002')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
          >
            "NKW-LC1-0002"
          </button>
          <button
            onClick={() => setQuery('Tenant')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 cursor-pointer"
          >
            "Tenant"
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {query.trim() === '' ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-300">
              Ready for Instant Verification
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Enter any citizen attribute above to pull up their verified village dossier,
              land holdings, landlord ties, and official letter generator.
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">No Citizen Record Found</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No record found for <span className="text-amber-400 font-mono">"{query}"</span>.
              The citizen might not be registered yet in Nakawa LC1 books.
            </p>
            <button
              onClick={() => onNavigate('citizen_register')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              Open Registration Form
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between px-1">
              <span>FOUND {searchResults.length} VERIFIED RECORD(S)</span>
              <span>Nakawa LC1 Official Registry</span>
            </div>

            {searchResults.map((c) => {
              const citizenLands = landRecords.filter(
                (l) => l.currentOwnerId === c.id || l.ownerNIN === c.nin
              );

              return (
                <div
                  key={c.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xs space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg shrink-0">
                        {c.fullName.charAt(0)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{c.fullName}</h3>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {c.villageId}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Authentic Native
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                          <span className="capitalize font-medium text-amber-300">
                            Category: {c.category.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span>{c.zone}</span>
                          <span>•</span>
                          <span className="font-mono">House: {c.householdNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onIssueLetter(c)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileBadge className="w-3.5 h-3.5" />
                        Issue ID Letter
                      </button>

                      <button
                        onClick={() => onViewCitizenDossier(c.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                      >
                        Full Dossier
                      </button>
                    </div>
                  </div>

                  {/* Identification & Land Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">NIRA National ID (NIN):</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {c.nin || (
                          <span className="text-rose-400">Needs LC1 Recommendation Letter</span>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Phone Contact:</span>
                      <span className="font-mono text-slate-200">{c.phone}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Land Plots Registered:</span>
                      {citizenLands.length > 0 ? (
                        <span className="text-emerald-400 font-semibold">
                          {citizenLands.length} Verified Plot(s) ({citizenLands.map((l) => l.plotNumber).join(', ')})
                        </span>
                      ) : (
                        <span className="text-slate-400">0 Registered Plots</span>
                      )}
                    </div>
                  </div>

                  {/* Tenancy & Landlord Info if applicable */}
                  {c.landlordName && (
                    <div className="text-xs text-slate-300 bg-slate-800/30 p-2.5 rounded border border-slate-700/40 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">Landlord / Host: </span>
                        <span className="font-semibold text-white">{c.landlordName}</span>
                        {c.landlordPhone && (
                          <span className="font-mono text-slate-300 ml-2">({c.landlordPhone})</span>
                        )}
                      </div>
                      <span className="text-[11px] text-amber-400">Tenancy Verified</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
