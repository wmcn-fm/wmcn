$(document).ready(function() {
	$('#review-carousel').hover( function() {
		$('.carousel-caption').fadeIn(400);
	}, function() {
		$('.carousel-caption').fadeOut(400);
	});
});