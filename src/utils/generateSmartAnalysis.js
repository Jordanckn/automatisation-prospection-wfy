export const generateSmartAnalysis = (metrics, prospect) => {
    const { mobile, desktop } = metrics;

    // Analyze performance scores
    const mobilePerf = mobile.categories.performance.score;
    const desktopPerf = desktop.categories.performance.score;
    const mobileSEO = mobile.categories.seo.score;
    const mobileAccessibility = mobile.categories.accessibility.score;
    const mobilePractices = mobile.categories.bestPractices.score;

    // Determine overall health
    const avgScore = (mobilePerf + desktopPerf + mobileSEO + mobileAccessibility + mobilePractices) / 5;

    let healthStatus = '';
    let urgencyLevel = '';
    let impactDescription = '';

    // Health status determination
    if (avgScore >= 90) {
        healthStatus = 'excellent';
        urgencyLevel = 'maintenance';
        impactDescription = 'Votre site présente une excellente base technique. Quelques optimisations mineures permettront de maintenir cette performance dans le temps.';
    } else if (avgScore >= 70) {
        healthStatus = 'good';
        urgencyLevel = 'optimization';
        impactDescription = 'Votre site fonctionne correctement, mais des améliorations ciblées vous permettraient de gagner en visibilité et en conversions.';
    } else if (avgScore >= 50) {
        healthStatus = 'moderate';
        urgencyLevel = 'important';
        impactDescription = 'Votre site présente des freins significatifs qui limitent votre visibilité sur Google et peuvent faire fuir vos visiteurs.';
    } else {
        healthStatus = 'critical';
        urgencyLevel = 'urgent';
        impactDescription = 'Votre site souffre de problèmes techniques majeurs qui pénalisent fortement votre référencement et votre taux de conversion.';
    }

    // Mobile-first analysis
    let mobileFirstAnalysis = '';
    if (mobilePerf < 50) {
        mobileFirstAnalysis = `Google privilégie désormais l'indexation Mobile-First. Avec un score mobile de ${mobilePerf}/100, votre site risque d'être relégué dans les résultats de recherche. Les visiteurs sur smartphone (plus de 60% du trafic web) subissent une expérience dégradée, ce qui augmente drastiquement votre taux de rebond.`;
    } else if (mobilePerf < 90) {
        mobileFirstAnalysis = `Google indexe prioritairement la version mobile de votre site. Votre score de ${mobilePerf}/100 indique une marge de progression importante. Chaque point gagné améliore votre positionnement face à vos concurrents.`;
    } else {
        mobileFirstAnalysis = `Excellent ! Votre score mobile de ${mobilePerf}/100 vous positionne favorablement dans l'algorithme Mobile-First de Google. Maintenez cette performance pour conserver votre avantage concurrentiel.`;
    }

    // SEO impact analysis
    let seoImpact = '';
    if (mobileSEO < 80) {
        seoImpact = ` Votre score SEO de ${mobileSEO}/100 révèle des opportunités manquées : balises meta incomplètes, structure HTML non optimale, ou contenus non indexables. Ces éléments limitent directement votre visibilité dans les résultats de recherche.`;
    } else if (mobileSEO < 95) {
        seoImpact = ` Votre SEO technique (${mobileSEO}/100) est sur la bonne voie. Quelques ajustements sur les balises et la structure permettront d'atteindre l'excellence.`;
    } else {
        seoImpact = ` Votre SEO technique est exemplaire (${mobileSEO}/100). Continuez à produire du contenu de qualité pour maximiser votre visibilité.`;
    }

    // Performance metrics analysis
    let metricsAnalysis = '';
    const lcp = mobile.metrics.lcp;
    if (lcp && lcp !== 'N/A') {
        const lcpValue = parseFloat(lcp);
        if (lcpValue > 4.0 || lcp.includes('s')) {
            metricsAnalysis = ` Le temps de chargement principal (LCP: ${lcp}) est trop élevé. Les visiteurs quittent généralement un site qui met plus de 3 secondes à charger, ce qui impacte directement vos conversions.`;
        } else if (lcpValue > 2.5) {
            metricsAnalysis = ` Le temps de chargement (LCP: ${lcp}) peut être amélioré. Réduire ce délai augmentera votre taux de rétention.`;
        }
    }

    // Accessibility impact
    let accessibilityNote = '';
    if (mobileAccessibility < 80) {
        accessibilityNote = ` L'accessibilité (${mobileAccessibility}/100) est un critère de plus en plus important pour Google. Un site accessible touche une audience plus large et améliore l'expérience de tous vos visiteurs.`;
    }

    // Business impact
    let businessImpact = '';
    if (healthStatus === 'critical' || healthStatus === 'moderate') {
        businessImpact = ` Pour un professionnel comme vous (${prospect.profession}, ${prospect.location}), chaque seconde de chargement perdue représente des clients potentiels qui se tournent vers vos concurrents.`;
    } else if (healthStatus === 'good') {
        businessImpact = ` En tant que ${prospect.profession} à ${prospect.location}, optimiser votre site vous donnera un avantage concurrentiel mesurable sur votre marché local.`;
    }

    // Combine all analyses
    const finalAnalysis = `
    ${mobileFirstAnalysis}${seoImpact}${metricsAnalysis}${accessibilityNote}${businessImpact}
    
    ${impactDescription} ${urgencyLevel === 'urgent' ? 'Une intervention rapide est recommandée pour éviter une perte continue de visibilité et de revenus.' : urgencyLevel === 'important' ? 'Des optimisations ciblées vous permettront de rattraper vos concurrents.' : 'Quelques ajustements stratégiques consolideront votre position.'}
  `.trim();

    return finalAnalysis;
};
