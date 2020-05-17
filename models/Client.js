const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Client', ClientSchema);