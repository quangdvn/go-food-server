const axios = require('axios');
const YelpApiKey = require('../configs/key').YelpApiKey;
const YelpBaseUrl = require('../configs/key').YelpBaseUrl;

const yelpApi = axios.create({
  baseURL: `${YelpBaseUrl}`,
  headers: {
    Authorization: `Bearer ${YelpApiKey}`,
  },
});

const businessSearch = async (term, latitude, longitude) => {
  try {
    const { data } = await yelpApi.get('/businesses/search', {
      params: {
        term,
        latitude,
        longitude,
      },
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const businessDetail = async (businessId) => {
  try {
    const { data } = await yelpApi.get(`/businesses/${businessId}`);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  businessSearch,
  businessDetail,
};
