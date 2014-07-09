$(document).ready(function() {

	$('.userId').each(function (i) {
		var text = $(this).text();
		var link = "<a href='/admin/users/" + text + "'>" + text + "</a>";
		$(this).text('').append(link);

	});

	$('input, textarea').change(function() {
		$('.updateButton').css('display', 'inline');
	});

	$('.appApproval').each(function (i) {
		var toggle = "<input class='approveApp' type='checkbox'>"
		$(this).text('').append(toggle);

	});

	

	$('.approveApp').on('click', function() {
		if ($(this).is(':checked')) {
			var userId = $(this).parent().siblings('.userId').text();
			approveApplicant(userId);
		};
	})

});	//end ready


function approveApplicant(id) {
	console.log('checked!' + id);
	
}