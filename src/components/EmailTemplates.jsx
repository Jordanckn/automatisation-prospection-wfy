import React, { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, Eye, Save, X } from 'lucide-react';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        message: '',
        isDefault: false
    });

    useEffect(() => {
        const savedTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
        setTemplates(savedTemplates);
    }, []);

    useEffect(() => {
        localStorage.setItem('emailTemplates', JSON.stringify(templates));
    }, [templates]);

    const handleCreate = () => {
        if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const newTemplate = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        setTemplates([...templates, newTemplate]);
        setFormData({ name: '', subject: '', message: '', isDefault: false });
        setIsCreating(false);
    };

    const handleUpdate = () => {
        if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        setTemplates(templates.map(t =>
            t.id === editingTemplate.id ? { ...t, ...formData } : t
        ));
        setEditingTemplate(null);
        setFormData({ name: '', subject: '', message: '', isDefault: false });
    };

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            subject: template.subject,
            message: template.message,
            isDefault: template.isDefault || false
        });
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingTemplate(null);
        setFormData({ name: '', subject: '', message: '', isDefault: false });
    };

    const renderPreview = (template) => {
        const sampleProspect = {
            name: 'Jean Dupont',
            url: 'www.exemple.fr',
            profession: 'Restaurant',
            location: 'Paris',
            email: 'contact@exemple.fr'
        };

        let preview = template.message;
        preview = preview.replace(/{nom}/g, sampleProspect.name);
        preview = preview.replace(/{url}/g, sampleProspect.url);
        preview = preview.replace(/{profession}/g, sampleProspect.profession);
        preview = preview.replace(/{localisation}/g, sampleProspect.location);
        preview = preview.replace(/{email}/g, sampleProspect.email);

        return preview;
    };

    return (
        <div className="email-templates">
            <div className="templates-header">
                <div>
                    <h2><Mail size={24} /> Modèles d'Emails</h2>
                    <p className="text-muted">Créez et gérez vos modèles d'emails personnalisables</p>
                </div>
                {!isCreating && !editingTemplate && (
                    <button onClick={() => setIsCreating(true)} className="btn-primary">
                        <Plus size={18} />
                        Nouveau modèle
                    </button>
                )}
            </div>

            {(isCreating || editingTemplate) && (
                <div className="template-form">
                    <h3>{editingTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}</h3>

                    <div className="form-group">
                        <label>Nom du modèle *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Email de prospection standard"
                        />
                    </div>

                    <div className="form-group">
                        <label>Sujet de l'email *</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Ex: Rapport d'audit SEO - {nom}"
                        />
                    </div>

                    <div className="form-group">
                        <label>Message *</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={12}
                            placeholder="Bonjour {nom},&#10;&#10;Suite à notre échange, je vous envoie le rapport d'audit SEO et performance de votre site {url}.&#10;&#10;..."
                        />
                        <small className="text-muted">
                            Variables disponibles : {'{nom}'}, {'{url}'}, {'{profession}'}, {'{localisation}'}, {'{email}'}
                        </small>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            <span>Définir comme modèle par défaut</span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button onClick={handleCancel} className="btn-cancel">
                            <X size={18} />
                            Annuler
                        </button>
                        <button
                            onClick={editingTemplate ? handleUpdate : handleCreate}
                            className="btn-primary"
                        >
                            <Save size={18} />
                            {editingTemplate ? 'Mettre à jour' : 'Créer'}
                        </button>
                    </div>
                </div>
            )}

            <div className="templates-list">
                {templates.length === 0 ? (
                    <div className="empty-state">
                        <Mail size={48} />
                        <p>Aucun modèle d'email</p>
                        <p className="text-muted">Créez votre premier modèle pour gagner du temps</p>
                    </div>
                ) : (
                    templates.map(template => (
                        <div key={template.id} className="template-card">
                            <div className="template-header">
                                <div>
                                    <h4>
                                        {template.name}
                                        {template.isDefault && <span className="badge-default">Par défaut</span>}
                                    </h4>
                                    <p className="template-subject">Sujet : {template.subject}</p>
                                </div>
                                <div className="template-actions">
                                    <button
                                        onClick={() => setPreviewTemplate(template)}
                                        className="btn-icon"
                                        title="Prévisualiser"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(template)}
                                        className="btn-icon"
                                        title="Modifier"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="btn-icon btn-danger-icon"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="template-preview">
                                {template.message.substring(0, 150)}...
                            </div>
                        </div>
                    ))
                )}
            </div>

            {previewTemplate && (
                <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
                    <div className="modal template-preview-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Eye size={20} /> Prévisualisation</h3>
                            <button onClick={() => setPreviewTemplate(null)} className="close-button">×</button>
                        </div>
                        <div className="modal-body">
                            <div className="preview-section">
                                <strong>Sujet :</strong>
                                <p>{previewTemplate.subject.replace(/{nom}/g, 'Jean Dupont')}</p>
                            </div>
                            <div className="preview-section">
                                <strong>Message :</strong>
                                <pre className="preview-message">{renderPreview(previewTemplate)}</pre>
                            </div>
                            <div className="preview-info">
                                <small className="text-muted">
                                    Exemple avec : Jean Dupont, www.exemple.fr, Restaurant, Paris
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplates;
