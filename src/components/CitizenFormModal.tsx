import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Citizen, CitizenCategory } from '../types';
import { X, UserPlus, Save, AlertCircle, ShieldCheck } from 'lucide-react';

interface CitizenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCitizen?: Citizen | null;
}

export const CitizenFormModal: React.FC<CitizenFormModalProps> = ({
  isOpen,
  onClose,
  editingCitizen,
}) => {
  const { addCitizen, updateCitizen } = useDatabase();

  const [formData, setFormData] = useState({
    fullName: '',
    nin: '',
    category: 'permanent' as CitizenCategory,
    gender: 'male' as 'male' | 'female' | 'other',
    dob: '1995-01-01',
    phone: '+256 ',
    alternatePhone: '',
    zone: 'Zone A - Market View',
    householdNumber: 'NKW-HH-',
    residentialAddress: '',
    occupation: '',
    employerOrWorkplace: '',
    landlordName: '',
    landlordPhone: '',
    isLandowner: false,
    kinName: '',
    kinRelationship: 'Spouse',
    kinPhone: '+256 ',
    bloodGroup: '',
    chronicConditions: '',
    immunizationStatus: 'full' as 'full' | 'partial' | 'unknown' | 'na',
    hasDisability: false,
    educationLevel: 'secondary' as 'none' | 'primary' | 'secondary' | 'vocational' | 'tertiary' | 'university',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingCitizen) {
      setFormData({
        fullName: editingCitizen.fullName,
        nin: editingCitizen.nin || '',
        category: editingCitizen.category,
        gender: editingCitizen.gender,
        dob: editingCitizen.dob,
        phone: editingCitizen.phone,
        alternatePhone: editingCitizen.alternatePhone || '',
        zone: editingCitizen.zone,
        householdNumber: editingCitizen.householdNumber,
        residentialAddress: editingCitizen.residentialAddress,
        occupation: editingCitizen.occupation,
        employerOrWorkplace: editingCitizen.employerOrWorkplace || '',
        landlordName: editingCitizen.landlordName || '',
        landlordPhone: editingCitizen.landlordPhone || '',
        isLandowner: editingCitizen.isLandowner,
        kinName: editingCitizen.nextOfKin?.name || '',
        kinRelationship: editingCitizen.nextOfKin?.relationship || 'Spouse',
        kinPhone: editingCitizen.nextOfKin?.phone || '+256 ',
        bloodGroup: editingCitizen.healthProfile?.bloodGroup || '',
        chronicConditions: editingCitizen.healthProfile?.chronicConditions || '',
        immunizationStatus: editingCitizen.healthProfile?.immunizationStatus || 'full',
        hasDisability: editingCitizen.healthProfile?.hasDisability || false,
        educationLevel: editingCitizen.educationLevel || 'secondary',
        notes: editingCitizen.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        nin: '',
        category: 'permanent',
        gender: 'male',
        dob: '1995-01-01',
        phone: '+256 ',
        alternatePhone: '',
        zone: 'Zone A - Market View',
        householdNumber: `NKW-HH-${Math.floor(100 + Math.random() * 900)}`,
        residentialAddress: '',
        occupation: '',
        employerOrWorkplace: '',
        landlordName: '',
        landlordPhone: '',
        isLandowner: false,
        kinName: '',
        kinRelationship: 'Spouse',
        kinPhone: '+256 ',
        bloodGroup: '',
        chronicConditions: '',
        immunizationStatus: 'full',
        hasDisability: false,
        educationLevel: 'secondary',
        notes: '',
      });
    }
    setError(null);
  }, [editingCitizen, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Full legal name is required.');
      return;
    }
    if (!formData.phone.trim() || formData.phone === '+256 ') {
      setError('A valid primary phone contact is required.');
      return;
    }
    if (!formData.residentialAddress.trim()) {
      setError('Physical residential address in Nakawa is required.');
      return;
    }
    if ((formData.category === 'tenant' || formData.category === 'home_employee') && !formData.landlordName.trim()) {
      setError(`For ${formData.category === 'tenant' ? 'tenants' : 'home employees'}, landlord / host / employer name is required for council records.`);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      nin: formData.nin.trim() ? formData.nin.trim().toUpperCase() : undefined,
      category: formData.category,
      gender: formData.gender,
      dob: formData.dob,
      phone: formData.phone.trim(),
      alternatePhone: formData.alternatePhone.trim() || undefined,
      zone: formData.zone,
      householdNumber: formData.householdNumber.trim(),
      residentialAddress: formData.residentialAddress.trim(),
      occupation: formData.occupation.trim() || 'Resident',
      employerOrWorkplace: formData.employerOrWorkplace.trim() || undefined,
      landlordName: formData.landlordName.trim() || undefined,
      landlordPhone: formData.landlordPhone.trim() || undefined,
      isLandowner: formData.isLandowner,
      nextOfKin: {
        name: formData.kinName.trim() || 'Not specified',
        relationship: formData.kinRelationship,
        phone: formData.kinPhone.trim() || formData.phone,
      },
      healthProfile: {
        bloodGroup: formData.bloodGroup.trim() || undefined,
        chronicConditions: formData.chronicConditions.trim() || undefined,
        immunizationStatus: formData.immunizationStatus,
        hasDisability: formData.hasDisability,
      },
      educationLevel: formData.educationLevel,
      notes: formData.notes.trim() || undefined,
      status: 'active' as const,
    };

    if (editingCitizen) {
      updateCitizen(editingCitizen.id, payload);
    } else {
      addCitizen(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingCitizen ? 'Edit Citizen Record' : 'Register New Citizen'}
              </h3>
              <p className="text-xs text-slate-400">
                Official registration form for Nakawa Local Council 1 records database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Identification & Category (From Fig 2.1) */}
          <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
            <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              1. Citizen Category &amp; National Identity
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-medium">
                  Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Kato James Wasswa"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Citizenship Category (Fig 2.1) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CitizenCategory })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="permanent">Permanent Resident</option>
                  <option value="tenant">Tenant (Renter)</option>
                  <option value="visitor">Visitor (Temporary)</option>
                  <option value="home_employee">Home Employee (Maid/Guard)</option>
                  <option value="child">Child / Dependent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  National ID (NIN)
                </label>
                <input
                  type="text"
                  value={formData.nin}
                  onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                  placeholder="e.g. CM84023101ABCD"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-[10px] text-slate-400">Leave blank if pending NIRA ID</span>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Residential Location & Contact */}
          <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
            <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
              2. Nakawa Residence &amp; Household
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Zone / Cell <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Zone A - Market View">Zone A - Market View</option>
                  <option value="Zone B - Railway Quarter">Zone B - Railway Quarter</option>
                  <option value="Zone C - Banda Border">Zone C - Banda Border</option>
                  <option value="Zone D - Naguru Border">Zone D - Naguru Border</option>
                  <option value="Zone E - Port Bell Corridor">Zone E - Port Bell Corridor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Household Code</label>
                <input
                  type="text"
                  value={formData.householdNumber}
                  onChange={(e) => setFormData({ ...formData, householdNumber: e.target.value })}
                  placeholder="NKW-HH-..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Primary Phone <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+256 700 000 000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-300 mb-1 font-medium">
                  Physical Residential Address / Landmark <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  placeholder="e.g. Plot 14B, Port Bell Road Junction, opposite Nakawa Market gate"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Occupation & Landlord/Host (For security & tenancy tracking) */}
          <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
            <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
              3. Occupation &amp; Property / Tenancy Status
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Occupation / Profession</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Trader, Teacher, Housemaid, Student"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Employer / School / Workplace</label>
                <input
                  type="text"
                  value={formData.employerOrWorkplace}
                  onChange={(e) => setFormData({ ...formData, employerOrWorkplace: e.target.value })}
                  placeholder="e.g. MUBS, Nakawa Market, Self-employed"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isLandowner}
                    onChange={(e) => setFormData({ ...formData, isLandowner: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                  <span>Is Registered Landowner in LC1</span>
                </label>
              </div>

              {(formData.category === 'tenant' || formData.category === 'home_employee' || formData.category === 'visitor') && (
                <>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">
                      Landlord / Host / Employer Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.landlordName}
                      onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                      placeholder="e.g. Hajji Sulaiman Kibirige"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Landlord / Host Contact</label>
                    <input
                      type="text"
                      value={formData.landlordPhone}
                      onChange={(e) => setFormData({ ...formData, landlordPhone: e.target.value })}
                      placeholder="+256 700 000 000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 4: Next of Kin & Health/Census Profile */}
          <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
            <div className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
              4. Next of Kin &amp; Welfare Profile (For Parish Census)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Next of Kin Name</label>
                <input
                  type="text"
                  value={formData.kinName}
                  onChange={(e) => setFormData({ ...formData, kinName: e.target.value })}
                  placeholder="e.g. Nalubega Prossy"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Kin Relationship</label>
                <select
                  value={formData.kinRelationship}
                  onChange={(e) => setFormData({ ...formData, kinRelationship: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Friend/Neighbor">Neighbor / Elder</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Kin Contact</label>
                <input
                  type="text"
                  value={formData.kinPhone}
                  onChange={(e) => setFormData({ ...formData, kinPhone: e.target.value })}
                  placeholder="+256 700 000 000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="none">None</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary (O/A Level)</option>
                  <option value="vocational">Vocational / Technical</option>
                  <option value="tertiary">Diploma / Tertiary</option>
                  <option value="university">University Degree</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Immunization Status</label>
                <select
                  value={formData.immunizationStatus}
                  onChange={(e) => setFormData({ ...formData, immunizationStatus: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="full">Full / Complete</option>
                  <option value="partial">Partial</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Blood Group</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  placeholder="e.g. O+, A+, B+"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              <Save className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              {editingCitizen ? 'Update Record' : 'Save Citizen to Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
