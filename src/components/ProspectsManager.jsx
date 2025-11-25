import React, { useState } from 'react';
import { Upload, UserPlus, Trash2, Play, Download, FileSpreadsheet, Edit2, FileText, Mail } from 'lucide-react';
import Papa from 'papaparse';

const ProspectsManager = ({ onRunAudit, onProspectsChange }) => {
    const [prospects, setProspects] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingProspect, setEditingProspect] = useState(null);
    const [newProspect, setNewProspect] = useState({
        name: '',
        url: '',
        profession: '',
        location: '',
        email: ''
    });

    // Modal de sélection du type d'audit
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [auditType, setAuditType] = useState('detailed');
    const [templateId, setTemplateId] = useState(null);
    const [templates, setTemplates] = useState([]);

    // Charger les templates
    React.useEffect(() => {
        const savedTemplates = localStorage.getItem('email_templates');
        if (savedTemplates) {
            setTemplates(JSON.parse(savedTemplates));
        }
    }, []);

    // Load prospects from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('webfityou_prospects');
        if (saved) {
            try {
                const loadedProspects = JSON.parse(saved);
                setProspects(loadedProspects);
                if (onProspectsChange) {
                    onProspectsChange(loadedProspects);
                }
            } catch (e) {
                console.error('Error loading prospects:', e);
            }
        }
    }, []);

    // Save prospects to localStorage whenever they change
    React.useEffect(() => {
        if (prospects.length > 0) {
            localStorage.setItem('webfityou_prospects', JSON.stringify(prospects));
        }
        if (onProspectsChange) {
            onProspectsChange(prospects);
        }
    }, [prospects, onProspectsChange]);

    // Add prospect manually
    const handleAddProspect = (e) => {
        e.preventDefault();

        // Vérifier les doublons par email ou URL
        const duplicate = prospects.find(p =>
            (newProspect.email && p.email?.toLowerCase() === newProspect.email.toLowerCase()) ||
            (newProspect.url && p.url?.toLowerCase() === newProspect.url.toLowerCase())
        );

        if (duplicate) {
            const message = `⚠️ Un prospect similaire existe déjà :\n\n` +
                `Nom: ${duplicate.name}\n` +
                `Email: ${duplicate.email}\n` +
                `URL: ${duplicate.url}\n\n` +
                `Voulez-vous quand même ajouter ce prospect ?`;

            if (!window.confirm(message)) {
                return;
            }
        }

        setProspects([...prospects, { ...newProspect, id: Date.now() }]);
        setNewProspect({ name: '', url: '', profession: '', location: '', email: '' });
        setShowAddForm(false);
    };

    // Delete prospect
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
            setProspects(prospects.filter(p => p.id !== id));
        }
    };

    // Start editing a prospect
    const handleEdit = (prospect) => {
        setEditingId(prospect.id);
        setEditingProspect({ ...prospect });
    };

    // Save edited prospect
    const handleSaveEdit = () => {
        setProspects(prospects.map(p =>
            p.id === editingId ? editingProspect : p
        ));
        setEditingId(null);
        setEditingProspect(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingProspect(null);
    };

    // Import CSV
    const handleCSVImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const imported = results.data
                    .filter(row => row.name && row.url) // Filter valid rows
                    .map(row => ({
                        id: Date.now() + Math.random(),
                        name: row.name || row.Name || row.nom || row.Nom || '',
                        url: row.url || row.URL || row.site || row.Site || '',
                        profession: row.profession || row.Profession || row.metier || row.Métier || '',
                        location: row.location || row.Location || row.ville || row.Ville || row.localisation || row.Localisation || '',
                        email: row.email || row.Email || row.mail || row.Mail || ''
                    }));

                // Détecter les doublons
                const duplicates = [];
                const toAdd = [];

                imported.forEach(newProspect => {
                    const duplicate = prospects.find(p =>
                        (newProspect.email && p.email?.toLowerCase() === newProspect.email.toLowerCase()) ||
                        (newProspect.url && p.url?.toLowerCase() === newProspect.url.toLowerCase())
                    );

                    if (duplicate) {
                        duplicates.push(newProspect);
                    } else {
                        toAdd.push(newProspect);
                    }
                });

                // Afficher un résumé
                let message = `Import terminé :\n\n`;
                message += `✅ ${toAdd.length} nouveau(x) prospect(s) ajouté(s)\n`;
                if (duplicates.length > 0) {
                    message += `⚠️ ${duplicates.length} doublon(s) ignoré(s)\n\n`;
                    message += `Doublons détectés :\n`;
                    duplicates.slice(0, 5).forEach(d => {
                        message += `- ${d.name} (${d.email || d.url})\n`;
                    });
                    if (duplicates.length > 5) {
                        message += `... et ${duplicates.length - 5} autre(s)`;
                    }
                }

                alert(message);
                setProspects([...prospects, ...toAdd]);
            },
            error: (error) => {
                alert('Erreur lors de l\'import CSV : ' + error.message);
            }
        });
    };

    // Export template CSV
    const handleExportTemplate = () => {
        const csv = 'name,url,profession,location,email\nJean Dupont,https://example.com,Avocat,Paris,jean.dupont@example.com\n';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_prospects.csv';
        a.click();
    };

    // Ouvrir le modal de sélection d'audit
    const handleOpenAuditModal = (prospect) => {
        setSelectedProspect(prospect);
        setShowAuditModal(true);
    };

    // Lancer l'audit avec les options sélectionnées
    const handleLaunchAudit = () => {
        if (selectedProspect) {
            onRunAudit({
                ...selectedProspect,
                auditType,
                templateId
            });
            setShowAuditModal(false);
            setSelectedProspect(null);
            setAuditType('detailed');
            setTemplateId(null);
        }
    };

    return (
        <div className="prospects-manager">
            <div className="manager-header">
                <h2>Gestion des Prospects</h2>
                <div className="header-actions">
                    <button onClick={handleExportTemplate} className="btn-secondary">
                        <Download size={18} /> Télécharger template CSV
                    </button>
                    <label className="btn-secondary">
                        <Upload size={18} /> Importer CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCSVImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                        <UserPlus size={18} /> Ajouter manuellement
                    </button>
                </div>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddProspect} className="add-prospect-form">
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Nom du prospect"
                            value={newProspect.name}
                            onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                            required
                        />
                        <input
                            type="url"
                            placeholder="URL du site"
                            value={newProspect.url}
                            onChange={(e) => setNewProspect({ ...newProspect, url: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Profession"
                            value={newProspect.profession}
                            onChange={(e) => setNewProspect({ ...newProspect, profession: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Localisation"
                            value={newProspect.location}
                            onChange={(e) => setNewProspect({ ...newProspect, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="email"
                            placeholder="Email du prospect"
                            value={newProspect.email}
                            onChange={(e) => setNewProspect({ ...newProspect, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setShowAddForm(false)} className="btn-cancel">
                            Annuler
                        </button>
                        <button type="submit" className="btn-submit">
                            Ajouter
                        </button>
                    </div>
                </form>
            )}

            <div className="prospects-table">
                {prospects.length === 0 ? (
                    <div className="empty-state">
                        <FileSpreadsheet size={48} />
                        <p>Aucun prospect pour le moment</p>
                        <p className="sub-text">Ajoutez des prospects manuellement ou importez un fichier CSV</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>URL</th>
                                <th>Profession</th>
                                <th>Localisation</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prospects.map((prospect) => (
                                <tr key={prospect.id}>
                                    {editingId === prospect.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingProspect.name}
                                                    onChange={(e) => setEditingProspect({ ...editingProspect, name: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="url"
                                                    value={editingProspect.url}
                                                    onChange={(e) => setEditingProspect({ ...editingProspect, url: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingProspect.profession}
                                                    onChange={(e) => setEditingProspect({ ...editingProspect, profession: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingProspect.location}
                                                    onChange={(e) => setEditingProspect({ ...editingProspect, location: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    value={editingProspect.email}
                                                    onChange={(e) => setEditingProspect({ ...editingProspect, email: e.target.value })}
                                                    style={{ width: '100%', padding: '0.5rem' }}
                                                />
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="btn-action btn-run"
                                                    title="Enregistrer"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="btn-action btn-delete"
                                                    title="Annuler"
                                                >
                                                    ✗
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{prospect.name}</td>
                                            <td><a href={prospect.url} target="_blank" rel="noopener noreferrer">{prospect.url}</a></td>
                                            <td>{prospect.profession}</td>
                                            <td>{prospect.location}</td>
                                            <td>{prospect.email || '-'}</td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={() => handleEdit(prospect)}
                                                    className="btn-action btn-edit"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenAuditModal(prospect)}
                                                    className="btn-action btn-run"
                                                    title="Lancer l'audit"
                                                >
                                                    <Play size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prospect.id)}
                                                    className="btn-action btn-delete"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal de sélection d'audit */}
            {showAuditModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3>Lancer un audit pour {selectedProspect?.name}</h3>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowAuditModal(false);
                                    setSelectedProspect(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group">
                                <label><FileText size={18} /> Type d'audit</label>
                                <select
                                    value={auditType}
                                    onChange={(e) => setAuditType(e.target.value)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        width: '100%',
                                        cursor: 'pointer',
                                        marginBottom: '15px'
                                    }}
                                >
                                    <option value="detailed">Audit Détaillé (complet)</option>
                                    <option value="simplified">Audit Simplifié (métriques essentielles)</option>
                                </select>
                            </div>

                            {templates.length > 0 && (
                                <div className="input-group">
                                    <label><Mail size={18} /> Template email (optionnel)</label>
                                    <select
                                        value={templateId || ''}
                                        onChange={(e) => setTemplateId(e.target.value || null)}
                                        style={{
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '14px',
                                            width: '100%',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Aucun template (rapport standard)</option>
                                        {templates.map(template => (
                                            <option key={template.id} value={template.id}>
                                                {template.name}
                                            </option>
                                        ))}
                                    </select>
                                    <small style={{ color: '#64748b', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                        Le template sera utilisé pour générer le rapport HTML
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setShowAuditModal(false);
                                    setSelectedProspect(null);
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleLaunchAudit}
                            >
                                <Play size={16} /> Lancer l'analyse
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProspectsManager;
