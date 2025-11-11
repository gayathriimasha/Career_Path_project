/**
 * ML Client: HTTP bridge to FastAPI scoring service
 */

const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';
const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Call ML service to score an assessment
 * @param {Object} payload - Feature payload from featureMapping
 * @returns {Promise<Object>} - Prediction response
 */
async function scoreAssessment(payload) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/score`,
      payload,
      {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    // Clean error mapping
    if (error.code === 'ECONNREFUSED') {
      throw new Error('ML service unavailable. Please ensure the FastAPI service is running on port 8001.');
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw new Error('ML service request timed out. Please try again.');
    }

    if (error.response) {
      // API returned an error
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message || 'Unknown error';
      throw new Error(`ML service error (${status}): ${message}`);
    }

    // Unknown error
    throw new Error(`Failed to communicate with ML service: ${error.message}`);
  }
}

/**
 * Health check for ML service
 * @returns {Promise<boolean>} - True if service is healthy
 */
async function healthCheck() {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/health`,
      { timeout: 2000 }
    );
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}

module.exports = {
  scoreAssessment,
  healthCheck,
  ML_SERVICE_URL
};
