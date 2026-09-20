import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Database,
  Copy,
  Check,
  Code2,
  Terminal,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Table,
  Laptop,
  BookOpen,
} from 'lucide-react';

export const DatabasePromptStudio: React.FC = () => {
  const { exportDatabaseJSON, importDatabaseJSON, resetToDefaultData, citizens, landRecords, resolutions, documents } = useDatabase();

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'sql' | 'erd' | 'backup' | 'vscode'>('vscode');
  const [targetDB, setTargetDB] = useState<'postgresql' | 'supabase' | 'mysql' | 'sqlite'>('postgresql');

  // Master Prompt crafted specifically to transform the conceptual model into a live database
  const masterPrompt = `PROMPT FOR TRANSFORMING NAKAWA LC1 CONCEPTUAL MODEL INTO A LIVE DATABASE:

Act as a Senior Database Architect and Full-Stack Systems Engineer. Transform the provided Fig 2.1 conceptual model and problem statement for Nakawa Local Council 1 (LC1) Citizens' Records Management System into a fully functional, production-ready live database with secure REST/GraphQL APIs and an administrative dashboard.

### 1. CONTEXT & PROBLEM STATEMENT BACKGROUND:
Nakawa LC1 (Kampala, Uganda) suffers from:
1. Handwritten exercise-book record collection causing severe duplication, loss of citizens' records, and exorbitant stationary costs.
2. Rampant land disputes arising from fraudulent sale of single plots to multiple buyers due to lack of proof of ownership and boundary records.
3. Inability for secretaries to trace council minutes and resolutions passed more than 6 months ago.
4. Single-office paper bottleneck where government services freeze if the secretary is away.
5. Delays in verifying citizens for Village ID Cards and National Identification (NIRA) recommendations.
6. Breakdown of bottom-to-top statistical reporting (Village -> Parish -> Sub-County -> District) leading to expensive, redundant national census door-to-door registrations.

### 2. CONCEPTUAL MODEL ARCHITECTURE (Fig 2.1):
Generate a normalized 3NF Relational Database Schema containing the following core entities and relationships:

A. CITIZEN REGISTER & PROFILES:
- Table: \`citizens\`
  - id (UUID, Primary Key)
  - village_id (VARCHAR UNIQUE, format: 'NKW-LC1-XXXX')
  - full_name (VARCHAR NOT NULL)
  - nin (VARCHAR(14) UNIQUE, Uganda National Identification Number, NULLABLE for pending NIRA registrations)
  - category (ENUM: 'permanent', 'tenant', 'visitor', 'home_employee', 'child')
  - gender (ENUM: 'male', 'female', 'other')
  - dob (DATE NOT NULL)
  - phone (VARCHAR(20) NOT NULL)
  - alternate_phone (VARCHAR(20))
  - zone (VARCHAR(50) NOT NULL, e.g. 'Zone A - Market View', 'Zone B - Railway Quarter')
  - household_number (VARCHAR(50) NOT NULL)
  - residential_address (TEXT NOT NULL)
  - occupation (VARCHAR(100))
  - employer_or_workplace (VARCHAR(150))
  - landlord_name (VARCHAR(150), required if category IN ('tenant', 'home_employee', 'visitor'))
  - landlord_phone (VARCHAR(20))
  - is_landowner (BOOLEAN DEFAULT FALSE)
  - registered_date (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - next_of_kin_name (VARCHAR(150))
  - next_of_kin_relationship (VARCHAR(50))
  - next_of_kin_phone (VARCHAR(20))
  - blood_group (VARCHAR(5))
  - chronic_conditions (TEXT)
  - immunization_status (ENUM: 'full', 'partial', 'unknown', 'na')
  - education_level (ENUM: 'none', 'primary', 'secondary', 'vocational', 'tertiary', 'university')
  - status (ENUM: 'active', 'relocated', 'deceased' DEFAULT 'active')
  - notes (TEXT)

B. ANTI DOUBLE-SALE LAND & BIBANJA REGISTRY:
- Table: \`land_plots\`
  - id (UUID, Primary Key)
  - plot_number (VARCHAR(50) UNIQUE NOT NULL, e.g. 'NKW-PLT-104B')
  - zone (VARCHAR(50) NOT NULL)
  - size_dimensions (VARCHAR(50) NOT NULL, e.g. '50x100 ft')
  - tenure_type (ENUM: 'kibanja', 'mailo', 'leasehold', 'customary')
  - current_owner_id (UUID REFERENCES citizens(id))
  - current_owner_name (VARCHAR(150) NOT NULL)
  - owner_nin (VARCHAR(14))
  - purchase_date (DATE NOT NULL)
  - witnessed_by_lc1 (BOOLEAN DEFAULT TRUE)
  - lc1_agreement_ref (VARCHAR(100) NOT NULL)
  - neighbor_north (VARCHAR(150) NOT NULL)
  - neighbor_south (VARCHAR(150) NOT NULL)
  - neighbor_east (VARCHAR(150) NOT NULL)
  - neighbor_west (VARCHAR(150) NOT NULL)
  - dispute_status (ENUM: 'clear', 'under_review', 'disputed' DEFAULT 'clear')
  - dispute_notes (TEXT)

- Table: \`plot_transfers\` (Immutable chain of custody)
  - id (UUID, Primary Key)
  - plot_id (UUID REFERENCES land_plots(id) ON DELETE CASCADE)
  - previous_owner (VARCHAR(150) NOT NULL)
  - buyer (VARCHAR(150) NOT NULL)
  - transfer_date (DATE NOT NULL)
  - witnessed_by (VARCHAR(150) NOT NULL)
  - consideration_notes (TEXT)
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

C. MINUTES & RESOLUTIONS ARCHIVE (> 6 MONTHS TRACING):
- Table: \`council_meetings\`
  - id (UUID, Primary Key)
  - meeting_date (DATE NOT NULL)
  - meeting_type (ENUM: 'executive_committee', 'general_village_meeting', 'emergency_security', 'arbitration')
  - reference_no (VARCHAR(50) UNIQUE NOT NULL, e.g. 'MIN/NKW/2026/01')
  - agenda (TEXT NOT NULL)
  - recorded_by (VARCHAR(150) NOT NULL)
  - attendees_count (INTEGER NOT NULL)
  - attendees_list (TEXT[])
  - minutes_notes (TEXT)
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

- Table: \`resolutions\`
  - id (UUID, Primary Key)
  - meeting_id (UUID REFERENCES council_meetings(id) ON DELETE CASCADE)
  - title (VARCHAR(200) NOT NULL)
  - description (TEXT NOT NULL)
  - category (ENUM: 'security', 'land_boundary', 'sanitation', 'infrastructure', 'welfare', 'administrative')
  - enforcement_deadline (DATE)
  - status (ENUM: 'enacted', 'in_progress', 'archived' DEFAULT 'enacted')

D. OFFICIAL STAMPED DOCUMENTS & VILLAGE ID LETTERS:
- Table: \`official_documents\`
  - id (UUID, Primary Key)
  - document_number (VARCHAR(50) UNIQUE NOT NULL, e.g. 'DOC-LC1-2026-0001')
  - citizen_id (UUID REFERENCES citizens(id))
  - citizen_name (VARCHAR(150) NOT NULL)
  - citizen_nin (VARCHAR(14))
  - document_type (ENUM: 'village_id_recommendation', 'nira_endorsement', 'proof_of_residence', 'land_verification_letter', 'good_conduct_clearance')
  - purpose (TEXT NOT NULL)
  - issue_date (DATE NOT NULL)
  - issued_by (VARCHAR(150) NOT NULL)
  - issued_role (VARCHAR(50) NOT NULL)
  - qr_verification_hash (VARCHAR(255) UNIQUE NOT NULL)
  - status (ENUM: 'valid', 'expired', 'revoked' DEFAULT 'valid')

E. COMMITTEE ACCOUNTS, RBAC & AUDIT LOGS:
- Table: \`system_users\`
  - id (UUID, Primary Key)
  - name (VARCHAR(150) NOT NULL)
  - email (VARCHAR(150) UNIQUE NOT NULL)
  - phone (VARCHAR(20))
  - role (ENUM: 'chairperson', 'vice_chairperson', 'general_secretary', 'defense_secretary', 'committee_member', 'records_clerk')
  - active (BOOLEAN DEFAULT TRUE)
  - last_login (TIMESTAMP)

- Table: \`audit_logs\`
  - id (UUID, Primary Key)
  - timestamp (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - user_name (VARCHAR(150) NOT NULL)
  - user_role (VARCHAR(50) NOT NULL)
  - action (VARCHAR(50) NOT NULL)
  - entity_type (VARCHAR(50) NOT NULL)
  - entity_id (VARCHAR(50) NOT NULL)
  - details (TEXT NOT NULL)

### 3. IMPLEMENTATION DELIVERABLES:
1. Provide the complete executable SQL DDL migration script with indexes on (village_id, nin, plot_number, meeting_date).
2. Write a PostgreSQL trigger to prevent registering land transfers on plots marked with 'disputed' caveat.
3. Create view \`v_parish_census_summary\` aggregating bottom-up counts by citizenship category and gender.
4. Provide REST API endpoints (GET /api/citizens/search, POST /api/land/transfer, POST /api/documents/verify/:hash).
`;

  // SQL DDL Script
  const sqlDDL = `-- =========================================================
-- NAKAWA LC1 CITIZENS & LAND RECORDS MANAGEMENT SYSTEM
-- Target Engine: PostgreSQL / Supabase / Neon
-- Generated from Section 2.1 Conceptual Model
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Citizenship Category & Status Types
CREATE TYPE citizen_category_enum AS ENUM ('permanent', 'tenant', 'visitor', 'home_employee', 'child');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE tenure_type_enum AS ENUM ('kibanja', 'mailo', 'leasehold', 'customary');
CREATE TYPE dispute_status_enum AS ENUM ('clear', 'under_review', 'disputed');
CREATE TYPE access_role_enum AS ENUM ('chairperson', 'vice_chairperson', 'general_secretary', 'defense_secretary', 'committee_member', 'records_clerk');

-- 2. Citizens Table
CREATE TABLE citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    village_id VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    nin VARCHAR(14) UNIQUE,
    category citizen_category_enum NOT NULL DEFAULT 'permanent',
    gender gender_enum NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(25) NOT NULL,
    alternate_phone VARCHAR(25),
    zone VARCHAR(100) NOT NULL,
    household_number VARCHAR(50) NOT NULL,
    residential_address TEXT NOT NULL,
    occupation VARCHAR(100),
    employer_or_workplace VARCHAR(150),
    landlord_name VARCHAR(150),
    landlord_phone VARCHAR(25),
    is_landowner BOOLEAN DEFAULT FALSE,
    registered_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_of_kin_name VARCHAR(150),
    next_of_kin_relationship VARCHAR(50),
    next_of_kin_phone VARCHAR(25),
    blood_group VARCHAR(10),
    chronic_conditions TEXT,
    immunization_status VARCHAR(20) DEFAULT 'full',
    has_disability BOOLEAN DEFAULT FALSE,
    education_level VARCHAR(30),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_citizens_village_id ON citizens(village_id);
CREATE INDEX idx_citizens_nin ON citizens(nin);
CREATE INDEX idx_citizens_category ON citizens(category);
CREATE INDEX idx_citizens_zone ON citizens(zone);

-- 3. Anti-Double-Sale Land & Bibanja Registry
CREATE TABLE land_plots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_number VARCHAR(50) UNIQUE NOT NULL,
    zone VARCHAR(100) NOT NULL,
    size_dimensions VARCHAR(100) NOT NULL,
    tenure_type tenure_type_enum NOT NULL DEFAULT 'kibanja',
    current_owner_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
    current_owner_name VARCHAR(150) NOT NULL,
    owner_nin VARCHAR(14),
    purchase_date DATE NOT NULL,
    witnessed_by_lc1 BOOLEAN DEFAULT TRUE,
    lc1_agreement_ref VARCHAR(100) NOT NULL,
    neighbor_north VARCHAR(150) NOT NULL,
    neighbor_south VARCHAR(150) NOT NULL,
    neighbor_east VARCHAR(150) NOT NULL,
    neighbor_west VARCHAR(150) NOT NULL,
    dispute_status dispute_status_enum NOT NULL DEFAULT 'clear',
    dispute_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_plot_number ON land_plots(plot_number);
CREATE INDEX idx_land_owner_nin ON land_plots(owner_nin);

-- 4. Land Transfer History (Audit Chain of Custody)
CREATE TABLE plot_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id UUID NOT NULL REFERENCES land_plots(id) ON DELETE CASCADE,
    previous_owner VARCHAR(150) NOT NULL,
    buyer VARCHAR(150) NOT NULL,
    transfer_date DATE NOT NULL,
    witnessed_by VARCHAR(150) NOT NULL,
    consideration_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Council Minutes Archive (> 6 Months Retrieval)
CREATE TABLE council_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_date DATE NOT NULL,
    meeting_type VARCHAR(50) NOT NULL,
    reference_no VARCHAR(50) UNIQUE NOT NULL,
    agenda TEXT NOT NULL,
    recorded_by VARCHAR(150) NOT NULL,
    attendees_count INTEGER NOT NULL DEFAULT 1,
    attendees_list TEXT[],
    minutes_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_council_meetings_date ON council_meetings(meeting_date);
CREATE INDEX idx_council_meetings_ref ON council_meetings(reference_no);

CREATE TABLE council_resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES council_meetings(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    enforcement_deadline DATE,
    status VARCHAR(20) DEFAULT 'enacted'
);

-- 6. Official Stamped Documents (NIRA Recommendation & Proof of Residence)
CREATE TABLE official_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES citizens(id) ON DELETE CASCADE,
    citizen_name VARCHAR(150) NOT NULL,
    citizen_nin VARCHAR(14),
    document_type VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    issue_date DATE NOT NULL,
    issued_by VARCHAR(150) NOT NULL,
    issued_role VARCHAR(50) NOT NULL,
    qr_verification_hash VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'valid'
);

CREATE INDEX idx_doc_qr_hash ON official_documents(qr_verification_hash);

-- 7. System Officers & Audit Log (Multi-officer access)
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(25),
    role access_role_enum NOT NULL DEFAULT 'committee_member',
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    details TEXT NOT NULL
);

-- 8. Automated Bottom-Up Census View for Parish & District Reporting
CREATE OR REPLACE VIEW v_parish_census_summary AS
SELECT 
    category,
    gender,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE is_landowner = TRUE) AS landowners_count,
    COUNT(*) FILTER (WHERE immunization_status = 'full') AS fully_immunized_count
FROM citizens
GROUP BY category, gender;
`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const copySQLToClipboard = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nakawa_lc1_live_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDatabaseJSON(content);
        if (ok) {
          alert('Database successfully restored from JSON file!');
        } else {
          alert('Failed to parse database backup. Please ensure valid JSON structure.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Model-to-Database Transformation Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Conceptual Model &rarr; Live Database Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-0.5">
              The exact system architecture and master prompt requested to transform Fig 2.1 into an enterprise
              PostgreSQL, Supabase, or MySQL live production database.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyPromptToClipboard}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  Prompt Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  Copy Master Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            1. Master Transformation Prompt
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            2. Production SQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'erd'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3. ERD Entity Architecture
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            4. Live Data Export / Backup
          </button>
          <button
            onClick={() => setActiveTab('vscode')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vscode'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-amber-500/40'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            5. Visual Studio Code & Defense Guide
          </button>
        </div>
      </div>

      {/* Tab 1: Master Prompt */}
      {activeTab === 'prompt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                The Complete Transformation Prompt
              </h3>
              <p className="text-xs text-slate-400">
                Paste this into any AI model, Claude, ChatGPT, or AI Studio to generate backend code or full SQL DB.
              </p>
            </div>
            <button
              onClick={copyPromptToClipboard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPrompt ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-slate-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800 max-h-[500px] leading-relaxed">
            {masterPrompt}
          </pre>
        </div>
      )}

      {/* Tab 2: SQL DDL Schema */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Ready-to-Execute Production SQL (PostgreSQL / Supabase)
              </h3>
              <p className="text-xs text-slate-400">
                Execute directly in Supabase SQL Editor, Neon, or psql to deploy the live database.
              </p>
            </div>
            <button
              onClick={copySQLToClipboard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSQL ? 'Copied SQL!' : 'Copy SQL'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800 max-h-[500px] leading-relaxed">
            {sqlDDL}
          </pre>
        </div>
      )}

      {/* Tab 3: ERD Entity Architecture */}
      {activeTab === 'erd' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Relational Schema Architecture (ERD)</h3>
            <p className="text-xs text-slate-400">
              Normalized 3NF relational mapping connecting citizens, land ownership, minutes, and documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Table 1: Citizens */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>citizens</span>
                <span className="text-[10px] text-slate-400">Primary Entity</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-amber-300 font-bold">🔑 id: UUID (PK)</li>
                <li className="text-blue-300"># village_id: VARCHAR (UQ)</li>
                <li>• full_name: VARCHAR</li>
                <li>• nin: VARCHAR(14) (UQ)</li>
                <li>• category: ENUM (5 types)</li>
                <li>• zone: VARCHAR</li>
                <li>• landlord_name: VARCHAR</li>
                <li>• is_landowner: BOOLEAN</li>
              </ul>
            </div>

            {/* Table 2: Land Plots */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>land_plots</span>
                <span className="text-[10px] text-slate-400">Double-Sale Guard</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-emerald-300 font-bold">🔑 id: UUID (PK)</li>
                <li className="text-blue-300"># plot_number: VARCHAR (UQ)</li>
                <li>🔗 current_owner_id: UUID (FK)</li>
                <li>• owner_nin: VARCHAR</li>
                <li>• neighbor_north: VARCHAR</li>
                <li>• neighbor_south: VARCHAR</li>
                <li>• neighbor_east/west: VARCHAR</li>
                <li className="text-rose-400">• dispute_status: ENUM</li>
              </ul>
            </div>

            {/* Table 3: Plot Transfers */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-purple-400 flex items-center justify-between">
                <span>plot_transfers</span>
                <span className="text-[10px] text-slate-400">Audit Trail</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-purple-300 font-bold">🔑 id: UUID (PK)</li>
                <li>🔗 plot_id: UUID (FK)</li>
                <li>• previous_owner: VARCHAR</li>
                <li>• buyer: VARCHAR</li>
                <li>• transfer_date: DATE</li>
                <li>• witnessed_by: VARCHAR</li>
              </ul>
            </div>

            {/* Table 4: Council Meetings */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-blue-400 flex items-center justify-between">
                <span>council_meetings</span>
                <span className="text-[10px] text-slate-400">&gt; 6 Mos Archive</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-blue-300 font-bold">🔑 id: UUID (PK)</li>
                <li className="text-amber-300"># reference_no: VARCHAR (UQ)</li>
                <li>• meeting_date: DATE</li>
                <li>• agenda: TEXT</li>
                <li>• recorded_by: VARCHAR</li>
                <li>• attendees_count: INT</li>
              </ul>
            </div>

            {/* Table 5: Resolutions */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-pink-400 flex items-center justify-between">
                <span>council_resolutions</span>
                <span className="text-[10px] text-slate-400">Village Bylaws</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-pink-300 font-bold">🔑 id: UUID (PK)</li>
                <li>🔗 meeting_id: UUID (FK)</li>
                <li>• title: VARCHAR</li>
                <li>• description: TEXT</li>
                <li>• enforcement_deadline: DATE</li>
                <li>• status: VARCHAR</li>
              </ul>
            </div>

            {/* Table 6: Official Documents */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>official_documents</span>
                <span className="text-[10px] text-slate-400">NIRA &amp; ID Letters</span>
              </div>
              <ul className="text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="text-amber-300 font-bold">🔑 id: UUID (PK)</li>
                <li className="text-blue-300"># document_number: VARCHAR (UQ)</li>
                <li>🔗 citizen_id: UUID (FK)</li>
                <li>• document_type: VARCHAR</li>
                <li># qr_verification_hash: VARCHAR</li>
                <li>• status: VARCHAR</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Live Backup & Reset */}
      {activeTab === 'backup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Live Data Export &amp; Backup Operations</h3>
            <p className="text-xs text-slate-400">
              Export the current live database state to JSON, restore from a file, or reset to original Nakawa seeds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-xs space-y-3">
              <div className="font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Export Live JSON Database
              </div>
              <p className="text-slate-400 text-[11px]">
                Download full database containing {citizens.length} citizens, {landRecords.length} plots, and {resolutions.length} meetings.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg cursor-pointer transition-colors"
              >
                Download Backup (.json)
              </button>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-xs space-y-3">
              <div className="font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Import JSON Backup
              </div>
              <p className="text-slate-400 text-[11px]">
                Restore records from a previously exported Nakawa LC1 database JSON file.
              </p>
              <label className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg cursor-pointer text-center block transition-colors">
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUploadBackup}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-xs space-y-3">
              <div className="font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400" />
                Reset to Seed Records
              </div>
              <p className="text-slate-400 text-[11px]">
                Reset database back to the authentic initial seed data with Nakawa LC1 records.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Reset all live records back to authentic default data?')) {
                    resetToDefaultData();
                    alert('Database reset to defaults.');
                  }
                }}
                className="w-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 font-bold py-2 rounded-lg cursor-pointer transition-colors"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Visual Studio Code & Final Year Defense Guide */}
      {activeTab === 'vscode' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Final Year Project Academic Guide
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-amber-400" />
                Running in Visual Studio Code &amp; Project Defense Preparation
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Step-by-step instructions to download, open, configure, and execute the Nakawa LC1 Citizens Records Management System in Visual Studio Code on your local laptop, with key presentation talking points for your project defense.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`npm install\nnpm run dev`);
                setCopiedBash(true);
                setTimeout(() => setCopiedBash(false), 2000);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/20 shrink-0 self-start sm:self-center"
            >
              {copiedBash ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedBash ? 'Copied Quick Launch!' : 'Copy Terminal Commands'}
            </button>
          </div>

          {/* Quick Terminal Launch Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-2 text-amber-400 font-semibold">
                <Terminal className="w-4 h-4" />
                VS Code Integrated Terminal Commands
              </span>
              <span>Bash / Zsh / PowerShell</span>
            </div>
            <pre className="bg-slate-900/90 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto selection:bg-emerald-500/30 selection:text-white">
{`# 1. Install all dependencies (React 19, Vite, Tailwind CSS, Lucide icons)
npm install

# 2. Launch the local development server (starts on http://localhost:3000)
npm run dev`}
            </pre>
          </div>

          {/* Step-by-Step Local Setup Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Extract &amp; Open Folder</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download or export the project files to your computer. Open <strong>Visual Studio Code</strong>, click <strong>File &gt; Open Folder</strong>, and select the project directory.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Open Terminal &amp; Install</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Press <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">Ctrl + `</code> (or <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">Cmd + `</code> on Mac) to open the built-in terminal. Run <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono">npm install</code>.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Run &amp; Live Preview</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Execute <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono">npm run dev</code>. Open your browser to <code className="text-amber-400 font-mono">http://localhost:3000</code> to present your working application live.
              </p>
            </div>
          </div>

          {/* Academic Defense Presentation Blueprint */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Final Year Project Defense — How to Present to University Examiners
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">1. Problem Formulation (Why this was built):</span>
                <p className="text-slate-300 leading-relaxed">
                  Explain the failure of manual exercise books in Nakawa LC1: lost pages, fraudulent double-sales of land plots, lost council minutes, and the single-officer bottleneck when the General Secretary is away.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">2. The Fig 2.1 Conceptual Model:</span>
                <p className="text-slate-300 leading-relaxed">
                  Demonstrate how you translated Section 2.1 into real software: separating citizens into 5 categories (Permanent, Tenant, Visitor, Home Employee, Child) with verified landlord linkages.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">3. Anti-Double Sale Mechanism (Key Innovation):</span>
                <p className="text-slate-300 leading-relaxed">
                  Navigate to <strong>Land Registry</strong>. Show the mandatory 4-point boundary neighbor check (North, South, East, West) and immutable transfer chain of custody that halts land fraud.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">4. Solving the 6-Month Minutes Loss:</span>
                <p className="text-slate-300 leading-relaxed">
                  Go to <strong>Council Minutes &amp; Resolutions</strong>. Click the <strong>&gt; 6 Months Ago</strong> filter badge to demonstrate instant retrieval of historic village bylaws passed years ago.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">5. Digital Official Documents &amp; NIRA Vetting:</span>
                <p className="text-slate-300 leading-relaxed">
                  Click <strong>Issue Letter</strong> on any resident to generate an authentic stamped LC1 recommendation letter with a verification QR hash and print-ready Uganda LC1 header.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">6. Bottom-Up Parish Census Automation:</span>
                <p className="text-slate-300 leading-relaxed">
                  Show the <strong>Parish Census Report</strong> tab. Point out how it eliminates costly door-to-door headcount surveys by automatically synthesizing demographic, immunization, and schooling data for KCCA and UBOS.
                </p>
              </div>
            </div>
          </div>

          {/* Codebase Map for Oral Defense */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              Key Source Files for Defense Viva (Where to Point the Examiners)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-[11px]">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/types/index.ts</span>
                <span className="text-slate-400 font-sans">Fig 2.1 entities, category enums &amp; boundary interfaces</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/context/DatabaseContext.tsx</span>
                <span className="text-slate-400 font-sans">Reactive state management, persistence &amp; audit logging</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/components/LandRegistry.tsx</span>
                <span className="text-slate-400 font-sans">4-point boundary validation &amp; anti double-sale chain</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/components/CouncilMinutes.tsx</span>
                <span className="text-slate-400 font-sans">Archival minutes query &amp; &gt; 6 month retrieval</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/components/DocumentGenerator.tsx</span>
                <span className="text-slate-400 font-sans">Printable LC1 stamped letters &amp; NIRA recommendation</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-300 font-bold block">src/components/CensusReportView.tsx</span>
                <span className="text-slate-400 font-sans">Bottom-up statistical aggregation for Parish / KCCA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
