// ============================================
// SYSTÈME DE TRADUCTION SANS IA
// Phrases fixes et structurées pour prospects
// Format : Titre court + Explication détaillée avec impact
// ============================================

// LISTE NOIRE : Audits trop techniques à EXCLURE complètement
const EXCLUDED_AUDITS = [
    'aria-hidden-body',
    'aria-hidden-focus',
    'aria-input-field-name',
    'aria-meter-name',
    'aria-progressbar-name',
    'aria-toggle-field-name',
    'aria-tooltip-name',
    'aria-treeitem-name',
    'definition-list',
    'dlitem',
    'duplicate-id-active',
    'duplicate-id-aria',
    'form-field-multiple-labels',
    'frame-title',
    'heading-order',
    'list',
    'listitem',
    'meta-refresh',
    'meta-viewport',
    'object-alt',
    'tabindex',
    'td-headers-attr',
    'th-has-data-cells',
    'valid-lang',
    'video-caption',
    'custom-controls-labels',
    'custom-controls-roles',
    'focus-traps',
    'focusable-controls',
    'interactive-element-affordance',
    'logical-tab-order',
    'managed-focus',
    'offscreen-content-hidden',
    'use-landmarks',
    'visual-order-follows-dom'
];

// Dictionnaire de traduction - PHRASES DÉTAILLÉES AVEC IMPACT
export const auditTranslations = {
    // ========================================
    // PERFORMANCE & VITESSE
    // ========================================
    'largest-contentful-paint': {
        simple: 'Affichage rapide du contenu principal',
        explanation: 'Vos visiteurs voient votre contenu important en moins de 3 secondes. Cela réduit le taux de rebond et améliore votre position sur Google, car les moteurs de recherche favorisent les sites rapides.'
    },
    'first-contentful-paint': {
        simple: 'Démarrage instantané de la page',
        explanation: 'Vos visiteurs voient immédiatement que votre page se charge, ce qui les rassure et les incite à rester. Une page qui démarre vite donne une impression de professionnalisme et de modernité.'
    },
    'speed-index': {
        simple: 'Chargement progressif et fluide',
        explanation: 'Votre page se remplit de contenu de manière continue sans blocage. Vos visiteurs peuvent commencer à lire pendant que le reste se charge, ce qui améliore considérablement leur expérience.'
    },
    'total-blocking-time': {
        simple: 'Site réactif aux clics',
        explanation: 'Les boutons et liens répondent immédiatement quand vos visiteurs cliquent dessus. Un site qui réagit vite inspire confiance et encourage les conversions (achats, contacts, inscriptions).'
    },
    'cumulative-layout-shift': {
        simple: 'Page stable sans éléments qui bougent',
        explanation: 'Rien ne se déplace pendant le chargement : vos visiteurs ne cliquent pas accidentellement sur le mauvais bouton. Cela évite la frustration et améliore le taux de conversion.'
    },
    'interactive': {
        simple: 'Interaction rapide avec le site',
        explanation: 'Votre site répond vite aux actions des visiteurs (clics, scroll, formulaires). Plus c\'est rapide, plus vos visiteurs sont satisfaits et plus ils ont tendance à acheter ou vous contacter.'
    },
    'bootup-time': {
        simple: 'Démarrage optimisé',
        explanation: 'Votre site est prêt à être utilisé rapidement après son ouverture. Cela réduit l\'attente et améliore l\'expérience, surtout sur mobile où la patience est limitée.'
    },
    'mainthread-work-breakdown': {
        simple: 'Ressources bien gérées',
        explanation: 'Votre site utilise efficacement la puissance de l\'appareil de vos visiteurs. Cela signifie qu\'il fonctionne bien même sur des smartphones ou ordinateurs moins performants, élargissant votre audience.'
    },
    'max-potential-fid': {
        simple: 'Réactivité maximale',
        explanation: 'Vos visiteurs peuvent interagir avec votre site sans aucun délai. Cette fluidité améliore la satisfaction client et augmente les chances qu\'ils accomplissent l\'action souhaitée (achat, contact).'
    },

    // ========================================
    // IMAGES
    // ========================================
    'uses-optimized-images': {
        simple: 'Images optimisées et légères',
        explanation: 'Vos photos sont compressées pour se charger rapidement sans perdre en qualité. Cela économise les données mobiles de vos visiteurs et accélère votre site, ce qui plaît à Google et améliore votre référencement.'
    },
    'modern-image-formats': {
        simple: 'Formats d\'images modernes',
        explanation: 'Vos images utilisent les meilleurs formats du web (WebP, AVIF). Elles sont plus légères qu\'en JPEG tout en gardant une excellente qualité, ce qui accélère le chargement et réduit les coûts d\'hébergement.'
    },
    'uses-responsive-images': {
        simple: 'Images adaptées à chaque écran',
        explanation: 'Chaque appareil (smartphone, tablette, ordinateur) reçoit la bonne taille d\'image. Un mobile ne télécharge pas une image géante, ce qui économise de la bande passante et accélère le chargement.'
    },
    'offscreen-images': {
        simple: 'Chargement intelligent des images',
        explanation: 'Les images se chargent uniquement quand le visiteur scroll vers elles. Cela accélère considérablement le chargement initial de la page et économise les données, surtout apprécié sur mobile.'
    },
    'efficient-animated-content': {
        simple: 'Animations légères et fluides',
        explanation: 'Vos animations (GIF, vidéos) sont optimisées pour ne pas ralentir le site. Des animations fluides améliorent l\'expérience sans frustrer vos visiteurs avec des ralentissements.'
    },
    'unsized-images': {
        simple: 'Images bien dimensionnées',
        explanation: 'Vos images ont des dimensions définies, ce qui évite que la page "saute" pendant le chargement. Cela améliore la stabilité visuelle et le confort de navigation.'
    },
    'image-aspect-ratio': {
        simple: 'Proportions d\'images correctes',
        explanation: 'Vos images ne sont pas déformées ou étirées. Cela donne une impression professionnelle et soignée, renforçant la crédibilité de votre entreprise.'
    },

    // ========================================
    // SEO & RÉFÉRENCEMENT
    // ========================================
    'document-title': {
        simple: 'Titre de page présent et optimisé',
        explanation: 'Votre page a un titre qui apparaît dans les onglets du navigateur et dans les résultats Google. Un bon titre attire les clics et améliore votre visibilité sur les moteurs de recherche.'
    },
    'meta-description': {
        simple: 'Description attractive pour Google',
        explanation: 'Votre page a une description qui s\'affiche sous le titre dans Google. Une description bien rédigée augmente le taux de clic depuis les résultats de recherche, vous apportant plus de visiteurs.'
    },
    'link-text': {
        simple: 'Liens avec textes descriptifs',
        explanation: 'Vos liens ont des textes clairs qui indiquent leur destination. Cela aide vos visiteurs à naviguer facilement et aide Google à comprendre la structure de votre site, améliorant votre référencement.'
    },
    'crawlable-anchors': {
        simple: 'Liens explorables par Google',
        explanation: 'Google peut suivre tous vos liens pour indexer vos pages. Plus Google explore votre site facilement, mieux il vous référence et plus vous apparaissez dans les résultats de recherche.'
    },
    'is-crawlable': {
        simple: 'Site indexable par les moteurs',
        explanation: 'Google peut référencer toutes vos pages. Si Google ne peut pas vous indexer, vous êtes invisible dans les recherches et perdez énormément de visiteurs potentiels.'
    },
    'robots-txt': {
        simple: 'Fichier robots correctement configuré',
        explanation: 'Votre site autorise les moteurs de recherche à le visiter. Une mauvaise configuration pourrait bloquer Google et rendre votre site invisible, vous faisant perdre tout le trafic organique.'
    },
    'hreflang': {
        simple: 'Langues bien gérées',
        explanation: 'Votre site multilingue indique correctement quelle version afficher selon le pays du visiteur. Cela améliore l\'expérience internationale et votre référencement dans chaque pays.'
    },
    'canonical': {
        simple: 'Pas de contenu dupliqué',
        explanation: 'Votre site évite les pages en double qui pourraient être pénalisées par Google. Cela protège votre référencement et concentre la valeur SEO sur les bonnes pages.'
    },
    'http-status-code': {
        simple: 'Toutes les pages fonctionnent',
        explanation: 'Vos pages sont accessibles sans erreur 404. Des liens cassés frustrent vos visiteurs et font mauvaise impression, en plus de nuire à votre référencement.'
    },
    'structured-data': {
        simple: 'Données structurées présentes',
        explanation: 'Votre site aide Google à mieux comprendre votre contenu (produits, avis, événements). Cela peut vous faire apparaître avec des étoiles, prix ou autres enrichissements dans Google, augmentant les clics.'
    },

    // ========================================
    // ACCESSIBILITÉ - EXPLICATIONS DÉTAILLÉES
    // ========================================
    'color-contrast': {
        simple: 'Contrastes de couleurs suffisants',
        explanation: 'Les textes de votre site se détachent bien du fond, ce qui les rend faciles à lire pour tout le monde, y compris les personnes malvoyantes. Un bon contraste améliore l\'expérience de lecture et réduit la fatigue visuelle de vos visiteurs.'
    },
    'image-alt': {
        simple: 'Images avec descriptions textuelles',
        explanation: 'Chaque image de votre site a une description alternative. Cela permet aux personnes utilisant un lecteur d\'écran de comprendre vos images, et aide aussi Google à mieux référencer vos photos dans la recherche d\'images.'
    },
    'button-name': {
        simple: 'Éléments cliquables bien identifiés',
        explanation: 'Tous les boutons et éléments cliquables de votre site ont des noms clairs qui indiquent leur fonction (ex: "Acheter", "Contacter", "S\'inscrire"). Cela aide vos visiteurs à comprendre où ils vont cliquer, et aide Google à mieux indexer votre site.'
    },
    'link-name': {
        simple: 'Liens avec textes descriptifs',
        explanation: 'Vos liens utilisent des textes explicites au lieu de "cliquez ici". Par exemple "Voir nos tarifs" au lieu de "cliquez ici". Cela améliore la navigation et aide Google à comprendre la structure de votre site, améliorant votre référencement.'
    },
    'html-has-lang': {
        simple: 'Langue du site correctement définie',
        explanation: 'Votre site indique sa langue principale (français, anglais, etc.). Cela permet aux navigateurs d\'afficher correctement les accents et caractères spéciaux, et aide les moteurs de recherche à proposer votre site aux bonnes personnes.'
    },
    'label': {
        simple: 'Formulaires clairement étiquetés',
        explanation: 'Chaque champ de vos formulaires (nom, email, téléphone) a une étiquette claire qui indique ce qu\'il faut remplir. Cela facilite la saisie pour vos visiteurs et réduit les erreurs, augmentant ainsi vos conversions (inscriptions, contacts, achats).'
    },
    'input-image-alt': {
        simple: 'Boutons graphiques décrits',
        explanation: 'Les boutons qui utilisent des images (icônes, logos) ont des descriptions textuelles. Vos visiteurs comprennent toujours à quoi sert un bouton, même si l\'image ne se charge pas, et les personnes malvoyantes peuvent utiliser votre site normalement.'
    },
    'document-title': {
        simple: 'Titre de page présent et descriptif',
        explanation: 'Votre page a un titre qui apparaît dans l\'onglet du navigateur et dans les résultats Google. Un bon titre aide vos visiteurs à s\'y retrouver quand ils ont plusieurs onglets ouverts, et améliore votre taux de clic depuis Google.'
    },

    // ARIA - VERSION SIMPLIFIÉE MAIS DÉTAILLÉE
    'aria-allowed-attr': {
        simple: 'Site compatible avec tous les appareils',
        explanation: 'Votre site utilise des paramètres techniques corrects qui garantissent son bon fonctionnement sur tous les navigateurs et appareils (ordinateurs, tablettes, smartphones). Cela élargit votre audience potentielle.'
    },
    'aria-required-attr': {
        simple: 'Éléments interactifs bien configurés',
        explanation: 'Tous les éléments interactifs de votre site (menus, boutons, formulaires) sont correctement paramétrés pour fonctionner de manière fiable. Cela réduit les bugs et améliore l\'expérience utilisateur.'
    },
    'aria-valid-attr-value': {
        simple: 'Configuration technique valide',
        explanation: 'Les paramètres techniques de votre site respectent les standards du web. Cela garantit que votre site fonctionne correctement aujourd\'hui et continuera de fonctionner avec les futures mises à jour des navigateurs.'
    },
    'aria-valid-attr': {
        simple: 'Paramètres techniques conformes',
        explanation: 'Votre site utilise les bons paramètres techniques selon les standards du web. Cela assure une compatibilité maximale avec tous les navigateurs et technologies d\'assistance (lecteurs d\'écran, etc.).'
    },
    'aria-roles': {
        simple: 'Fonctions des éléments clairement définies',
        explanation: 'Chaque élément de votre site (menu, bouton, zone de contenu) a une fonction clairement identifiée. Cela aide les technologies d\'assistance à guider correctement les personnes en situation de handicap, et améliore l\'accessibilité globale.'
    },

    // ========================================
    // SÉCURITÉ & BONNES PRATIQUES - DÉTAILLÉES
    // ========================================
    'uses-https': {
        simple: 'Connexion sécurisée (HTTPS)',
        explanation: 'Votre site utilise une connexion cryptée (cadenas vert dans le navigateur). Cela protège les données de vos visiteurs (mots de passe, informations bancaires) et rassure vos clients. Google favorise aussi les sites HTTPS dans son classement.'
    },
    'no-vulnerable-libraries': {
        simple: 'Aucune faille de sécurité connue',
        explanation: 'Les composants techniques de votre site sont à jour et ne contiennent pas de failles de sécurité connues. Cela protège votre site contre les piratages et protège les données de vos visiteurs, préservant votre réputation.'
    },
    'geolocation-on-start': {
        simple: 'Respect de la vie privée des visiteurs',
        explanation: 'Votre site ne demande pas la localisation géographique de vos visiteurs sans raison valable. Cela respecte leur vie privée et évite de les faire fuir avec des demandes intrusives dès l\'arrivée sur le site.'
    },
    'notification-on-start': {
        simple: 'Pas de pop-ups de notifications agressifs',
        explanation: 'Votre site ne bombarde pas vos visiteurs avec des demandes de notifications dès leur arrivée. Cela améliore l\'expérience utilisateur et évite que vos visiteurs quittent immédiatement votre site par agacement.'
    },
    'paste-preventing-inputs': {
        simple: 'Copier-coller autorisé dans les formulaires',
        explanation: 'Vos visiteurs peuvent copier-coller leurs informations (email, adresse) dans vos formulaires. Cela facilite la saisie, réduit les erreurs et augmente le taux de complétion de vos formulaires (plus d\'inscriptions, de commandes).'
    },
    'errors-in-console': {
        simple: 'Site sans erreurs techniques',
        explanation: 'Votre site ne génère pas d\'erreurs techniques en arrière-plan. Cela garantit un fonctionnement fluide et fiable, réduisant les risques de bugs qui pourraient faire fuir vos visiteurs ou bloquer des conversions.'
    },
    'inspector-issues': {
        simple: 'Aucun problème technique détecté',
        explanation: 'Aucun problème technique détecté'
    },

    // ========================================
    // CACHE & RESSOURCES
    // ========================================
    'uses-long-cache-ttl': {
        simple: 'Mise en cache efficace',
        explanation: 'Les visiteurs réguliers chargent plus vite'
    },
    'uses-text-compression': {
        simple: 'Fichiers compressés',
        explanation: 'Votre site consomme moins de bande passante'
    },
    'render-blocking-resources': {
        simple: 'Chargement optimisé',
        explanation: 'Votre contenu s\'affiche sans attendre'
    },
    'unused-css-rules': {
        simple: 'Styles optimisés',
        explanation: 'Votre site ne charge que le CSS nécessaire'
    },
    'unused-javascript': {
        simple: 'Scripts optimisés',
        explanation: 'Votre site ne charge que le code utile'
    },
    'unminified-css': {
        simple: 'CSS compacté',
        explanation: 'Vos fichiers de style sont allégés'
    },
    'unminified-javascript': {
        simple: 'Code JavaScript optimisé',
        explanation: 'Les scripts de votre site sont compressés pour être plus légers. Cela accélère le chargement de vos pages et réduit la consommation de données, particulièrement apprécié sur mobile.'
    },
    'uses-passive-event-listeners': {
        simple: 'Défilement fluide et réactif',
        explanation: 'Votre page scroll de manière fluide sans saccades ni ralentissements. Cela améliore considérablement le confort de navigation, surtout sur mobile où le scroll est l\'action principale.'
    },
    'duplicated-javascript': {
        simple: 'Pas de code en double',
        explanation: 'Votre site ne charge pas plusieurs fois les mêmes fichiers. Cela évite le gaspillage de bande passante et accélère le chargement, réduisant les coûts d\'hébergement et améliorant l\'expérience.'
    },
    'legacy-javascript': {
        simple: 'Technologies modernes utilisées',
        explanation: 'Votre site utilise les dernières technologies web au lieu de code obsolète. Cela garantit de meilleures performances, une meilleure sécurité et une compatibilité future avec les nouveaux navigateurs.'
    },

    // ========================================
    // MOBILE - EXPLICATIONS DÉTAILLÉES
    // ========================================
    'viewport': {
        simple: 'Parfaitement adapté aux smartphones',
        explanation: 'Votre site s\'affiche correctement sur tous les smartphones sans nécessiter de zoom ou de scroll horizontal. Avec plus de 60% du trafic web sur mobile, c\'est essentiel pour ne pas perdre la majorité de vos visiteurs potentiels.'
    },
    'font-size': {
        simple: 'Textes lisibles sur mobile sans zoomer',
        explanation: 'Les textes de votre site sont assez grands pour être lus facilement sur smartphone sans avoir à zoomer. Cela évite la frustration des visiteurs mobiles et réduit le taux de rebond (visiteurs qui partent immédiatement).'
    },
    'tap-targets': {
        simple: 'Boutons faciles à toucher du doigt',
        explanation: 'Les boutons et liens de votre site sont assez grands et espacés pour être touchés facilement du doigt sur smartphone. Cela évite les clics accidentels et la frustration, améliorant le taux de conversion mobile.'
    },
    'content-width': {
        simple: 'Largeur parfaitement adaptée au mobile',
        explanation: 'Le contenu de votre site s\'adapte à la largeur de l\'écran sans nécessiter de scroll horizontal gênant. Cela améliore grandement le confort de lecture sur smartphone et évite que vos visiteurs mobiles ne quittent votre site.'
    },

    // ========================================
    // RÉSEAU - EXPLICATIONS DÉTAILLÉES
    // ========================================
    'uses-http2': {
        simple: 'Protocole de communication moderne (HTTP/2)',
        explanation: 'Votre site utilise le protocole HTTP/2, la dernière génération de communication web. Cela permet de charger plusieurs ressources en parallèle, accélérant considérablement le chargement de vos pages.'
    },
    'uses-rel-preconnect': {
        simple: 'Connexions anticipées aux ressources externes',
        explanation: 'Votre site se connecte à l\'avance aux ressources externes (polices, vidéos, APIs). Cela réduit les temps d\'attente et accélère le chargement global, améliorant l\'expérience de vos visiteurs.'
    },
    'server-response-time': {
        simple: 'Serveur d\'hébergement très réactif',
        explanation: 'Votre serveur répond en moins d\'une seconde aux demandes. Un serveur rapide est la base d\'un site performant : si le serveur est lent, tout le reste sera lent, peu importe les autres optimisations.'
    },
    'redirects': {
        simple: 'Accès direct aux pages sans détours',
        explanation: 'Vos pages sont accessibles directement sans redirections multiples. Chaque redirection ajoute du délai et ralentit le chargement. Les éviter améliore la vitesse et l\'expérience utilisateur.'
    },
    'uses-rel-preload': {
        simple: 'Chargement prioritaire des ressources importantes',
        explanation: 'Les éléments essentiels de votre site (logo, CSS principal, polices) se chargent en priorité. Cela garantit que vos visiteurs voient rapidement un site fonctionnel, même si tout n\'est pas encore chargé.'
    },

    // ========================================
    // DIVERS
    // ========================================
    'charset': {
        simple: 'Encodage correct',
        explanation: 'Les accents s\'affichent correctement'
    },
    'doctype': {
        simple: 'Format HTML moderne',
        explanation: 'Votre site utilise les standards actuels'
    },
    'no-document-write': {
        simple: 'Code optimisé',
        explanation: 'Votre site utilise les bonnes pratiques'
    },
    'external-anchors-use-rel-noopener': {
        simple: 'Liens externes sécurisés',
        explanation: 'Vos liens sortants sont protégés'
    },
    'appcache-manifest': {
        simple: 'Pas de cache obsolète',
        explanation: 'Votre site n\'utilise pas de technologies dépassées'
    },
    'deprecations': {
        simple: 'Technologies à jour',
        explanation: 'Votre site n\'utilise pas de code obsolète'
    }
};

// ============================================
// FONCTION DE TRADUCTION - SYSTÈME FIXE
// ============================================
export const translateAudit = (auditId, originalTitle) => {
    // 1. VÉRIFIER SI L'AUDIT EST DANS LA LISTE NOIRE
    if (EXCLUDED_AUDITS.includes(auditId)) {
        return null; // Retourner null pour l'exclure complètement
    }

    // 2. CHERCHER UNE TRADUCTION EXACTE
    if (auditTranslations[auditId]) {
        return auditTranslations[auditId];
    }

    // 3. CHERCHER UNE CORRESPONDANCE PARTIELLE
    const normalizedId = auditId.toLowerCase();
    for (const [key, value] of Object.entries(auditTranslations)) {
        if (normalizedId.includes(key) || key.includes(normalizedId)) {
            return value;
        }
    }

    // 4. CATÉGORISER ET RETOURNER UNE PHRASE GÉNÉRIQUE SIMPLE
    return categorizeAndSimplify(auditId, originalTitle);
};

// ============================================
// CATÉGORISATION - PHRASES FIXES PAR CATÉGORIE
// ============================================
const categorizeAndSimplify = (auditId, title) => {
    const id = auditId.toLowerCase();

    // Performance
    if (id.includes('time') || id.includes('speed') || id.includes('paint') || id.includes('load')) {
        return {
            simple: 'Vitesse optimisée',
            explanation: 'Votre site se charge rapidement'
        };
    }

    // Images
    if (id.includes('image') || id.includes('img')) {
        return {
            simple: 'Images bien gérées',
            explanation: 'Vos images sont optimisées'
        };
    }

    // SEO
    if (id.includes('seo') || id.includes('meta') || id.includes('title') || id.includes('description')) {
        return {
            simple: 'Référencement configuré',
            explanation: 'Votre site est bien paramétré pour Google'
        };
    }

    // Accessibilité - EXCLURE SI TROP TECHNIQUE
    if (id.includes('aria') || id.includes('role') || id.includes('label')) {
        return null; // Exclure les audits ARIA non traduits
    }

    // Sécurité
    if (id.includes('https') || id.includes('security') || id.includes('vulnerable')) {
        return {
            simple: 'Site sécurisé',
            explanation: 'Votre site protège vos visiteurs'
        };
    }

    // Cache & Ressources
    if (id.includes('cache') || id.includes('compression') || id.includes('minif')) {
        return {
            simple: 'Ressources optimisées',
            explanation: 'Vos fichiers sont bien configurés'
        };
    }

    // Mobile
    if (id.includes('mobile') || id.includes('viewport') || id.includes('tap')) {
        return {
            simple: 'Compatible mobile',
            explanation: 'Votre site fonctionne bien sur smartphone'
        };
    }

    // Par défaut : EXCLURE si on ne sait pas quoi en faire
    return null;
};

// ============================================
// EXPLICATIONS CONTEXTUELLES - PHRASES FIXES
// ============================================
export const generateContextualExplanation = (category, score) => {
    const explanations = {
        performance: {
            high: 'Votre site se charge rapidement. Vos visiteurs restent et Google vous favorise.',
            medium: 'Votre site a une vitesse correcte. Quelques optimisations le rendraient encore plus rapide.',
            low: 'Votre site est trop lent. Vos visiteurs partent avant même de voir votre contenu.'
        },
        accessibility: {
            high: 'Votre site est accessible à tous, y compris aux personnes en situation de handicap.',
            medium: 'Votre site est utilisable par la plupart des gens. Quelques améliorations le rendraient parfait.',
            low: 'Votre site a des problèmes d\'accessibilité qui excluent certains visiteurs.'
        },
        'best-practices': {
            high: 'Votre site respecte les standards modernes et offre une expérience sécurisée.',
            medium: 'Votre site fonctionne bien. Quelques ajustements le rendraient encore meilleur.',
            low: 'Votre site utilise des pratiques obsolètes qui peuvent causer des problèmes.'
        },
        seo: {
            high: 'Votre site est bien configuré pour être trouvé sur Google.',
            medium: 'Votre site apparaît sur Google. Des optimisations augmenteraient votre visibilité.',
            low: 'Votre site est mal configuré pour Google. Vous perdez beaucoup de visiteurs potentiels.'
        }
    };

    const level = score >= 90 ? 'high' : score >= 50 ? 'medium' : 'low';
    return explanations[category]?.[level] || '';
};
