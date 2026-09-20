import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { LandRecord } from '../types';
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Search,
  History,
  ArrowRight,
  FileText,
  UserCheck,
  X,
  Compass,
} from 'lucide-react';

export const LandRegistry: React.FC = () => {
  const { landRecords, addLandRecord, updateLandRecord, addLandTransfer, citizens } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDispute, setFilterDispute] = useState<string>('all');
  const [selectedPlotForDetail, setSelectedPlotForDetail] = useState<LandRecord | null>(null);
  const [isAddingPlot, setIsAddingPlot] = useState(false);
  const [isTransferringPlot, setIsTransferringPlot] = useState<LandRecord | null>(null);

  // New plot form state
  const [newPlot, setNewPlot] = useState({
    plotNumber: `NKW-PLT-${Math.floor(100 + Math.random() * 900)}`,
    zone: 'Zone A - Market View',
    size: '50 x 100 ft (0.11 Acres)',
    tenureType: 'kibanja' as 'kibanja' | 'mailo' | 'leasehold' | 'customary',
    currentOwnerName: '',
    ownerNIN: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    witnessedByLC1: true,
    lc1AgreementRef: `LC1/NKW/AGR/${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
    north: '',
    south: '',
    east: '',
    west: '',
    disputeStatus: 'clear' as 'clear' | 'under_review' | 'disputed',
    disputeNotes: '',
  });

  // Transfer form state
  const [transferData, setTransferData] = useState({
    buyer: '',
    buyerNIN: '',
    transferDate: new Date().toISOString().slice(0, 10),
    witnessedBy: 'LC1 Chairperson & Defense Secretary',
    notes: 'Official sale agreement signed at LC1 office after boundary neighbor confirmation.',
  });

  const filteredPlots = landRecords.filter((p) => {
    const matchesSearch =
      p.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.currentOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerNIN.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDispute =
      filterDispute === 'all' || p.disputeStatus === filterDispute;

    return matchesSearch && matchesDispute;
  });

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlot.currentOwnerName.trim()) {
      alert('Owner name is required.');
      return;
    }
    if (!newPlot.north.trim() || !newPlot.south.trim()) {
      alert('North and South boundary neighbors are required to prevent boundary disputes.');
      return;
    }

    addLandRecord({
      plotNumber: newPlot.plotNumber.trim(),
      zone: newPlot.zone,
      size: newPlot.size.trim(),
      tenureType: newPlot.tenureType,
      currentOwnerId: `ctz-${Date.now()}`,
      currentOwnerName: newPlot.currentOwnerName.trim(),
      ownerNIN: newPlot.ownerNIN.trim() || 'NOT-SPECIFIED',
      purchaseDate: newPlot.purchaseDate,
      witnessedByLC1: newPlot.witnessedByLC1,
      lc1AgreementRef: newPlot.lc1AgreementRef.trim(),
      boundaryNeighbors: {
        north: newPlot.north.trim(),
        south: newPlot.south.trim(),
        east: newPlot.east.trim() || 'Access Path',
        west: newPlot.west.trim() || 'Access Path',
      },
      disputeStatus: newPlot.disputeStatus,
      disputeNotes: newPlot.disputeNotes.trim() || undefined,
      transferHistory: [
        {
          previousOwner: 'Original Registered Allotment',
          transferDate: newPlot.purchaseDate,
          buyer: newPlot.currentOwnerName.trim(),
          witnessedBy: 'Nakawa LC1 Executive Committee',
          notes: 'Initial registration in digital system.',
        },
      ],
    });

    setIsAddingPlot(false);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTransferringPlot) return;
    if (!transferData.buyer.trim()) {
      alert('New buyer name is required.');
      return;
    }

    addLandTransfer(isTransferringPlot.id, {
      previousOwner: isTransferringPlot.currentOwnerName,
      transferDate: transferData.transferDate,
      buyer: transferData.buyer.trim(),
      witnessedBy: transferData.witnessedBy.trim(),
      notes: transferData.notes.trim(),
    });

    setIsTransferringPlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Problem Statement Callout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Anti Double-Sale Protection System
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Nakawa LC1 Land &amp; Bibanja Ownership Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              Directly resolving fraudulent double-sales by maintaining a single immutable register
              of plot ownership, verified 4-point boundary neighbors, and LC1 witnessed sales agreements.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPlot(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            Register Plot / Kibanja
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Plot Number, Owner Name, NIN, Zone..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Dispute Status:</span>
          <select
            value={filterDispute}
            onChange={(e) => setFilterDispute(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">All Plots ({landRecords.length})</option>
            <option value="clear">Clear Title (Verified)</option>
            <option value="disputed">Disputed / Caveat Alert</option>
            <option value="under_review">Under LC1 Review</option>
          </select>
        </div>
      </div>

      {/* Plots Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlots.map((plot) => {
          const isDisputed = plot.disputeStatus === 'disputed';

          return (
            <div
              key={plot.id}
              className={`bg-slate-900 border rounded-xl p-4.5 space-y-3.5 transition-all ${
                isDisputed
                  ? 'border-rose-700/80 bg-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-mono">{plot.plotNumber}</h3>
                    {isDisputed ? (
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded uppercase animate-pulse">
                        Double Sale Alert
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
                        Clear Title
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {plot.zone} • {plot.size}
                  </div>
                </div>

                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {plot.tenureType}
                </span>
              </div>

              {/* Registered Owner Box */}
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 text-xs space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Current Registered Owner
                </div>
                <div className="font-bold text-slate-100">{plot.currentOwnerName}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  NIN: {plot.ownerNIN}
                </div>
                <div className="text-[11px] text-slate-400">
                  Acquired: {plot.purchaseDate} • Ref: {plot.lc1AgreementRef}
                </div>
              </div>

              {/* Boundary Neighbors (The key to preventing double sales) */}
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
                <div className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Verified Boundary Neighbors (Crucial)
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400 font-bold">N:</span> {plot.boundaryNeighbors.north}
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">S:</span> {plot.boundaryNeighbors.south}
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">E:</span> {plot.boundaryNeighbors.east}
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">W:</span> {plot.boundaryNeighbors.west}
                  </div>
                </div>
              </div>

              {isDisputed && plot.disputeNotes && (
                <div className="text-xs bg-rose-900/30 border border-rose-800/60 text-rose-300 p-2.5 rounded">
                  <span className="font-bold block text-[11px]">DISPUTE MEMORANDUM:</span>
                  <p className="text-[11px] mt-0.5">{plot.disputeNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setIsTransferringPlot(plot)}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  Witness Sale / Transfer
                </button>

                <button
                  onClick={() => setSelectedPlotForDetail(plot)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs border border-slate-700 cursor-pointer"
                >
                  Audit History ({plot.transferHistory.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Plot Modal */}
      {isAddingPlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Register New Land Plot / Kibanja
              </h3>
              <button
                onClick={() => setIsAddingPlot(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Plot Number / Code</label>
                  <input
                    type="text"
                    required
                    value={newPlot.plotNumber}
                    onChange={(e) => setNewPlot({ ...newPlot, plotNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Zone / Cell</label>
                  <select
                    value={newPlot.zone}
                    onChange={(e) => setNewPlot({ ...newPlot, zone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="Zone A - Market View">Zone A - Market View</option>
                    <option value="Zone B - Railway Quarter">Zone B - Railway Quarter</option>
                    <option value="Zone C - Banda Border">Zone C - Banda Border</option>
                    <option value="Zone D - Naguru Border">Zone D - Naguru Border</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Size / Dimensions</label>
                  <input
                    type="text"
                    required
                    value={newPlot.size}
                    onChange={(e) => setNewPlot({ ...newPlot, size: e.target.value })}
                    placeholder="e.g. 50 x 100 ft"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tenure Type</label>
                  <select
                    value={newPlot.tenureType}
                    onChange={(e) => setNewPlot({ ...newPlot, tenureType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="kibanja">Kibanja (Customary bibanja on Mailo)</option>
                    <option value="mailo">Mailo Land Title</option>
                    <option value="leasehold">Leasehold (KCCA/Govt)</option>
                    <option value="customary">Customary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPlot.currentOwnerName}
                    onChange={(e) => setNewPlot({ ...newPlot, currentOwnerName: e.target.value })}
                    placeholder="e.g. Kato James Wasswa"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Owner National ID (NIN)</label>
                  <input
                    type="text"
                    value={newPlot.ownerNIN}
                    onChange={(e) => setNewPlot({ ...newPlot, ownerNIN: e.target.value })}
                    placeholder="CM840..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">LC1 Witnessed Agreement Ref</label>
                  <input
                    type="text"
                    value={newPlot.lc1AgreementRef}
                    onChange={(e) => setNewPlot({ ...newPlot, lc1AgreementRef: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Purchase / Allotment Date</label>
                  <input
                    type="date"
                    value={newPlot.purchaseDate}
                    onChange={(e) => setNewPlot({ ...newPlot, purchaseDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* 4 Boundary Neighbors Section */}
              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700 space-y-2">
                <div className="font-semibold text-amber-400 uppercase text-[11px]">
                  Boundary Neighbors (Crucial: Required to prevent selling to 2 buyers)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-0.5">North Neighbor</label>
                    <input
                      type="text"
                      required
                      value={newPlot.north}
                      onChange={(e) => setNewPlot({ ...newPlot, north: e.target.value })}
                      placeholder="e.g. Kiyingi Samuel (Plot 104A)"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-0.5">South Neighbor</label>
                    <input
                      type="text"
                      required
                      value={newPlot.south}
                      onChange={(e) => setNewPlot({ ...newPlot, south: e.target.value })}
                      placeholder="e.g. Access Road"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-0.5">East Neighbor</label>
                    <input
                      type="text"
                      value={newPlot.east}
                      onChange={(e) => setNewPlot({ ...newPlot, east: e.target.value })}
                      placeholder="e.g. Namutebi Agnes"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-[11px] mb-0.5">West Neighbor</label>
                    <input
                      type="text"
                      value={newPlot.west}
                      onChange={(e) => setNewPlot({ ...newPlot, west: e.target.value })}
                      placeholder="e.g. Drainage Channel"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingPlot(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Save Plot Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Witness Transfer Modal */}
      {isTransferringPlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Witness Land Sale / Transfer</h3>
                <p className="text-xs text-amber-400 font-mono">Plot: {isTransferringPlot.plotNumber}</p>
              </div>
              <button
                onClick={() => setIsTransferringPlot(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
              <div className="bg-slate-800/50 p-2.5 rounded border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Seller / Current Owner:</span>
                <span className="font-bold text-white text-sm">{isTransferringPlot.currentOwnerName}</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  New Buyer Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transferData.buyer}
                  onChange={(e) => setTransferData({ ...transferData, buyer: e.target.value })}
                  placeholder="e.g. Kiwanuka Patrick"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Buyer National ID (NIN)</label>
                <input
                  type="text"
                  value={transferData.buyerNIN}
                  onChange={(e) => setTransferData({ ...transferData, buyerNIN: e.target.value })}
                  placeholder="CM9..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Witnessing Council Officials</label>
                <input
                  type="text"
                  value={transferData.witnessedBy}
                  onChange={(e) => setTransferData({ ...transferData, witnessedBy: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Agreement Notes &amp; Consideration</label>
                <textarea
                  rows={2}
                  value={transferData.notes}
                  onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTransferringPlot(null)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Execute Official Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail & Transfer History Modal */}
      {selectedPlotForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Chain of Custody &amp; Transfer History</h3>
                <p className="text-xs text-amber-400 font-mono">
                  {selectedPlotForDetail.plotNumber} • {selectedPlotForDetail.zone}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlotForDetail(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto text-xs">
              {selectedPlotForDetail.transferHistory.length === 0 ? (
                <div className="text-slate-400 py-4 text-center">
                  No prior transfers recorded. Original allotment by village elders.
                </div>
              ) : (
                selectedPlotForDetail.transferHistory.map((t, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-400">
                      <span className="font-semibold">Transfer #{selectedPlotForDetail.transferHistory.length - idx}</span>
                      <span>Date: {t.transferDate}</span>
                    </div>
                    <div className="text-slate-200">
                      <span className="text-slate-400">From: </span>
                      <span className="font-semibold">{t.previousOwner}</span> &rarr;{' '}
                      <span className="text-slate-400">To: </span>
                      <span className="font-semibold text-emerald-400">{t.buyer}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Witness: <span className="text-slate-300">{t.witnessedBy}</span>
                    </div>
                    {t.notes && <p className="text-[11px] text-slate-400 italic mt-1">{t.notes}</p>}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedPlotForDetail(null)}
                className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
