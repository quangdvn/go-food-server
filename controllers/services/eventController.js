const { eventSearch, eventFeatured, eventDetail } = require('../../api/yelp');
const { User } = require('../../models/user');
const combineObject = require('../../utils/combineObject');
const { Event, validateEvent } = require('../../models/event');
const {
  Notification,
  validateNotification,
} = require('../../models/notification');

exports.getAllEvents = async (req, res) => {
  const { _id } = req.user;
  try {
    const {
      address: { latitude, longitude },
    } = await User.findById(_id).select('address');

    const apiData = await eventSearch(latitude, longitude);

    const subData = await eventFeatured(latitude, longitude);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }

    if (!subData.success) {
      return res.status(400).send({ success: false, error: subData.error });
    }

    const returnData = combineObject(
      apiData.data,
      subData.data,
      'featuredEvent'
    );

    return res.status(200).send({ success: true, data: returnData });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.getByFeatured = async (req, res) => {
  const { _id } = req.user;
  try {
    const {
      address: { latitude, longitude },
    } = await User.findById(_id).select('address');

    const apiData = await eventFeatured(latitude, longitude);

    if (!apiData.success) {
      return res.status(400).send({ success: false, error: apiData.error });
    }

    return res.status(200).send({ success: true, data: apiData.data });
  } catch (err) {
    return res.status(400).send({ success: false, error: err });
  }
};

exports.getEventDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const apiData = await eventDetail(encodeURI(id));

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

exports.addEvent = async (req, res) => {
  const { error: eventError } = validateEvent(req.body);
  if (eventError)
    return res.status(400).send({
      success: false,
      error: eventError.details[0].message,
      type: 'event',
    });

  const { error: notiError } = validateNotification(req.body);
  if (notiError)
    return res.status(400).send({
      success: false,
      error: notiError.details[0].message,
      type: 'notification',
    });

  try {
    const { _id: userId } = req.user;
    const { id: eventId } = req.params;
    const { type, attenders, time, fees } = req.body;

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { reactedEvents: [eventId] },
      },
      { new: true }
    );

    const newEvent = new Event({
      userId,
      eventId,
      time,
    });

    await newEvent.save();

    const newNotification = new Notification({
      userId,
      type,
      time,
      attenders,
      fees,
    });

    await newNotification.save();

    return res.status(200).json({
      success: true,
      message: 'Mark interested event successfully!!',
      data: newEvent,
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.removeEvent = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: eventId } = req.params;

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { reactedEvents: [eventId] },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Mark uninterested event successfully!!',
    });
  } catch (err) {
    return res.status(400).send({ success: false, error: err.message });
  }
};

exports.getInterestedEvents = async (req, res) => {};
