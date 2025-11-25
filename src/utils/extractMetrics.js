import { translateAudit } from './auditTranslations';

export const extractMetrics = (mobileData, desktopData) => {
    const processResult = (data, strategy) => {
        if (!data || !data.lighthouseResult) {
            console.warn(`Données PageSpeed manquantes pour ${strategy}`, data);
            return {
                strategy,
                categories: {
                    performance: { score: 0, color: 'red' },
                    accessibility: { score: 0, color: 'red' },
                    bestPractices: { score: 0, color: 'red' },
                    seo: { score: 0, color: 'red' }
                },
                metrics: { lcp: 'N/A', cls: 'N/A', tbt: 'N/A', si: 'N/A', ttfb: 'N/A', fcp: 'N/A' },
                opportunities: [],
                diagnostics: [],
                passedAudits: []
            };
        }

        const lh = data.lighthouseResult;
        const audits = lh.audits || {};
        const categories = lh.categories || {};

        // Helper to get score and color
        const getCategoryScore = (categoryKey) => {
            const cat = categories[categoryKey];
            if (!cat || cat.score === null) return { score: 0, color: 'red' };

            const score = Math.round(cat.score * 100);
            let color = 'red';
            if (score >= 90) color = 'green';
            else if (score >= 50) color = 'orange';

            return { score, color };
        };

        // Extract all 4 categories
        const categoriesData = {
            performance: getCategoryScore('performance'),
            accessibility: getCategoryScore('accessibility'),
            bestPractices: getCategoryScore('best-practices'),
            seo: getCategoryScore('seo')
        };

        // Règle d'ajustement : diminuer SEO de 18 points et Pratiques de 4 points
        // pour rendre les rapports plus réalistes et actionables
        categoriesData.seo.score = Math.max(0, categoriesData.seo.score - 18);
        categoriesData.bestPractices.score = Math.max(0, categoriesData.bestPractices.score - 4);

        // Recalculer les couleurs après ajustement
        if (categoriesData.seo.score >= 90) categoriesData.seo.color = 'green';
        else if (categoriesData.seo.score >= 50) categoriesData.seo.color = 'orange';
        else categoriesData.seo.color = 'red';

        if (categoriesData.bestPractices.score >= 90) categoriesData.bestPractices.color = 'green';
        else if (categoriesData.bestPractices.score >= 50) categoriesData.bestPractices.color = 'orange';
        else categoriesData.bestPractices.color = 'red';

        // Core Web Vitals & Metrics (for performance details)
        const metrics = {
            lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
            cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
            tbt: audits['total-blocking-time']?.displayValue || 'N/A',
            si: audits['speed-index']?.displayValue || 'N/A',
            ttfb: audits['server-response-time']?.displayValue || 'N/A',
            fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        };

        // Opportunities (Weaknesses/Improvements) - TRADUIT EN LANGAGE SIMPLE
        const opportunities = Object.entries(audits)
            .filter(([id, audit]) => audit && audit.details?.type === 'opportunity' && (audit.score === null || audit.score < 0.9))
            .sort(([, a], [, b]) => (a.score || 1) - (b.score || 1))
            .map(([id, audit]) => {
                const translated = translateAudit(id, audit.title);
                if (!translated) return null; // Exclure si trop technique
                return {
                    title: translated.simple || audit.title,
                    description: translated.explanation || audit.description || '',
                    savings: audit.details?.overallSavingsMs ? `${Math.round(audit.details.overallSavingsMs)}ms` :
                        audit.details?.overallSavingsBytes ? `${Math.round(audit.details.overallSavingsBytes / 1024)}kb` : ''
                };
            })
            .filter(item => item !== null) // Enlever les null
            .slice(0, 5); // Top 5 opportunities

        // Diagnostics/Issues - TRADUIT EN LANGAGE SIMPLE
        const diagnostics = Object.entries(audits)
            .filter(([id, audit]) => audit && (audit.score === 0 || (audit.score !== null && audit.score < 0.5)))
            .map(([id, audit]) => {
                const translated = translateAudit(id, audit.title);
                if (!translated) return null; // Exclure si trop technique
                return translated.simple || audit.title;
            })
            .filter(item => item !== null) // Enlever les null
            .slice(0, 5);


        // Strengths (Passed audits) - TRADUIT EN LANGAGE SIMPLE
        const passedAudits = Object.entries(audits)
            .filter(([id, audit]) => audit && audit.score === 1 && audit.details?.type !== 'opportunity')
            .map(([id, audit]) => {
                const translated = translateAudit(id, audit.title);
                // Exclure si la traduction retourne null (audit trop technique)
                if (!translated) return null;
                return {
                    title: translated.simple || audit.title,
                    explanation: translated.explanation
                };
            })
            .filter(item => item !== null) // Enlever les null
            .slice(0, 8); // Plus de points forts pour valoriser

        return {
            strategy,
            categories: categoriesData,
            metrics,
            opportunities,
            diagnostics,
            passedAudits
        };
    };

    const mobile = processResult(mobileData, 'mobile');
    const desktop = processResult(desktopData, 'desktop');

    // Select best strengths and weaknesses
    const strengths = mobile.passedAudits.length > 0 ? mobile.passedAudits : desktop.passedAudits;
    const weaknesses = mobile.opportunities.length > 0 ? mobile.opportunities : desktop.opportunities;

    return {
        mobile,
        desktop,
        strengths,
        weaknesses
    };
};
