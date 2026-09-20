import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  Building,
  HeartPulse,
  GraduationCap,
  Car,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const CensusReportView: React.FC = () => {
  const { citizens, landRecords, resolutions } = useDatabase();

  const totalPop = citizens.length;
  const males = citizens.filter((c) => c.gender === 'male').length;
  const females = citizens.filter((c) => c.gender === 'female').length;

  const childrenCount = citizens.filter((c) => c.category === 'child').length;
  const tenantsCount = citizens.filter((c) => c.category === 'tenant').length;
  const permanentCount = citizens.filter((c) => c.category === 'permanent').length;
  const homeEmployeesCount = citizens.filter((c) => c.category === 'home_employee').length;
  const visitorsCount = citizens.filter((c) => c.category === 'visitor').length;

  const fullyImmunized = citizens.filter(
    (c) => c.healthProfile.immunizationStatus === 'full'
  ).length;

  const educationBreakdown = {
    primary: citizens.filter((c) => c.educationLevel === 'primary').length,
    secondary: citizens.filter((c) => c.educationLevel === 'secondary').length,
    vocational: citizens.filter((c) => c.educationLevel === 'vocational').length,
    tertiary_uni: citizens.filter(
      (c) => c.educationLevel === 'tertiary' || c.educationLevel === 'university'
    ).length,
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header addressing the bottom-to-top flow & UBOS census problem */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building className="w-3.5 h-3.5" />
              Bottom-to-Top Governance • Parish &rarr; Sub-County &rarr; District
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Nakawa LC1 Population Census &amp; Sector Welfare Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              Replaces costly manual census walking. Generates automated demographic and welfare analytics
              to feed directly into Parish Development Model (PDM), KCCA, and UBOS district planning.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={handlePrintReport}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Parish Report
            </button>
          </div>
        </div>
      </div>

      {/* Sector Impact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Sector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Health Sector Indicators</h3>
              <div className="text-[11px] text-slate-400">Hospitals &amp; Health Centers (HC IV)</div>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Child Immunization Coverage:</span>
              <span className="font-bold text-emerald-400">
                {totalPop > 0 ? Math.round((fullyImmunized / totalPop) * 100) : 0}% Fully Immunized
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Vulnerable / Chronic Patients:</span>
              <span className="font-bold text-white">
                {citizens.filter((c) => c.healthProfile.chronicConditions).length} Tracked
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Health Priority in Village:</span>
              <span className="text-slate-200">Drainage Desilting &amp; Sanitation</span>
            </div>
          </div>
        </div>

        {/* Education Sector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-400">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Education Sector Profile</h3>
              <div className="text-[11px] text-slate-400">UPE &amp; USE School Planning</div>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Primary Age Pupils:</span>
              <span className="font-bold text-white">{educationBreakdown.primary} enrolled</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Secondary School Students:</span>
              <span className="font-bold text-white">{educationBreakdown.secondary} registered</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Higher Education / University:</span>
              <span className="font-bold text-white">{educationBreakdown.tertiary_uni} scholars</span>
            </div>
          </div>
        </div>

        {/* Transport & Infrastructure */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Transport &amp; Roads</h3>
              <div className="text-[11px] text-slate-400">KCCA Division Feedback</div>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Registered Land Plots:</span>
              <span className="font-bold text-white">{landRecords.length} surveyed plots</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Active Road Infrastructure Resolutions:</span>
              <span className="font-bold text-amber-400">2 Enacted</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Key Corridor:</span>
              <span className="text-slate-200">Port Bell Rd &amp; Muteesa II Close</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Bottom-to-Top Printable Summary Report */}
      <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-sm border border-slate-300 space-y-6">
        <div className="text-center border-b pb-4 space-y-1">
          <div className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
            THE REPUBLIC OF UGANDA • LOCAL GOVERNMENT SYSTEM
          </div>
          <h3 className="text-lg font-extrabold uppercase text-slate-950">
            NAKAWA LOCAL COUNCIL 1 (LC1) STATISTICAL SUBMISSION
          </h3>
          <p className="text-xs text-slate-700">
            Transmitted to: Nakawa Parish Chief &bull; Nakawa Sub-County / Division &bull; Kampala District (KCCA)
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Reporting Date: {new Date().toISOString().slice(0, 10)} &bull; Automated Census Ledger
          </div>
        </div>

        {/* Aggregate Breakdown Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
            1. Population Classification Matrix (Uganda Local Gov Act Cap 243)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 font-bold">Category</th>
                  <th className="p-2 border-r border-slate-300 font-bold">Total Headcount</th>
                  <th className="p-2 border-r border-slate-300 font-bold">% of Village</th>
                  <th className="p-2 font-bold">Governance &amp; Security Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">Permanent Residents / Natives</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{permanentCount}</td>
                  <td className="p-2 border-r border-slate-300">
                    {totalPop > 0 ? Math.round((permanentCount / totalPop) * 100) : 0}%
                  </td>
                  <td className="p-2 text-slate-600">Landowners and customary bibanja occupants</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">Tenants (Renters)</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{tenantsCount}</td>
                  <td className="p-2 border-r border-slate-300">
                    {totalPop > 0 ? Math.round((tenantsCount / totalPop) * 100) : 0}%
                  </td>
                  <td className="p-2 text-slate-600">Registered with active landlord agreements</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">Home Employees (Domestic Staff)</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{homeEmployeesCount}</td>
                  <td className="p-2 border-r border-slate-300">
                    {totalPop > 0 ? Math.round((homeEmployeesCount / totalPop) * 100) : 0}%
                  </td>
                  <td className="p-2 text-slate-600">Vetted by LC1 Defense Secretary</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">Visitors (Temporary Stay)</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{visitorsCount}</td>
                  <td className="p-2 border-r border-slate-300">
                    {totalPop > 0 ? Math.round((visitorsCount / totalPop) * 100) : 0}%
                  </td>
                  <td className="p-2 text-slate-600">Internships, students, temporary guests (&lt; 6 mos)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">Children &amp; Minors (&lt; 18)</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{childrenCount}</td>
                  <td className="p-2 border-r border-slate-300">
                    {totalPop > 0 ? Math.round((childrenCount / totalPop) * 100) : 0}%
                  </td>
                  <td className="p-2 text-slate-600">Eligible for primary/secondary schooling &amp; health drives</td>
                </tr>
                <tr className="bg-slate-100 font-bold">
                  <td className="p-2 border-r border-slate-300">Total Village Population</td>
                  <td className="p-2 border-r border-slate-300">{totalPop}</td>
                  <td className="p-2 border-r border-slate-300">100%</td>
                  <td className="p-2">Males: {males} | Females: {females}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Parish Chief Sign-off */}
        <div className="flex justify-between items-end pt-6 border-t border-slate-300 text-xs">
          <div>
            <div className="font-bold text-slate-900">Submitted by: Nakawa LC1 Chairperson</div>
            <div className="text-slate-600">Mugisha Patrick</div>
            <div className="h-0.5 w-40 bg-slate-900 mt-2"></div>
            <div className="text-[10px] text-slate-500">Date &amp; Signature</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-900">Received by: Nakawa Parish Chief</div>
            <div className="text-slate-600">Parish Development Model Secretariat</div>
            <div className="h-0.5 w-40 bg-slate-900 mt-2 ml-auto"></div>
            <div className="text-[10px] text-slate-500">Official Parish Stamp &amp; Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
