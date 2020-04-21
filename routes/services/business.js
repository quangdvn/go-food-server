const express = require('express');
const { businessSearch, businessDetail } = require('../../api/yelp');
const axios = require('axios');

// console.log(businessSearch);
//     console.log('test1');
//     const data = await businessSearch('pizza');
//     return res.status(200).send({ success: true, data });
const router = express.Router();
//FOnCa-BqUIAPuOFn7-eZfw
router.get('/', async (req, res) => {
  try {
    const data = await businessSearch('pizza');
    return res.status(200).send({ success: true, data });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await businessDetail(id);
    return res.status(200).send({ success: true, data });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
});

module.exports = router;
