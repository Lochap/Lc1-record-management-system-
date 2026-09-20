import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Citizen,
  LandRecord,
  CouncilResolution,
  OfficialDocument,
  UserAccount,
  AuditLog,
  AccessRole,
  CitizenCategory,
} from '../types';
import {
  INITIAL_CITIZENS,
  INITIAL_LAND_RECORDS,
  INITIAL_RESOLUTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

interface DatabaseContextType {
  citizens: Citizen[];
  landRecords: LandRecord[];
  resolutions: CouncilResolution[];
  documents: OfficialDocument[];
  users: UserAccount[];
  auditLogs: AuditLog[];
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  // Citizen actions
  addCitizen: (citizen: Omit<Citizen, 'id' | 'villageId' | 'registeredDate'>) => Citizen;
  updateCitizen: (id: string, updates: Partial<Citizen>) => void;
  deleteCitizen: (id: string) => void;
  // Land actions
  addLandRecord: (record: Omit<LandRecord, 'id'>) => LandRecord;
  updateLandRecord: (id: string, updates: Partial<LandRecord>) => void;
  addLandTransfer: (landId: string, transfer: { previousOwner: string; transferDate: string; buyer: string; witnessedBy: string; notes?: string }) => void;
  // Resolution actions
  addResolution: (res: Omit<CouncilResolution, 'id'>) => CouncilResolution;
  updateResolution: (id: string, updates: Partial<CouncilResolution>) => void;
  // Document actions
  issueDocument: (doc: Omit<OfficialDocument, 'id' | 'documentNumber' | 'qrVerificationHash' | 'issueDate' | 'status'>) => OfficialDocument;
  revokeDocument: (id: string) => void;
  // User actions
  addUser: (user: Omit<UserAccount, 'id' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  // Backup & Reset
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CITIZENS: 'nakawa_lc1_citizens_v1',
  LAND: 'nakawa_lc1_land_v1',
  RESOLUTIONS: 'nakawa_lc1_resolutions_v1',
  DOCUMENTS: 'nakawa_lc1_documents_v1',
  USERS: 'nakawa_lc1_users_v1',
  LOGS: 'nakawa_lc1_logs_v1',
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CITIZENS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CITIZENS;
  });

  const [landRecords, setLandRecords] = useState<LandRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAND);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LAND_RECORDS;
  });

  const [resolutions, setResolutions] = useState<CouncilResolution[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOLUTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_RESOLUTIONS;
  });

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DOCUMENTS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => users[0] || INITIAL_USERS[0]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITIZENS, JSON.stringify(citizens));
  }, [citizens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAND, JSON.stringify(landRecords));
  }, [landRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(resolutions));
  }, [resolutions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16).replace('T', ' ');
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: formatted,
      userName: currentUser.name,
      userRole: currentUser.role.replace('_', ' ').toUpperCase(),
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const addCitizen = (data: Omit<Citizen, 'id' | 'villageId' | 'registeredDate'>): Citizen => {
    const nextNum = citizens.length + 1;
    const villageId = `NKW-LC1-${String(nextNum).padStart(4, '0')}`;
    const id = `ctz-${Date.now()}`;
    const registeredDate = new Date().toISOString().slice(0, 10);
    const newCitizen: Citizen = {
      ...data,
      id,
      villageId,
      registeredDate,
    };
    setCitizens((prev) => [newCitizen, ...prev]);
    addAuditLog('CITIZEN_REGISTERED', 'citizen', id, `Registered ${newCitizen.fullName} (${newCitizen.category.toUpperCase()}) under Village ID ${villageId}`);
    return newCitizen;
  };

  const updateCitizen = (id: string, updates: Partial<Citizen>) => {
    setCitizens((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    const found = citizens.find((c) => c.id === id);
    addAuditLog('CITIZEN_UPDATED', 'citizen', id, `Updated records for ${found ? found.fullName : id}`);
  };

  const deleteCitizen = (id: string) => {
    const target = citizens.find((c) => c.id === id);
    setCitizens((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('CITIZEN_DELETED', 'citizen', id, `Archived/deleted citizen ${target ? target.fullName : id}`);
  };

  const addLandRecord = (record: Omit<LandRecord, 'id'>): LandRecord => {
    const id = `land-${Date.now()}`;
    const newRecord: LandRecord = { ...record, id };
    setLandRecords((prev) => [newRecord, ...prev]);
    addAuditLog('LAND_RECORD_CREATED', 'land', id, `Registered Plot ${record.plotNumber} under owner ${record.currentOwnerName}`);
    return newRecord;
  };

  const updateLandRecord = (id: string, updates: Partial<LandRecord>) => {
    setLandRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    addAuditLog('LAND_RECORD_MODIFIED', 'land', id, `Updated land details for Plot ${updates.plotNumber || id}`);
  };

  const addLandTransfer = (landId: string, transfer: { previousOwner: string; transferDate: string; buyer: string; witnessedBy: string; notes?: string }) => {
    setLandRecords((prev) =>
      prev.map((r) => {
        if (r.id === landId) {
          return {
            ...r,
            currentOwnerName: transfer.buyer,
            transferHistory: [transfer, ...r.transferHistory],
          };
        }
        return r;
      })
    );
    addAuditLog('LAND_TRANSFER_RECORDED', 'land', landId, `Witnessed transfer of plot to ${transfer.buyer}`);
  };

  const addResolution = (res: Omit<CouncilResolution, 'id'>): CouncilResolution => {
    const id = `res-${Date.now()}`;
    const newRes: CouncilResolution = { ...res, id };
    setResolutions((prev) => [newRes, ...prev]);
    addAuditLog('RESOLUTION_RECORDED', 'resolution', id, `Recorded council minutes ${res.referenceNo} with ${res.resolutions.length} resolutions`);
    return newRes;
  };

  const updateResolution = (id: string, updates: Partial<CouncilResolution>) => {
    setResolutions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    addAuditLog('RESOLUTION_UPDATED', 'resolution', id, `Updated meeting minutes ${updates.referenceNo || id}`);
  };

  const issueDocument = (doc: Omit<OfficialDocument, 'id' | 'documentNumber' | 'qrVerificationHash' | 'issueDate' | 'status'>): OfficialDocument => {
    const id = `doc-${Date.now()}`;
    const issueDate = new Date().toISOString().slice(0, 10);
    const documentNumber = `DOC-LC1-${new Date().getFullYear()}-${String(documents.length + 1).padStart(4, '0')}`;
    const qrVerificationHash = `VLD-NKW-LC1-${doc.citizenId}-${doc.documentType.toUpperCase()}-${Date.now().toString(36)}`;
    const newDoc: OfficialDocument = {
      ...doc,
      id,
      documentNumber,
      qrVerificationHash,
      issueDate,
      status: 'valid',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('OFFICIAL_DOCUMENT_ISSUED', 'document', id, `Issued ${doc.documentType} to ${doc.citizenName} (Ref: ${documentNumber})`);
    return newDoc;
  };

  const revokeDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'revoked' } : d))
    );
    addAuditLog('DOCUMENT_REVOKED', 'document', id, `Revoked official document ${id}`);
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'lastLogin'>) => {
    const id = `usr-${Date.now()}`;
    const newUser: UserAccount = {
      ...userData,
      id,
      lastLogin: 'Never',
    };
    setUsers((prev) => [...prev, newUser]);
    addAuditLog('USER_CREATED', 'user', id, `Created staff account for ${userData.name} (${userData.role})`);
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const exportDatabaseJSON = (): string => {
    const dump = {
      exportTimestamp: new Date().toISOString(),
      metadata: {
        parish: 'Nakawa',
        division: 'Nakawa Division',
        district: 'Kampala',
        country: 'Uganda',
        system: 'Nakawa LC1 Digital Records Management System',
        version: '1.0.0',
      },
      citizens,
      landRecords,
      resolutions,
      documents,
      users,
      auditLogs,
    };
    return JSON.stringify(dump, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.citizens && Array.isArray(data.citizens)) {
        setCitizens(data.citizens);
      }
      if (data.landRecords && Array.isArray(data.landRecords)) {
        setLandRecords(data.landRecords);
      }
      if (data.resolutions && Array.isArray(data.resolutions)) {
        setResolutions(data.resolutions);
      }
      if (data.documents && Array.isArray(data.documents)) {
        setDocuments(data.documents);
      }
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      }
      addAuditLog('DATABASE_RESTORED', 'user', 'system', 'Database imported from external JSON backup');
      return true;
    } catch (e) {
      console.error('Failed to parse database backup JSON:', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setCitizens(INITIAL_CITIZENS);
    setLandRecords(INITIAL_LAND_RECORDS);
    setResolutions(INITIAL_RESOLUTIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setUsers(INITIAL_USERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(STORAGE_KEYS.CITIZENS);
    localStorage.removeItem(STORAGE_KEYS.LAND);
    localStorage.removeItem(STORAGE_KEYS.RESOLUTIONS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  return (
    <DatabaseContext.Provider
      value={{
        citizens,
        landRecords,
        resolutions,
        documents,
        users,
        auditLogs,
        currentUser,
        setCurrentUser,
        addCitizen,
        updateCitizen,
        deleteCitizen,
        addLandRecord,
        updateLandRecord,
        addLandTransfer,
        addResolution,
        updateResolution,
        issueDocument,
        revokeDocument,
        addUser,
        updateUser,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
