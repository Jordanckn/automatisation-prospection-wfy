import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Mail, Users, Calendar, ChevronDown, ChevronUp, Trash2, Clock } from 'lucide-react';

const CampaignsDashboard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [expandedCampaign, setExpandedCampaign] = useState(null);

    const loadCampaigns = () => {
        const savedCampaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
        setCampaigns(savedCampaigns);
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const handleResetStats = () => {
        if (window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les statistiques de campagnes ?\n\nCette action est irréversible et supprimera l\'historique complet de toutes vos campagnes.')) {
            localStorage.setItem('emailCampaigns', JSON.stringify([]));
            setCampaigns([]);
            alert('✅ Statistiques réinitialisées avec succès !');
        }
    };

    // Fonction pour calculer le temps écoulé
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return null; // Afficher la date complète
    };

    const stats = {
        totalCampaigns: campaigns.length,
        totalSent: campaigns.reduce((sum, c) => sum + c.totalSent, 0),
        totalFailed: campaigns.reduce((sum, c) => sum + c.totalFailed, 0),
        successRate: campaigns.length > 0
            ? ((campaigns.reduce((sum, c) => sum + c.totalSent, 0) /
                campaigns.reduce((sum, c) => sum + c.totalSent + c.totalFailed, 0)) * 100).toFixed(1)
            : 0
    };

    const toggleCampaign = (campaignId) => {
        setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
    };

    return (
        <div className="campaigns-dashboard">
            <div className="dashboard-header">
                <h2><BarChart3 size={24} /> Tableau de Bord des Campagnes</h2>
                <button
                    onClick={handleResetStats}
                    className="btn-danger"
                    title="Réinitialiser les statistiques"
                >
                    <Trash2 size={18} />
                    Réinitialiser les stats
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}>
                        <Mail size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Campagnes lancées</span>
                        <span className="stat-value">{stats.totalCampaigns}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Emails envoyés</span>
                        <span className="stat-value">{stats.totalSent}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Taux de succès</span>
                        <span className="stat-value">{stats.successRate}%</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#ef4444' }}>
                        <Mail size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Échecs</span>
                        <span className="stat-value">{stats.totalFailed}</span>
                    </div>
                </div>
            </div>

            <div className="campaigns-list">
                <h3>Historique des campagnes</h3>

                {campaigns.length === 0 ? (
                    <div className="empty-state">
                        <Mail size={48} />
                        <p>Aucune campagne lancée</p>
                        <p className="text-muted">Créez une liste et lancez votre première campagne</p>
                    </div>
                ) : (
                    campaigns.map(campaign => (
                        <div key={campaign.id} className="campaign-card">
                            <div
                                className="campaign-header"
                                onClick={() => toggleCampaign(campaign.id)}
                            >
                                <div className="campaign-info">
                                    <h4>{campaign.name}</h4>
                                    <div className="campaign-meta">
                                        <span className="campaign-list">
                                            <Users size={14} /> {campaign.listName}
                                        </span>
                                        <span
                                            className="campaign-date"
                                            title={new Date(campaign.createdAt).toLocaleString('fr-FR', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        >
                                            <Clock size={14} />
                                            {getRelativeTime(campaign.createdAt) ||
                                                new Date(campaign.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="campaign-stats">
                                    <div className="campaign-stat success">
                                        <span className="stat-number">{campaign.totalSent}</span>
                                        <span className="stat-label">Envoyés</span>
                                    </div>
                                    {campaign.totalFailed > 0 && (
                                        <div className="campaign-stat error">
                                            <span className="stat-number">{campaign.totalFailed}</span>
                                            <span className="stat-label">Échecs</span>
                                        </div>
                                    )}
                                    <button className="btn-icon">
                                        {expandedCampaign === campaign.id ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {expandedCampaign === campaign.id && (
                                <div className="campaign-details">
                                    <h5>Détails des envois</h5>
                                    <div className="results-list">
                                        {campaign.results.map((result, index) => (
                                            <div key={index} className={`result-row ${result.status}`}>
                                                <span className="result-index">#{index + 1}</span>
                                                <span className="result-name">{result.prospectName}</span>
                                                <span className={`result-status ${result.status}`}>
                                                    {result.status === 'success' ? '✓ Envoyé' : '✗ Échec'}
                                                </span>
                                                <span
                                                    className="result-time"
                                                    title={new Date(result.timestamp).toLocaleString('fr-FR', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                >
                                                    {new Date(result.timestamp).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CampaignsDashboard;
