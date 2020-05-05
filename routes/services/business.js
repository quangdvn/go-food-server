const express = require('express');
const auth = require('../../middlewares/auth');
const { businessSearch, businessDetail } = require('../../api/yelp');
const { User } = require('../../models/user');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { _id } = req.user;
  try {
    const {
      favoriteFood,
      address: { latitude, longitude },
    } = await User.findById(_id).select('favoriteFood address');

    const apiData = await businessSearch(favoriteFood, latitude, longitude);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }

    return res.status(200).send({ success: true, data: apiData.data });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiData = await businessDetail(id);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }

    return res.status(200).send({ success: true, data: apiData.data });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
});

module.exports = router;
