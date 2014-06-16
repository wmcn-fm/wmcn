$(document).ready(function() {

	$('#edit').on('click', function() {
		//console.log('shit is popping!');
		$('.editable').toggleClass('live');

	});

/*
	$('td').on('hover', function() {
		if ($(this).hasClass('live')) {
			$(this).css('background-color', 'yellow');
		};
	});
*/

	$('td').on('click', function() {
		if ($(this).hasClass('live')) {
			var cellData = $(this).text();
		  	//console.log(cellData);
		  	//console.log('clicked!');
		  	$(this).replaceWith(createInput(cellData));
		}	
	});

});

function createInput(placeholder) {
	return "<input type='text' class='form-control' type='text' placeholder='" + placeholder + "'>";
}