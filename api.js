const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const generate = require('nanoid/generate');
const config = require('./config');
const mongoose = require('./lib/mongooseConnect');

// grab the url model
const Url = require('./models/url');

// Avoid having `_`, '-' and `@` in short IDs
// https://github.com/routific/routific-full-product/issues/2280
// https://github.com/routific/routific-full-product/issues/2368
const allowedShortIdChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const minNumChars = 8
const maxNumChars = 10

// Randomly generate the valid number of characters to be generated in short ID
// It should return either 8, 9 or 10
function getRandomNumGeneratedChars() {
  return Math.floor(Math.random() * (maxNumChars - minNumChars + 1)) + minNumChars
}

function generateShortId() {
  return generate(allowedShortIdChars, getRandomNumGeneratedChars());
}

function generateShortUrl(id) {
  return config.webhost + id;
}

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/v1.0/shorten', function(req, res){
  console.log('POST /api/v1.0/shorten');
  let longUrl = req.body.long_url;
  console.log({longUrl});

  if (!longUrl) {
    return res.status(400).send('Missing required field: long_url')
  }

  // prepend http:// to url if missing from request
  const re = new RegExp("^(http|https)://", "i");
  if (re.test(longUrl) == false) {
    longUrl = "http://"+longUrl;
  }
  let response = {
    long_url: longUrl
  };

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // the document exists, so we return it without creating a new entry
      response.short_id = doc.short_id;
      response.short_url = generateShortUrl(doc.short_id);
      console.log('url found', {response});
      return res.send(response);
    } else {
      // since it doesn't exist, let's go ahead and create it:
      const shortUrlId = config.shortIdPre + generateShortId();
      const newUrl = Url({
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
        console.log('url not found', {response});
        return res.send(response);
      });
    }
  });
});

app.get('/:short_id', function(req, res){
  console.log('GET /:short_id');

  const shortUrlId = req.params.short_id;
  console.log({shortUrlId});

  // check if url already exists in database
  Url.findOne({short_id: shortUrlId}, function (err, doc){
    if (doc) {
      console.log(`Redirecting to ${doc.long_url}`);
      return res.redirect(doc.long_url);
    } else {
      console.log(`Redirecting to ${config.webhost}`);
      return res.redirect(config.webhost);
    }
  });
});

module.exports = app
