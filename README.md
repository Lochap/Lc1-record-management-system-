# NAKAWA LOCAL COUNCIL 1 (LC1) CITIZENS' RECORDS MANAGEMENT SYSTEM
### Final Year Project — Academic Software Engineering / Computer Science

A modern, full-stack municipal governance records system engineered to digitize citizen records, secure land tenure, preserve council resolutions, decentralize administrative workflows, and automate bottom-to-top demographic reporting for Nakawa Local Council 1, Kampala, Uganda.

---

## 📋 Table of Contents
1. [Academic Problem Statement & Fig 2.1 Model](#academic-problem-statement)
2. [Prerequisites](#prerequisites)
3. [Quick Start in Visual Studio Code (Step-by-Step)](#quick-start-in-visual-studio-code)
4. [VS Code Recommended Setup](#vs-code-recommended-setup)
5. [Project Architecture & File Directory](#project-architecture--file-directory)
6. [Core System Modules](#core-system-modules)
7. [Database Schema & Persistence](#database-schema--persistence)
8. [Final Year Project Defense & Demonstration Guide](#final-year-project-defense--demonstration-guide)

---

## 🏛️ Academic Problem Statement

In many urban and peri-urban communities across Uganda—exemplified by Nakawa LC1—village administration has historically depended on paper exercise books and physical files. This legacy operational mode generates critical failure points:

1. **Lost & Damaged Files**: Paper notebooks wear out, suffer water/fire damage, or get misplaced during office transitions.
2. **Double-Sale of Land (Fraudulent Conveyance)**: Plots are repeatedly sold to unsuspecting buyers because there is no centralized, timestamped registry documenting boundary neighbors and historical chains of ownership.
3. **Forgotten Council Resolutions**: Secretaries and councilors cannot retrieve minutes or by-laws passed more than 6 months prior, crippling enforcement of community resolutions.
4. **Single-Office Bottleneck**: Administrative progress halts whenever the General Secretary is indisposed or absent with the physical book.
5. **Slow Vetting for Village IDs & NIRA**: Residents endure delays when applying for National Identification and Registration Authority (NIRA) verification or employment clearance.
6. **Census & PDM Data Breakdown**: Bottom-up statistical flows (Village -> Parish -> Sub-County -> KCCA / UBOS) fail, necessitating costly door-to-door headcounts.

This software system directly implements the **Fig 2.1 Conceptual Model** by unifying citizens, land plots, council minutes, official certificates, and audit logs into a single reactive application.

---

## ⚙️ Prerequisites

Before opening in Visual Studio Code, verify that you have installed:

1. **Node.js**: Version 18.0.0 or higher.
   - Check in your terminal: `node -v`
   - Download if needed: [https://nodejs.org](https://nodejs.org)
2. **npm**: Included automatically with Node.js.
   - Check in your terminal: `npm -v`
3. **Visual Studio Code**:
   - Download if needed: [https://code.visualstudio.com](https://code.visualstudio.com)

---

## 🚀 Quick Start in Visual Studio Code

### Step 1: Open the Project in VS Code
1. Open Visual Studio Code.
2. Click **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows/Linux, `Cmd+O` on macOS).
3. Select the root folder of this project (the folder containing `package.json`).

### Step 2: Open the Integrated Terminal
- Press `` Ctrl + ` `` (backtick) or go to **Terminal** > **New Terminal** in the top menu bar.

### Step 3: Install Project Dependencies
Run the following command in the VS Code terminal:
```bash
npm install
```
*(This installs React 19, Vite, Tailwind CSS, Lucide Icons, and Motion).*

### Step 4: Launch the Local Development Server
Run:
```bash
npm run dev
```

### Step 5: Open the Application in your Browser
The terminal will display:
```
  VITE v8.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```
Hold `Ctrl` (or `Cmd`) and click `http://localhost:3000`, or paste it into your browser.

---

## 💻 VS Code Recommended Setup

This project includes pre-configured settings in `.vscode/`:
- `.vscode/extensions.json`: Recommends Tailwind CSS IntelliSense, Prettier, and TypeScript helpers.
- `.vscode/settings.json`: Configures auto-formatting and TypeScript SDK pathing.

### Useful VS Code Shortcuts:
- **Toggle Terminal**: `` Ctrl + ` ``
- **Command Palette**: `Ctrl + Shift + P` (`Cmd + Shift + P` on Mac)
- **Quick File Open**: `Ctrl + P` (`Cmd + P` on Mac)
- **Search Everywhere**: `Ctrl + Shift + F`

---

## 📁 Project Architecture & File Directory

```
nakawa-lc1-records-system/
├── .vscode/
│   ├── extensions.json             # Recommended VS Code plugins
│   └── settings.json               # Editor settings (auto-format, tab size)
├── public/                         # Static assets and icons
├── src/
│   ├── components/                 # Core User Interface Modules
│   │   ├── Header.tsx              # Council branding, live clock, search shortcut
│   │   ├── Sidebar.tsx             # Responsive navigation sidebar
│   │   ├── Dashboard.tsx           # High-level statistics, rapid action cards
│   │   ├── CitizenRegister.tsx     # Full citizen roster, filtering & actions
│   │   ├── CitizenSearch.tsx       # Instant search (Name, NIN, Phone, Village ID)
│   │   ├── CitizenFormModal.tsx    # Registration / Editing form with validation
│   │   ├── CitizenDossierModal.tsx # Citizen profile, family & land linkages
│   │   ├── CitizenshipCategoriesView.tsx # Fig 2.1 breakdown (Tenants, Landowners, etc.)
│   │   ├── LandRegistry.tsx        # Anti double-sale registry & boundary checks
│   │   ├── CouncilMinutes.tsx      # Archived minutes & resolution search (>6 months)
│   │   ├── DocumentGenerator.tsx   # Stamped LC1 letters & NIRA verification
│   │   ├── CensusReportView.tsx    # Bottom-up statistical export for Parish / PDM
│   │   ├── UsersAndAccess.tsx      # Multi-officer role switching & audit trail
│   │   └── DatabasePromptStudio.tsx# SQL migration script, ERD & VS Code guide
│   ├── context/
│   │   └── DatabaseContext.tsx     # Central reactive state engine & LocalStorage persistence
│   ├── data/
│   │   └── defaultData.ts          # Nakawa LC1 seed data (citizens, plots, resolutions)
│   ├── types/
│   │   └── index.ts                # TypeScript strict interfaces & data models
│   ├── App.tsx                     # Main layout & routing container
│   ├── main.tsx                    # React DOM root mounting
│   └── index.css                   # Tailwind CSS styling directives
├── index.html                      # HTML entry point with metadata
├── package.json                    # Dependencies & npm scripts
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite build tool configuration
└── README.md                       # Project documentation & presentation guide
```

---

## 🛠️ Core System Modules

| Module | Purpose & Academic Justification |
|---|---|
| **Citizen Register & Search** | Replaces paper exercise books with verified profiles, NIN validation, photo avatars, and instant search (`Ctrl + K`). |
| **Fig 2.1 Citizenship Categories** | Categorizes residents into Permanent, Tenant, Visitor, Home Employee, and Child with specific tenancy links. |
| **Land Registry & Caveats** | Eliminates double-plot sales by mandating **4-point boundary checks** (North, South, East, West) and an immutable transfer chain of custody. |
| **Council Minutes & Resolutions** | Allows councilors to search resolutions older than 6 months, tracking status (`Enacted`, `Under Review`, `Amended`). |
| **Official Stamped Documents** | Generates printed LC1 Village Recommendation Letters, Proof of Residence, and Land Clearances with an authentic council stamp and verification QR hash. |
| **Bottom-Up Census Report** | Aggregates population numbers, education brackets, and immunization data to export directly to Nakawa Parish Chief and KCCA. |
| **Multi-Officer Role Access** | Prevents office gridlock by supporting Chairperson, Vice Chairperson, General Secretary, Defense Secretary, and Records Clerk profiles. |

---

## 🗄️ Database Schema & Persistence

1. **Client-Side Persistence**: The application automatically stores all records into the browser's `localStorage`. Edits, additions, and status changes persist across reloads.
2. **Export / Import JSON**: In the **Database Studio** tab, click **Export Database (JSON)** to download a complete backup file, or upload an existing backup.
3. **Live Relational SQL Migration**: In the **Database Studio** tab, copy the auto-generated **PostgreSQL / Supabase DDL migration script** to spin up an external cloud database.

---

## 🎓 Final Year Project Defense & Demonstration Guide

When presenting this project to your university supervisor, external examiners, or defense panel:

### 1. Introduce the Real-World Problem (1-2 Mins)
- Highlight the real vulnerabilities of Nakawa LC1: land fraud through multiple sales, missing records, paper deterioration, and bureaucratic gridlock.

### 2. Walk Through the Fig 2.1 Conceptual Model (2 Mins)
- Navigate to **Citizenship Categories** to demonstrate how the system differentiates landowners from tenants and household employees.
- Open **Citizen Dossier** to demonstrate how personal identification (NIN, Phone, Village ID) ties into residence zones and kin.

### 3. Demonstrate the Anti-Double Sale Mechanism (3 Mins)
- Navigate to **Land Registry**.
- Show how every plot requires **4-Point Boundaries** (North, South, East, West neighbors).
- Demonstrate the **Chain of Custody** log showing historical ownership transfers.
- Show how disputed plots are flagged with an active caveat warning.

### 4. Demonstrate Resolution Search > 6 Months (2 Mins)
- Go to **Council Minutes**.
- Click the **> 6 Months Ago** filter badge to show how easy it is to retrieve historical council bylaws that were previously lost in dusty files.

### 5. Generate an Official Stamped Document (2 Mins)
- Go to **Official Documents** or click **Issue Letter** on any citizen.
- Select **NIRA Recommendation / Village ID**.
- Click **Print / Save as PDF** to show the professional Uganda LC1 letterhead, official stamp watermark, and QR verification code.

### 6. Show the Parish Census Summary (2 Mins)
- Navigate to **Parish Census Report**.
- Show how the system aggregates data for the Parish Development Model (PDM), KCCA, and UBOS without needing an expensive door-to-door headcount.

---

## 📜 Build & Production Deployment

To build a production-ready bundle:
```bash
npm run build
```
The compiled, optimized files will be output to the `/dist` folder. To preview the production build locally:
```bash
npm run preview
```
