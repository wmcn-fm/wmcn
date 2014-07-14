$(document).ready(function() {

	$('.userId').each(function (i) {
		var text = $(this).text();
		var link = "<a href='/admin/users/" + text + "'>" + text + "</a>";
		$(this).text('').append(link);
	});

	$('input, textarea').change(function() {
		$('.updateButton').css('display', 'inline');
	});

	$('.triggerUpdate').on('click', function() {
		$('.updateButton, .app-updateButton').css('display', 'inline');
	});

	$('.appApproval').each(function (i) {
		var toggle = "<input class='approveApp' type='checkbox'>"
		$(this).text('').append(toggle);

	});

	$('.approveApp').on('click', function() {
		if ($(this).is(':checked')) {
			var userId = $(this).parent().siblings('.userId').text();
			successApps.push(userId);
		};
	})

	$('.app-updateButton').on('click', function(e) {
		e.preventDefault();
		console.log('updateButton clicked');
		$.post('http://localhost:3000/admin/applicants/dj', {data : successApps}, function (response) {
			console.log(response.redirect);
		});
	});

});	//end ready

var successApps = [];
