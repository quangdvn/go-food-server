const {
  businessSearch,
  businessSearchByCategory,
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

exports.getByCategories = async (req, res) => {
  const { _id } = req.user;
  const { alias } = req.params;

  try {
    const {
      address: { latitude, longitude },
    } = await User.findById(_id).select('address');

    const apiData = await businessSearchByCategory(alias, latitude, longitude);

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
    const apiData = await businessDetail(encodeURI(id));
    const subData = await businessReviews(encodeURI(id));

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
  const { _id } = req.user;
  try {
    const { inputTerm } = req.params;
    const {
      address: { latitude, longitude },
    } = await User.findById(_id).select('address');

    const apiData = await autoCompleteSearch(inputTerm, latitude, longitude);
    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }
    return res.status(200).send({
      success: true,
      data: apiData.data,
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.searchBusiness = async (req, res) => {
  const { _id } = req.user;
  try {
    const { inputTerm } = req.params;
    const {
      address: { latitude, longitude },
    } = await User.findById(_id).select('address');
    const apiData = await businessSearch(inputTerm, latitude, longitude);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }

    return res.status(200).send({
      success: true,
      data: { details: apiData.data },
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};
