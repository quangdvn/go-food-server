const express = require('express');
const auth = require('../../middlewares/auth');
const {
  getAllNotifications,
} = require('../../controllers/services/notificationController');

const router = express.Router();

router.get('/', auth, getAllNotifications);

module.exports = router;
