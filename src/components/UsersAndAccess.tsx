import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { AccessRole, UserAccount } from '../types';
import {
  ShieldAlert,
  UserPlus,
  Lock,
  Eye,
  Key,
  CheckCircle2,
  AlertCircle,
  Activity,
  Users,
  X,
  FileCheck,
} from 'lucide-react';

export const UsersAndAccess: React.FC = () => {
  const { users, currentUser, addUser, auditLogs } = useDatabase();

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '+256 ',
    role: 'committee_member' as AccessRole,
    active: true,
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Name and email are required.');
      return;
    }

    addUser({
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      phone: newUser.phone.trim(),
      role: newUser.role,
      active: newUser.active,
    });

    setIsAddingUser(false);
    setNewUser({
      name: '',
      email: '',
      phone: '+256 ',
      role: 'committee_member',
      active: true,
    });
  };

  const rolesMatrix = [
    {
      role: 'Chairperson',
      code: 'chairperson',
      permissions: ['Full Access', 'Sign LC1 Letters', 'Witness Land Sales', 'Approve Bylaws', 'Audit Logs'],
    },
    {
      role: 'General Secretary',
      code: 'general_secretary',
      permissions: ['Manage Citizens', 'Record Minutes', 'Draft Official Letters', 'Issue Residence Proof', 'Audit Logs'],
    },
    {
      role: 'Defense Secretary',
      code: 'defense_secretary',
      permissions: ['Verify Domestic Workers', 'Land Boundary Inspections', 'Security Clearance', 'Dispute Flagging'],
    },
    {
      role: 'Records Clerk',
      code: 'records_clerk',
      permissions: ['Citizen Search', 'Data Entry', 'Autofill ID Forms', 'Census Export'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header addressing committee absence problem */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Key className="w-3.5 h-3.5" />
              Multi-Officer Decentralized Access
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Committee Users &amp; Access Levels
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              Directly solves the limitation where files were locked in one office and service stalled
              when the secretary was absent. Any authorized committee official can now securely access and verify records.
            </p>
          </div>

          <button
            onClick={() => setIsAddingUser(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            Add Committee Officer
          </button>
        </div>
      </div>

      {/* Grid: Active Users + Role Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officers List (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Registered LC1 Committee Officers</h3>
            <span className="text-xs text-slate-400">{users.length} Active Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.map((u) => {
              const isCurrent = u.id === currentUser.id;

              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-xs'
                      : 'bg-slate-800/50 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                        {u.name}
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-400 font-semibold capitalize mt-0.5">
                        {u.role.replace('_', ' ')}
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <div className="text-slate-300 space-y-0.5 pt-1 border-t border-slate-700/40 text-[11px]">
                    <div>Email: {u.email}</div>
                    <div>Phone: {u.phone}</div>
                    <div className="text-slate-400 text-[10px]">Last login: {u.lastLogin}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Access Matrix (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Role Permissions Matrix
          </h3>
          <p className="text-xs text-slate-300">
            Enforces strict separation of duties and security as outlined in Fig 2.1 Categories node.
          </p>

          <div className="space-y-3 text-xs">
            {rolesMatrix.map((rm) => (
              <div key={rm.code} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-1.5">
                <div className="font-bold text-amber-300">{rm.role}</div>
                <div className="flex flex-wrap gap-1">
                  {rm.permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Trail (Ensures accountability when multiple officers work on records) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">System Security &amp; Activity Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-400">All actions tamper-proof &amp; timestamped</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-2 font-semibold">Timestamp</th>
                <th className="pb-2 font-semibold">Officer Name &amp; Role</th>
                <th className="pb-2 font-semibold">Action</th>
                <th className="pb-2 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5">
                    <span className="font-semibold text-slate-200">{log.userName}</span>{' '}
                    <span className="text-[10px] text-amber-400">({log.userRole})</span>
                  </td>
                  <td className="py-2.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Committee Member Account</h3>
              <button
                onClick={() => setIsAddingUser(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Officer Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Akello Betty"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. vicechair@nakawalc1.gov.ug"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Contact</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Council Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AccessRole })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                >
                  <option value="chairperson">LC1 Chairperson</option>
                  <option value="vice_chairperson">Vice Chairperson</option>
                  <option value="general_secretary">General Secretary</option>
                  <option value="defense_secretary">Defense Secretary</option>
                  <option value="committee_member">Committee Member</option>
                  <option value="records_clerk">Records Clerk</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
