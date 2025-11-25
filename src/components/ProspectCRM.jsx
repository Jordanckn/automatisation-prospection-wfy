import React, { useState, useEffect } from 'react';
import { Users, Plus, Save, X, MessageSquare, Calendar, Mail, Globe, Briefcase, MapPin, ChevronDown, ChevronUp, Trash2, UserPlus, Phone, Star, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

const STATUSES = [
    { value: 'new', label: 'Nouveau', color: '#3b82f6', Icon: UserPlus },
    { value: 'contacted', label: 'Contacté', color: '#8b5cf6', Icon: Phone },
    { value: 'interested', label: 'Intéressé', color: '#f59e0b', Icon: Star },
    { value: 'negotiation', label: 'Négociation', color: '#10b981', Icon: MessageCircle },
    { value: 'client', label: 'Client', color: '#059669', Icon: CheckCircle },
    { value: 'lost', label: 'Perdu', color: '#ef4444', Icon: XCircle }
];

const ProspectCRM = () => {
    const [prospects, setProspects] = useState([]);
    const [filteredProspects, setFilteredProspects] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProspect, setExpandedProspect] = useState(null);
    const [editingNote, setEditingNote] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        loadProspects();
    }, []);

    useEffect(() => {
        filterProspects();
    }, [prospects, filterStatus, searchTerm]);

    const loadProspects = () => {
        const saved = localStorage.getItem('webfityou_prospects');
        if (saved) {
            try {
                let loadedProspects = JSON.parse(saved);
                loadedProspects = loadedProspects.map(p => ({
                    ...p,
                    status: p.status || 'new',
                    notes: p.notes || [],
                    lastContact: p.lastContact || null,
                    nextAction: p.nextAction || '',
                    tags: p.tags || []
                }));
                setProspects(loadedProspects);
            } catch (e) {
                console.error('Error loading prospects:', e);
            }
        }
    };

    const saveProspects = (updatedProspects) => {
        localStorage.setItem('webfityou_prospects', JSON.stringify(updatedProspects));
        setProspects(updatedProspects);
    };

    const filterProspects = () => {
        let filtered = [...prospects];

        if (filterStatus !== 'all') {
            filtered = filtered.filter(p => p.status === filterStatus);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(term) ||
                p.email?.toLowerCase().includes(term) ||
                p.profession?.toLowerCase().includes(term) ||
                p.location?.toLowerCase().includes(term)
            );
        }

        setFilteredProspects(filtered);
    };

    const updateProspectStatus = (prospectId, newStatus) => {
        const updated = prospects.map(p =>
            p.id === prospectId
                ? { ...p, status: newStatus, lastContact: new Date().toISOString() }
                : p
        );
        saveProspects(updated);
    };

    const addNote = (prospectId) => {
        if (!newNote.trim()) return;

        const updated = prospects.map(p =>
            p.id === prospectId
                ? {
                    ...p,
                    notes: [
                        ...p.notes,
                        {
                            id: Date.now(),
                            text: newNote,
                            date: new Date().toISOString()
                        }
                    ]
                }
                : p
        );
        saveProspects(updated);
        setNewNote('');
        setEditingNote(null);
    };

    const deleteNote = (prospectId, noteId) => {
        if (!window.confirm('Supprimer cette note ?')) return;

        const updated = prospects.map(p =>
            p.id === prospectId
                ? { ...p, notes: p.notes.filter(n => n.id !== noteId) }
                : p
        );
        saveProspects(updated);
    };

    const updateNextAction = (prospectId, action) => {
        const updated = prospects.map(p =>
            p.id === prospectId ? { ...p, nextAction: action } : p
        );
        saveProspects(updated);
    };

    const getStatusInfo = (status) => {
        return STATUSES.find(s => s.value === status) || STATUSES[0];
    };

    const getStatusCounts = () => {
        const counts = { all: prospects.length };
        STATUSES.forEach(status => {
            counts[status.value] = prospects.filter(p => p.status === status.value).length;
        });
        return counts;
    };

    const counts = getStatusCounts();

    return (
        <div className="prospect-crm-v2">
            {/* Header avec stats */}
            <div className="crm-header-v2">
                <div className="header-content">
                    <div className="header-title">
                        <Users size={28} />
                        <div>
                            <h2>CRM Prospects</h2>
                            <p className="subtitle">Gérez et suivez vos {prospects.length} prospects</p>
                        </div>
                    </div>
                </div>

                {/* Stats rapides */}
                <div className="quick-stats">
                    {STATUSES.map(status => {
                        const StatusIcon = status.Icon;
                        return (
                            <div key={status.value} className="stat-pill" style={{ borderLeftColor: status.color }}>
                                <StatusIcon className="stat-icon" size={20} style={{ color: status.color }} />
                                <div className="stat-info">
                                    <span className="stat-value">{counts[status.value] || 0}</span>
                                    <span className="stat-label">{status.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Barre de filtres moderne */}
            <div className="crm-toolbar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher par nom, email, profession..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-v2"
                    />
                </div>

                <div className="filter-chips">
                    <button
                        className={`chip ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Tous <span className="chip-count">{counts.all}</span>
                    </button>
                    {STATUSES.map(status => (
                        <button
                            key={status.value}
                            className={`chip ${filterStatus === status.value ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status.value)}
                            style={{
                                '--chip-color': status.color
                            }}
                        >
                            <status.Icon size={16} /> {status.label} <span className="chip-count">{counts[status.value] || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des prospects */}
            <div className="prospects-container">
                {filteredProspects.length === 0 ? (
                    <div className="empty-state-v2">
                        <div className="empty-icon">
                            <Users size={64} />
                        </div>
                        <h3>Aucun prospect trouvé</h3>
                        <p>
                            {searchTerm || filterStatus !== 'all'
                                ? 'Essayez de modifier vos filtres de recherche'
                                : 'Ajoutez vos premiers prospects depuis l\'onglet "Gestion des prospects"'}
                        </p>
                    </div>
                ) : (
                    <div className="prospects-list">
                        {filteredProspects.map(prospect => {
                            const statusInfo = getStatusInfo(prospect.status);
                            const isExpanded = expandedProspect === prospect.id;

                            return (
                                <div key={prospect.id} className={`prospect-card-v2 ${isExpanded ? 'expanded' : ''}`}>
                                    {/* En-tête de la carte */}
                                    <div className="card-header-v2">
                                        <div className="prospect-main-info">
                                            <div className="prospect-avatar" style={{ background: statusInfo.color }}>
                                                {prospect.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="prospect-identity">
                                                <h3>{prospect.name}</h3>
                                                <div className="prospect-details">
                                                    {prospect.profession && (
                                                        <span className="detail-item">
                                                            <Briefcase size={14} /> {prospect.profession}
                                                        </span>
                                                    )}
                                                    {prospect.location && (
                                                        <span className="detail-item">
                                                            <MapPin size={14} /> {prospect.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <select
                                                value={prospect.status}
                                                onChange={(e) => updateProspectStatus(prospect.id, e.target.value)}
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: `${statusInfo.color}15`,
                                                    color: statusInfo.color,
                                                    borderColor: statusInfo.color
                                                }}
                                            >
                                                {STATUSES.map(status => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => setExpandedProspect(isExpanded ? null : prospect.id)}
                                                className="expand-btn"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contacts rapides */}
                                    <div className="quick-contacts">
                                        {prospect.email && (
                                            <a href={`mailto:${prospect.email}`} className="contact-link">
                                                <Mail size={16} />
                                                <span>{prospect.email}</span>
                                            </a>
                                        )}
                                        {prospect.url && (
                                            <a href={prospect.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                                                <Globe size={16} />
                                                <span>{prospect.url}</span>
                                            </a>
                                        )}
                                    </div>

                                    {/* Prochaine action (toujours visible) */}
                                    {prospect.nextAction && (
                                        <div className="next-action-badge">
                                            <Calendar size={14} />
                                            <span>{prospect.nextAction}</span>
                                        </div>
                                    )}

                                    {/* Contenu étendu */}
                                    {isExpanded && (
                                        <div className="expanded-content">
                                            {/* Prochaine action éditable */}
                                            <div className="action-section">
                                                <label className="section-label">
                                                    <Calendar size={16} />
                                                    Prochaine action
                                                </label>
                                                <input
                                                    type="text"
                                                    value={prospect.nextAction || ''}
                                                    onChange={(e) => updateNextAction(prospect.id, e.target.value)}
                                                    placeholder="Ex: Relancer par email le 25/11..."
                                                    className="action-input"
                                                />
                                            </div>

                                            {/* Dernier contact */}
                                            {prospect.lastContact && (
                                                <div className="last-contact">
                                                    <Calendar size={14} />
                                                    <span>Dernier contact: {new Date(prospect.lastContact).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            )}

                                            {/* Section Notes */}
                                            <div className="notes-section">
                                                <div className="section-header">
                                                    <label className="section-label">
                                                        <MessageSquare size={16} />
                                                        Notes ({prospect.notes?.length || 0})
                                                    </label>
                                                    <button
                                                        onClick={() => setEditingNote(editingNote === prospect.id ? null : prospect.id)}
                                                        className="add-note-btn"
                                                    >
                                                        {editingNote === prospect.id ? <X size={16} /> : <Plus size={16} />}
                                                        {editingNote === prospect.id ? 'Annuler' : 'Ajouter'}
                                                    </button>
                                                </div>

                                                {editingNote === prospect.id && (
                                                    <div className="note-editor">
                                                        <textarea
                                                            value={newNote}
                                                            onChange={(e) => setNewNote(e.target.value)}
                                                            placeholder="Écrivez votre note ici..."
                                                            rows={3}
                                                            className="note-textarea"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => addNote(prospect.id)}
                                                            className="save-note-btn"
                                                            disabled={!newNote.trim()}
                                                        >
                                                            <Save size={16} />
                                                            Enregistrer
                                                        </button>
                                                    </div>
                                                )}

                                                {prospect.notes && prospect.notes.length > 0 && (
                                                    <div className="notes-timeline">
                                                        {prospect.notes.slice().reverse().map(note => (
                                                            <div key={note.id} className="note-card">
                                                                <div className="note-content">{note.text}</div>
                                                                <div className="note-meta">
                                                                    <span className="note-date">
                                                                        {new Date(note.date).toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => deleteNote(prospect.id, note.id)}
                                                                        className="delete-note-btn"
                                                                        title="Supprimer"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProspectCRM;
