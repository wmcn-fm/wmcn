$(document).ready(function() {

  var live;

  $('#edit').on('click', function() {
  	//console.log('shit is popping!');
  	$('.editable').toggleClass('live');
  	live = $('.live');

  });


  $('td').on('click', function() {
  	if ($(this).hasClass('live')) {
  		var cellData = $(this).text();
	  	//console.log(cellData);
	  	//console.log('clicked!');
	  	

  	}
  	
  });

});