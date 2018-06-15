var helper = require('./helper')
  , expect = require('expect.js')
  , nanoid = require('nanoid')
  , config = require('../config');

describe('Test Node Url Shortener - RESTful API', function () {
  var id;
  var longUrl = 'https://routific.com/' + nanoid(10)

  it('should POST /api/v1.0/shorten', function (done) {
    helper.api('post', '/api/v1.0/shorten')
      .send({
        long_url: longUrl
      })
      .expect(200)
      .end(function(_, res) {
        var data = res.body;
        expect(data).to.an('object');
        expect(data).not.to.be.empty();
        expect(data).to.have.keys('short_id', 'long_url', 'short_url');
        id = data.short_id;
        done();
      });
  });

  it('should return same link on second POST /api/v1.0/shorten', function (done) {
    helper.api('post', '/api/v1.0/shorten')
      .send({
        long_url: longUrl
      })
      .expect(200)
      .end(function(_, res) {
        expect(res.body.short_id).to.equal(id);
        done();
      });
  });

  it('should redirect GET /:short_id', function(done){
    helper.api('get', '/' + id)
      .expect(301)
      .end(function(_, res) {
        var header = res.header
        expect(header).to.an('object');
        expect(header).not.to.be.empty();
        expect(header).to.have.keys('location');
        expect(header.location).to.equal(longUrl);
        done();
      })
  });

  it('GET /:short_id should redirect to homepage if short ID not found', function(done){
    helper.api('get', '/' + nanoid(10))
      .expect(301)
      .end(function(_, res) {
        var header = res.header
        expect(header).to.an('object');
        expect(header).not.to.be.empty();
        expect(header).to.have.keys('location');
        expect(header.location).to.equal(config.webhost);
        done();
      })
  });
})
