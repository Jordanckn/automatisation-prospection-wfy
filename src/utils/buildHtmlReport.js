import { generateSmartAnalysis } from './generateSmartAnalysis';

export const buildHtmlReport = (data, prospect) => {
  const { mobile, desktop, strengths, weaknesses } = data;
  const { name, url, profession, location } = prospect;

  // Generate smart SEO explanation
  const seoExplanation = generateSmartAnalysis({ mobile, desktop }, prospect);

  // Format strengths and weaknesses WITHOUT truncation
  const pointsFortsHtml = strengths.slice(0, 4).map(s => `<li>${s}</li>`).join('');
  const pointsFaiblesHtml = weaknesses.slice(0, 4).map(w => {
    return `<li><strong>${w.title}</strong>${w.description ? ` : ${w.description}` : ''}</li>`;
  }).join('');

  // Helper to create circular gauge SVG
  const createCircularGauge = (score, color) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const strokeColor = color === 'green' ? '#10b981' : color === 'orange' ? '#f59e0b' : '#ef4444';

    return `
      <svg width="120" height="120" viewBox="0 0 120 120" style="transform: rotate(-90deg);">
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#e5e7eb" stroke-width="10"/>
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="${strokeColor}" stroke-width="10" 
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" 
                stroke-linecap="round" style="transition: stroke-dashoffset 0.5s ease;"/>
        <text x="60" y="60" text-anchor="middle" dy="7" font-size="28" font-weight="700" 
              fill="${strokeColor}" transform="rotate(90 60 60)">${score}</text>
      </svg>
    `;
  };

  const template = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Audit WebFitYou</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 30px 30px; border-bottom: 2px solid #e5e7eb;">
              <img src="https://ptzpnswtgevfxfeosjfj.supabase.co/storage/v1/object/public/Images/Logo-rond-webfityou-seo-ia-optimisation-siteweb-2.png" 
                   alt="WebFitYou" 
                   width="100" 
                   height="100" 
                   style="display: block; border-radius: 50%; border: 3px solid #f3f4f6; margin-bottom: 20px;" />
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #111827;">WebFitYou</h1>
              <p style="margin: 0 0 20px; font-size: 16px; color: #6b7280;">Optimisation SEO & Performance Web</p>
              <div style="display: inline-block; padding: 10px 18px; border-radius: 6px; background-color: #eff6ff; border: 1px solid #3b82f6; font-size: 13px; font-weight: 600; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">
                Rapport d'audit technique
              </div>
            </td>
          </tr>
          
          <!-- Introduction -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.7; color: #374151;">
                Bonjour <strong style="color: #111827;">${name}</strong>,
              </p>
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.7; color: #374151;">
                Nous sommes <strong style="color: #111827;">WebFitYou</strong>, spécialistes en optimisation SEO et performance web. 
                Nous accompagnons les professionnels comme vous (${profession}, basé à ${location}) dans l'amélioration de leur visibilité en ligne.
              </p>
              <p style="margin: 0 0 14px; font-size: 16px; line-height: 1.7; color: #374151;">
                Nous avons analysé votre site <strong style="color: #111827;">${url}</strong> à l'aide de l'API Google PageSpeed Insights 
                afin de vous fournir un diagnostic précis et des recommandations concrètes.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #374151;">
                Voici les résultats de notre analyse :
              </p>
            </td>
          </tr>
          
          <!-- Mobile Scores -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #111827; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                📱 Scores Mobile (Google PageSpeed Insights)
              </h2>
              
              <table width="100%" cellpadding="15" cellspacing="0" border="0">
                <tr>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(mobile.categories.performance.score, mobile.categories.performance.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Performance</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(mobile.categories.accessibility.score, mobile.categories.accessibility.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Accessibilité</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(mobile.categories.bestPractices.score, mobile.categories.bestPractices.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Pratiques</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(mobile.categories.seo.score, mobile.categories.seo.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">SEO</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Desktop Scores -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #111827; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                💻 Scores Desktop (Google PageSpeed Insights)
              </h2>
              
              <table width="100%" cellpadding="15" cellspacing="0" border="0">
                <tr>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(desktop.categories.performance.score, desktop.categories.performance.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Performance</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(desktop.categories.accessibility.score, desktop.categories.accessibility.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Accessibilité</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(desktop.categories.bestPractices.score, desktop.categories.bestPractices.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">Pratiques</div>
                  </td>
                  <td width="25%" align="center" style="padding: 10px;">
                    ${createCircularGauge(desktop.categories.seo.score, desktop.categories.seo.color)}
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; font-weight: 600;">SEO</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Strengths -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">Points forts détectés</h2>
                  <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Audits réussis</span>
                </div>
                <ul style="margin: 0; padding: 0; list-style: none;">
                  ${pointsFortsHtml || '<li style="padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px;"><span style="position: absolute; left: 0; top: 8px; width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; display: inline-block;"></span>Analyse en cours...</li>'}
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Weaknesses -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">Axes d'amélioration</h2>
                  <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Opportunités d'optimisation</span>
                </div>
                <ul style="margin: 0; padding: 0; list-style: none;">
                  ${pointsFaiblesHtml || '<li style="padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px;"><span style="position: absolute; left: 0; top: 8px; width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; display: inline-block;"></span>Analyse en cours...</li>'}
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- SEO Explanation -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                  <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">Impact sur votre référencement</h2>
                  <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Analyse & recommandations</span>
                </div>
                <p style="margin: 0; font-size: 16px; line-height: 1.8; color: #374151;">
                  ${seoExplanation}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 30px; background-color: #f9fafb;">
              <p style="margin: 0 0 14px; font-size: 17px; color: #374151;"><strong>Vous souhaitez améliorer ces résultats ?</strong></p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
                WebFitYou vous accompagne avec des solutions sur mesure : optimisation technique, refonte SEO, amélioration des performances et intégration d'intelligence artificielle.
              </p>
              <a href="https://webfityou.com/contact" 
                 style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 16px 36px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 17px;">
                Discutons de votre projet
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
              <p style="margin: 0 0 8px; font-weight: 600; color: #111827;">WebFitYou</p>
              <p style="margin: 0 0 4px;">Création de sites web & optimisation SEO</p>
              <p style="margin: 0;">© 2025 WebFitYou. Tous droits réservés.</p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;

  // Add inline styles to list items
  const styledTemplate = template.replace(
    /<li>/g,
    '<li style="padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 12px;"><span style="position: absolute; left: 0; top: 8px; width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; display: inline-block;"></span>'
  );

  return styledTemplate;
};
