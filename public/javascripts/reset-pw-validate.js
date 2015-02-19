$(document).ready(function() {
	$('#newPw1, #newPw2').change(function() {
		var newPw1 = $('#newPw1').val();
		var newPw2 = $('#newPw2').val();

		if (newPw1 !== newPw2) {
			// alert(newPw1 + ', ' + newPw2 + ', are not equivalent!');
			$('p.help-block').text('passwords are not equivalent!');
		} else {
			// alert(newPw1 + newPw2 + 'are equivalent');
			$('.submitBt').prop("disabled", false);
			$('p.help-block').text('');
		}
	});
});