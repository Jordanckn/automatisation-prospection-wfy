import React, { useState } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle } from 'lucide-react';

const DataManager = () => {
    const [importStatus, setImportStatus] = useState(null);

    const exportAllData = () => {
        try {
            const data = {
                prospects: JSON.parse(localStorage.getItem('webfityou_prospects') || '[]'),
                lists: JSON.parse(localStorage.getItem('prospectLists') || '[]'),
                campaigns: JSON.parse(localStorage.getItem('emailCampaigns') || '[]'),
                apiKeys: JSON.parse(localStorage.getItem('webfityou_keys') || '{}'),
                emailTemplates: JSON.parse(localStorage.getItem('emailTemplates') || '[]'),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `webfityou-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setImportStatus({ type: 'success', message: 'Données exportées avec succès !' });
            setTimeout(() => setImportStatus(null), 3000);
        } catch (error) {
            setImportStatus({ type: 'error', message: 'Erreur lors de l\'export' });
            setTimeout(() => setImportStatus(null), 3000);
        }
    };

    const importAllData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Vérifier la structure
                if (!data.version) {
                    throw new Error('Format de fichier invalide');
                }

                // Demander confirmation
                if (!window.confirm('⚠️ Cette action va remplacer toutes vos données actuelles.\n\nÊtes-vous sûr de vouloir continuer ?')) {
                    return;
                }

                // Importer les données
                if (data.prospects) localStorage.setItem('webfityou_prospects', JSON.stringify(data.prospects));
                if (data.lists) localStorage.setItem('prospectLists', JSON.stringify(data.lists));
                if (data.campaigns) localStorage.setItem('emailCampaigns', JSON.stringify(data.campaigns));
                if (data.apiKeys) localStorage.setItem('webfityou_keys', JSON.stringify(data.apiKeys));
                if (data.emailTemplates) localStorage.setItem('emailTemplates', JSON.stringify(data.emailTemplates));

                setImportStatus({
                    type: 'success',
                    message: `Données importées avec succès ! (${data.prospects?.length || 0} prospects, ${data.lists?.length || 0} listes, ${data.campaigns?.length || 0} campagnes)`
                });

                // Recharger la page après 2 secondes
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                setImportStatus({ type: 'error', message: 'Erreur lors de l\'import : fichier invalide' });
                setTimeout(() => setImportStatus(null), 3000);
            }
        };
        reader.readAsText(file);
    };

    const getDataStats = () => {
        const prospects = JSON.parse(localStorage.getItem('webfityou_prospects') || '[]');
        const lists = JSON.parse(localStorage.getItem('prospectLists') || '[]');
        const campaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
        const templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');

        return { prospects, lists, campaigns, templates };
    };

    const stats = getDataStats();

    return (
        <div className="data-manager">
            <div className="data-manager-header">
                <h2><Database size={24} /> Gestion des Données</h2>
                <p className="text-muted">Exportez et importez vos données pour les sauvegarder</p>
            </div>

            {importStatus && (
                <div className={`import-status ${importStatus.type}`}>
                    {importStatus.type === 'success' ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <span>{importStatus.message}</span>
                </div>
            )}

            <div className="data-stats-grid">
                <div className="data-stat-card">
                    <div className="stat-number">{stats.prospects.length}</div>
                    <div className="stat-label">Prospects</div>
                </div>
                <div className="data-stat-card">
                    <div className="stat-number">{stats.lists.length}</div>
                    <div className="stat-label">Listes</div>
                </div>
                <div className="data-stat-card">
                    <div className="stat-number">{stats.campaigns.length}</div>
                    <div className="stat-label">Campagnes</div>
                </div>
                <div className="data-stat-card">
                    <div className="stat-number">{stats.templates.length}</div>
                    <div className="stat-label">Modèles</div>
                </div>
            </div>

            <div className="data-actions">
                <div className="data-action-card">
                    <div className="action-icon export">
                        <Download size={32} />
                    </div>
                    <h3>Exporter les données</h3>
                    <p>Téléchargez une sauvegarde complète de toutes vos données (prospects, listes, campagnes, modèles)</p>
                    <button onClick={exportAllData} className="btn-primary">
                        <Download size={18} />
                        Exporter tout
                    </button>
                </div>

                <div className="data-action-card">
                    <div className="action-icon import">
                        <Upload size={32} />
                    </div>
                    <h3>Importer les données</h3>
                    <p>Restaurez une sauvegarde précédente. Attention : cela remplacera toutes vos données actuelles</p>
                    <label className="btn-secondary" htmlFor="import-file">
                        <Upload size={18} />
                        Importer un fichier
                    </label>
                    <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={importAllData}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className="data-info">
                <AlertCircle size={20} />
                <div>
                    <strong>Conseil :</strong> Exportez régulièrement vos données pour éviter toute perte.
                    Les données sont stockées dans votre navigateur et peuvent être effacées si vous videz le cache.
                </div>
            </div>
        </div>
    );
};

export default DataManager;
