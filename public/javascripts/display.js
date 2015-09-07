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
    $(this).text(parsed);
  });

  $('.timeslot.timeSince').each(function(i) {
    var timeslot = $(this).text();
    var start = sinceTimeslot(timeslot);
    var $this = $(this);
    setInterval(function () {
      var date = new Date();
      var timeElapsed = '';
      var hoursElapsed = date.getHours() - start.getHours();
      if (hoursElapsed && hoursElapsed < 10 && hoursElapsed > 1) hoursElapsed = "0" + String(hoursElapsed);
      if (hoursElapsed) timeElapsed += hoursElapsed + ':';
      var minsElapsed = date.getMinutes() - start.getMinutes();
      if (minsElapsed < 10) minsElapsed = "0" + String(minsElapsed);
      var secondsElapsed = date.getSeconds() - start.getSeconds();
      if (secondsElapsed < 10) secondsElapsed = "0" + String(secondsElapsed);
      timeElapsed += minsElapsed + ':' + secondsElapsed;
      $this.text(timeElapsed);
    }, 1000);
  });

  $('.timeslot.timeUntil').each(function(i) {
    var timeslot = $(this).text();
    var start = sinceTimeslot(timeslot);
    var $this = $(this);
    setInterval(function () {
      var date = new Date();
      var timeUntil = '';
      var hoursUntil = start.getHours() - date.getHours() - 1;
      if (hoursUntil && hoursUntil < 10) hoursUntil = "0" + String(hoursUntil);
      if (hoursUntil) timeUntil += hoursUntil + ':';
      var minsUntil = 60 - date.getMinutes();
      if (minsUntil < 10) minsUntil = "0" + String(minsUntil);
      var secondsTil = 60 - date.getSeconds();
      if (secondsTil < 10) secondsTil = "0" + String(secondsTil);
      timeUntil += minsUntil + ':' + secondsTil;
      $this.text(timeUntil);
    }, 1000);
  })

  $(function () {
    $('[data-toggle="popover"]').popover();
  });
});

Date.prototype.setDay = function(dayOfWeek) {
    this.setDate(this.getDate() - this.getDay() + dayOfWeek);
};

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
  return days[day] + ', ' + hour;
}

function sinceTimeslot(timeslot) {
  var day = timeslot % 7;
  var hour = (timeslot - day) / 7;
  var today = new Date()
  today.setHours(hour);
  today.setDay(day);
  today.setMinutes(0);
  today.setSeconds(0);
  return today;
}
