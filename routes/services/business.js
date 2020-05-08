const express = require('express');
const auth = require('../../middlewares/auth');
const {
  getAllBusinesses,
  getBusinessDetail,
} = require('../../controllers/services/businessController');

const router = express.Router();

router.get('/', auth, getAllBusinesses);

router.get('/:id', getBusinessDetail);

module.exports = router;
