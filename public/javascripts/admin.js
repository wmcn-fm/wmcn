$(document).ready(function() {

	$('.userId').each(function (i) {
		var text = $(this).text();
		var link = "<a href='/admin/users/" + text + "'>" + text + "</a>";
		$(this).text('').append(link);

	});

	$('input, textarea').change(function() {
		$('.updateButton').css('display', 'inline');
	});

});	//end ready
