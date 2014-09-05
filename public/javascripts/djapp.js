$(document).ready(function() {
	var availableSlots = [];

	$('.timeslotSelector').click(function() {
		var timeId = $(this).attr('id');
		console.log(timeId);
		if ($(this).is(':checked')) {
			availableSlots.push('x');
			console.log(availableSlots);
		}
	});
});