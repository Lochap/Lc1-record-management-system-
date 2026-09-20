import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Citizen, CitizenCategory } from '../types';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileBadge,
  Phone,
  MapPin,
  Heart,
  Home,
  Briefcase,
  Baby,
  UserCheck,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CitizenRegisterProps {
  onOpenRegisterModal: () => void;
  onEditCitizen: (citizen: Citizen) => void;
  onIssueLetterForCitizen: (citizen: Citizen) => void;
  selectedCitizenIdToView?: string | null;
  onClearSelectedCitizen?: () => void;
}

export const CitizenRegister: React.FC<CitizenRegisterProps> = ({
  onOpenRegisterModal,
  onEditCitizen,
  onIssueLetterForCitizen,
  selectedCitizenIdToView,
  onClearSelectedCitizen,
}) => {
  const { citizens, deleteCitizen, landRecords, currentUser } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [landownerFilter, setLandownerFilter] = useState<string>('all');
  const [activeDossierCitizen, setActiveDossierCitizen] = useState<Citizen | null>(() => {
    if (selectedCitizenIdToView) {
      return citizens.find((c) => c.id === selectedCitizenIdToView) || null;
    }
    return null;
  });

  // Unique zones
  const zones = useMemo(() => {
    const set = new Set(citizens.map((c) => c.zone));
    return Array.from(set);
  }, [citizens]);

  // Filtered citizens
  const filteredCitizens = useMemo(() => {
    return citizens.filter((c) => {
      const matchesSearch =
        searchTerm === '' ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.villageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.nin && c.nin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.phone.includes(searchTerm) ||
        c.occupation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || c.category === selectedCategory;

      const matchesZone = selectedZone === 'all' || c.zone === selectedZone;

      const matchesLandowner =
        landownerFilter === 'all' ||
        (landownerFilter === 'yes' && c.isLandowner) ||
        (landownerFilter === 'no' && !c.isLandowner);

      return matchesSearch && matchesCategory && matchesZone && matchesLandowner;
    });
  }, [citizens, searchTerm, selectedCategory, selectedZone, landownerFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Village ID',
      'Full Name',
      'NIN',
      'Category',
      'Gender',
      'DOB',
      'Phone',
      'Zone',
      'Household Number',
      'Address',
      'Occupation',
      'Is Landowner',
      'Registered Date',
    ];
    const rows = filteredCitizens.map((c) => [
      c.villageId,
      `"${c.fullName}"`,
      c.nin || 'N/A',
      c.category,
      c.gender,
      c.dob,
      c.phone,
      `"${c.zone}"`,
      c.householdNumber,
      `"${c.residentialAddress}"`,
      `"${c.occupation}"`,
      c.isLandowner ? 'Yes' : 'No',
      c.registeredDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Nakawa_LC1_Citizens_Register_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive / delete citizen record for ${name}? This action is logged.`)) {
      deleteCitizen(id);
      if (activeDossierCitizen?.id === id) {
        setActiveDossierCitizen(null);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Nakawa LC1 Citizen Register</span>
            <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
              {filteredCitizens.length} of {citizens.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Official village register adhering to Section 2.1 conceptual model.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV for Parish / Sub-county report"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export CSV
          </button>

          <button
            onClick={onOpenRegisterModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            Register Citizen
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, NIN, Village ID, Phone..."
              className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">All Citizenship Categories</option>
              <option value="permanent">Permanent Residents</option>
              <option value="tenant">Tenants (Renters)</option>
              <option value="visitor">Visitors (Temporary)</option>
              <option value="home_employee">Home Employees (Maids/Security)</option>
              <option value="child">Children / Dependents</option>
            </select>
          </div>

          {/* Zone Dropdown */}
          <div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">All Zones / Cells</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Landowner Filter */}
          <div>
            <select
              value={landownerFilter}
              onChange={(e) => setLandownerFilter(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">All Property Ownership</option>
              <option value="yes">Landowners Only</option>
              <option value="no">Non-Landowners (Tenants/Guests)</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Quick Filter:</span>
          {(['all', 'permanent', 'tenant', 'home_employee', 'visitor', 'child'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {cat === 'all'
                  ? 'All'
                  : cat === 'home_employee'
                  ? 'Home Employee'
                  : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Citizens Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/70 border-b border-slate-800 text-slate-300 uppercase tracking-wider">
                <th className="py-3 px-3.5 font-semibold">Village ID</th>
                <th className="py-3 px-3.5 font-semibold">Citizen Name &amp; NIN</th>
                <th className="py-3 px-3.5 font-semibold">Category</th>
                <th className="py-3 px-3.5 font-semibold">Zone &amp; Address</th>
                <th className="py-3 px-3.5 font-semibold">Contact</th>
                <th className="py-3 px-3.5 font-semibold">Land / Property</th>
                <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No citizen records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCitizens.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-3.5 font-mono text-[11px] font-semibold text-amber-400">
                      {c.villageId}
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        {c.fullName}
                        {c.gender === 'female' ? (
                          <span className="text-[10px] text-pink-400">(F)</span>
                        ) : (
                          <span className="text-[10px] text-blue-400">(M)</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {c.nin ? `NIN: ${c.nin}` : 'No NIN Registered'}
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
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
                      {c.landlordName && (
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                          LL: {c.landlordName}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="text-slate-200">{c.zone}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {c.residentialAddress}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-slate-300 font-mono text-[11px]">
                      {c.phone}
                    </td>

                    <td className="py-3 px-3.5">
                      {c.isLandowner ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Landowner
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Tenant / Res.</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-right space-x-1">
                      <button
                        onClick={() => setActiveDossierCitizen(c)}
                        className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Full Citizen Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onIssueLetterForCitizen(c)}
                        className="p-1.5 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Issue Official LC1 Recommendation Letter"
                      >
                        <FileBadge className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditCitizen(c)}
                        className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Citizen Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id, c.fullName)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete / Archive Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Dossier Modal */}
      {activeDossierCitizen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
                  {activeDossierCitizen.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {activeDossierCitizen.fullName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {activeDossierCitizen.villageId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Registered on {activeDossierCitizen.registeredDate} • Nakawa LC1
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveDossierCitizen(null);
                  if (onClearSelectedCitizen) onClearSelectedCitizen();
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Category & Personal */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
                  Demographic Details
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Citizenship Category:</span>
                  <span className="font-semibold text-white capitalize">
                    {activeDossierCitizen.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">National ID (NIN):</span>
                  <span className="font-mono text-slate-200">
                    {activeDossierCitizen.nin || 'Not Provided (Needs LC1 recommendation)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Gender &amp; DOB:</span>
                  <span className="text-slate-200 capitalize">
                    {activeDossierCitizen.gender} • {activeDossierCitizen.dob}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Education Level:</span>
                  <span className="text-slate-200 capitalize">
                    {activeDossierCitizen.educationLevel || 'Unspecified'}
                  </span>
                </div>
              </div>

              {/* Residence & Contact */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
                  Residential &amp; Contact
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Zone / Cell:</span>
                  <span className="text-slate-200">{activeDossierCitizen.zone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Household Code:</span>
                  <span className="font-mono text-slate-200">
                    {activeDossierCitizen.householdNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Primary Phone:</span>
                  <span className="font-mono text-slate-200">{activeDossierCitizen.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Physical Address:</span>
                  <span className="text-slate-200 text-right truncate max-w-[180px]">
                    {activeDossierCitizen.residentialAddress}
                  </span>
                </div>
              </div>

              {/* Occupation & Landlord Link (Crucial for LC1 problem statement) */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
                  Occupation &amp; Host / Landlord
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Occupation:</span>
                  <span className="text-slate-200">{activeDossierCitizen.occupation}</span>
                </div>
                {activeDossierCitizen.landlordName && (
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Landlord / Employer:</span>
                    <span className="text-slate-200 font-semibold">
                      {activeDossierCitizen.landlordName}
                    </span>
                  </div>
                )}
                {activeDossierCitizen.landlordPhone && (
                  <div className="flex justify-between py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Landlord Phone:</span>
                    <span className="font-mono text-slate-200">
                      {activeDossierCitizen.landlordPhone}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Landowner Status:</span>
                  <span className="text-slate-200">
                    {activeDossierCitizen.isLandowner ? 'Yes (Registered)' : 'No (Tenant/Worker)'}
                  </span>
                </div>
              </div>

              {/* Next of Kin & Health Profile */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 space-y-2">
                <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
                  Welfare, Kin &amp; Health
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Next of Kin:</span>
                  <span className="text-slate-200">
                    {activeDossierCitizen.nextOfKin.name} ({activeDossierCitizen.nextOfKin.relationship})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Kin Contact:</span>
                  <span className="font-mono text-slate-200">
                    {activeDossierCitizen.nextOfKin.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="text-slate-200">
                    {activeDossierCitizen.healthProfile.bloodGroup || 'Not Tested'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Immunization:</span>
                  <span className="text-emerald-400 capitalize">
                    {activeDossierCitizen.healthProfile.immunizationStatus || 'Complete'}
                  </span>
                </div>
              </div>
            </div>

            {activeDossierCitizen.notes && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">
                  Official Council Notes:
                </span>
                <p className="text-slate-300 italic">{activeDossierCitizen.notes}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const citizenToIssue = activeDossierCitizen;
                  setActiveDossierCitizen(null);
                  onIssueLetterForCitizen(citizenToIssue);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileBadge className="w-4 h-4" />
                Generate Stamped LC1 Letter
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const c = activeDossierCitizen;
                    setActiveDossierCitizen(null);
                    onEditCitizen(c);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 cursor-pointer"
                >
                  Edit Information
                </button>
                <button
                  onClick={() => setActiveDossierCitizen(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
