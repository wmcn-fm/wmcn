$(document).ready(function() {
  $('input[name="selectedTimeslot"]').on('input', function() {
    var input = $(this).val();
    var appid = $(this).data('appid');
    var ts = parseInt(input);
    var valid = 0 <= ts && ts <= 167 && ts !== NaN;
    var submitButton = $('button[data-appid="'+appid+'"]');
    submitButton.prop('disabled', !valid);
  }).on('change', function() {
    var input = $(this).val();
    var appid = $(this).data('appid');
    var ts = parseInt(input);
    var valid = 0 <= ts && ts <= 167 && ts !== NaN;
    var submitButton = $('button[data-appid="'+appid+'"]');
    submitButton.prop('disabled', !valid);
  });
});
