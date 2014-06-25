$(document).ready(function() {
    $('#updateUserSubmit').on('click', 'a.deleteUser', deleteUser);

    if ($('table'.length)) {
        $('table').floatThead();

        $(window).scroll(function() {
            var table = $('table');
            var windowOffset = table.offset().top - $(window).scrollTop();

            if (table.isOnScreen()) {
                if (windowOffset < 1) {
                    console.log('if');
                    $('.legend').addClass('pinned');
                } else {
                    console.log('else');
                    if ($('.legend').hasClass('pinned')) {
                        $('.legend').removeClass('pinned');
                    }
                }
            }
        });
    }
});

$.fn.isOnScreen = function(){
    
    var win = $(window);
    
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
    
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    
};

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