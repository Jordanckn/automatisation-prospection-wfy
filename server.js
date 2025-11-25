import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import htmlPdf from 'html-pdf-node';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // webfityou@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD // Mot de passe d'application
    }
});

// Vérifier la connexion au démarrage
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erreur de configuration Gmail:', error);
    } else {
        console.log('✅ Serveur prêt à envoyer des emails via Gmail');
    }
});

// Fonction pour générer un PDF à partir de HTML
async function generatePdfFromHtml(html) {
    try {
        console.log('📄 Génération du PDF en cours...');

        // Prétraiter le HTML pour le PDF : supprimer les contraintes de largeur
        let pdfHtmlContent = html
            // Supprimer width="600" des tables
            .replace(/width="600"/g, 'width="100%"')
            // Supprimer max-width: 600px des styles inline
            .replace(/max-width:\s*600px/g, 'max-width: 100%');

        // Styles CSS pour adapter le HTML email au PDF
        const pdfStyles = `
            <style>
                /* Reset */
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }

                /* Container principal pour le centrage */
                .pdf-wrapper {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    padding: 5mm;
                    box-sizing: border-box;
                }

                /* Forcer la table principale à utiliser toute la largeur */
                table, .main-container {
                    margin: 0 auto !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                /* Réduire les paddings excessifs du wrapper externe */
                table[style*="padding: 20px"] {
                    padding: 0 !important;
                }
                
                /* Ajuster les paddings internes */
                td[style*="padding: 30px"] {
                    padding: 15px !important;
                }
                
                /* Supprimer le fond gris du container externe pour le PDF */
                table[style*="background-color: #f4f4f4"] {
                    background-color: #ffffff !important;
                }
                
                /* Assurer que les images ne débordent pas */
                img {
                    max-width: 100% !important;
                    height: auto !important;
                }
                
                /* Centrer le logo dans le PDF */
                .logo-container {
                    margin: 0 auto !important;
                    text-align: center !important;
                }
                
                .logo-container img {
                    margin: 0 auto !important;
                    display: block !important;
                }
                
                /* Aligner le texte d'introduction à gauche */
                .intro-text p {
                    text-align: left !important;
                }
                
                /* Préserver le centrage du texte */
                td[align="center"] {
                    text-align: center !important;
                }
                
                /* Éviter les sauts de page dans les sections importantes */
                tr, .gauge-container {
                    page-break-inside: avoid !important;
                }
            </style>
        `;

        // Créer le HTML final avec un wrapper flex pour le centrage
        const finalHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                ${pdfStyles}
            </head>
            <body style="margin: 0; padding: 0;">
                <div class="pdf-wrapper">
                    ${pdfHtmlContent}
                </div>
            </body>
            </html>
        `;

        const options = {
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            scale: 1
        };

        const file = { content: finalHTML };
        const pdfBuffer = await htmlPdf.generatePdf(file, options);

        console.log('✅ PDF généré avec succès');
        return pdfBuffer;
    } catch (error) {
        console.error('❌ Erreur génération PDF:', error);
        throw error;
    }
}

// Fonction pour convertir le texte en HTML simple avec liens cliquables
function textToSimpleHtml(text) {
    // Remplacer les sauts de ligne par des <br>
    let html = text.replace(/\n/g, '<br>');

    // Convertir les patterns "Discutons-en : mailto:..." en lien cliquable
    html = html.replace(/Discutons-en\s*:\s*mailto:([^\s<]+)/gi, (match, url) => {
        return `<a href="mailto:${url}" style="color: #3b82f6; text-decoration: underline; font-weight: 600;">Discutons-en</a>`;
    });

    // Convertir les patterns "Se désinscrire : mailto:..." en lien cliquable
    html = html.replace(/Se désinscrire\s*:\s*mailto:([^\s<]+)/gi, (match, url) => {
        return `<a href="mailto:${url}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Se désinscrire</a>`;
    });

    // Convertir les autres liens mailto: restants en liens cliquables
    html = html.replace(/mailto:([^\s<]+)/g, (match, url) => {
        return `<a href="mailto:${url}" style="color: #3b82f6; text-decoration: underline;">Contactez-nous</a>`;
    });

    // Convertir les URLs http/https en liens cliquables
    html = html.replace(/(https?:\/\/[^\s<]+)/g, (match, url) => {
        return `<a href="${url}" style="color: #3b82f6; text-decoration: underline;">${url}</a>`;
    });

    // Envelopper dans un HTML simple avec meilleur style
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
                a {
                    color: #3b82f6;
                    text-decoration: underline;
                }
                a:hover {
                    color: #2563eb;
                }
                hr {
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;
}

// Route d'envoi d'email
app.post('/send-email', async (req, res) => {
    const { to, subject, text, html, htmlInBody, generatePdf, prospectName } = req.body;

    console.log('📧 Nouvelle demande d\'envoi:', {
        to,
        subject,
        htmlInBody,
        generatePdf,
        prospectName,
        hasHtml: !!html
    });

    if (!to || !subject) {
        return res.status(400).json({ error: 'Destinataire et objet requis' });
    }

    const mailOptions = {
        from: `WebFitYou <${process.env.GMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        // Si HTML dans le corps, afficher le rapport complet
        // Sinon, convertir le texte en HTML simple pour les liens cliquables
        html: htmlInBody ? html : textToSimpleHtml(text),
        attachments: []
    };

    try {
        // Générer le PDF si demandé
        if (generatePdf && html) {
            console.log('📄 Génération du PDF demandée...');
            const pdfBuffer = await generatePdfFromHtml(html);

            const filename = `Audit-${prospectName || 'WebFitYou'}.pdf`;

            mailOptions.attachments.push({
                filename: filename,
                content: pdfBuffer,
                contentType: 'application/pdf'
            });

            console.log(`✅ PDF généré et ajouté en pièce jointe: ${filename}`);
        }

        console.log('📤 Envoi de l\'email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email envoyé avec succès:', info.messageId);

        res.json({
            success: true,
            messageId: info.messageId,
            message: 'Email envoyé avec succès',
            pdfGenerated: generatePdf,
            attachments: mailOptions.attachments.length
        });
    } catch (error) {
        console.error('❌ Erreur d\'envoi:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'envoi de l\'email',
            details: error.message
        });
    }
});

// Route de test
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'WebFitYou Email Server' });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur d'envoi d'emails démarré sur http://localhost:${PORT}`);
    console.log(`📄 Génération PDF activée avec html-pdf-node`);
});
