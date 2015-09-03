var fs = require('fs');

function parseJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

var parsed = parseJSON('config/editable_text.json');


module.exports = parsed;
