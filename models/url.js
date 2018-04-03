var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for our links
var urlSchema = new Schema({
  long_url: String,
  short_id: String,
  created_at: Date
});
// create indexes
urlSchema.index({ long_url: 1 });
urlSchema.index({ short_id: 1 });

urlSchema.pre('save', function(next){
  var doc = this;
  doc.created_at = new Date();
  next();
});

var Url = mongoose.model('ShortUrl', urlSchema);

module.exports = Url;
