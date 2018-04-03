var request = require('supertest');
var Api = require('../api');

var server = Api.listen()
var api = function(verb, path) {
  var requestPromise = request.agent(server)[verb](path)
    .set('Accept', 'application/json')
  return requestPromise;
};


//
// function startApp(done) {
//   if (api == undefined) {
//     var server = Api.listen(3001, function() {
//       api = function(verb, path) {
//         var requestPromise = request(server)[verb](path)
//           .set('Accept', 'application/json')
//         return requestPromise;
//       }
//       console.log('api', api);
//       done();
//     });
//   }
//   else {
//     done();
//   }
// }

module.exports = {
  api: api,
}
