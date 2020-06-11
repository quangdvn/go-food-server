const { User } = require('../../models/user');
const { Notification } = require('../../models/notification');

exports.getAllNotifications = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const data = await Notification.find({ userId: userId });

    return res.send(data);

    return res.status(200).send({ success: true, data: returnData });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};
