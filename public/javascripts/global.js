$(document).ready(function() {

    // $('.playlist').each(function (i) {
    //     var colors = ['#bdbdbd', '#ff8900', '#086fa1', '#a31010'];
    //     var color = colors[i];
    //     $(this).css('background-color', color);
    // });
    (function() {
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = '/images/favicon.png';
        document.getElementsByTagName('head')[0].appendChild(link);
    }());
    

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
            $(this).parent().toggleClass('available-slot')
        } else {
            var index = availableSlots.indexOf(timeId);
            console.log(index);
            if (index > -1) {
                availableSlots.splice(index, 1);
                $(this).parent().toggleClass('available-slot')
            }
            console.log(availableSlots);
        }
    });

    $('#djAppSubmission').submit(function(eventObj) {
        $('<input />').attr('type', 'hidden')
            .attr('name', "availability")
            .attr('value', availableSlots)
            .appendTo($(this));
        return true;
    });

    $('.per-person1, .per-person2, .per-person3, .per-person4, .mac-affiliation1, .mac-affiliation2, .mac-affiliation3, .mac-affiliation4').hide();
    $('#1dj').click(function() {
        $('.per-person1').slideToggle();
    });
    $('#2dj').click(function() {
        $('.per-person1, .per-person2').slideToggle();
    });
    $('#3dj').click(function() {
        $('.per-person1, .per-person2, .per-person3').slideToggle();
    });
    $('#4dj').click(function() {
        $('.per-person1, .per-person2, .per-person3, .per-person4').slideToggle();
    });

    $('.mac-affil1').click(function() {
        $('.mac-affiliation1').slideToggle();
    });

    $('.mac-affil2').click(function() {
        $('.mac-affiliation2').slideToggle();
    });

    $('.mac-affil3').click(function() {
        $('.mac-affiliation3').slideToggle();
    });

    $('.mac-affil4').click(function() {
        $('.mac-affiliation4').slideToggle();
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