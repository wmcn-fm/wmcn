$(document).ready(function() {
	if ($('form').length) {

		$('input').each(function() {
			var type = $(this).attr('type');
			if (type === 'text') {

				if ($(this).attr('name') === 'firstName') {
					$(this).val(Faker.Name.firstName());
				} else if ($(this).attr('name') === 'lastName'){
					$(this).val(Faker.Name.lastName());
				} else {
					$(this).val(Faker.Lorem.words());
				}

			} else if (type === 'email') {
				$(this).val(Faker.Internet.email());
			} else if (type === 'tel') {
				$(this).val(Faker.PhoneNumber.phoneNumber());
			} else if (type === 'number') {
				$(this).val(Faker.Helpers.randomNumber());
			}
		});
		$('textarea').each(function() {
			$(this).val(Faker.Lorem.sentences());
		})
	} 
	// $('form').each(function() {
	// 	console.log($(this));
	// 	$(this).filter(':input')(function() {
	// 		console.log($(this) + 'hi');
	// 	});
	// });
});