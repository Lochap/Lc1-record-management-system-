export type CitizenCategory = 'permanent' | 'tenant' | 'visitor' | 'home_employee' | 'child';

export type AccessRole = 'chairperson' | 'vice_chairperson' | 'general_secretary' | 'defense_secretary' | 'committee_member' | 'records_clerk';

export interface Citizen {
  id: string;
  villageId: string; // e.g. "NKW-LC1-0024"
  fullName: string;
  nin?: string; // National Identification Number (e.g., CM9001...)
  category: CitizenCategory;
  gender: 'male' | 'female' | 'other';
  dob: string; // YYYY-MM-DD
  phone: string;
  alternatePhone?: string;
  zone: string; // Cell or Zone within Nakawa (e.g. Zone A, Banda Border, Railway Quarter)
  householdNumber: string; // House/Plot code
  residentialAddress: string;
  occupation: string;
  employerOrWorkplace?: string;
  landlordName?: string; // If tenant or home employee
  landlordPhone?: string;
  isLandowner: boolean;
  registeredDate: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
  };
  healthProfile: {
    bloodGroup?: string;
    chronicConditions?: string;
    immunizationStatus?: 'full' | 'partial' | 'unknown' | 'na';
    hasDisability?: boolean;
    disabilityDetails?: string;
  };
  educationLevel?: 'none' | 'primary' | 'secondary' | 'vocational' | 'tertiary' | 'university';
  notes?: string;
  status: 'active' | 'relocated' | 'deceased';
}

export interface LandRecord {
  id: string;
  plotNumber: string; // e.g., "NKW-PLT-104B"
  zone: string;
  size: string; // e.g. "50 x 100 ft" or "0.25 Acres"
  tenureType: 'kibanja' | 'mailo' | 'leasehold' | 'customary';
  currentOwnerId: string; // Citizen ID
  currentOwnerName: string;
  ownerNIN: string;
  purchaseDate: string;
  witnessedByLC1: boolean;
  lc1AgreementRef: string;
  boundaryNeighbors: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  disputeStatus: 'clear' | 'under_review' | 'disputed';
  disputeNotes?: string;
  transferHistory: {
    previousOwner: string;
    transferDate: string;
    buyer: string;
    witnessedBy: string;
    notes?: string;
  }[];
}

export interface CouncilResolution {
  id: string;
  meetingDate: string;
  meetingType: 'executive_committee' | 'general_village_meeting' | 'emergency_security' | 'arbitration';
  referenceNo: string; // e.g. "MIN/NKW/2025/08"
  agenda: string;
  recordedBy: string; // Name and title
  attendeesCount: number;
  attendeesKey: string[]; // e.g. ["Chairperson: J. Okello", "Secretary: S. Namubiru"]
  resolutions: {
    id: string;
    title: string;
    description: string;
    category: 'security' | 'land_boundary' | 'sanitation' | 'infrastructure' | 'welfare' | 'administrative';
    enforcementDeadline?: string;
    status: 'enacted' | 'in_progress' | 'archived';
  }[];
  minutesNotes: string;
}

export interface OfficialDocument {
  id: string;
  documentNumber: string; // e.g. "DOC-LC1-2026-0391"
  citizenId: string;
  citizenName: string;
  citizenNIN?: string;
  documentType: 'village_id_recommendation' | 'nira_endorsement' | 'proof_of_residence' | 'land_verification_letter' | 'good_conduct_clearance';
  purpose: string;
  issueDate: string;
  issuedBy: string;
  issuedRole: string;
  qrVerificationHash: string;
  status: 'valid' | 'expired' | 'revoked';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AccessRole;
  active: boolean;
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'citizen' | 'land' | 'resolution' | 'document' | 'user';
  entityId: string;
  details: string;
}
