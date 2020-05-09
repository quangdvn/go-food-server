const express = require('express');
const auth = require('../../middlewares/auth');
const {
  getAllBusinesses,
  getByCategories,
  getBusinessDetail,
  getAutoComplete,
  searchBusiness,
} = require('../../controllers/services/businessController');

const router = express.Router();

router.get('/', auth, getAllBusinesses);

router.get('/categories/:alias', auth, getByCategories);

router.get('/:id', getBusinessDetail);

router.get('/autocomplete/:inputTerm', auth, getAutoComplete);

router.get('/search/:inputTerm', auth, searchBusiness);

module.exports = router;
