function playAudio(player, callback) {
    console.log(player)
    player.addEventListener("play", function () {
        callback("PLAY");
    });

    player.addEventListener("pause", function () {
        callback("PAUSE");
    });
}