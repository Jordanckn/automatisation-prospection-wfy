import React from 'react';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';

const PDFButton = ({ htmlContent, fileName }) => {
    const handleExport = () => {
        // Prétraiter le HTML pour le PDF : supprimer les contraintes de largeur
        let pdfHtmlContent = htmlContent
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

        const element = document.createElement('div');
        element.innerHTML = finalHTML;

        const opt = {
            margin: [5, 5, 5, 5], // Marges réduites : 5mm de chaque côté
            filename: fileName || 'audit-webfityou.pdf',
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy']
            }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <button onClick={handleExport} className="pdf-btn">
            <Download size={18} /> Exporter en PDF
        </button>
    );
};

export default PDFButton;
