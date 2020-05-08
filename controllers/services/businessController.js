const {
  businessSearch,
  businessDetail,
  businessReviews,
  autoCompleteSearch,
} = require('../../api/yelp');
const { User } = require('../../models/user');

exports.getAllBusinesses = async (req, res) => {
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
};

exports.getBusinessDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const apiData = await businessDetail(id);
    const subData = await businessReviews(id);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }
    if (!subData.success) {
      return res.status(400).send({ success: false, error: subData.error });
    }

    return res.status(200).send({
      success: true,
      data: { details: apiData.data, reviews: subData.data },
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.getAutoComplete = async (req, res) => {
  try {
    
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};
