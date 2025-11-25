import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Mail, Target, Award, AlertCircle } from 'lucide-react';

const AdvancedStats = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [prospects, setProspects] = useState([]);
    const [lists, setLists] = useState([]);
    const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, all

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const savedCampaigns = JSON.parse(localStorage.getItem('emailCampaigns') || '[]');
        const savedProspects = JSON.parse(localStorage.getItem('webfityou_prospects') || '[]');
        const savedLists = JSON.parse(localStorage.getItem('prospectLists') || '[]');

        setCampaigns(savedCampaigns);
        setProspects(savedProspects);
        setLists(savedLists);
    };

    // Filtrer les campagnes par période
    const getFilteredCampaigns = () => {
        const now = new Date();
        const filtered = campaigns.filter(campaign => {
            const campaignDate = new Date(campaign.createdAt);
            const diffDays = Math.floor((now - campaignDate) / (1000 * 60 * 60 * 24));

            if (timeRange === '7days') return diffDays <= 7;
            if (timeRange === '30days') return diffDays <= 30;
            return true; // all
        });
        return filtered;
    };

    // Données pour le graphique d'évolution temporelle
    const getTimelineData = () => {
        const filtered = getFilteredCampaigns();
        const grouped = {};

        filtered.forEach(campaign => {
            const date = new Date(campaign.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short'
            });

            if (!grouped[date]) {
                grouped[date] = { date, envoyés: 0, succès: 0, échecs: 0 };
            }

            campaign.results?.forEach(result => {
                grouped[date].envoyés++;
                if (result.status === 'success') grouped[date].succès++;
                if (result.status === 'error') grouped[date].échecs++;
            });
        });

        return Object.values(grouped).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    };

    // Taux de succès par liste
    const getSuccessRateByList = () => {
        const listStats = {};

        campaigns.forEach(campaign => {
            const listName = campaign.listName || 'Sans liste';
            if (!listStats[listName]) {
                listStats[listName] = { name: listName, total: 0, succès: 0, échecs: 0 };
            }

            campaign.results?.forEach(result => {
                listStats[listName].total++;
                if (result.status === 'success') listStats[listName].succès++;
                if (result.status === 'error') listStats[listName].échecs++;
            });
        });

        return Object.values(listStats).map(stat => ({
            ...stat,
            tauxSuccès: stat.total > 0 ? Math.round((stat.succès / stat.total) * 100) : 0
        }));
    };

    // Distribution des statuts prospects (pour CRM)
    const getProspectStatusDistribution = () => {
        const distribution = {
            'Nouveau': 0,
            'Contacté': 0,
            'Intéressé': 0,
            'En négociation': 0,
            'Client': 0,
            'Perdu': 0
        };

        prospects.forEach(p => {
            const status = p.status || 'new';
            const statusLabels = {
                'new': 'Nouveau',
                'contacted': 'Contacté',
                'interested': 'Intéressé',
                'negotiation': 'En négociation',
                'client': 'Client',
                'lost': 'Perdu'
            };
            const label = statusLabels[status] || 'Nouveau';
            distribution[label]++;
        });

        return Object.entries(distribution)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    };

    // Statistiques globales
    const getGlobalStats = () => {
        const filtered = getFilteredCampaigns();
        let totalSent = 0;
        let totalSuccess = 0;
        let totalErrors = 0;

        filtered.forEach(campaign => {
            campaign.results?.forEach(result => {
                totalSent++;
                if (result.status === 'success') totalSuccess++;
                if (result.status === 'error') totalErrors++;
            });
        });

        const successRate = totalSent > 0 ? Math.round((totalSuccess / totalSent) * 100) : 0;

        return {
            totalCampaigns: filtered.length,
            totalSent,
            totalSuccess,
            totalErrors,
            successRate,
            totalProspects: prospects.length,
            totalLists: lists.length
        };
    };

    const stats = getGlobalStats();
    const timelineData = getTimelineData();
    const listSuccessData = getSuccessRateByList();
    const prospectStatusData = getProspectStatusDistribution();

    const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#059669', '#ef4444'];

    return (
        <div className="advanced-stats">
            <div className="stats-header">
                <div>
                    <h2><TrendingUp size={24} /> Statistiques Avancées</h2>
                    <p className="text-muted">Analysez vos performances et optimisez vos campagnes</p>
                </div>
                <div className="time-range-selector">
                    <button
                        className={`range-btn ${timeRange === '7days' ? 'active' : ''}`}
                        onClick={() => setTimeRange('7days')}
                    >
                        7 jours
                    </button>
                    <button
                        className={`range-btn ${timeRange === '30days' ? 'active' : ''}`}
                        onClick={() => setTimeRange('30days')}
                    >
                        30 jours
                    </button>
                    <button
                        className={`range-btn ${timeRange === 'all' ? 'active' : ''}`}
                        onClick={() => setTimeRange('all')}
                    >
                        Tout
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <Mail size={24} />
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-value">{stats.totalSent}</div>
                        <div className="kpi-label">Emails Envoyés</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <Target size={24} />
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-value">{stats.successRate}%</div>
                        <div className="kpi-label">Taux de Succès</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <Calendar size={24} />
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-value">{stats.totalCampaigns}</div>
                        <div className="kpi-label">Campagnes</div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <Award size={24} />
                    </div>
                    <div className="kpi-content">
                        <div className="kpi-value">{stats.totalProspects}</div>
                        <div className="kpi-label">Prospects</div>
                    </div>
                </div>
            </div>

            {/* Graphiques */}
            <div className="charts-grid">
                {/* Évolution temporelle */}
                <div className="chart-card">
                    <h3>📈 Évolution des Envois</h3>
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="envoyés" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="succès" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="échecs" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-chart">
                            <AlertCircle size={48} />
                            <p>Aucune donnée pour cette période</p>
                        </div>
                    )}
                </div>

                {/* Taux de succès par liste */}
                <div className="chart-card">
                    <h3>🎯 Taux de Succès par Liste</h3>
                    {listSuccessData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={listSuccessData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="tauxSuccès" fill="#3b82f6" name="Taux de succès (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-chart">
                            <AlertCircle size={48} />
                            <p>Aucune campagne lancée</p>
                        </div>
                    )}
                </div>

                {/* Distribution des statuts prospects */}
                <div className="chart-card">
                    <h3>👥 Distribution des Prospects</h3>
                    {prospectStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={prospectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {prospectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-chart">
                            <AlertCircle size={48} />
                            <p>Aucun prospect</p>
                        </div>
                    )}
                </div>

                {/* Détails par liste */}
                <div className="chart-card">
                    <h3>📊 Détails par Liste</h3>
                    {listSuccessData.length > 0 ? (
                        <div className="list-details">
                            {listSuccessData.map((list, index) => (
                                <div key={index} className="list-detail-item">
                                    <div className="list-detail-header">
                                        <span className="list-name">{list.name}</span>
                                        <span className="list-rate" style={{
                                            color: list.tauxSuccès >= 80 ? '#10b981' : list.tauxSuccès >= 50 ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {list.tauxSuccès}%
                                        </span>
                                    </div>
                                    <div className="list-detail-bar">
                                        <div
                                            className="list-detail-fill"
                                            style={{
                                                width: `${list.tauxSuccès}%`,
                                                background: list.tauxSuccès >= 80 ? '#10b981' : list.tauxSuccès >= 50 ? '#f59e0b' : '#ef4444'
                                            }}
                                        />
                                    </div>
                                    <div className="list-detail-stats">
                                        <span>✅ {list.succès} succès</span>
                                        <span>❌ {list.échecs} échecs</span>
                                        <span>📧 {list.total} total</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-chart">
                            <AlertCircle size={48} />
                            <p>Aucune donnée disponible</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedStats;
