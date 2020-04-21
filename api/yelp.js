const axios = require('axios');
const YelpApiKey = require('../configs/key').YelpApiKey;
const YelpBaseUrl = require('../configs/key').YelpBaseUrl;

const yelpApi = axios.create({
  baseURL: `${YelpBaseUrl}`,
  headers: {
    Authorization: `Bearer ${YelpApiKey}`,
  },
});

const businessSearch = async (term) => {
  try {
    const { data } = await yelpApi.get('/businesses/search', {
      params: {
        term,
        longitude: 139.68872,
        latitude: 35.68052,
      },
    });
    return data;
  } catch (err) {
    return err.message;
  }
};

const businessDetail = async (businessId) => {
  try {
    const { data } = await yelpApi.get(`/businesses/${businessId}`);
    return data;
  } catch (err) {
    return err.message;
  }
};

exports.businessSearch = businessSearch;
exports.businessDetail = businessDetail;
