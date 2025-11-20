import React, { useState } from 'react';
import { Upload, UserPlus, Trash2, Play, Download, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

const ProspectsManager = ({ onRunAudit }) => {
    const [prospects, setProspects] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProspect, setNewProspect] = useState({
        name: '',
        url: '',
        profession: '',
        location: ''
    });

    // Load prospects from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('webfityou_prospects');
        if (saved) {
            try {
                setProspects(JSON.parse(saved));
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
    }, [prospects]);

    // Add prospect manually
    const handleAddProspect = (e) => {
        e.preventDefault();
        setProspects([...prospects, { ...newProspect, id: Date.now() }]);
        setNewProspect({ name: '', url: '', profession: '', location: '' });
        setShowAddForm(false);
    };

    // Delete prospect
    const handleDelete = (id) => {
        setProspects(prospects.filter(p => p.id !== id));
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
                        location: row.location || row.Location || row.ville || row.Ville || row.localisation || row.Localisation || ''
                    }));

                setProspects([...prospects, ...imported]);
            },
            error: (error) => {
                alert('Erreur lors de l\'import CSV : ' + error.message);
            }
        });
    };

    // Export template CSV
    const handleExportTemplate = () => {
        const csv = 'name,url,profession,location\nJean Dupont,https://example.com,Avocat,Paris\n';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_prospects.csv';
        a.click();
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prospects.map((prospect) => (
                                <tr key={prospect.id}>
                                    <td>{prospect.name}</td>
                                    <td><a href={prospect.url} target="_blank" rel="noopener noreferrer">{prospect.url}</a></td>
                                    <td>{prospect.profession}</td>
                                    <td>{prospect.location}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => onRunAudit(prospect)}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProspectsManager;
