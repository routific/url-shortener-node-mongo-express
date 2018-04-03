var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var config = require('./config');
var mongoose = require('./lib/mongooseConnect');

// grab the url model
var Url = require('./models/url');

function generateShortUrl(shortid) {
  return config.webhost + shortid;
}

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/v1.0/shorten', function(req, res){
  var longUrl = req.body.long_url;

  if (!longUrl) {
    return res.status(400).send('Missing required field: long_url')
  }

  // prepend http:// to url if missing from request
  var re = new RegExp("^(http|https)://", "i");
  var match = re.test(longUrl);
  if (match == false) {
    longUrl = "http://"+longUrl;
  }
  var response = {
    long_url: longUrl
  };

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // the document exists, so we return it without creating a new entry
      response.short_id = doc.short_id;
      response.short_url = generateShortUrl(doc.short_id);
      return res.send(response);
    } else {
      // since it doesn't exist, let's go ahead and create it:
      var shortUrlId = config.shortIdPre + shortid.generate();
      var newUrl = Url({
        long_url: longUrl,
        short_id: shortUrlId
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }
        response.short_id = shortUrlId;
        response.short_url = generateShortUrl(shortUrlId);
        return res.send(response);
      });
    }
  });
});

app.get('/:short_id', function(req, res){

  var shortUrlId = req.params.short_id;

  // check if url already exists in database
  Url.findOne({short_id: shortUrlId}, function (err, doc){
    if (doc) {
      return res.redirect(doc.long_url);
    } else {
      return res.redirect(config.webhost);
    }
  });
});

module.exports = app
