const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, 'thisisnewtoken');
    const user = await User.findById(decode._id);
    if (!user) {
      throw new Error('Please authenticate !!!');
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = auth;
