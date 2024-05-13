// Buat objek pemutar YouTube
var player;
// var durasi;
// var loop = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'NN4jTi23UlY', // Ganti VIDEO_ID dengan ID video YouTube yang ingin Anda embed
        playerVars: {
            autoplay: 1, // Autoplay video
            mute: 1 // Muted autoplay
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Panggil fungsi onYouTubeIframeAPIReady() ketika API YouTube siap

function onPlayerReady(event) {
    // Dapatkan informasi video setelah pemutar siap
    durasi = player.getDuration(); // Mendapatkan durasi video dalam detik
    // console.log('Durasi video:', duration);
    // durasi['d'] = duration;
    // player.playVideo();
    // console.log(durasi['d']);
    $('#first').attr('hidden', true);
}

function onPlayerStateChange(event) {
    // Perubahan status pemutar YouTube
    // Tambahkan logika tambahan jika diperlukan
}