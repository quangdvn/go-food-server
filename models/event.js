const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'events' }
);

const Event = mongoose.model('Event', eventSchema);

function validateEvent(event) {
  const schema = Joi.object({
    timeStart: Joi.string().required(),
  });
  return schema.validate(event);
}

module.exports = {
  Event,
  validateEvent,
};
