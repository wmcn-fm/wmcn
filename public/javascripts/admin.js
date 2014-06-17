$(document).ready(function() {

	$('#edit').on('click', function() {
		$('.editable').toggleClass('live');
		$('#userTable').toggleClass('live');
		toggleInputs();
	});
});	//end ready

function createInput(placeholder) {
	return "<input type='text' class='form-control' type='text' placeholder='" + placeholder + "'>";
}

function toggleInputs() {
	if ($('#userTable').hasClass('live')) {

		// replace each td with an input
		$('td.live').each(function(index, element) {
			var cellData = $(element).text();
			console.log(cellData);
			$(this).text('').append(createInput(cellData));
		});

	} else {
		//find any <input> fields
		$('td.editable > input').each(function(index, element) {
			var placeholder = $(element).attr('placeholder');
			console.log('placeholder' + placeholder);
			$(this).parent().text('').append(placeholder);
		});
	}
}