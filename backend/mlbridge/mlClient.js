const axios = require('axios');

/**
 * ML Client for communicating with the Python FastAPI service
 */
class MLClient {
  constructor(baseURL = 'http://127.0.0.1:8001') {
    this.baseURL = baseURL;
    this.timeout = 30000; // 30 seconds timeout
  }

  /**
   * Check if ML service is healthy and ready
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: this.timeout
      });
      return response.data;
    } catch (error) {
      console.error('ML Service health check failed:', error.message);
      throw new Error(`ML Service unavailable: ${error.message}`);
    }
  }

  /**
   * Send prediction request to ML service
   * @param {Object} features - Student features for prediction
   * @returns {Promise<Object>} Prediction response with career scores and recommendations
   */
  async predictCareer(features) {
    try {
      // Validate required features
      const requiredFeatures = [
        'math_score', 'physics_score', 'chemistry_score', 'biology_score',
        'english_score', 'history_score', 'geography_score',
        'weekly_self_study_hours', 'absence_days',
        'extracurricular_activities', 'part_time_job'
      ];

      for (const feature of requiredFeatures) {
        if (features[feature] === undefined || features[feature] === null) {
          throw new Error(`Missing required feature: ${feature}`);
        }
      }

      // Ensure binary features are integers
      features.extracurricular_activities = parseInt(features.extracurricular_activities);
      features.part_time_job = parseInt(features.part_time_job);

      // Ensure numeric features are floats
      const numericFeatures = [
        'math_score', 'physics_score', 'chemistry_score', 'biology_score',
        'english_score', 'history_score', 'geography_score',
        'weekly_self_study_hours', 'absence_days'
      ];

      for (const feature of numericFeatures) {
        features[feature] = parseFloat(features[feature]);
        if (isNaN(features[feature])) {
          throw new Error(`Invalid numeric value for feature: ${feature}`);
        }
      }

      console.log('Sending prediction request to ML service:', features);

      const response = await axios.post(`${this.baseURL}/score`, features, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('ML service response received successfully');
      return response.data;

    } catch (error) {
      console.error('ML prediction failed:', error.message);
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const detail = error.response.data?.detail || 'Unknown ML service error';
        throw new Error(`ML Service error (${status}): ${detail}`);
      } else if (error.request) {
        // Request timeout or network error
        throw new Error('ML Service timeout or network error. Please try again.');
      } else {
        // Client-side error
        throw new Error(`ML Client error: ${error.message}`);
      }
    }
  }

  /**
   * Test the ML service with sample data
   */
  async testConnection() {
    const sampleFeatures = {
      math_score: 85.0,
      physics_score: 78.0,
      chemistry_score: 72.0,
      biology_score: 80.0,
      english_score: 75.0,
      history_score: 70.0,
      geography_score: 73.0,
      weekly_self_study_hours: 20.0,
      absence_days: 5.0,
      extracurricular_activities: 1,
      part_time_job: 0
    };

    try {
      await this.healthCheck();
      const prediction = await this.predictCareer(sampleFeatures);
      console.log('ML service test successful:', prediction.top_career);
      return true;
    } catch (error) {
      console.error('ML service test failed:', error.message);
      return false;
    }
  }
}

module.exports = MLClient;