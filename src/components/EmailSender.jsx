import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle } from 'lucide-react';

const EmailSender = ({ htmlContent, prospectData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [sendOptions, setSendOptions] = useState({
        sendHtml: true,
        sendPdf: false,
        template: 'standard' // 'standard' ou 'commercial'
    });

    // Fonction pour générer un message en HTML avec liens cliquables
    const generateEmailMessage = () => {
        const prospectName = prospectData?.name || '';
        const prospectEmail = prospectData?.email || '';
        const prospectUrl = prospectData?.url || 'votre site web';
        const profession = prospectData?.profession || '';

        // Créer le lien de désinscription
        const unsubscribeLink = `mailto:webfityou@gmail.com?subject=Demande de désinscription - ${encodeURIComponent(prospectName)}&body=Bonjour,%0D%0A%0D%0AMerci de bien vouloir supprimer mes coordonnées de votre liste de diffusion.%0D%0A%0D%0ACordialement,%0D%0A${encodeURIComponent(prospectName)}`;

        // Lien pour demander un rendez-vous
        const meetingLink = `mailto:webfityou@gmail.com?subject=Demande de rendez-vous - ${encodeURIComponent(prospectName)}&body=Bonjour,%0D%0A%0D%0AJe souhaite discuter des optimisations prioritaires pour mon site web suite à l'audit que vous m'avez transmis.%0D%0A%0D%0AMerci de me proposer quelques créneaux pour un échange.%0D%0A%0D%0ACordialement,%0D%0A${encodeURIComponent(prospectName)}`;

        // Template commercial personnalisé
        if (sendOptions.template === 'commercial') {
            // Adapter le titre selon la profession
            let title = prospectName;
            if (profession.toLowerCase().includes('avocat')) {
                title = `Maître ${prospectName}`;
            } else if (profession.toLowerCase().includes('docteur') || profession.toLowerCase().includes('médecin')) {
                title = `Docteur ${prospectName}`;
            }

            // Adapter le message selon la profession
            let businessContext = '';
            let clientTerm = 'clients';
            let acquisitionTerm = 'demandes qualifiées';

            if (profession.toLowerCase().includes('avocat')) {
                businessContext = 'Google et l\'intelligence artificielle jouent un rôle déterminant dans la manière dont les clients choisissent leur avocat, et votre site pourrait capter bien plus de demandes que ce qu\'il génère actuellement.';
                clientTerm = 'futurs clients';
                acquisitionTerm = 'dossiers qualifiés';
            } else if (profession.toLowerCase().includes('architecte')) {
                businessContext = 'Dans le secteur de l\'architecture, votre présence en ligne est souvent le premier contact avec vos futurs clients. Votre site pourrait générer bien plus de projets qualifiés.';
                clientTerm = 'futurs clients';
                acquisitionTerm = 'projets qualifiés';
            } else {
                businessContext = 'Votre présence en ligne est déterminante pour attirer de nouveaux clients. Votre site pourrait générer bien plus de demandes qualifiées qu\'actuellement.';
            }

            return `${title},

Nous avons analysé votre site web ${prospectUrl} et au vu des résultats en pièce jointe, je me suis dit que cela valait le coup de vous contacter.

${businessContext}

Chez WebFitYou, nous aidons des professionnels comme vous à devenir visibles partout où leurs ${clientTerm} cherchent :
• En première page sur Google
• Dans les réponses des IA (ChatGPT, Gemini…)
• Via des contenus optimisés et convaincants

L'objectif : transformer votre site web en un levier d'acquisition de ${acquisitionTerm}.

Les conclusions de l'audit sont ci-jointes. Si vous le souhaitez, je peux vous présenter les optimisations prioritaires à mettre en place et l'impact concret sur votre activité.

Discutons-en : <a href="${meetingLink}" style="color: #3b82f6; text-decoration: underline;">cliquez ici</a>

Bien à vous,
L'équipe WebFitYou
🌐 www.webfityou.com

---
Vous ne souhaitez plus recevoir ces emails ? <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Se désinscrire</a>`;
        }

        // Template standard
        let attachmentInfo = '';
        if (sendOptions.sendPdf && sendOptions.sendHtml) {
            attachmentInfo = 'Vous trouverez le rapport ci-dessous dans le corps de l\'email, ainsi qu\'en pièce jointe au format PDF pour votre archivage.';
        } else if (sendOptions.sendPdf) {
            attachmentInfo = 'Veuillez trouver le rapport complet en pièce jointe au format PDF.';
        } else {
            attachmentInfo = 'Vous trouverez le rapport détaillé ci-dessous.';
        }

        return `Bonjour ${prospectName},

Nous avons le plaisir de vous transmettre l'audit SEO et performance de votre site web.

Ce rapport détaillé analyse les performances de votre site sur mobile et desktop, et identifie les opportunités d'optimisation pour améliorer votre visibilité en ligne.

📎 ${attachmentInfo}

N'hésitez pas à nous contacter si vous souhaitez discuter de ces résultats ou explorer des solutions d'optimisation.

Cordialement,
L'équipe WebFitYou
🌐 www.webfityou.com

---
Vous ne souhaitez plus recevoir ces emails ? <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Se désinscrire</a>`;
    };

    // Fonction pour générer la version texte lisible pour la prévisualisation
    const generatePreviewMessage = () => {
        const message = generateEmailMessage();
        // Remplacer les liens HTML par du texte lisible
        return message
            .replace(/<a href="mailto:[^"]+"\s+style="[^"]+">cliquez ici<\/a>/g, 'webfityou@gmail.com')
            .replace(/<a href="mailto:[^"]+"\s+style="[^"]+">Se désinscrire<\/a>/g, 'webfityou@gmail.com');
    };

    const [emailData, setEmailData] = useState({
        to: prospectData?.email || '',
        subject: `Audit SEO & Performance - ${prospectData?.name || 'Votre site'}`,
        message: generateEmailMessage(),
        previewMessage: generatePreviewMessage()
    });

    // Mettre à jour le message selon les options
    React.useEffect(() => {
        setEmailData(prev => ({
            ...prev,
            message: generateEmailMessage(),
            previewMessage: generatePreviewMessage()
        }));
    }, [sendOptions.sendHtml, sendOptions.sendPdf, sendOptions.template, prospectData?.name]);

    const handleSend = async () => {
        if (!sendOptions.sendHtml && !sendOptions.sendPdf) {
            setError('Veuillez sélectionner au moins une option d\'envoi');
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: emailData.to,
                    subject: emailData.subject,
                    text: emailData.message,
                    // Envoyer le HTML si option HTML cochée OU si PDF demandé (pour générer le PDF)
                    html: (sendOptions.sendHtml || sendOptions.sendPdf) ? htmlContent : null,
                    // Si seulement PDF (pas HTML), ne pas afficher le HTML dans l'email
                    htmlInBody: sendOptions.sendHtml,
                    generatePdf: sendOptions.sendPdf,
                    prospectName: prospectData?.name || 'Audit'
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(false);
                }, 2000);
            } else {
                setError(result.error || 'Erreur lors de l\'envoi');
            }
        } catch (err) {
            setError('Impossible de se connecter au serveur d\'envoi. Assurez-vous que le serveur est démarré.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="email-button">
                <Mail size={18} /> Envoyer par Email
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="email-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Mail size={20} /> Envoyer le rapport par email</h3>
                            <button onClick={() => setIsOpen(false)} className="close-button">
                                <X size={20} />
                            </button>
                        </div>

                        {success ? (
                            <div className="success-message-modal">
                                <CheckCircle size={48} color="#10b981" />
                                <p>Email envoyé avec succès !</p>
                            </div>
                        ) : (
                            <>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Destinataire</label>
                                        <input
                                            type="email"
                                            value={emailData.to}
                                            onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Objet</label>
                                        <input
                                            type="text"
                                            value={emailData.subject}
                                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type de message</label>
                                        <select
                                            value={sendOptions.template}
                                            onChange={(e) => setSendOptions({ ...sendOptions, template: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="standard">Message standard (neutre)</option>
                                            <option value="commercial">Message commercial (personnalisé par profession)</option>
                                        </select>
                                        <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                            Le message commercial s'adapte automatiquement selon la profession du prospect
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label>Message d'accompagnement (prévisualisation)</label>
                                        <textarea
                                            value={emailData.previewMessage}
                                            readOnly
                                            rows={12}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '6px',
                                                backgroundColor: '#f9fafb',
                                                fontFamily: 'monospace',
                                                fontSize: '14px',
                                                lineHeight: '1.6',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Format d'envoi</label>
                                        <div className="checkbox-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={sendOptions.sendHtml}
                                                    onChange={(e) => setSendOptions({ ...sendOptions, sendHtml: e.target.checked })}
                                                />
                                                <span>Email HTML (dans le corps du message)</span>
                                            </label>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={sendOptions.sendPdf}
                                                    onChange={(e) => setSendOptions({ ...sendOptions, sendPdf: e.target.checked })}
                                                />
                                                <span>Pièce jointe PDF</span>
                                            </label>
                                        </div>
                                    </div>

                                    {error && <div className="error-message">{error}</div>}
                                </div>

                                <div className="modal-footer">
                                    <button onClick={() => setIsOpen(false)} className="btn-cancel">
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        className="btn-send"
                                        disabled={isSending || !emailData.to}
                                    >
                                        {isSending ? (
                                            <>Envoi en cours...</>
                                        ) : (
                                            <><Send size={18} /> Envoyer</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EmailSender;
