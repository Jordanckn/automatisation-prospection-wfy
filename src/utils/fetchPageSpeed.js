import axios from 'axios';

const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export const fetchPageSpeed = async (url, strategy, apiKey) => {
  if (!apiKey) {
    throw new Error("Clé API Google PageSpeed manquante. Veuillez la configurer dans les paramètres.");
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        url: url,
        strategy: strategy,
        key: apiKey,
        locale: 'fr'
      },
      paramsSerializer: params => {
        // Add multiple category parameters
        const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
        const baseParams = new URLSearchParams(params);
        categories.forEach(cat => baseParams.append('category', cat));
        return baseParams.toString();
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching PageSpeed data for ${strategy}:`, error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Erreur Google API: ${error.response.data.error.message}`);
    }
    throw error;
  }
};
