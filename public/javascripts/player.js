$(document).ready(function() {
  var playPauseCount = 0;

  $('#toggleStream').click(function() {
    if (playPauseCount %2 == 0) {
      playStream();
    } else {
      pauseStream();
    }
    playPauseCount++;
  });
})

function playStream() {
    document.getElementById('stream').play();
    $('#toggleStream').find('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
}

function pauseStream() {
    document.getElementById('stream').pause();
    $('#toggleStream').find('span').removeClass('glyphicon-pause').addClass('glyphicon-play');

}
