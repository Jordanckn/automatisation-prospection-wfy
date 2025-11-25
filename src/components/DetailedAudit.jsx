import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Zap, Eye, Shield } from 'lucide-react';

const DetailedAudit = ({ data }) => {
    if (!data || !data.mobile) return null;

    const { mobile, desktop } = data;

    // Helper to get icon based on score
    const getScoreIcon = (score) => {
        if (score >= 90) return <CheckCircle size={20} color="#10b981" />;
        if (score >= 50) return <AlertCircle size={20} color="#f59e0b" />;
        return <AlertCircle size={20} color="#ef4444" />;
    };

    // Helper to format metric value
    const formatMetric = (value) => {
        if (!value || value === 'N/A') return 'Non disponible';
        return value;
    };

    return (
        <div className="detailed-audit">
            <h2 className="audit-title">Audit Technique Détaillé</h2>
            <p className="audit-subtitle">Analyse complète des performances et optimisations recommandées</p>

            {/* Scores Overview */}
            <div className="scores-overview">
                <h3><Eye size={20} /> Vue d'ensemble des scores</h3>
                <div className="scores-grid-detailed">
                    <div className="score-card">
                        <div className="score-header">
                            <span>📱 Mobile</span>
                        </div>
                        <div className="score-items">
                            <div className="score-item-detailed">
                                {getScoreIcon(mobile.categories.performance.score)}
                                <span>Performance</span>
                                <strong>{mobile.categories.performance.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(mobile.categories.accessibility.score)}
                                <span>Accessibilité</span>
                                <strong>{mobile.categories.accessibility.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(mobile.categories.bestPractices.score)}
                                <span>Bonnes pratiques</span>
                                <strong>{mobile.categories.bestPractices.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(mobile.categories.seo.score)}
                                <span>SEO</span>
                                <strong>{mobile.categories.seo.score}/100</strong>
                            </div>
                        </div>
                    </div>

                    <div className="score-card">
                        <div className="score-header">
                            <span>💻 Desktop</span>
                        </div>
                        <div className="score-items">
                            <div className="score-item-detailed">
                                {getScoreIcon(desktop.categories.performance.score)}
                                <span>Performance</span>
                                <strong>{desktop.categories.performance.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(desktop.categories.accessibility.score)}
                                <span>Accessibilité</span>
                                <strong>{desktop.categories.accessibility.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(desktop.categories.bestPractices.score)}
                                <span>Bonnes pratiques</span>
                                <strong>{desktop.categories.bestPractices.score}/100</strong>
                            </div>
                            <div className="score-item-detailed">
                                {getScoreIcon(desktop.categories.seo.score)}
                                <span>SEO</span>
                                <strong>{desktop.categories.seo.score}/100</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Web Vitals */}
            <div className="metrics-section">
                <h3><Zap size={20} /> Core Web Vitals (Mobile)</h3>
                <p className="section-description">
                    Les Core Web Vitals sont les métriques essentielles que Google utilise pour évaluer l'expérience utilisateur de votre site.
                </p>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon"><Clock size={24} /></div>
                        <div className="metric-content">
                            <h4>LCP - Largest Contentful Paint</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.lcp)}</div>
                            <p className="metric-explanation">
                                Mesure le temps nécessaire pour afficher le plus grand élément visible.
                                <strong> Objectif : &lt; 2.5s</strong>. Un LCP rapide assure que votre page semble se charger rapidement.
                            </p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon"><TrendingUp size={24} /></div>
                        <div className="metric-content">
                            <h4>CLS - Cumulative Layout Shift</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.cls)}</div>
                            <p className="metric-explanation">
                                Mesure la stabilité visuelle de la page.
                                <strong> Objectif : &lt; 0.1</strong>. Un CLS faible évite que les éléments ne bougent pendant le chargement.
                            </p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon"><Zap size={24} /></div>
                        <div className="metric-content">
                            <h4>FCP - First Contentful Paint</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.fcp)}</div>
                            <p className="metric-explanation">
                                Temps avant l'affichage du premier contenu.
                                <strong> Objectif : &lt; 1.8s</strong>. Indique quand l'utilisateur voit quelque chose pour la première fois.
                            </p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon"><Clock size={24} /></div>
                        <div className="metric-content">
                            <h4>TBT - Total Blocking Time</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.tbt)}</div>
                            <p className="metric-explanation">
                                Temps pendant lequel la page est bloquée et non interactive.
                                <strong> Objectif : &lt; 200ms</strong>. Un TBT faible signifie une page réactive rapidement.
                            </p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon"><Eye size={24} /></div>
                        <div className="metric-content">
                            <h4>SI - Speed Index</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.si)}</div>
                            <p className="metric-explanation">
                                Vitesse à laquelle le contenu est visuellement affiché.
                                <strong> Objectif : &lt; 3.4s</strong>. Plus c'est rapide, mieux c'est pour l'utilisateur.
                            </p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon"><Shield size={24} /></div>
                        <div className="metric-content">
                            <h4>TTFB - Time To First Byte</h4>
                            <div className="metric-value">{formatMetric(mobile.metrics.ttfb)}</div>
                            <p className="metric-explanation">
                                Temps de réponse du serveur.
                                <strong> Objectif : &lt; 600ms</strong>. Reflète la qualité de votre hébergement et configuration serveur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Opportunities */}
            {mobile.opportunities && mobile.opportunities.length > 0 && (
                <div className="opportunities-section">
                    <h3><TrendingUp size={20} /> Opportunités d'optimisation</h3>
                    <p className="section-description">
                        Ces recommandations peuvent améliorer significativement les performances de votre site.
                    </p>
                    <div className="opportunities-list">
                        {mobile.opportunities.map((opp, index) => (
                            <div key={index} className="opportunity-card">
                                <div className="opportunity-header">
                                    <h4>{opp.title}</h4>
                                    {opp.savings && <span className="savings-badge">Gain potentiel : {opp.savings}</span>}
                                </div>
                                <p className="opportunity-description">{opp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Diagnostics */}
            {mobile.diagnostics && mobile.diagnostics.length > 0 && (
                <div className="diagnostics-section">
                    <h3><AlertCircle size={20} /> Points d'attention</h3>
                    <p className="section-description">
                        Ces éléments nécessitent une attention particulière pour améliorer la qualité globale du site.
                    </p>
                    <div className="diagnostics-list">
                        {mobile.diagnostics.slice(0, 10).map((diag, index) => (
                            <div key={index} className="diagnostic-item">
                                <AlertCircle size={16} />
                                <span>{diag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Passed Audits */}
            {mobile.passedAudits && mobile.passedAudits.length > 0 && (
                <div className="passed-section">
                    <h3><CheckCircle size={20} /> Audits réussis</h3>
                    <p className="section-description">
                        Ces éléments sont correctement configurés et contribuent positivement à votre score.
                    </p>
                    <div className="passed-grid">
                        {mobile.passedAudits.slice(0, 12).map((audit, index) => (
                            <div key={index} className="passed-item">
                                <CheckCircle size={16} color="#10b981" />
                                <span>
                                    {typeof audit === 'object' && audit.title ? (
                                        <>
                                            <strong>{audit.title}</strong>
                                            {audit.explanation && <span className="audit-explanation"> : {audit.explanation}</span>}
                                        </>
                                    ) : (
                                        audit
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailedAudit;
