import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { CouncilResolution } from '../types';
import {
  FileText,
  Calendar,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Archive,
  Users,
  Shield,
  X,
  Sparkles,
} from 'lucide-react';

export const CouncilMinutes: React.FC = () => {
  const { resolutions, addResolution, currentUser } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState<'all' | 'older_than_6_months' | 'recent'>('all');
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);

  // New meeting form
  const [meetingForm, setMeetingForm] = useState({
    meetingDate: new Date().toISOString().slice(0, 10),
    meetingType: 'executive_committee' as CouncilResolution['meetingType'],
    referenceNo: `MIN/NKW/${new Date().getFullYear()}/${String(resolutions.length + 1).padStart(2, '0')}`,
    agenda: '',
    recordedBy: `${currentUser.name} (${currentUser.role.replace('_', ' ')})`,
    attendeesCount: 9,
    attendeesKey: 'Chairperson, Vice Chairperson, Secretary, Defense',
    resolutionTitle: '',
    resolutionDesc: '',
    resolutionCat: 'security' as const,
    deadline: '',
    minutesNotes: '',
  });

  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

  const filteredMeetings = resolutions.filter((res) => {
    const resDate = new Date(res.meetingDate);
    const matchesSearch =
      res.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.agenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.minutesNotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.resolutions.some(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesAge =
      filterAge === 'all' ||
      (filterAge === 'older_than_6_months' && resDate < sixMonthsAgo) ||
      (filterAge === 'recent' && resDate >= sixMonthsAgo);

    return matchesSearch && matchesAge;
  });

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingForm.agenda.trim()) {
      alert('Meeting agenda is required.');
      return;
    }
    if (!meetingForm.resolutionTitle.trim()) {
      alert('At least one resolution title is required.');
      return;
    }

    addResolution({
      meetingDate: meetingForm.meetingDate,
      meetingType: meetingForm.meetingType,
      referenceNo: meetingForm.referenceNo.trim(),
      agenda: meetingForm.agenda.trim(),
      recordedBy: meetingForm.recordedBy.trim(),
      attendeesCount: Number(meetingForm.attendeesCount) || 1,
      attendeesKey: meetingForm.attendeesKey.split(',').map((s) => s.trim()),
      resolutions: [
        {
          id: `res-${Date.now()}`,
          title: meetingForm.resolutionTitle.trim(),
          description: meetingForm.resolutionDesc.trim() || meetingForm.agenda.trim(),
          category: meetingForm.resolutionCat,
          enforcementDeadline: meetingForm.deadline || undefined,
          status: 'enacted',
        },
      ],
      minutesNotes: meetingForm.minutesNotes.trim() || 'Duly passed by LC1 Committee.',
    });

    setIsAddingMeeting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header addressing the 6-month resolution tracing problem */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Archive className="w-3.5 h-3.5" />
              Digital Committee Archive • Beyond 6 Months Tracing
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Nakawa LC1 Council Minutes &amp; Resolutions Archive
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              Permanently archives council decisions, meeting minutes, and village bylaws. Solves the challenge
              where secretaries could not trace resolutions passed more than six months ago.
            </p>
          </div>

          <button
            onClick={() => setIsAddingMeeting(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            Record Meeting &amp; Resolutions
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, agenda, resolution text, reference..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* 6-Month Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Time Filter:</span>
          <button
            onClick={() => setFilterAge('all')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterAge === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            All Minutes
          </button>
          <button
            onClick={() => setFilterAge('older_than_6_months')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer flex items-center gap-1 ${
              filterAge === 'older_than_6_months'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
            title="Resolutions passed over 6 months ago"
          >
            <Clock className="w-3.5 h-3.5" />
            &gt; 6 Months Ago
          </button>
          <button
            onClick={() => setFilterAge('recent')}
            className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterAge === 'recent'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Meeting Records List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No meeting minutes or resolutions match your search or filter.
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-xs"
            >
              {/* Meeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {meeting.referenceNo}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                        {meeting.meetingType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Meeting Date: {meeting.meetingDate}
                      </span>
                      <span>•</span>
                      <span>Recorded By: {meeting.recordedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{meeting.attendeesCount} Committee Members Attended</span>
                </div>
              </div>

              {/* Agenda */}
              <div className="text-xs text-slate-200 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
                <span className="font-bold text-amber-400 block text-[10px] uppercase tracking-wider mb-0.5">
                  Deliberated Agenda
                </span>
                <p className="leading-relaxed">{meeting.agenda}</p>
              </div>

              {/* Resolutions List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Resolutions Passed &amp; Enforced ({meeting.resolutions.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meeting.resolutions.map((r) => (
                    <div
                      key={r.id}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100">{r.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {r.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {r.description}
                      </p>
                      {r.enforcementDeadline && (
                        <div className="text-[10px] text-amber-400 font-mono pt-1">
                          Deadline: {r.enforcementDeadline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Attendees Key */}
              <div className="text-[11px] text-slate-400 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Key Signatories:</span>
                {meeting.attendeesKey.map((att, i) => (
                  <span
                    key={i}
                    className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 text-slate-300"
                  >
                    {att}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Meeting Modal */}
      {isAddingMeeting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Record LC1 Council Meeting &amp; Resolutions
              </h3>
              <button
                onClick={() => setIsAddingMeeting(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={meetingForm.meetingDate}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meetingDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Reference Number</label>
                  <input
                    type="text"
                    required
                    value={meetingForm.referenceNo}
                    onChange={(e) => setMeetingForm({ ...meetingForm, referenceNo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Meeting Type</label>
                  <select
                    value={meetingForm.meetingType}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meetingType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="executive_committee">Executive Committee Meeting</option>
                    <option value="general_village_meeting">General Village Baraza</option>
                    <option value="emergency_security">Emergency Security Council</option>
                    <option value="arbitration">Land / Family Arbitration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Attendees Count</label>
                  <input
                    type="number"
                    value={meetingForm.attendeesCount}
                    onChange={(e) => setMeetingForm({ ...meetingForm, attendeesCount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">
                    Meeting Agenda &amp; Deliberations <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={meetingForm.agenda}
                    onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                    placeholder="e.g. Assessment of drainage desilting along Port Bell corridor..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">
                    Primary Resolution Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingForm.resolutionTitle}
                    onChange={(e) => setMeetingForm({ ...meetingForm, resolutionTitle: e.target.value })}
                    placeholder="e.g. Mandatory Landlord Tenant Registration Notice"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">Resolution Specifics &amp; Terms</label>
                  <textarea
                    rows={2}
                    value={meetingForm.resolutionDesc}
                    onChange={(e) => setMeetingForm({ ...meetingForm, resolutionDesc: e.target.value })}
                    placeholder="Details of the resolution passed..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Resolution Category</label>
                  <select
                    value={meetingForm.resolutionCat}
                    onChange={(e) => setMeetingForm({ ...meetingForm, resolutionCat: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="security">Security &amp; Defense</option>
                    <option value="land_boundary">Land &amp; Boundary</option>
                    <option value="sanitation">Sanitation &amp; Health</option>
                    <option value="infrastructure">Roads &amp; Infrastructure</option>
                    <option value="welfare">Social Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Enforcement Deadline</label>
                  <input
                    type="date"
                    value={meetingForm.deadline}
                    onChange={(e) => setMeetingForm({ ...meetingForm, deadline: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingMeeting(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Save to Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
