const express = require('express');
const _ = require('lodash');
const auth = require('../../middlewares/auth');
const {
  User,
  validateLogInUser,
  validateSignUpUser,
  validateUserInfo,
} = require('../../models/user');

const router = express.Router();

//* New User Signup
router.post('/signup', async (req, res) => {
  const { error } = validateSignUpUser(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  try {
    const { password, rePassword } = req.body;
    if (password !== rePassword)
      return res
        .status(400)
        .send({ success: false, message: 'Password mis-match.' });

    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail)
      return res
        .status(400)
        .send({ success: false, message: 'User already registered.' });

    const newUser = new User(
      _.pick(req.body, ['fullname', 'email', 'password'])
    );
    await newUser.save();

    const token = newUser.generateAuthToken();

    res.status(200).send({
      success: true,
      data: _.pick(newUser, ['_id']),
      token,
    });
  } catch (err) {
    return res.status(400).send({ success: false, message: err.message });
  }
});

router.post('/info', auth, async (req, res) => {
  const { error } = validateUserInfo(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  try {
    const { address, favoriteFood } = req.body;
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { address, favoriteFood }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Update successful !!',
    });

  } catch (err) {
    return res.status(400).send({ success: false, message: err.message });
  }
});

// //* User Log-In to work with Data
// router.post('/login', async (req, res) => {
//   const { error } = validateAuth(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status(400).send('Invalid email !!!');

//     const validPassword = await user.comparePassword(req.body.password);
//     if (!validPassword) return res.status(400).send('Password incorrect !!!');

//     const token = user.generateAuthToken();

//     res
//       .header('x-auth-token', token)
//       .status(200)
//       .send(_.pick(user, ['_id', 'username', 'fullname']));
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// });

// //* User get private Information
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.status(200).send(user);
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// });

// //* User update current Profile
// router.put('/updatedetails', auth, async (req, res) => {
//   const { error } = validateUpdateUser(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   try {
//     const { fullname, contactNumber } = req.body;

//     await User.findByIdAndUpdate(
//       req.user._id,
//       { fullname, contactNumber },
//       { new: true }
//     );

//     res.status(200).json({
//       msg: 'Update successful',
//       userData: { fullname, contactNumber },
//     });
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// });

// //* User update current Password
// router.put('/updatepassword', auth, async (req, res) => {
//   const { error } = validateUpdatePassword(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   try {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id);

//     const validPassword = await user.comparePassword(oldPassword);
//     if (!validPassword) {
//       return res.status(400).send('Old password incorrect !!!');
//     } else {
//       user.password = newPassword;
//       await user.save();
//       return res.status(200).send('Update password successful');
//     }
//   } catch (err) {
//     return res.status(400).send(err.message);
//   }
// });

module.exports = router;
