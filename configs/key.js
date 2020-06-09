require('dotenv').config();

module.exports = {
  MongoUri: `${process.env.MONGO_URI}`,
  YelpApiKey: `${process.env.YELP_API}`,
  YelpBaseUrl: `${process.env.YELP_URL}`,
  GeoCodeApiKey: `${process.env.GEOCODE_API_KEY}`,
  GeoCodeBaseUrl: `${process.env.GEOCODE_BASE_URL}`,
  GeoNamesBaseUrl: `${process.env.GEONAME_BASE_URL}`, 
  GeoNamesAPIKey: `${process.env.GEONAME_API_KEY}`
};
