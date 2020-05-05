const axios = require('axios');
const GeoCodeBaseUrl = require('../configs/key').GeoCodeBaseUrl;

const geoCodeApi = axios.create({
  baseURL: `${GeoCodeBaseUrl}`,
});

const locationToLatLng = async (location) => {
  try {
    const {
      data: { latt, longt },
    } = await geoCodeApi.get('/', {
      params: {
        locate: location,
        geoit: 'json',
      },
    });
    return { success: true, data: { latitude: latt, longitude: longt } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  locationToLatLng,
};
