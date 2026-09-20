import React, { useState, useEffect } from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CitizenRegister } from './components/CitizenRegister';
import { CitizenSearch } from './components/CitizenSearch';
import { CitizenshipCategoriesView } from './components/CitizenshipCategoriesView';
import { LandRegistry } from './components/LandRegistry';
import { CouncilMinutes } from './components/CouncilMinutes';
import { DocumentGenerator } from './components/DocumentGenerator';
import { CensusReportView } from './components/CensusReportView';
import { UsersAndAccess } from './components/UsersAndAccess';
import { DatabasePromptStudio } from './components/DatabasePromptStudio';
import { CitizenFormModal } from './components/CitizenFormModal';
import { CitizenDossierModal } from './components/CitizenDossierModal';
import { Citizen } from './types';
import { Menu } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);
  const [activeDossierCitizenId, setActiveDossierCitizenId] = useState<string | null>(null);
  const [preselectedCitizenForDoc, setPreselectedCitizenForDoc] = useState<Citizen | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global hotkey: Cmd/Ctrl + K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentTab('citizen_search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenRegister = () => {
    setEditingCitizen(null);
    setIsRegisterModalOpen(true);
  };

  const handleEditCitizen = (citizen: Citizen) => {
    setEditingCitizen(citizen);
    setIsRegisterModalOpen(true);
  };

  const handleIssueLetter = (citizen: Citizen) => {
    setPreselectedCitizenForDoc(citizen);
    setCurrentTab('documents');
  };

  const handleViewCitizenDossier = (citizenId: string) => {
    setActiveDossierCitizenId(citizenId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        onOpenSearch={() => setCurrentTab('citizen_search')}
        onOpenPromptStudio={() => setCurrentTab('database_prompt')}
      />

      {/* Sub-header mobile bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Council Menu</span>
        </button>
        <span className="text-xs text-slate-300 capitalize font-medium">
          {currentTab.replace('_', ' ')}
        </span>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenRegisterModal={handleOpenRegister}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {currentTab === 'home' && (
            <Dashboard
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenRegisterModal={handleOpenRegister}
              onSelectCitizenToView={handleViewCitizenDossier}
            />
          )}

          {currentTab === 'citizen_register' && (
            <CitizenRegister
              onOpenRegisterModal={handleOpenRegister}
              onEditCitizen={handleEditCitizen}
              onIssueLetterForCitizen={handleIssueLetter}
              selectedCitizenIdToView={activeDossierCitizenId}
              onClearSelectedCitizen={() => setActiveDossierCitizenId(null)}
            />
          )}

          {currentTab === 'citizen_search' && (
            <CitizenSearch
              onIssueLetter={handleIssueLetter}
              onViewCitizenDossier={handleViewCitizenDossier}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'citizenship_categories' && (
            <CitizenshipCategoriesView
              onViewCitizenDossier={handleViewCitizenDossier}
              onIssueLetter={handleIssueLetter}
            />
          )}

          {currentTab === 'land_registry' && <LandRegistry />}

          {currentTab === 'resolutions' && <CouncilMinutes />}

          {currentTab === 'documents' && (
            <DocumentGenerator
              preselectedCitizen={preselectedCitizenForDoc}
              onClearPreselectedCitizen={() => setPreselectedCitizenForDoc(null)}
            />
          )}

          {currentTab === 'census_report' && <CensusReportView />}

          {currentTab === 'users_access' && <UsersAndAccess />}

          {currentTab === 'database_prompt' && <DatabasePromptStudio />}
        </main>
      </div>

      {/* Citizen Register/Edit Form Modal */}
      <CitizenFormModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setEditingCitizen(null);
        }}
        editingCitizen={editingCitizen}
      />

      {/* Citizen Dossier Modal */}
      {activeDossierCitizenId && (
        <CitizenDossierModal
          citizenId={activeDossierCitizenId}
          onClose={() => setActiveDossierCitizenId(null)}
          onIssueLetter={handleIssueLetter}
          onEdit={handleEditCitizen}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <DatabaseProvider>
      <MainLayout />
    </DatabaseProvider>
  );
}
