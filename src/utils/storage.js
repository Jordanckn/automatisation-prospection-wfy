// Utilitaire pour gérer le localStorage de manière sûre et avec logs

const STORAGE_KEYS = {
    PROSPECTS: 'webfityou_prospects',
    LISTS: 'prospectLists',
    CAMPAIGNS: 'emailCampaigns',
    API_KEYS: 'webfityou_keys'
};

// Charger des données depuis le localStorage
export const loadFromStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item) {
            const parsed = JSON.parse(item);
            console.log(`✅ Chargé depuis localStorage [${key}]:`, parsed);
            return parsed;
        }
        console.log(`ℹ️ Aucune donnée dans localStorage [${key}], utilisation de la valeur par défaut`);
        return defaultValue;
    } catch (error) {
        console.error(`❌ Erreur lors du chargement depuis localStorage [${key}]:`, error);
        return defaultValue;
    }
};

// Sauvegarder des données dans le localStorage
export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`💾 Sauvegardé dans localStorage [${key}]:`, value);
        return true;
    } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde dans localStorage [${key}]:`, error);
        return false;
    }
};

// Supprimer des données du localStorage
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Supprimé de localStorage [${key}]`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur lors de la suppression depuis localStorage [${key}]:`, error);
        return false;
    }
};

// Vider tout le localStorage (pour debug)
export const clearAllStorage = () => {
    try {
        localStorage.clear();
        console.log('🧹 localStorage complètement vidé');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors du vidage du localStorage:', error);
        return false;
    }
};

export default STORAGE_KEYS;
