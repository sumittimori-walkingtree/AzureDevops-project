// API service for making requests to the backend

// Use a function to get the API URL to avoid issues during SSR
const getApiUrl = () =>  'https://trendgenie-with-ai.onrender.com';

/**
 * Fetch data from the API
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const url = `${getApiUrl()}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};


export const generateVideoContent = async (topic, niche ) => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/generate-video-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        topic, 
        niche,
        optionsCount: 3 // Request 3 content options
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    // Check if we received multiple content options
    if (data.contentOptions && Array.isArray(data.contentOptions)) {
      return data;
    } 
    // If backend hasn't been updated yet, convert single content to array
    else if (data.content) {
      // Create variations of the content to simulate multiple options
      return {
        contentOptions: [
          data.content,
          {
            title: `Alternative: ${data.content.title}`,
            description: data.content.description,
            hashtags: data.content.hashtags
          },
          {
            title: `Another Option: ${data.content.title}`,
            description: data.content.description,
            hashtags: data.content.hashtags
          }
        ]
      };
    } else {
      throw new Error('Invalid response format from the server');
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};