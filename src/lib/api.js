// API Configuration for FastAPI Backend

// Update this with your actual backend URL
// For local development: http://YOUR_IP_ADDRESS:8000
// For production: https://your-domain.com
export const API_BASE_URL = 'http://192.168.0.108:8000'; // Replace with your IP

export const API_ENDPOINTS = {
  predict: `${API_BASE_URL}/predict`,
  health: `${API_BASE_URL}/health`,
  classes: `${API_BASE_URL}/classes`,
};

/**
 * Upload image to FastAPI backend for disease prediction
 * @param {string} imageUri - Local URI of the image
 * @returns {Promise<Object>} - Prediction results with recommendations
 */
export async function predictDisease(imageUri) {
  try {
    // Create FormData
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append image file
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    });

    // Send POST request
    const response = await fetch(API_ENDPOINTS.predict, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Prediction failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Check if backend is running
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(API_ENDPOINTS.health, {
      method: 'GET',
    });
    const data = await response.json();
    return data.status === 'healthy' && data.model_loaded;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Get available disease classes
 * @returns {Promise<Array<string>>}
 */
export async function getDiseaseClasses() {
  try {
    const response = await fetch(API_ENDPOINTS.classes);
    const data = await response.json();
    return data.classes;
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return [];
  }
}