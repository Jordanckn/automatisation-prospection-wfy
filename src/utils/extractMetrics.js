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

        // Core Web Vitals & Metrics (for performance details)
        const metrics = {
            lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
            cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
            tbt: audits['total-blocking-time']?.displayValue || 'N/A',
            si: audits['speed-index']?.displayValue || 'N/A',
            ttfb: audits['server-response-time']?.displayValue || 'N/A',
            fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
        };

        // Opportunities (Weaknesses/Improvements)
        const opportunities = Object.values(audits)
            .filter(audit => audit && audit.details?.type === 'opportunity' && (audit.score === null || audit.score < 0.9))
            .sort((a, b) => (a.score || 1) - (b.score || 1))
            .slice(0, 5) // Top 5 opportunities
            .map(audit => ({
                title: audit.title,
                description: audit.description,
                savings: audit.details?.overallSavingsMs ? `${Math.round(audit.details.overallSavingsMs)}ms` :
                    audit.details?.overallSavingsBytes ? `${Math.round(audit.details.overallSavingsBytes / 1024)}kb` : ''
            }));

        // Diagnostics/Issues
        const diagnostics = Object.values(audits)
            .filter(audit => audit && (audit.score === 0 || (audit.score !== null && audit.score < 0.5)))
            .slice(0, 5)
            .map(audit => audit.title);

        // Strengths (Passed audits)
        const passedAudits = Object.values(audits)
            .filter(audit => audit && audit.score === 1 && audit.details?.type !== 'opportunity')
            .slice(0, 5)
            .map(audit => audit.title);

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
