//Model for shortUrl document
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shorterUrl: String
}, {timestamps: true});

const Model = mongoose.model('shortUrl', urlSchema);

module.exports = Model;