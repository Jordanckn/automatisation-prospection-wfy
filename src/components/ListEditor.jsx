import React, { useState } from 'react';
import { UserPlus, UserMinus, Mail, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ListEditor = ({ list, prospects, onBack, onUpdateList }) => {
    const [selectedProspects, setSelectedProspects] = useState(list.prospectIds || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCampaignModal, setShowCampaignModal] = useState(false);

    const toggleProspect = (prospectId) => {
        if (selectedProspects.includes(prospectId)) {
            setSelectedProspects(selectedProspects.filter(id => id !== prospectId));
        } else {
            setSelectedProspects([...selectedProspects, prospectId]);
        }
    };

    const saveList = () => {
        onUpdateList({ ...list, prospectIds: selectedProspects });
        // onBack sera appelé par le parent après la sauvegarde
    };

    const filteredProspects = prospects.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.url?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const prospectsInList = prospects.filter(p => selectedProspects.includes(p.id));

    return (
        <div className="list-editor">
            <div className="list-editor-header">
                <div>
                    <button onClick={onBack} className="btn-back">← Retour</button>
                    <h2 style={{ borderLeftColor: list.color }}>
                        {list.name}
                    </h2>
                    <p className="text-muted">
                        {selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} sélectionné{selectedProspects.length > 1 ? 's' : ''}
                    </p>
                </div>

                <div className="list-editor-actions">
                    <button
                        className="btn-primary"
                        onClick={() => setShowCampaignModal(true)}
                        disabled={selectedProspects.length === 0}
                    >
                        <Send size={18} />
                        Lancer une campagne ({selectedProspects.length})
                    </button>
                    <button onClick={saveList} className="btn-success">
                        Enregistrer
                    </button>
                </div>
            </div>

            <div className="list-editor-body">
                <div className="prospects-selector">
                    <h3>Ajouter des prospects</h3>

                    <input
                        type="text"
                        placeholder="Rechercher un prospect..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <div className="prospects-list">
                        {filteredProspects.length === 0 ? (
                            <div className="empty-state-small">
                                <p>Aucun prospect trouvé</p>
                            </div>
                        ) : (
                            filteredProspects.map(prospect => {
                                const isSelected = selectedProspects.includes(prospect.id);

                                return (
                                    <div
                                        key={prospect.id}
                                        className={`prospect-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleProspect(prospect.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => { }}
                                        />
                                        <div className="prospect-info">
                                            <strong>{prospect.name}</strong>
                                            <span className="text-muted">{prospect.email}</span>
                                            {prospect.url && (
                                                <span className="prospect-url">{prospect.url}</span>
                                            )}
                                        </div>
                                        <button className="btn-icon">
                                            {isSelected ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="prospects-selected">
                    <h3>Prospects dans cette liste</h3>

                    {prospectsInList.length === 0 ? (
                        <div className="empty-state-small">
                            <UserPlus size={32} />
                            <p>Aucun prospect dans cette liste</p>
                            <p className="text-muted">Sélectionnez des prospects à gauche</p>
                        </div>
                    ) : (
                        <div className="selected-prospects-list">
                            {prospectsInList.map(prospect => (
                                <div key={prospect.id} className="selected-prospect-card">
                                    <div className="prospect-info">
                                        <strong>{prospect.name}</strong>
                                        <span className="text-muted">{prospect.email}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleProspect(prospect.id)}
                                        className="btn-icon btn-danger"
                                    >
                                        <UserMinus size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showCampaignModal && (
                <CampaignModal
                    list={list}
                    prospects={prospectsInList}
                    onClose={() => setShowCampaignModal(false)}
                />
            )}
        </div>
    );
};

const CampaignModal = ({ list, prospects, onClose }) => {
    const [campaignName, setCampaignName] = useState(`Campagne ${list.name}`);
    const [delayBetweenEmails, setDelayBetweenEmails] = useState(5);
    const [sendOptions, setSendOptions] = useState({
        sendHtml: false,
        sendPdf: true,
        template: 'standard' // 'standard' ou 'commercial'
    });
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState([]);

    // Fonction pour générer le message email selon le template
    const generateEmailMessage = (prospect) => {
        const { name, url, profession } = prospect;

        // Lien pour demander un rendez-vous
        const meetingLink = `mailto:webfityou@gmail.com?subject=Demande de rendez-vous - ${encodeURIComponent(name)}&body=Bonjour,%0D%0A%0D%0AJe souhaite discuter des optimisations prioritaires pour mon site web suite à l'audit que vous m'avez transmis.%0D%0A%0D%0AMerci de me proposer quelques créneaux pour un échange.%0D%0A%0D%0ACordialement,%0D%0A${encodeURIComponent(name)}`;

        // Lien de désinscription
        const unsubscribeLink = `mailto:webfityou@gmail.com?subject=Demande de désinscription - ${encodeURIComponent(name)}&body=Bonjour,%0D%0A%0D%0AMerci de bien vouloir supprimer mes coordonnées de votre liste de diffusion.%0D%0A%0D%0ACordialement,%0D%0A${encodeURIComponent(name)}`;

        // Template commercial personnalisé
        if (sendOptions.template === 'commercial') {
            // Adapter le titre selon la profession
            let title = name;
            if (profession?.toLowerCase().includes('avocat')) {
                title = `Maître ${name}`;
            } else if (profession?.toLowerCase().includes('docteur') || profession?.toLowerCase().includes('médecin')) {
                title = `Docteur ${name}`;
            }

            // Adapter le message selon la profession
            let businessContext = '';
            let clientTerm = 'clients';
            let acquisitionTerm = 'demandes qualifiées';

            if (profession?.toLowerCase().includes('avocat')) {
                businessContext = 'Google et l\'intelligence artificielle jouent un rôle déterminant dans la manière dont les clients choisissent leur avocat, et votre site pourrait capter bien plus de demandes que ce qu\'il génère actuellement.';
                clientTerm = 'futurs clients';
                acquisitionTerm = 'dossiers qualifiés';
            } else if (profession?.toLowerCase().includes('architecte')) {
                businessContext = 'Dans le secteur de l\'architecture, votre présence en ligne est souvent le premier contact avec vos futurs clients. Votre site pourrait générer bien plus de projets qualifiés.';
                clientTerm = 'futurs clients';
                acquisitionTerm = 'projets qualifiés';
            } else {
                businessContext = 'Votre présence en ligne est déterminante pour attirer de nouveaux clients. Votre site pourrait générer bien plus de demandes qualifiées qu\'actuellement.';
            }

            const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        a { color: #3b82f6; text-decoration: underline; }
        a:hover { color: #2563eb; }
    </style>
</head>
<body>
${title},<br><br>

Nous avons analysé votre site web ${url} et au vu des résultats en pièce jointe, je me suis dit que cela valait le coup de vous contacter.<br><br>

${businessContext}<br><br>

Chez WebFitYou, nous aidons des professionnels comme vous à devenir visibles partout où leurs ${clientTerm} cherchent :<br>
• En première page sur Google<br>
• Dans les réponses des IA (ChatGPT, Gemini…)<br>
• Via des contenus optimisés et convaincants<br><br>

L'objectif : transformer votre site web en un levier d'acquisition de ${acquisitionTerm}.<br><br>

Les conclusions de l'audit sont ci-jointes. Si vous le souhaitez, je peux vous présenter les optimisations prioritaires à mettre en place et l'impact concret sur votre activité.<br><br>

Discutons-en : <a href="${meetingLink}" style="color: #3b82f6; text-decoration: underline;">cliquez ici</a><br><br>

Bien à vous,<br>
L'équipe WebFitYou<br>
🌐 www.webfityou.com<br><br>

---<br>
Vous ne souhaitez plus recevoir ces emails ? <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Se désinscrire</a>
</body>
</html>`;
            return htmlMessage;
        }

        // Template standard
        const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        a { color: #3b82f6; text-decoration: underline; }
        a:hover { color: #2563eb; }
    </style>
</head>
<body>
Bonjour ${name},<br><br>

Suite à notre échange, je vous envoie le rapport d'audit SEO et performance de votre site ${url}.<br><br>

Ce rapport détaillé vous présente :<br>
• Les points forts de votre site<br>
• Les axes d'amélioration prioritaires<br>
• Des recommandations concrètes pour optimiser votre visibilité<br><br>

N'hésitez pas à me contacter si vous avez des questions.<br><br>

Cordialement,<br>
L'équipe WebFitYou<br>
🌐 www.webfityou.com<br><br>

---<br>
Vous ne souhaitez plus recevoir ces emails ? <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Se désinscrire</a>
</body>
</html>`;
        return htmlMessage;
    };

    const startCampaign = async () => {
        setIsSending(true);
        const results = [];

        // Récupérer les clés API
        const savedKeys = localStorage.getItem('webfityou_keys');
        const apiKeys = savedKeys ? JSON.parse(savedKeys) : {};

        if (!apiKeys.googlePageSpeedApiKey) {
            alert('Veuillez configurer votre clé API Google PageSpeed dans les paramètres.');
            setIsSending(false);
            return;
        }

        for (let i = 0; i < prospects.length; i++) {
            const prospect = prospects[i];

            try {
                // 1. Générer l'audit pour ce prospect
                setSendStatus([...results, {
                    prospectId: prospect.id,
                    prospectName: prospect.name,
                    status: 'generating',
                    message: 'Génération de l\'audit...',
                    timestamp: new Date().toISOString()
                }]);

                // Import des fonctions nécessaires
                const { fetchPageSpeed } = await import('../utils/fetchPageSpeed');
                const { extractMetrics } = await import('../utils/extractMetrics');
                const { buildHtmlReport } = await import('../utils/buildHtmlReport');

                // Fetch PageSpeed Data
                const [mobileData, desktopData] = await Promise.all([
                    fetchPageSpeed(prospect.url, 'mobile', apiKeys.googlePageSpeedApiKey),
                    fetchPageSpeed(prospect.url, 'desktop', apiKeys.googlePageSpeedApiKey)
                ]);

                // Extract Metrics
                const metrics = extractMetrics(mobileData, desktopData);

                // Build HTML Report
                const htmlContent = buildHtmlReport(metrics, prospect);

                // 2. Préparer le message email avec le template sélectionné
                const emailMessage = generateEmailMessage(prospect);

                // 3. Envoyer l'email
                setSendStatus([...results, {
                    prospectId: prospect.id,
                    prospectName: prospect.name,
                    status: 'sending',
                    message: 'Envoi de l\'email...',
                    timestamp: new Date().toISOString()
                }]);

                const response = await fetch('http://localhost:3001/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: prospect.email,
                        subject: `Rapport d'audit SEO - ${prospect.name}`,
                        text: emailMessage,
                        html: (sendOptions.sendHtml || sendOptions.sendPdf) ? htmlContent : null,
                        htmlInBody: sendOptions.sendHtml,
                        generatePdf: sendOptions.sendPdf,
                        prospectName: prospect.name
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    results.push({
                        prospectId: prospect.id,
                        prospectName: prospect.name,
                        status: 'success',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    results.push({
                        prospectId: prospect.id,
                        prospectName: prospect.name,
                        status: 'error',
                        error: result.error || 'Erreur lors de l\'envoi',
                        timestamp: new Date().toISOString()
                    });
                }

                setSendStatus([...results]);

                // Délai entre les envois (sauf pour le dernier)
                if (i < prospects.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenEmails * 1000));
                }
            } catch (error) {
                results.push({
                    prospectId: prospect.id,
                    prospectName: prospect.name,
                    status: 'error',
                    error: error.message || 'Erreur inconnue',
                    timestamp: new Date().toISOString()
                });
                setSendStatus([...results]);
            }
        }

        setIsSending(false);

        // Sauvegarder la campagne dans l'historique
        const campaign = {
            id: Date.now().toString(),
            name: campaignName,
            listId: list.id,
            listName: list.name,
            totalSent: results.filter(r => r.status === 'success').length,
            totalFailed: results.filter(r => r.status === 'error').length,
            results: results,
            createdAt: new Date().toISOString()
        };

        const campaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
        campaigns.unshift(campaign);
        localStorage.setItem('emailCampaigns', JSON.stringify(campaigns));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="campaign-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3><Mail size={20} /> Nouvelle Campagne</h3>
                    <button onClick={onClose} className="close-button">×</button>
                </div>

                <div className="modal-body">
                    {!isSending && sendStatus.length === 0 ? (
                        <>
                            <div className="form-group">
                                <label>Nom de la campagne</label>
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                />
                            </div>

                            <div className="campaign-summary">
                                <h4>Résumé</h4>
                                <div className="summary-item">
                                    <span>Liste :</span>
                                    <strong>{list.name}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Prospects :</span>
                                    <strong>{prospects.length}</strong>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Délai entre chaque envoi (secondes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={delayBetweenEmails}
                                    onChange={(e) => setDelayBetweenEmails(parseInt(e.target.value))}
                                />
                                <small className="text-muted">
                                    Recommandé : 5-10 secondes pour éviter d'être marqué comme spam
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Type de message</label>
                                <select
                                    value={sendOptions.template}
                                    onChange={(e) => setSendOptions({ ...sendOptions, template: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="standard">Message standard (neutre)</option>
                                    <option value="commercial">Message commercial (personnalisé par profession)</option>
                                </select>
                                <small className="text-muted">
                                    Le message commercial s'adapte automatiquement selon la profession (ex: "Maître" pour les avocats)
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Format d'envoi</label>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={sendOptions.sendHtml}
                                            onChange={(e) => setSendOptions({ ...sendOptions, sendHtml: e.target.checked })}
                                        />
                                        <span>Email HTML (rapport dans le corps)</span>
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={sendOptions.sendPdf}
                                            onChange={(e) => setSendOptions({ ...sendOptions, sendPdf: e.target.checked })}
                                        />
                                        <span>Pièce jointe PDF</span>
                                    </label>
                                </div>
                            </div>

                            <div className="alert alert-info">
                                <AlertCircle size={18} />
                                <div>
                                    <strong>Important :</strong> Assurez-vous que tous les prospects ont un audit généré avant de lancer la campagne.
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="campaign-progress">
                            <h4>Envoi en cours...</h4>

                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(sendStatus.length / prospects.length) * 100}%` }}
                                />
                            </div>

                            <p className="progress-text">
                                {sendStatus.length} / {prospects.length} emails envoyés
                            </p>

                            <div className="send-results">
                                {sendStatus.map((result, index) => (
                                    <div key={index} className={`result-item ${result.status}`}>
                                        {result.status === 'success' ? (
                                            <CheckCircle size={16} color="#10b981" />
                                        ) : result.status === 'generating' ? (
                                            <Clock size={16} color="#f59e0b" />
                                        ) : result.status === 'sending' ? (
                                            <Send size={16} color="#3b82f6" />
                                        ) : (
                                            <XCircle size={16} color="#ef4444" />
                                        )}
                                        <span>{result.prospectName}</span>
                                        {result.message && (
                                            <span className="status-message">{result.message}</span>
                                        )}
                                        {result.status === 'error' && result.error && (
                                            <span className="error-message">{result.error}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {!isSending && sendStatus.length === 0 ? (
                        <>
                            <button onClick={onClose} className="btn-cancel">Annuler</button>
                            <button
                                onClick={startCampaign}
                                className="btn-primary"
                                disabled={!campaignName || prospects.length === 0}
                            >
                                <Send size={18} />
                                Lancer la campagne
                            </button>
                        </>
                    ) : sendStatus.length === prospects.length ? (
                        <>
                            <button
                                onClick={() => {
                                    setSendStatus([]);
                                    setIsSending(false);
                                }}
                                className="btn-secondary"
                                style={{ marginRight: '10px' }}
                            >
                                Nouvelle campagne
                            </button>
                            <button onClick={onClose} className="btn-success">
                                Terminé - Fermer
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ListEditor;
