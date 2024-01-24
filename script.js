
// DOM Declaration
const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

//hide the controls bar in 3s
const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();
//when moving the mouse the control barr will appear for 3s
container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});
//this function format the time make it appear in this format >>
const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    //if seconds are less then 10s then the seconds will have '0s'
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    //if minutes are less then 10m then the minutes will have '0m'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    //if hours are less then 10h then the hours will have '0h'
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        //if the video is less then 60mns then the time will appear mm:ss
        return `${minutes}:${seconds}`
    }
        //else the time will appear hh:mm:ss

    return `${hours}:${minutes}:${seconds}`;
}
//this EventListener call a function that allows show you the video properties (duration/progressbar position)
videoTimeline.addEventListener("mousemove", e => {
    //calculating the width of the videoTimeline div
    let timelineWidth = videoTimeline.clientWidth;
    //getting the position of the mouse click
    let offsetX = e.offsetX;
    
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    //change the offsetX value to make it be reasonable when changing the progressTime position
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    //changing the progressTime position
    progressTime.style.left = `${offsetX}px`;
    //changing the progressTime text
    progressTime.innerText = formatTime(percent);
});
//initializing the time line properties
videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});
//update the time of the video when changed
mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});
//setting the video duration text
mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});
//this function change the video properties when it's called
const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}
//this function make the video mute or unmute it when the volume button clicked /it change also the icon of the volume button
volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});
//this function update the volume slider position and value and it change the icon when the volume is muted
volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});
//change visually the selection of the speed option
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

//make the video full screen
fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});
//show the speed option when the speed button is clicked
speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
//skip backward for 5s when the skip button backward is clicked
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
//skip forward for 5s when the skip button forward is clicked
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);
//change the icon of the playPauseBtn button to pause when it's clicked and the video is not running
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
//change the icon of the playPauseBtn button to play when it's clicked and the video is running
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
//when the playPauseBtn is clicked this function pause the video if it is running and play it when it is not
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
//when the user click on somewhere on the videoTimeline and keep moving this function change the progress bar information
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
//when the user stop clicking on the mouse it rstop the event mousemove called in the other eventlistener
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));