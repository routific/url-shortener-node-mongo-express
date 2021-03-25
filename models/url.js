const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema for our links
let urlSchema = new Schema({
  long_url: String,
  short_id: String,
  created_at: Date,
  location: String
}, {
  shardKey: {
    _id: 1,
    location: 1
  }
});
// create indexes
urlSchema.index({ long_url: 1 });
urlSchema.index({ short_id: 1 });

urlSchema.pre('save', function(next){
  let doc = this;
  doc.created_at = new Date();
  doc.location = 'US';
  next();
});

const Url = mongoose.model('ShortUrl', urlSchema);

module.exports = Url;
