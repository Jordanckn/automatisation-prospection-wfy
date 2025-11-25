import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Briefcase, FileText, Mail } from 'lucide-react';

const Form = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        url: '',
        name: '',
        profession: '',
        location: '',
        email: '',
        auditType: 'detailed', // 'detailed' ou 'simplified'
        templateId: null // ID du template email sélectionné
    });

    const [templates, setTemplates] = useState([]);

    // Charger les templates depuis localStorage
    useEffect(() => {
        const savedTemplates = localStorage.getItem('email_templates');
        if (savedTemplates) {
            setTemplates(JSON.parse(savedTemplates));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-container">
            <h2>Nouvel Audit</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label><Search size={18} /> URL du site</label>
                    <input
                        type="url"
                        name="url"
                        placeholder="https://example.com"
                        required
                        value={formData.url}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label><User size={18} /> Nom du prospect</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Jean Dupont"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="input-group half">
                        <label><Briefcase size={18} /> Profession</label>
                        <input
                            type="text"
                            name="profession"
                            placeholder="Profession (ex: Avocat, Architecte...)"
                            required
                            value={formData.profession}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group half">
                        <label><MapPin size={18} /> Localisation</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Paris, Lyon..."
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>📧 Email du prospect (optionnel)</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Type d'audit */}
                <div className="input-group">
                    <label><FileText size={18} /> Type d'audit</label>
                    <select
                        name="auditType"
                        value={formData.auditType}
                        onChange={handleChange}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            width: '100%',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="detailed">Audit Détaillé (complet avec tous les audits)</option>
                        <option value="simplified">Audit Simplifié (métriques essentielles uniquement)</option>
                    </select>
                </div>

                {/* Template email */}
                {templates.length > 0 && (
                    <div className="input-group">
                        <label><Mail size={18} /> Template email (optionnel)</label>
                        <select
                            name="templateId"
                            value={formData.templateId || ''}
                            onChange={handleChange}
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

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Analyse en cours...' : 'Lancer l\'audit'}
                </button>
            </form>
        </div>
    );
};

export default Form;
