var superagent = require('superagent');
$(document).ready(function() {
  //  while viewing applications, select timeslot fills input value
  $('a.pickTimeslot').click(function(e) {
    e.preventDefault();
    var ts = $(this).data('ts');
    var app_id = $(this).parent().data('appid');
    var thisInput = $('input[data-appid="'+app_id+'"]');
    thisInput.val(thisInput.val() + ','+ ts + ',').change();
  });

  //  validate app approval
  $('form.approveApp').submit(function(e) {
    e.preventDefault();
    var app_id = $(this).data('appid');
    var submitButton = $(this).find('button.approveApp[data-appid="'+app_id+'"]');
    submitButton.button('loading');
    var timeslot = $(this).find('input[name="selectedTimeslot"][data-appId="'+app_id+'"]').val();
    superagent.post('/admin/applications/' + app_id).send({selectedTimeslot: timeslot}).end(function(error, res) {
      if (error) {
        console.log(error);
        submitButton.button('reset').text('Error').prop('disabled', true);
        error = JSON.stringify(error);
        $( makeAlert(error, 'danger') ).insertBefore($('#login'))
      } else {
        var resJson = JSON.parse(res.text);
        if (resJson['error']) {
          submitButton.button('reset').text('Error').prop('disabled', true);
          $( makeAlert(resJson['error'], 'danger') ).insertBefore($('#login'))
        } else {
          var parsed = timeslotToDate(timeslot);
          var humanReadable = [];

          var messages = [];
          for (var s in resJson.result.result.timeslot) {
            var row = resJson.result.result.timeslot[s];
            console.log(row);
            if (row.hasOwnProperty('error')) {
              console.log('errored row');
              var message = resJson.result.result.show.title + ' not scheduled for '
                            + timeslotToDate(row.error.failing_slot) +
                            ': ' + row.error.detail;
              $(makeAlert(message, 'danger')).insertBefore($('#login'));
            } else {
              var message = resJson.result.result.show.title + ' successfully scheduled for '
                            + timeslotToDate(row.timeslot);
              $(makeAlert(message, 'success')).insertBefore($('#login'));
            }
          }

          $('tr[data-appid="'+app_id+'"]').fadeOut('slow',function() {
            $(this).remove();
            var numAppsSelector = $('span.numApps');
            var numApps = parseInt(numAppsSelector.text() );
            numAppsSelector.text(numApps - 1);
          });
        }
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
  });

  $('form.clearSlot').submit(function(e) {
    e.preventDefault();
    var delButton = $(this).find('button.clearSlot');
    delButton.button('loading');
    var slot_id = delButton.data('slot');
    superagent.post('/admin/schedule/' + slot_id).end(function(err, res) {
      console.log(err, res);
      if (err) {
        console.log(err);
        var errMsg;
        if (err.hasOwnProperty('response') && err.response.hasOwnProperty('text')) {
          errMsg = err.response.text;
        } else {
          errMsg = err;
        }
        delButton.button('reset').text('Error');
        $(makeAlert(errMsg, 'danger')).insertBefore($('#login'));
      } else {
        console.log(res);
        var successMsg;
        if (res.hasOwnProperty('text')) {
          var text = JSON.parse(res.text);
          if (text.hasOwnProperty('result') && text.result === 'cleared slot ' + slot_id) {
            successMsg = text.result;
          } else {
            successMsg = text;
          }
        }
        delButton.button('reset').text('Cleared');
        $(makeAlert(successMsg, 'success')).insertBefore($('#login'));
        $('.filledSlot[data-slot="'+slot_id+'"]').fadeOut('normal', function() {
          $(this).remove();
        })
      }
      console.log('after if else!');
    }); //  end superagent post
  });
});


function makeAlert(message, type) {
  return "<div class='alert alert-dismissible alert-"+ type +"' role='alert'>\
              <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                <span aria-hidden='true'>&times;</span>\
              </button>\
              <p>"+ message + "</p>\
          </div>"
}
