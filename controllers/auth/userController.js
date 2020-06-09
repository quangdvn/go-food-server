const _ = require('lodash');
const {
  User,
  validateLogInUser,
  validateSignUpUser,
  validateUserInfo,
  validateUpdateUser,
} = require('../../models/user');

exports.signUpUser = async (req, res) => {
  const { error } = validateSignUpUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, error: 'Something went wrong ..' });
  // .send({ success: false, error: error.details[0].message });

  try {
    const { password, rePassword } = req.body;
    if (password !== rePassword)
      return res
        .status(400)
        .send({ success: false, error: 'Password mis-match.' });

    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail)
      return res
        .status(400)
        .send({ success: false, error: 'User already registered.' });

    const newUser = new User(
      _.pick(req.body, ['fullname', 'email', 'password'])
    );
    await newUser.save();

    const token = newUser.generateAuthToken();

    return res.status(200).send({
      success: true,
      data: _.pick(newUser, ['_id']),
      token,
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.postUserInfo = async (req, res) => {
  const { error } = validateUserInfo(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message });

  try {
    const { address, favoriteFood } = req.body;
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { address, favoriteFood }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Update successful !!',
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.logInUser = async (req, res) => {
  const { error } = validateLogInUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, error: 'Something went wrong ..' });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ success: false, error: 'Invalid email.' });

    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res
        .status(400)
        .send({ success: false, error: 'Invalid password.' });

    const token = user.generateAuthToken();

    return res.status(200).send({
      success: true,
      data: _.pick(user, ['_id']),
      token,
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id)
      // .populate({
      //   path: 'bookmarks',
      //   select: '-__v -_id -createdAt -updatedAt -userId',
      // })
      .select('-password -__v -createdAt -updatedAt');
    return res.status(200).send({ success: true, data: user });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.updateUserInfo = async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, error: error.details[0].message });

  try {
    const { _id } = req.user;
    const { dob, contactNumber, gender } = req.body;

    const {
      dob: curDob,
      contactNumber: curContactNumber,
      gender: curGender,
    } = await User.findById(_id).select('dob contactNumber gender');

    console.log(curDob, curContactNumber, curGender);

    let updateDob = dob || curDob;
    let updateContact = contactNumber || curContactNumber;
    let updateGender = gender || curGender;

    console.log(updateDob, updateContact, updateGender);

    await User.findOneAndUpdate(
      { _id: _id },
      { dob: updateDob, contactNumber: updateContact, gender: updateGender },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Update successful',
      updateData: { updateDob, updateContact, updateGender },
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};
