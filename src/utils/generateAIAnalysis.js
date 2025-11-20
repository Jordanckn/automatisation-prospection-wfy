import OpenAI from 'openai';

export const generateAIAnalysis = async (metrics, prospect, openRouterKey, model) => {
    if (!openRouterKey) {
        // Fallback to static analysis if no key provided
        return `
      Google privilégie désormais l'indexation Mobile-First. 
      Votre score mobile de ${metrics.mobile.metrics.score}/100 indique ${metrics.mobile.metrics.score < 50 ? "de graves problèmes de performance qui pénalisent votre visibilité." : metrics.mobile.metrics.score < 90 ? "une marge de progression pour atteindre le top des résultats." : "une excellente base technique."}
      Le temps de chargement (LCP) de ${metrics.mobile.metrics.lcp} impacte directement le taux de rebond.
    `;
    }

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: openRouterKey,
        dangerouslyAllowBrowser: true, // Client-side usage
        defaultHeaders: {
            "HTTP-Referer": "https://webfityou.com",
            "X-Title": "WebFitYou AuditBot"
        }
    });

    const prompt = `
    Tu es un expert SEO. Analyse ces métriques pour le site ${prospect.url} du client ${prospect.name} (${prospect.profession}, ${prospect.location}).
    
    Métriques Mobile:
    - Score: ${metrics.mobile.metrics.score}/100
    - LCP: ${metrics.mobile.metrics.lcp}
    - CLS: ${metrics.mobile.metrics.cls}
    
    Métriques Desktop:
    - Score: ${metrics.desktop.metrics.score}/100
    
    Points faibles principaux:
    ${metrics.weaknesses.map(w => `- ${w.title}`).join('\n')}
    
    Rédige un paragraphe court (max 3 phrases), impactant et vulgarisé pour expliquer ce que cela signifie pour son SEO et son business. 
    Ne sois pas trop technique, parle de perte de clients, de visibilité Google et d'expérience utilisateur.
    Ton but est de lui faire comprendre l'urgence d'agir.
  `;

    try {
        const completion = await openai.chat.completions.create({
            model: model || "tngtech/deepseek-r1t2-chimera:free", // Updated default to the user's preferred free model
            messages: [
                { role: "system", content: "Tu es un expert SEO concis et persuasif." },
                { role: "user", content: prompt }
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Erreur OpenRouter:", error);
        // Return a more descriptive error if possible
        return `Impossible de générer l'analyse IA. (Erreur: ${error.message || 'Inconnue'})`;
    }
};
