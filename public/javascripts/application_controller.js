$(document).ready(function() {

  //  select defaults for radio buttons
  $("input[name='num_users'][value='1']").prop('checked', true);
  $("input[name='time_pref'][value='1']").prop('checked', true);


  //  event listener for changing number of users
  $("input[name='num_users']").on('change', function() {
    var numUsers = $("input[name='num_users']:checked").val();
    updateUserInfo(numUsers);
  })
});

//  @param numUsers: number of users the form *should* contain
//  counts the number of current user form fields and adjusts it
//  to equal numUsers, by jQuery cloning or removing .userInfo
function updateUserInfo(numUsers) {
  var numUserFields = $('.userInfo').length;

  if (numUsers > numUserFields && numUserFields <= 4) {
    var diff = numUsers - numUserFields;
    while (diff > 0) {
      var clone = $('.userInfo').last().clone();
      var cloneUser = clone.find('#userNumber').text();
      var nextUser = parseInt(cloneUser) + 1;
      clone.find('#userNumber').text(nextUser);
      clone.appendTo('#userInfo');
      diff--;
    }
  }

  if (numUsers < numUserFields && numUserFields >=1) {
    var diff = numUserFields - numUsers;
    while (diff > 0) {
      $('.userInfo').last().remove();
      diff--;
    }
  }
}
