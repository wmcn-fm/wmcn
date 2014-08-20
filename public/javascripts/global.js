$(document).ready(function() {

    $('.playlist').each(function (i) {
        var colors = ['#bdbdbd', '#ff8900', '#086fa1', '#a31010'];
        var color = colors[i];
        $(this).css('background-color', color);
    });

    $('#schedule').popover();
    $('.popover-dismiss').popover({
      trigger: 'focus'
    });
    $('#updateUserSubmit').on('click', 'a.deleteUser', deleteUser);

    if ($('table'.length)) {
        $('table').floatThead();
    }

});

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