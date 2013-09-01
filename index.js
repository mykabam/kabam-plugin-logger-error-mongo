var colors = require('colors');
exports.name = 'kabamPluginLoggerHttpMongo';

exports.model = {
  'httpErrorLog':function(kabam){

  var httpErrorLogSchema = new kabam.mongoose.Schema({
    "timestamp": {type: Date, default: new Date()},
    "duration": {type: Number, min: 1},
    "method": {type: String, match: /GET|POST|PUT|DELETE|OPTIONS/i},
    "ip": String,
    "uri": {type: String, match: /\/.*/},
    "username": {type: String, default: null},
    "email":  {type: String, default: null}
    "error": String
  });

  httpErrorLogSchema.index({
    timestamp: 1,
    ip: 1,
    uri: 1,
    username: 1
  });

  return kabam.mongoConnection.model('httpErrorLog', httpErrorLogSchema);
  }
};

exports.app = function(kabam){
  kabam.on('error', function(error){
    error.error = JSON.stringify(error.error, null, 2);
    kabam.model.httpErrorLog.create(error,function(err,errorLogged){
      if(err) throw err;
      console.log('***HTTP ERROR***'.red);
      console.log(errorLogged);
      console.log('***HTTP ERROR***'.red);
      console.error(errorLogged);
    });
  });
};
