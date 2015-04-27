$(document).ready(function() {

  alignNav();
  $(window).resize(function() {
    alignNav();
  });

  //  convert ISO 8601 to "from now"
  $('.dateFromNow').each(function(i) {
    var hours = moment($(this).text()).fromNow();
    $(this).text(hours);
  }); 
});


function alignNav() {
  var height = $( window ).height() - ($('#main-nav').height() + 7);
  $('#header, #clear').css({"height": height});
}