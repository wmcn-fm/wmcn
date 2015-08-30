$(document).ready(function() {

  //  convert ISO 8601 to "from now"
  $('.dateFromNow').each(function(i) {
    var hours = moment($(this).text()).fromNow();
    $(this).text(hours);
  });

  $('.date-shorthand').each(function(i) {
    var date = moment($(this).text()).format("M/D/YY");
    $(this).text(date);
  })

  $('.date').each(function(i) {
    var date = moment($(this).text()).format("MMMM D, YYYY // hA");
    $(this).text(date);
  });

  $('.timeslot.toDate').each(function(i) {
    var timeslot = $(this).text();
    var parsed = timeslotToDate(timeslot);
    var humanReadable = parsed.day + ', ' + parsed.hour;
    $(this).text(humanReadable);
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });
});

function timeslotToDate(timeslot) {
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var day = timeslot % 7;
  var hour = (timeslot - day) / 7;

  if (hour > 12) {
    hour = (hour - 12) + 'pm';
  } else if (hour === 0) {
    hour = '12am';
  } else if (hour == 12) {
    hour = '12pm';
  } else {
    hour += 'am';
  }

  return {day: days[day], hour: hour};
}
