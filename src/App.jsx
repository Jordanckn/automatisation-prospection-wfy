import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import Report from './components/Report';
import PDFButton from './components/PDFButton';
import EmailSender from './components/EmailSender';
import SettingsModal from './components/SettingsModal';
import ProspectsManager from './components/ProspectsManager';
import ProspectCRM from './components/ProspectCRM';
import DetailedAudit from './components/DetailedAudit';
import ListsManager from './components/ListsManager';
import ListEditor from './components/ListEditor';
import CampaignsDashboard from './components/CampaignsDashboard';
import AdvancedStats from './components/AdvancedStats';
import DataManager from './components/DataManager';
import EmailTemplates from './components/EmailTemplates';
import { NotificationProvider } from './components/NotificationProvider';
import { fetchPageSpeed } from './utils/fetchPageSpeed';
import { extractMetrics } from './utils/extractMetrics';
import { buildHtmlReport } from './utils/buildHtmlReport';
import { buildSimplifiedReport } from './utils/buildSimplifiedReport';
import { generateAIAnalysis } from './utils/generateAIAnalysis';
import { Loader2, Settings, Users, FileText, BarChart3, FolderOpen, Mail, Database, FileEdit, UserCog, BarChart2 } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit', 'prospects', 'detailed', 'lists', 'campaigns'
  const [isLoading, setIsLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [error, setError] = useState(null);
  const [prospectData, setProspectData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [refreshListsKey, setRefreshListsKey] = useState(0); // Pour forcer le rechargement des listes

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    googlePageSpeedApiKey: import.meta.env.VITE_PSI_KEY || '',
    openRouterApiKey: '',
    aiModel: 'google/gemini-2.0-flash-001'
  });

  // Load keys from localStorage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('webfityou_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleSaveSettings = (newKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem('webfityou_keys', JSON.stringify(newKeys));
  };

  const handleAuditSubmit = async (formData) => {
    if (!apiKeys.googlePageSpeedApiKey) {
      setError("Veuillez configurer votre clé API Google PageSpeed dans les paramètres.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportHtml(null);
    setProspectData(formData);

    try {
      // 1. Fetch PageSpeed Data
      const [mobileData, desktopData] = await Promise.all([
        fetchPageSpeed(formData.url, 'mobile', apiKeys.googlePageSpeedApiKey),
        fetchPageSpeed(formData.url, 'desktop', apiKeys.googlePageSpeedApiKey)
      ]);

      let html;

      // 2. Générer le rapport selon le type d'audit
      if (formData.auditType === 'simplified') {
        // Audit simplifié
        html = buildSimplifiedReport(mobileData, desktopData, formData);
      } else {
        // Audit détaillé (par défaut)
        const metrics = extractMetrics(mobileData, desktopData);

        // Si un template est sélectionné, l'utiliser
        if (formData.templateId) {
          const templates = JSON.parse(localStorage.getItem('email_templates') || '[]');
          const selectedTemplate = templates.find(t => t.id === formData.templateId);

          if (selectedTemplate) {
            // Utiliser le template personnalisé
            html = selectedTemplate.content
              .replace(/{{prospect_name}}/g, formData.name)
              .replace(/{{prospect_url}}/g, formData.url)
              .replace(/{{prospect_profession}}/g, formData.profession || '')
              .replace(/{{prospect_location}}/g, formData.location || '');

            // TODO: Injecter les métriques dans le template si nécessaire
          } else {
            html = buildHtmlReport(metrics, formData);
          }
        } else {
          html = buildHtmlReport(metrics, formData);
        }

        setDetailedData(metrics); // Save for detailed audit tab
      }

      setReportHtml(html);
      setActiveTab('audit'); // Switch to audit tab to show results
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotificationProvider>
      <div className="app-container">
        <header className="app-header">
          <button
            className="settings-btn-trigger"
            onClick={() => setIsSettingsOpen(true)}
            title="Paramètres API"
          >
            <Settings size={24} />
          </button>
          <img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/Logo-rond-webfityou-seo-ia-optimisation-siteweb-2.png" alt="WebFitYou Logo" className="app-logo" />
          <h1>WebFitYou AuditBot</h1>
          <p>Générateur d'audits SEO & Performance</p>
        </header>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          initialKeys={apiKeys}
        />

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <FileText size={20} /> Rapport Email
          </button>
          <button
            className={`tab-button ${activeTab === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveTab('detailed')}
            disabled={!detailedData}
          >
            <BarChart3 size={20} /> Audit Détaillé
          </button>
          <button
            className={`tab-button ${activeTab === 'prospects' ? 'active' : ''}`}
            onClick={() => setActiveTab('prospects')}
          >
            <Users size={20} /> Gestion des prospects
          </button>
          <button
            className={`tab-button ${activeTab === 'crm' ? 'active' : ''}`}
            onClick={() => setActiveTab('crm')}
          >
            <UserCog size={20} /> CRM
          </button>
          <button
            className={`tab-button ${activeTab === 'lists' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('lists');
              setSelectedList(null);
              setRefreshListsKey(prev => prev + 1); // Force le rechargement à chaque fois qu'on revient sur l'onglet
            }}
          >
            <FolderOpen size={20} /> Listes
          </button>
          <button
            className={`tab-button ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <Mail size={20} /> Campagnes
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart2 size={20} /> Statistiques
          </button>
          <button
            className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <FileEdit size={20} /> Modèles
          </button>
          <button
            className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={20} /> Données
          </button>
        </div>

        <main>
          {activeTab === 'audit' ? (
            <>
              <Form onSubmit={handleAuditSubmit} isLoading={isLoading} />

              {error && <div className="error-message">{error}</div>}

              {isLoading && (
                <div className="loading-state">
                  <Loader2 className="animate-spin" size={48} />
                  <p>Analyse de {prospectData?.url} en cours...</p>
                  <p className="sub-text">Interrogation de Google PageSpeed & Analyse IA...</p>
                </div>
              )}

              {reportHtml && (
                <div className="results-section">
                  <div className="actions-bar">
                    <PDFButton htmlContent={reportHtml} fileName={`Audit-${prospectData?.name || 'WebFitYou'}.pdf`} />
                    <EmailSender htmlContent={reportHtml} prospectData={prospectData} />
                  </div>
                  <Report htmlContent={reportHtml} />
                </div>
              )}
            </>
          ) : activeTab === 'detailed' ? (
            <DetailedAudit data={detailedData} />
          ) : activeTab === 'prospects' ? (
            <ProspectsManager
              onRunAudit={handleAuditSubmit}
              onProspectsChange={setProspects}
            />
          ) : activeTab === 'crm' ? (
            <ProspectCRM />
          ) : activeTab === 'lists' ? (
            selectedList ? (
              <ListEditor
                list={selectedList}
                prospects={prospects}
                onBack={() => setSelectedList(null)}
                onUpdateList={(updatedList) => {
                  console.log('📝 App.jsx: Mise à jour de la liste:', updatedList);

                  // Update list in localStorage
                  const lists = JSON.parse(localStorage.getItem('prospectLists') || '[]');
                  console.log('📋 App.jsx: Listes actuelles:', lists);

                  const updatedLists = lists.map(l => l.id === updatedList.id ? updatedList : l);
                  console.log('📋 App.jsx: Listes mises à jour:', updatedLists);

                  localStorage.setItem('prospectLists', JSON.stringify(updatedLists));
                  console.log('✅ App.jsx: Sauvegarde dans localStorage terminée');

                  setSelectedList(null);
                  setRefreshListsKey(prev => prev + 1); // Force le rechargement
                  console.log('🔄 App.jsx: Rechargement du ListsManager déclenché');
                }}
              />
            ) : (
              <ListsManager
                key={refreshListsKey}
                prospects={prospects}
                onSelectList={(list) => setSelectedList(list)}
              />
            )
          ) : activeTab === 'campaigns' ? (
            <CampaignsDashboard />
          ) : activeTab === 'stats' ? (
            <AdvancedStats />
          ) : activeTab === 'templates' ? (
            <EmailTemplates />
          ) : activeTab === 'data' ? (
            <DataManager />
          ) : null}
        </main>

        <footer className="app-footer">
          <p>
            © {new Date().getFullYear()} - Développé par{' '}
            <a
              href="https://webfityou.com/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              WebFitYou
            </a>
          </p>
        </footer>
      </div>
    </NotificationProvider>
  );
}

export default App;
