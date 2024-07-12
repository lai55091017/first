function toggleAudio(audioid, buttonid) {
    var audioElement = document.getElementById(audioid);
    var buttonElement = document.getElementById(buttonid);

    if (audioElement.paused) {
        audioElement.play();
        buttonElement.src = "/img/pause.png";  // 修改為暫停圖標
        buttonElement.alt = "Pause";
    } else {
        audioElement.pause();
        buttonElement.src = "/img/play.png";  // 修改為播放圖標
        buttonElement.alt = "Play";
    }
}
