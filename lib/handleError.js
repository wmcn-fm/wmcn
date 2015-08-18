

var handleError = function(err, res) {
  console.log('hello from handle error: here is thet error\n')
  console.log(err);
  res.render('error', {
      message: err.message,
      error: err
  });
}





module.exports = handleError;
