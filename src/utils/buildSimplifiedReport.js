// Génération de rapport d'audit SIMPLIFIÉ avec Design PREMIUM & MODERNE
// Utilise uniquement : LCP, FCP, Speed Index, TBT, et les scores globaux
// Design professionnel : Pas d'emojis, icônes modernes, style épuré

export const buildSimplifiedReport = (mobileData, desktopData, prospect) => {
  const { name, url, profession, location } = prospect;

  // Extraire les données essentielles
  const mobile = mobileData?.lighthouseResult;
  const desktop = desktopData?.lighthouseResult;

  if (!mobile || !desktop) {
    throw new Error('Données PageSpeed incomplètes');
  }

  // Extraire les métriques clés
  const data = {
    lcp: parseFloat(mobile.audits['largest-contentful-paint']?.numericValue || 0) / 1000,
    fcp: parseFloat(mobile.audits['first-contentful-paint']?.numericValue || 0) / 1000,
    speedIndex: parseFloat(mobile.audits['speed-index']?.numericValue || 0) / 1000,
    tbt: parseFloat(mobile.audits['total-blocking-time']?.numericValue || 0) / 1000,
    accessibility: parseFloat(mobile.categories?.accessibility?.score || 0),
    bestPractices: parseFloat(mobile.categories?.['best-practices']?.score || 0),
    performance: parseFloat(mobile.categories?.performance?.score || 0),
    seo: parseFloat(mobile.categories?.seo?.score || 0)
  };

  // Générer les points forts
  const pointsForts = [];
  if (data.lcp <= 2.5) pointsForts.push("Le contenu principal s'affiche très rapidement, ce qui rassure immédiatement l'utilisateur.");
  if (data.fcp <= 1.8) pointsForts.push("Les premiers éléments visuels apparaissent presque instantanément, donnant une impression de fluidité.");
  if (data.speedIndex <= 3.4) pointsForts.push("La mise en place visuelle de la page est rapide et agréable.");
  if (data.accessibility >= 0.9) pointsForts.push("Le site est accessible, ce qui améliore l'expérience d'un large public.");
  if (data.bestPractices >= 0.9) pointsForts.push("Le site respecte de bonnes pratiques techniques, renforçant la fiabilité générale.");
  if (data.performance >= 0.8) pointsForts.push("Les performances globales sont solides, assurant une navigation confortable.");

  if (pointsForts.length === 0) {
    pointsForts.push("Peu d'éléments positifs ressortent des données disponibles.");
  }

  // Générer les points faibles
  const pointsFaibles = [];
  if (data.lcp > 2.5) pointsFaibles.push("Le contenu principal met trop de temps à apparaître, ce qui peut décourager certains visiteurs.");
  if (data.fcp > 1.8) pointsFaibles.push("Le premier affichage visuel manque de rapidité, réduisant la fluidité perçue.");
  if (data.speedIndex > 3.4) pointsFaibles.push("La page met du temps à devenir visuellement complète, ce qui nuit à l'expérience utilisateur.");
  if (data.tbt > 0.6) pointsFaibles.push("Certains scripts bloquent l'interactivité, rendant le site lent à réagir.");

  if (pointsFaibles.length === 0) {
    pointsFaibles.push("Aucun point faible significatif n'a été détecté.");
  }

  // Générer les axes d'amélioration
  const axesAmelioration = [];
  if (data.tbt > 0.6) axesAmelioration.push(`Réduire les scripts bloquants pour accélérer la mise en interactivité (temps de blocage mesuré : ${data.tbt.toFixed(2)} s).`);
  if (data.lcp > 2.5) axesAmelioration.push(`Optimiser les images ou composants responsables du retard du contenu principal (LCP mesuré : ${data.lcp.toFixed(2)} s).`);
  if (data.fcp > 1.8) axesAmelioration.push(`Améliorer les premiers éléments visuels pour renforcer la vitesse perçue (FCP mesuré : ${data.fcp.toFixed(2)} s).`);
  if (data.speedIndex > 3.4) axesAmelioration.push(`Fluidifier l'affichage visuel progressif des éléments de la page (Speed Index mesuré : ${data.speedIndex.toFixed(2)} s).`);

  if (axesAmelioration.length === 0) {
    axesAmelioration.push("Les performances sont bonnes : seules des optimisations mineures pourraient affiner encore l'expérience.");
  }

  // Convertir les scores en pourcentages
  const scores = {
    performance: Math.round(data.performance * 100),
    accessibility: Math.round(data.accessibility * 100),
    bestPractices: Math.round(data.bestPractices * 100),
    seo: Math.round(data.seo * 100)
  };

  // Fonction pour obtenir la couleur du score
  const getScoreColor = (score) => {
    if (score >= 90) return { color: 'green', hex: '#10b981', bg: '#d1fae5' };
    if (score >= 50) return { color: 'orange', hex: '#f59e0b', bg: '#fef3c7' };
    return { color: 'red', hex: '#ef4444', bg: '#fee2e2' };
  };

  // Helper to create ultra-simple Gmail iOS compatible gauge (Premium Style)
  const createGmailGauge = (score, label) => {
    const { hex: bgColor, bg: lightBg } = getScoreColor(score);
    const filledBlocks = Math.round(score / 10);
    const emptyBlocks = 10 - filledBlocks;

    return `
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 auto;">
            <tr>
              <td align="center" style="padding: 15px; background-color: ${lightBg}; border-radius: 12px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding-bottom: 10px;">
                      <span style="font-size: 36px; font-weight: bold; color: ${bgColor}; font-family: Arial, sans-serif;">${score}</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table cellpadding="0" cellspacing="2" border="0">
                        <tr>
                          ${Array(filledBlocks).fill('').map(() =>
      `<td width="8" height="8" bgcolor="${bgColor}" style="font-size: 0; line-height: 0; border-radius: 2px;"></td>`
    ).join('')}
                          ${Array(emptyBlocks).fill('').map(() =>
      `<td width="8" height="8" bgcolor="#e5e7eb" style="font-size: 0; line-height: 0; border-radius: 2px;"></td>`
    ).join('')}
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top: 8px;">
                        <span style="font-size: 12px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">${label}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
  };

  // Icônes SVG (encodées pour email/PDF)
  // Check icon (Green)
  const checkIcon = `<img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/check-circle-green.png" width="24" height="24" alt="Check" style="vertical-align: middle;" />`;
  // Alert icon (Red)
  const alertIcon = `<img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/alert-circle-red.png" width="24" height="24" alt="Alert" style="vertical-align: middle;" />`;
  // Rocket icon (Blue/Orange)
  const rocketIcon = `<img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/rocket-orange.png" width="24" height="24" alt="Rocket" style="vertical-align: middle;" />`;

  // Construire le HTML du rapport
  const template = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Audit WebFitYou - ${name}</title>
  <style>
    /* Styles spécifiques pour le PDF */
    @media print {
        body { margin: 0; padding: 0; }
        .gauges-container { display: flex !important; justify-content: space-between !important; width: 100% !important; }
        .gauge-item { width: 23% !important; margin: 0 !important; }
        .main-container { max-width: 100% !important; width: 100% !important; }
        td { page-break-inside: avoid; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table class="main-container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header Premium -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px; border-bottom: 1px solid #f3f4f6;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/Logo-rond-webfityou-seo-ia-optimisation-siteweb-2.png" 
                         alt="WebFitYou Logo" 
                         width="100" 
                         height="100" 
                         border="0"
                         style="display: block; max-width: 100px; height: auto;" />
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #111827;">WebFitYou</h1>
              <p style="margin: 0 0 20px; font-size: 16px; color: #6b7280;">Optimisation SEO & Performance Web</p>
              <div style="display: inline-block; padding: 8px 16px; border-radius: 50px; background-color: #f3f4f6; font-size: 13px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">
                Rapport d'audit technique
              </div>
            </td>
          </tr>
          
          <!-- Introduction -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.7; color: #374151;">
                Bonjour <strong style="color: #111827;">${name}</strong>,
              </p>
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.7; color: #374151;">
                Voici une analyse synthétique des performances de votre site <strong style="color: #111827;">${url}</strong>. 
                Ce rapport se concentre sur les métriques essentielles (Core Web Vitals) qui impactent directement votre référencement Google et l'expérience de vos visiteurs.
              </p>
            </td>
          </tr>
          
          <!-- Scores Globaux (Cote à Cote) -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #111827; padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                Performance Globale
              </h2>
              
              <!-- Table pour alignement parfait -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="25%" align="center" style="padding: 5px;">
                        ${createGmailGauge(scores.performance, 'Performance')}
                    </td>
                    <td width="25%" align="center" style="padding: 5px;">
                        ${createGmailGauge(scores.accessibility, 'Accessibilité')}
                    </td>
                    <td width="25%" align="center" style="padding: 5px;">
                        ${createGmailGauge(scores.bestPractices, 'Pratiques')}
                    </td>
                    <td width="25%" align="center" style="padding: 5px;">
                        ${createGmailGauge(scores.seo, 'SEO')}
                    </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Points Forts -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #111827; display: flex; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">
                <span style="color: #10b981; margin-right: 10px; font-size: 20px;">●</span> Points Forts
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${pointsForts.map(pf => `
                <tr>
                    <td valign="top" width="24" style="padding: 8px 10px 8px 0;">
                        <span style="color: #10b981; font-weight: bold; font-size: 18px;">✓</span>
                    </td>
                    <td valign="top" style="padding: 8px 0; color: #374151; font-size: 15px; line-height: 1.6; border-bottom: 1px solid #f9fafb;">
                        ${pf}
                    </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          
          <!-- Points Faibles -->
          ${pointsFaibles.length > 0 && pointsFaibles[0] !== "Aucun point faible significatif n'a été détecté." ? `
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #111827; display: flex; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">
                <span style="color: #ef4444; margin-right: 10px; font-size: 20px;">●</span> Points d'Attention
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${pointsFaibles.map(pf => `
                <tr>
                    <td valign="top" width="24" style="padding: 8px 10px 8px 0;">
                        <span style="color: #ef4444; font-weight: bold; font-size: 18px;">!</span>
                    </td>
                    <td valign="top" style="padding: 8px 0; color: #374151; font-size: 15px; line-height: 1.6; border-bottom: 1px solid #f9fafb;">
                        ${pf}
                    </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Axes d'Amélioration -->
          <tr>
            <td style="padding: 0 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #111827; display: flex; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px;">
                <span style="color: #f59e0b; margin-right: 10px; font-size: 20px;">●</span> Pistes d'Optimisation
              </h2>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #4b5563; line-height: 1.8; font-size: 15px;">
                  ${axesAmelioration.join('<br><br>')}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Rapport généré par <strong style="color: #3b82f6;">WebFitYou</strong>
              </p>
              <p style="margin: 10px 0 16px 0; color: #94a3b8; font-size: 12px;">
                Audit basé sur les Core Web Vitals
              </p>
              
              <!-- Unsubscribe Link -->
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Vous ne souhaitez plus recevoir ces emails ? 
                <a href="mailto:webfityou@gmail.com?subject=Demande de désinscription - ${encodeURIComponent(name)}&body=Bonjour,%0D%0A%0D%0AMerci de bien vouloir supprimer mes coordonnées de votre liste de diffusion.%0D%0A%0D%0ACordialement,%0D%0A${encodeURIComponent(name)}" 
                   style="color: #3b82f6; text-decoration: underline;">
                  Se désinscrire
                </a>
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;

  return template;
};
