const express = require('express');
const auth = require('../../middlewares/auth');
const {
  getAllEvents,
  getEventDetail,
  getInterestedEvents,
  addEvent,
  removeEvent,
} = require('../../controllers/services/eventController');

const router = express.Router();

router.get('/', auth, getAllEvents);

router.get('/interested', auth, getInterestedEvents);

router.get('/:id', getEventDetail);

router.put('/:id/interested', auth, addEvent);

router.put('/:id/uninterested', auth, removeEvent);

module.exports = router;
