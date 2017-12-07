function playAudio(player, callback) {
    player.addEventListener("play", function () {
        callback("PLAY");
    });

    player.addEventListener("pause", function () {
        callback("PAUSE");
    });
}