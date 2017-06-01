$(document).ready(function()
{
    window.tracks = $(".track").toArray().reverse();
    window.currentVideoPlayer = 1;
    window.currentVideoIndex = 0;
    initializeEvents();
});

function showFullChart()
{
    $(".trackPosition").removeClass("off").addClass("on");
    $(".trackArtistTitle").removeClass("off").addClass("on");
    $(".trackCover").removeClass("off").addClass("on");
    $(".trackOptions").removeClass("off").addClass("on");
    $(".trackPeak").removeClass("off").addClass("on");
    $(".trackLast").removeClass("off").addClass("on");
    $(".trackWeeks").removeClass("off").addClass("on");
}

function playThatChart()
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    window.scrollTo(0,document.body.scrollHeight);
    playTrack(0);
}

function playTrack(index, full = false)
{
    window.currentVideoIndex = index;
    scrollPage(index);
    setTimeout(loadTrack(index, full), 0);
}

function scrollPage(index)
{
    window.scrollTo(0,document.body.scrollHeight - 180 - 60 * (index + 1));
}

function clearPlayerLabel()
{
    $(".playerLabel").hide();
}

function displayPlayer(index)
{
    $("#videoPlayer" + window.currentVideoPlayer).show().css('visibility', 'visible');
    window.currentVideoPlayer = window.currentVideoPlayer === 1 ? 2 : 1;
    $("#videoPlayer" + window.currentVideoPlayer).hide();
    var videoPlayer = $("#videoPlayer" + window.currentVideoPlayer)[0];
    videoPlayer["src"] = "about:blank";
    
    setPlayerLoaded();
}

function scrollPlayer(index)
{
    var playerHeight = ((window.tracks.length - index) * 60) + 25;
    var playerContainer = $(".playerContainer")[0];
    playerContainer.style["margin-top"] = playerHeight;
    if (document.body.scrollHeight < playerHeight + 300) {
        window.scrollTo(0,document.body.scrollHeight);
    }
    else {
        scrollPage(index);
    }
}

function loadTrack(index, full = false)
{
    var track = window.tracks[index];
    $(track).addClass("current");

    scrollPlayer(index);
    
    var trackPosition = $(track).find(".trackPosition");
    var number = trackPosition.text();
    var direction = hasClass(trackPosition[0], "up") ? "up" 
                    : (hasClass(trackPosition[0], "down") ? "down"
                    : (hasClass(trackPosition[0], "eq") ? "eq"
                    : "entry"));
    $(".playerPosition").text(number).removeClass("up").removeClass("down").removeClass("eq").removeClass("entry").addClass(direction);

    var artist = $(track).find(".trackArtist").text();
    $(".playerArtist").text(artist);
    var title = $(track).find(".trackTitle").text();
    $(".playerTitle").text(title);

    var videoUrl = track.getAttribute("data-videourl");
    var videoDuration = parseInt(track.getAttribute("data-videoduration"));
    videoDuration = videoDuration === NaN ? 18 : videoDuration;
    var videoPlayer = $("#videoPlayer" + currentVideoPlayer)[0];
    videoPlayer["src"] = processVideoUrl(videoUrl, full);
    clearPlayerLabel();

    var onLoadHandler = registerEvent();
    videoPlayer.onload = function() 
    {
        if (videoPlayer["src"] === "about:blank") return;
        if (!isActiveEvent(onLoadHandler)) return;

        var initHandler = registerEvent();
        setTimeout(function() {
            if (!isActiveEvent(initHandler)) return;

            displayPlayer(index);

            if (full) return;            
            var afterPlayHandler = registerEvent();
            setTimeout(function() { 
                if (!isActiveEvent(afterPlayHandler)) return;

                clearCurrentTrack();
                if (index < window.tracks.length) {
                    playTrack(index + 1); 
                }
            }, videoDuration * 1000);
        }, 1500);

        var labelHandler = registerEvent();
        setTimeout(function() {
            if (!isActiveEvent(labelHandler)) return;

            showTrackLabel(track);
        }, 2500);
    }
}

function showTrackLabel(track)
{
    var trackPosition = $(track).find(".trackPosition");
    trackPosition.removeClass("off").addClass("on");
    var trackArtistTitle = $(track).find(".trackArtistTitle");
    trackArtistTitle.removeClass("off").addClass("on");
    var trackCover = $(track).find(".trackCover");
    trackCover.removeClass("off").addClass("on");
    var trackPeak = $(track).find(".trackPeak");
    trackPeak.removeClass("off").addClass("on");
    var trackLast = $(track).find(".trackLast");
    trackLast.removeClass("off").addClass("on");
    var trackWeeks = $(track).find(".trackWeeks");
    trackWeeks.removeClass("off").addClass("on");
    var trackOptions = $(track).find(".trackOptions");
    trackOptions.removeClass("off").addClass("on");

    $(".playerLabel").show();
}

function playTrackFromLink(linkElement)
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    setPlayerLoading();
    var track = linkElement.parentElement.parentElement;
    var index = window.tracks.indexOf(track);
    playTrack(index, true);
}

function goToPreviousTrack()
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    setPlayerLoading();
    playTrack(window.currentVideoIndex - 1);
}

function goToNextTrack()
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    setPlayerLoading();
    playTrack(window.currentVideoIndex + 1);
}

function pauseVideo()
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    $("#pausePlayLink").text(">");
    $("#pausePlayLink")[0].setAttribute("href", "javascript:playVideo()");
}

function pauseCurrentPlayer()
{
    var videoPlayerIndex = window.currentVideoPlayer === 1 ? 2 : 1;
    $("#videoPlayer" + videoPlayerIndex).css('visibility', 'hidden');
    var videoPlayer = $("#videoPlayer" + videoPlayerIndex)[0];
    videoPlayer["src"] = "about:blank";
}

function playVideo()
{
    setPlayerLoading();
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    playTrack(window.currentVideoIndex);
    $("#pausePlayLink").text("||");
    $("#pausePlayLink")[0].setAttribute("href", "javascript:pauseVideo()");
}

function setPlayerLoading()
{
    $(".playerContainer")[0].style.backgroundImage = "url('images/spinner.gif')";
}

function setPlayerLoaded()
{
    $(".playerContainer")[0].style.backgroundImage = "";
}

function clearCurrentTrack()
{
    var track = window.tracks[window.currentVideoIndex];
    $(track).removeClass("current");
}

function initializeEvents()
{
    window.currentEvents = [];
    window.eventSeed = 0;
}

function registerEvent()
{
    window.currentEvents.push(window.eventSeed);
    var handler = window.eventSeed;
    window.eventSeed = window.eventSeed + 1;    
    return handler;
}

function cancelAllEvents()
{
    window.currentEvents = [];
}

function isActiveEvent(handler)
{
    return window.currentEvents.indexOf(handler) !== -1;
}

function hasClass(element, cls) 
{
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function processVideoUrl(url, full = false)
{
    if (!full) return url;
    return url.substring(0, url.indexOf('?')) + '?autoplay=1';
}