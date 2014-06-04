$(document).ready(function() {

  //identify each element in the table by its owner, category/type...
  $('#edit').on('click', function() {
  	console.log('shit is popping!');
  	$('.editable').toggleClass('live');
  });

});