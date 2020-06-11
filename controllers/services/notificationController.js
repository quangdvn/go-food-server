const { User } = require('../../models/user');
const { Notification } = require('../../models/notification');

exports.getAllNotifications = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    const data = await Notification.find({ userId: userId }).sort({
      createdAt: -1,
    });

    const totalNotifications = data.length;
    const latestNoti = data.splice(0, 1)[0];
    const olderNotis = data;

    return res.status(200).send({
      success: true,
      data: {
        latestNoti,
        olderNotis,
      },
      count: totalNotifications,
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};
