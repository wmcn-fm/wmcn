$(document).ready(function() {

    // $('.playlist').each(function (i) {
    //     var colors = ['#bdbdbd', '#ff8900', '#086fa1', '#a31010'];
    //     var color = colors[i];
    //     $(this).css('background-color', color);
    // });

    

    $('#nav').affix({
        offset: {
            top: $('.logo-main').height()
        }
    });

    $('.streamButton').click(function() {
        $(this).toggleClass('pressed');
        if (playPauseCount %2 == 0) {
            playStream();
        } else {
            pauseStream();
        }
        playPauseCount++;
    });

    $('#schedule').popover();
    $('.popover-dismiss').popover({
      trigger: 'focus'
    });
    $('#updateUserSubmit').on('click', 'a.deleteUser', deleteUser);

    $('.main-content').each(function(i) {
        var w = $(this).width();
        $(this).css({
            'height': w + 'px'
        });
    });

    // if ($('table'.length)) {
    //     $('table').floatThead();
    // }

    $('.timeslotSelector').each(function (i) {
        $(this).attr('id', i);
    });

    $('.timeslotSelector').click(function() {
        var timeId = $(this).attr('id');
        console.log(timeId);
        if ($(this).is(':checked')) {
            availableSlots.push(timeId);
            console.log(availableSlots);
        } else {
            var index = availableSlots.indexOf(timeId);
            console.log(index);
            if (index > -1) {
                availableSlots.splice(index, 1);
            }
            console.log(availableSlots);
        }
    });

});

var playPauseCount = 0;

var availableSlots = [];

function playStream() {
    document.getElementById('streamPlayer').play();
}

function pauseStream() {
    document.getElementById('streamPlayer').pause();
}

function deleteUser(event) {
    event.preventDefault();

    var confirmation = confirm('are you sure you want to delete this user?');

    if (confirmation == true) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg !== '') {
                alert('error: ' + reponse.msg);
            } 
        });
    } else {
        return false;
    }
};