// Support down to IE9.

// Device is set via a server detection script
// Just emulated here:
var device = window.innerWidth >= 600 ? "desktop" : "mobile";
//device = "mobile";

// I don't know how to get this function out of the global scope! - Help anyone?
function onYouTubePlayerAPIReady() {
  videoHeader.onYouTubePlayerAPIReady();
}


var videoHeader = (function () {

  if (device === "mobile") {return;}

  var video_iframe_id = "video_iframe";
  var video_iframe = document.getElementById(video_iframe_id);
  if (!video_iframe) {return;}

  var video_staticBg = document.getElementById("video_staticBg");
  if (!video_staticBg) {return;}

  var videos = [
    {
      videoId: "UPkMkIOzej8",
      startSeconds: 0,
      endSeconds: 9.3, // May need to adjust animation timing too
      suggestedQuality: "large"
    }
    // Will handle more videos defined here
  ];

  var noOfVideos = videos.length;
  var currentVideo = 0;

  var player;
  var isPaused = false;

  var playerDefaults = {
    autoplay: 0,
    autohide: 1,
    modestbranding: 0,
    rel: 0,
    showinfo: 0,
    controls: 0,
    disablekb: 1,
    enablejsapi: 0,
    iv_load_policy: 3
  };


  var embedScripts = (function () {

    // Append YouTube iframe video API
    // Calls onYouTubePlayerAPIReady() in the global scope when ready

    var videoScript = document.createElement("script");
    videoScript.setAttribute("async", true);
    videoScript.src = "https://www.youtube.com/player_api";
    document.head.appendChild(videoScript);

  })();


  function playVideo () {
    if (!isPaused) {
      // console.log("Playing: " + currentVideo);
      player.loadVideoById(videos[currentVideo]);
      if (videos[currentVideo].startSeconds > 0) {
        player.seekTo(videos[currentVideo].startSeconds);
      }
    }
  }


  function onPlayerStateChange(e) {

    requestAnimationFrame(function() {
      
// Sequence appears to be:
// -1
//  3
// -1
//  3
//  1

//  2
//  0
// -1
//  0

      switch (e.data) {
          
        case -1 : {break;} // Unstarted

        case 0 : { // Video has ended
          
          video_iframe.classList.remove("-js-active");
          video_staticBg.classList.remove("-js-hidden");

          playVideo();
          break;
        }
        
        case 1 : { // Video is playing

          video_iframe.classList.add("-js-active");
          video_staticBg.classList.add("-js-hidden");

          // Increment ready for the next video
          currentVideo = (currentVideo === videos.length - 1) ? 0 : currentVideo + 1;
          break;
        }
        
        case 2 : {break;} // Video is paused
        case 3 : {break;} // Video is buffering
        case 4 : {break;} // Unknown
        case 5 : {break;} // Video is queued
      }

    });

  }


  function onPlayerReady() {
    player.loadVideoById(videos[currentVideo]);
    player.mute();
  }


  function onYouTubePlayerAPIReady() {

    // Called from globally scoped function of the same name.
    player = new YT.Player(video_iframe_id, {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      },
      playerVars: playerDefaults
    });
  }



// The play / pause button

  function toggleVideoPause(e) {

    var btn = e.target;
    var video_staticBg = document.querySelector(".video_staticBg");
    if (!btn || !video_staticBg) {return;}

    var txt = btn.getAttribute("aria-label");
    var isPlaying = txt.match("Pause");

    requestAnimationFrame(function () {

      if (isPlaying) {

        video_staticBg.classList.add("-js-paused");
        btn.setAttribute("aria-label", txt.replace("Pause", "Play"));
        player.pauseVideo();
        btn.querySelector("use").setAttributeNS("http://www.w3.org/1999/xlink", "href", "#icon-play");
        isPaused = true;

      } else {

        btn.setAttribute("aria-label", txt.replace("Play", "Pause"));
        player.playVideo();
        btn.querySelector("use").setAttributeNS("http://www.w3.org/1999/xlink", "href", "#icon-pause");
        isPaused = false;
        video_staticBg.classList.remove("-js-paused");

      }

    });
  }

  var video_btn = document.querySelector(".video_btn");
  if (video_btn) {
    video_btn.addEventListener("click", toggleVideoPause, false);
  }



// Adjust width and height of the iframe to accomodate content height and aspect ratio.

  function aspectRatio() {

    var video_column_center = document.getElementById("video_column_center");
    var video = document.querySelector(".video");
    if (!video_column_center || !video) {return;}

    var contentHeight = video_column_center.clientHeight;

    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var videoW = screenW;
    var videoH = screenH;

    // Ensure video height is larger than the content column
    if (screenH <= contentHeight) {
      screenH = contentHeight + 48; // 48 = 16px * 3 === 1.5rem padding top and bottom // Assumption!!!
      video.setAttribute("style", "min-height: " + screenH + "px");
    }

    if (screenH * 16 / 9 < screenW) {
      videoW = screenW;
      videoH = screenW * 9 / 16;
    } else {
      videoW = screenH * 16 / 9;
      videoH = screenH;
    }

    return {w: videoW, h: videoH};
  }

  // The video aspect ratio closest to full-screen
  function setVideoBlockSize() {
    var AR = aspectRatio();
    video_iframe.setAttribute("style", "width: " + AR.w + "px; height: " + AR.h + "px;");
    video_iframe.parentElement.setAttribute("style", "width: " + AR.w + "px; height: " + AR.h + "px;");
  }

  setVideoBlockSize();
  window.addEventListener("resize", setVideoBlockSize, false); // Add a debounce!



  // Reduce motion
  // if (window.matchMedia("prefers-reduced-motion").matches) {
  //   toggleVideo();
  // }
  
  return {
    onYouTubePlayerAPIReady: onYouTubePlayerAPIReady
  }

})();