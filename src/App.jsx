import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import Report from './components/Report';
import PDFButton from './components/PDFButton';
import SettingsModal from './components/SettingsModal';
import ProspectsManager from './components/ProspectsManager';
import DetailedAudit from './components/DetailedAudit';
import { fetchPageSpeed } from './utils/fetchPageSpeed';
import { extractMetrics } from './utils/extractMetrics';
import { buildHtmlReport } from './utils/buildHtmlReport';
import { generateAIAnalysis } from './utils/generateAIAnalysis';
import { Loader2, Settings, Users, FileText, BarChart3 } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit', 'prospects', or 'detailed'
  const [isLoading, setIsLoading] = useState(false);
  const [reportHtml, setReportHtml] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [error, setError] = useState(null);
  const [prospectData, setProspectData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

      // 2. Extract Metrics
      const metrics = extractMetrics(mobileData, desktopData);

      // 3. Build Final Report with smart analysis
      const html = buildHtmlReport(metrics, formData);

      setReportHtml(html);
      setDetailedData(metrics); // Save for detailed audit tab
      setActiveTab('audit'); // Switch to audit tab to show results
    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                </div>
                <Report htmlContent={reportHtml} />
              </div>
            )}
          </>
        ) : activeTab === 'detailed' ? (
          <DetailedAudit data={detailedData} />
        ) : (
          <ProspectsManager onRunAudit={handleAuditSubmit} />
        )}
      </main>
    </div>
  );
}

export default App;
