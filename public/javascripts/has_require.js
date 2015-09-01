var superagent = require('superagent');
$(document).ready(function() {
  //  while viewing applications, select timeslot fills input value
  $('a.pickTimeslot').click(function(e) {
    e.preventDefault();
    var ts = $(this).data('ts');
    var app_id = $(this).parent().data('appid');
    var thisInput = $('input[data-appid="'+app_id+'"]');
    thisInput.val(ts).change();
  });

  //  validate app approval
  $('form.approveApp').submit(function(e) {
    e.preventDefault();
    var app_id = $(this).data('appid');
    var submitButton = $(this).find('button.approveApp[data-appid="'+app_id+'"]');
    submitButton.button('loading');
    var timeslot = parseInt( $(this).find('input[name="selectedTimeslot"][data-appId="'+app_id+'"]').val() );
    superagent.post('/admin/applications/' + app_id).send({selectedTimeslot: timeslot}).end(function(error, res) {
      var resJson = JSON.parse(res.text);
      if (resJson['error']) {
        submitButton.button('reset').text('Error').prop('disabled', true);
        $( makeAlert(resJson['error'], 'danger') ).insertBefore($('#login'))
      } else {
        submitButton.button('reset').text('Scheduled at slot' + resJson.result.result.timeslot).removeClass('btn-danger').addClass('btn-success');
        var parsed = timeslotToDate(timeslot);
        var humanReadable = parsed.day + ', ' + parsed.hour;
        var message = resJson.result.result.show.title + ' successfully scheduled for \
                      <span class="timeslot toDate">' + humanReadable + '</span>';
        $(makeAlert(message, 'success')).insertBefore($('#login'));
        $('tr[data-appid="'+app_id+'"]').fadeOut('normal',function() {
          $(this).remove();
          var numAppsSelector = $('span.numApps');
          var numApps = parseInt(numAppsSelector.text() );
          numAppsSelector.text(numApps - 1);
        });
      }
    }); //  end superagent.post
  });

  //  validate app deletion
  $('form.deleteApp').submit(function(e) {
    e.preventDefault();
    var delButton = $(this).find('button.deleteApp');
    delButton.button('loading');
    var app_id = delButton.data('appid');
    superagent.del('/admin/applications/' + app_id).end(function(error, res) {
      var resJson = JSON.parse(res.text);
      if (resJson['error']) {
        delButton.button('reset').text('Error');
        $( makeAlert(resJson['error'].response.text, 'danger') ).insertBefore($('#login'));
      } else {
        delButton.button('reset').text('Deleted');
        $( makeAlert(resJson['result'], 'success')).insertBefore($('#login'));
        $('tr[data-appid="'+app_id+'"]').fadeOut('normal',function() {
          $(this).remove();
          var numAppsSelector = $('span.numApps');
          var numApps = parseInt(numAppsSelector.text() );
          numAppsSelector.text(numApps - 1);
        });
      }
    });
  })
})


function makeAlert(message, type) {
  return "<div class='alert alert-dismissible alert-"+ type +"' role='alert'>\
              <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                <span aria-hidden='true'>&times;</span>\
              </button>\
              <p>"+ message + "</p>\
          </div>"
}
