import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Citizen, OfficialDocument } from '../types';
import {
  FileBadge,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Download,
  Search,
  Plus,
  QrCode,
  X,
  FileText,
} from 'lucide-react';

interface DocumentGeneratorProps {
  preselectedCitizen?: Citizen | null;
  onClearPreselectedCitizen?: () => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  preselectedCitizen,
  onClearPreselectedCitizen,
}) => {
  const { documents, issueDocument, revokeDocument, citizens, currentUser } = useDatabase();

  const [activeTab, setActiveTab] = useState<'issued_list' | 'create_new'>('issued_list');
  const [selectedDocToPrint, setSelectedDocToPrint] = useState<OfficialDocument | null>(null);

  // Form State
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>(
    preselectedCitizen ? preselectedCitizen.id : citizens[0]?.id || ''
  );
  const [docType, setDocType] = useState<OfficialDocument['documentType']>('village_id_recommendation');
  const [purpose, setPurpose] = useState(
    'Application for Uganda National Identification Card (NIRA) and verification of Ugandan citizenship & Nakawa residence.'
  );

  const selectedCitizen = citizens.find((c) => c.id === selectedCitizenId);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizen) return;

    const newDoc = issueDocument({
      citizenId: selectedCitizen.id,
      citizenName: selectedCitizen.fullName,
      citizenNIN: selectedCitizen.nin,
      documentType: docType,
      purpose: purpose.trim(),
      issuedBy: currentUser.name,
      issuedRole: currentUser.role.replace('_', ' ').toUpperCase(),
    });

    setSelectedDocToPrint(newDoc);
    setActiveTab('issued_list');
    if (onClearPreselectedCitizen) onClearPreselectedCitizen();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              NIRA National ID &amp; Village Clearance Engine
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Official LC1 Stamped Recommendation Letters &amp; IDs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              Eliminating citizen delays at NIRA and banks. Generates verifiable, QR-stamped LC1 recommendation
              letters, proof of residence, and land ownership certificates instantly from database records.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('create_new')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'create_new'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              Issue New Document
            </button>
            <button
              onClick={() => setActiveTab('issued_list')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'issued_list'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <FileBadge className="w-4 h-4" />
              Issued Archive ({documents.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'create_new' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Generate Official Council Letter</h3>
            <p className="text-xs text-slate-400">
              Select citizen record to autofill verified details onto authentic LC1 stationery.
            </p>
          </div>

          <form onSubmit={handleIssue} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">
                Select Registered Citizen <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedCitizenId}
                onChange={(e) => setSelectedCitizenId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {citizens.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.villageId}) • {c.category.toUpperCase()} • {c.zone}
                  </option>
                ))}
              </select>
            </div>

            {selectedCitizen && (
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-slate-300 space-y-1">
                <div className="font-semibold text-amber-400">Autofilled Verification Data:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>NIN: {selectedCitizen.nin || 'Pending Verification'}</div>
                  <div>Household: {selectedCitizen.householdNumber}</div>
                  <div>Address: {selectedCitizen.residentialAddress}</div>
                  <div>Kin: {selectedCitizen.nextOfKin.name}</div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Document Type</label>
              <select
                value={docType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setDocType(val);
                  if (val === 'village_id_recommendation') {
                    setPurpose('Application for Uganda National Identification Card (NIRA) and verification of Ugandan citizenship & Nakawa residence.');
                  } else if (val === 'proof_of_residence') {
                    setPurpose('Commercial Bank Account Opening & Proof of Village Residence for utility verification.');
                  } else if (val === 'land_verification_letter') {
                    setPurpose('Confirmation of registered plot ownership & boundary survey without counter-claims in Nakawa LC1.');
                  } else {
                    setPurpose('Official village vetting and confirmation of good conduct with no criminal record in LC1.');
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
              >
                <option value="village_id_recommendation">
                  Village Recommendation for National ID (NIRA)
                </option>
                <option value="proof_of_residence">
                  Official Proof of Residence Certificate
                </option>
                <option value="land_verification_letter">
                  Land Ownership &amp; Boundary Verification Clearance
                </option>
                <option value="good_conduct_clearance">
                  Village Character &amp; Good Conduct Clearance
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Official Purpose Statement</label>
              <textarea
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileBadge className="w-4 h-4" />
                Issue Stamped Official Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issued Documents Archive */}
      {activeTab === 'issued_list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Issued Letters Registry &amp; Verification Hashes</h3>
            <span className="text-xs text-slate-400">Traceable across all committee members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800/70 border-b border-slate-800 text-slate-300 uppercase tracking-wider">
                  <th className="py-3 px-3.5 font-semibold">Reference No</th>
                  <th className="py-3 px-3.5 font-semibold">Citizen Name &amp; NIN</th>
                  <th className="py-3 px-3.5 font-semibold">Document Type</th>
                  <th className="py-3 px-3.5 font-semibold">Issue Date</th>
                  <th className="py-3 px-3.5 font-semibold">Signatory Officer</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-amber-400">
                      {doc.documentNumber}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-100">{doc.citizenName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{doc.citizenNIN || 'No NIN'}</div>
                    </td>
                    <td className="py-3 px-3.5 capitalize text-slate-200">
                      {doc.documentType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3.5 text-slate-300">{doc.issueDate}</td>
                    <td className="py-3 px-3.5 text-slate-300">
                      {doc.issuedBy} ({doc.issuedRole})
                    </td>
                    <td className="py-3 px-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedDocToPrint(doc)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-semibold cursor-pointer"
                      >
                        Print / View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Official LC1 Letter Modal */}
      {selectedDocToPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[95vh] overflow-y-auto print:max-w-none print:w-full print:border-none print:shadow-none print:bg-white">
            {/* Modal Controls (Hidden in print) */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400">Official LC1 Letter Preview</span>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {selectedDocToPrint.documentNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Print Letterhead
                </button>
                <button
                  onClick={() => setSelectedDocToPrint(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Letterhead Canvas */}
            <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-lg shadow-md border border-slate-300 space-y-6 print:border-none print:shadow-none print:p-4">
              {/* Header Uganda Crest */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-[11px] font-bold tracking-widest uppercase text-slate-700">
                  THE REPUBLIC OF UGANDA
                </div>
                <div className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-950">
                  NAKAWA DIVISION LOCAL GOVERNMENT
                </div>
                <div className="text-sm font-bold text-slate-800">
                  OFFICE OF THE LOCAL COUNCIL I (LC1) EXECUTIVE COMMITTEE
                </div>
                <div className="text-xs text-slate-600">
                  NAKAWA PARISH • KAMPALA CAPITAL CITY AUTHORITY (KCCA)
                </div>
                <div className="text-[11px] text-slate-500">
                  P.O. Box 7010, Kampala • Tel: +256 772 458 912 • Email: nakawalc1@gov.ug
                </div>
              </div>

              {/* Reference & Date */}
              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <div>
                  <span>REF: </span>
                  <span className="font-mono text-slate-950">{selectedDocToPrint.documentNumber}</span>
                </div>
                <div>
                  <span>DATE: </span>
                  <span className="text-slate-950">{selectedDocToPrint.issueDate}</span>
                </div>
              </div>

              {/* Addressee */}
              <div className="text-xs space-y-0.5 text-slate-900">
                <div className="font-bold">TO: THE EXECUTIVE DIRECTOR / TO WHOM IT MAY CONCERN</div>
                <div>National Identification &amp; Registration Authority (NIRA) / General Authorities</div>
                <div>Kampala, Uganda</div>
              </div>

              {/* Subject */}
              <div className="text-center font-bold text-sm underline uppercase tracking-wide text-slate-950">
                RE: {selectedDocToPrint.documentType.replace(/_/g, ' ')} FOR{' '}
                {selectedDocToPrint.citizenName.toUpperCase()}
              </div>

              {/* Body Text */}
              <div className="text-xs leading-relaxed text-slate-800 space-y-3">
                <p>
                  This is to officially certify that{' '}
                  <strong className="text-slate-950">{selectedDocToPrint.citizenName}</strong>
                  {selectedDocToPrint.citizenNIN ? ` (NIN: ${selectedDocToPrint.citizenNIN})` : ''} is a duly
                  registered resident in our official Nakawa Local Council 1 (LC1) digital register.
                </p>

                <p>
                  <strong>Purpose of Endorsement:</strong> {selectedDocToPrint.purpose}
                </p>

                <p>
                  According to our verified village records, the citizen holds no adverse record of criminal or
                  subversive activity within our jurisdiction and has satisfied the vetting requirements
                  stipulated under the Local Government Act (Cap 243).
                </p>

                <p>
                  Any assistance rendered to this citizen to facilitate the above stated purpose is highly
                  appreciated by the council.
                </p>
              </div>

              {/* Signatures & Circular Stamp */}
              <div className="flex justify-between items-end pt-8 border-t border-slate-300">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-950">{selectedDocToPrint.issuedBy}</div>
                  <div className="text-slate-600 font-semibold">{selectedDocToPrint.issuedRole}</div>
                  <div className="text-[10px] text-slate-500">Nakawa LC1 Executive Committee</div>
                  <div className="h-0.5 w-36 bg-slate-900 mt-2"></div>
                  <div className="text-[10px] text-slate-500 uppercase">Authorized Signature</div>
                </div>

                {/* Simulated LC1 Official Circular Rubber Stamp */}
                <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-blue-700/80 flex flex-col items-center justify-center text-center p-1 text-blue-800 font-bold rotate-[-8deg] opacity-90 select-none">
                  <div className="text-[8px] uppercase tracking-tighter">★ NAKAWA LC1 ★</div>
                  <div className="text-[9px] uppercase leading-tight font-black">OFFICIAL STAMP</div>
                  <div className="text-[8px] font-mono">{selectedDocToPrint.issueDate}</div>
                  <div className="text-[7px] text-blue-900">VERIFIED &amp; APPROVED</div>
                </div>

                {/* QR Verification Box */}
                <div className="text-right space-y-1 text-[10px] font-mono text-slate-600">
                  <div className="w-16 h-16 border border-slate-400 bg-slate-100 p-1 flex items-center justify-center ml-auto">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div>HASH: {selectedDocToPrint.qrVerificationHash.slice(0, 16)}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
