$(document).ready(function() {

	$('#edit').on('click', function() {
		$('.editable').toggleClass('live');
		console.log('hi');
		//$('#userTable').toggleClass('live');
		$('td').each(function (i) {
			if ($(this).hasClass('live')) {
				replaceInput($(this));
			}
		});
	});

	$('td').on('click', function() {
		console.log('toggle');
		if ($(this).hasClass('live')) {
			console.log('hasclass live');
			addInput($(this));
		} else {
			console.log('else');
			replaceInput($(this));
		}
	});
});	//end ready

function createInput(placeholder) {
	return "<input type='text' class='form-control' type='text' placeholder='" + placeholder + "'>";
}

function addInput(elem) {
	$(elem).addClass('')
	console.log('adding input');
	var cellData = $(elem).text();
	$(elem).text('').append(createInput(cellData));
}

function replaceInput(elem) {
	console.log('replace');
	if ($(elem).children('input').length) {
		console.log('replace.if');
		var placeholder = $(elem).children('input').attr('placeholder');
		$(elem).text('').append(placeholder);
	}
}

function toggleInputs() {
	//var this = $(this);
	console.log('toggle');
	if ($(this).hasClass('live')) {
		console.log('hasclass live');
		addInput();
	} else {
		console.log('else');
		replaceInput();
	}

}