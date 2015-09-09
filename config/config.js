var settings = require('./config.json');

var dev = {};
var production = {};
var env = process.env.NODE_ENV;

function configure(node_env) {
  var env = {};
  var api_root_url;
  var db;
  var root_url;

  var api_version = settings.api.v;
  var db_stem = settings.api.db.stem;

  if (node_env !== 'production') {
    api_root_url = settings.api.stem + settings.api.url.dev + ":" + settings.api.port.dev;
    db = db_stem + process.env.USER + ":" + process.env.PW + "@" + settings.api.db.host.dev + ':' + settings.api.port.dev + '/' + settings.api.db.name.dev;
    root_url = settings.app.stem + settings.app.url.dev + ":" + settings.app.port.dev
  } else {
    api_root_url = settings.api.stem + settings.api.url.production;
    db = db_stem + process.env.USER + ":" + process.env.PW + "@" + settings.api.db.host.production + '/' + settings.api.db.name.production;
    root_url = settings.app.stem + settings.app.url.production;
  }

  env.api_root_url = api_root_url;
  env.db = db;
  env.root_url = root_url;
  console.log(env);
  return env;
}

module.exports = function(){
  switch(env){
    case 'development':
      return configure('development');

    case 'production':
      return configure('production');

    default:
      console.log('no environment specified; defaulting to development');
      return configure('development');
  }
};
