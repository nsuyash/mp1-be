const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  collectionType: {
    type: String,
    required: true
  },
  subCollectionType: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  modelSubContent: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  mrp: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  productImageUrl: {
    type: String,
    required: true
  },
  productImagesUrl: [{
    type: String,
    required: true
  }],
  highlights: [{
    type: String,
    required: true
  }],
  warranty: {
    type: String,
    required: true
  },
  features: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: [{
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }]
}, {timestamps: true});

const Products = mongoose.model('Products', productSchema);

module.exports = Products