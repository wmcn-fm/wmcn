$(document).ready(function() {
  $('input[name="selectedTimeslot"]').on('input', function() {
    var rawInput = $(this).val();
    var filteredInput = rawInput.replace( /[^\d,]/g, '' );
    var appid = $(this).data('appid');
    var parsed = filteredInput.split(',');

    var valid = true;
    $(this).val(filteredInput);
    if ($(this).val() ) {
        var parsed = $(this).val().split(',');
        for (var c in parsed) {
          var char = parseInt(parsed[c]);
          if (char === NaN || char < 0 || char > 167 ) {
            valid = false;
            break;
          }
        }
    } else {
      valid = false;
    }
    var submitButton = $('button.approveApp[data-appid="'+appid+'"]');
    submitButton.prop('disabled', !valid);

  }).on('change', function() {
    var rawInput = $(this).val();
    var filteredInput = rawInput.replace( /[^\d,]/g, '' );
    var appid = $(this).data('appid');
    var parsed = filteredInput.split(',');
    var ts = parseInt(filteredInput);
    $(this).val(filteredInput);
  });
});
