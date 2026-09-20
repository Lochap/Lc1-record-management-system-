import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Citizen } from '../types';
import {
  X,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  FileBadge,
  Calendar,
  Home,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Users,
} from 'lucide-react';

interface CitizenDossierModalProps {
  citizenId: string;
  onClose: () => void;
  onIssueLetter: (citizen: Citizen) => void;
  onEdit: (citizen: Citizen) => void;
}

export const CitizenDossierModal: React.FC<CitizenDossierModalProps> = ({
  citizenId,
  onClose,
  onIssueLetter,
  onEdit,
}) => {
  const { citizens, landRecords, documents } = useDatabase();
  const citizen = citizens.find((c) => c.id === citizenId);

  if (!citizen) return null;

  const citizenPlots = landRecords.filter(
    (l) => l.currentOwnerId === citizen.id || l.ownerNIN === citizen.nin
  );
  const citizenDocs = documents.filter((d) => d.citizenId === citizen.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              {citizen.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{citizen.fullName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {citizen.category.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Village ID: <span className="text-amber-400 font-bold">{citizen.villageId}</span> • NIN:{' '}
                <span className="text-slate-200">{citizen.nin || 'Pending Verification'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onIssueLetter(citizen);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileBadge className="w-4 h-4" />
            Issue Stamped Recommendation
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(citizen);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          >
            Edit Record
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Residential Info */}
          <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
            <div className="font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Residence &amp; Location
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Zone / Cell: </span>
                <span className="font-semibold text-white">{citizen.zone}</span>
              </div>
              <div>
                <span className="text-slate-400">Household No: </span>
                <span className="font-mono text-white">{citizen.householdNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Physical Address: </span>
                <span>{citizen.residentialAddress}</span>
              </div>
              <div>
                <span className="text-slate-400">Date Registered: </span>
                <span>{citizen.registeredDate}</span>
              </div>
            </div>
          </div>

          {/* Tenancy & Landlord Info */}
          <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
            <div className="font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              Tenancy &amp; Landowner Status
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Landowner Status: </span>
                <span className="font-semibold text-emerald-400">
                  {citizen.isLandowner ? 'Yes (Verified Landowner)' : 'No (Tenant / Occupant)'}
                </span>
              </div>
              {citizen.landlordName && (
                <div>
                  <span className="text-slate-400">Landlord / Employer: </span>
                  <span className="text-white font-semibold">{citizen.landlordName}</span>
                </div>
              )}
              {citizen.landlordPhone && (
                <div>
                  <span className="text-slate-400">Landlord Phone: </span>
                  <span className="font-mono">{citizen.landlordPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Next of Kin */}
          <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
            <div className="font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Contact &amp; Next of Kin
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Primary Phone: </span>
                <span className="font-mono text-white">{citizen.phone}</span>
              </div>
              <div>
                <span className="text-slate-400">Next of Kin: </span>
                <span className="text-white font-semibold">{citizen.nextOfKin.name}</span> (
                {citizen.nextOfKin.relationship})
              </div>
              <div>
                <span className="text-slate-400">Kin Contact: </span>
                <span className="font-mono">{citizen.nextOfKin.phone}</span>
              </div>
            </div>
          </div>

          {/* Health & Welfare */}
          <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
            <div className="font-bold text-amber-400 uppercase text-[11px] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" />
              Health &amp; Welfare Census
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-400">Immunization: </span>
                <span className="capitalize text-emerald-300">
                  {citizen.healthProfile.immunizationStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Blood Group: </span>
                <span className="font-bold text-white">{citizen.healthProfile.bloodGroup || 'Unrecorded'}</span>
              </div>
              <div>
                <span className="text-slate-400">Education Level: </span>
                <span className="capitalize">{citizen.educationLevel}</span>
              </div>
              <div>
                <span className="text-slate-400">Occupation: </span>
                <span>{citizen.occupation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owned Land Plots (Anti Double-Sale Cross Check) */}
        <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
          <div className="font-bold text-white text-xs">
            Registered Land Plots ({citizenPlots.length})
          </div>
          {citizenPlots.length === 0 ? (
            <div className="text-slate-400 text-xs">No registered land plots in Nakawa LC1.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {citizenPlots.map((p) => (
                <div key={p.id} className="bg-slate-900 p-2.5 rounded border border-slate-700">
                  <div className="font-mono font-bold text-amber-400">{p.plotNumber}</div>
                  <div className="text-slate-300 text-[11px]">
                    {p.zone} • {p.size} ({p.tenureType})
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    Agreement: {p.lc1AgreementRef}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Official Documents Issued */}
        <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-700/60 space-y-2">
          <div className="font-bold text-white text-xs">
            Official Documents Issued ({citizenDocs.length})
          </div>
          {citizenDocs.length === 0 ? (
            <div className="text-slate-400 text-xs">No official letters generated yet.</div>
          ) : (
            <div className="space-y-1.5 text-xs">
              {citizenDocs.map((d) => (
                <div
                  key={d.id}
                  className="bg-slate-900 p-2 rounded border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{d.documentNumber}</span> •{' '}
                    <span className="capitalize text-slate-200">{d.documentType.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{d.issueDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
