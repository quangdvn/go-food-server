const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const ObjectId = mongoose.Schema.Types.ObjectId;

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    attenders: {
      type: Number,
      default: 0,
      required: true,
    },
    fees: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true, collection: 'notifications' }
);

const Notification = mongoose.model('Notification', notificationSchema);

function validateNotification(notification) {
  const schema = Joi.object({
    type: Joi.string().required(),
    attenders: Joi.number().required(),
    time: Joi.string().required(),
    fees: Joi.number().required(),
  }).options({ stripUnknown: true });
  return schema.validate(notification);
}

module.exports = {
  Notification,
  validateNotification,
};
