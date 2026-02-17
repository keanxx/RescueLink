import { api } from './client';

export const geolocationAPI = {
  /**
   * Convert GPS coordinates to human-readable address
   * @param {number} latitude - GPS latitude
   * @param {number} longitude - GPS longitude
   * @returns {Promise} Address data
   */
  reverseGeocode: async (latitude, longitude) => {
    try {
      const response = await api.post('/geolocation/reverse', {
        latitude,
        longitude
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
