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
        console.log('\nnew trigger:\n');
        for (var c in parsed) {
          var char = parseInt(parsed[c]);
          console.log(char);
          if (char === NaN || char < 0 || char > 167 ) {
            console.log('bad value');
            var valid = false;
            break;
          }
        }
    } else {
      valid = false;
    }
    console.log('valid after loop:', valid);
    var submitButton = $('button.approveApp[data-appid="'+appid+'"]');
    submitButton.prop('disabled', !valid);

  }).on('change', function() {
    var rawInput = $(this).val();
    var filteredInput = rawInput.replace( /[^\d,]/g, '' );
    var appid = $(this).data('appid');
    var parsed = filteredInput.split(',');
    var ts = parseInt(filteredInput);

    var invalid = true;
    $(this).val(filteredInput);
  });
});
