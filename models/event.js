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
    restaurantId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: 'events' }
);

const Event = mongoose.model('Event', eventSchema);

function validateEvent(bookmark) {
  const schema = Joi.object({
    restaurantName: Joi.string().required(),
    rating: Joi.number().required(),
    imageUrl: Joi.string().required(),
    price: Joi.string().required(),
    categories: Joi.string().required(),
    address: Joi.string().required(),
    distance: Joi.number().required(),
  });
  return schema.validate(bookmark);
}

module.exports = {
  Bookmark,
  validateBookmark,
};
