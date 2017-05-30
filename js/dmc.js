$(document).ready(function()
{
    window.tracks = $(".track").toArray().reverse();
    currentVideoPlayer = 1;
});

function startChartTour()
{
    window.scrollTo(0,document.body.scrollHeight);

    playTrack(0);
}

function playTrack(index)
{
    clearPlayer();
    scrollPage(index);
    setTimeout(initPlayer(index), 0);
}

function scrollPage(index)
{
    window.scrollTo(0,document.body.scrollHeight - 50 - 60 * (index + 1));
}

function clearPlayer()
{
    $(".playerLabel").hide();
}

function switchPlayer(index)
{
    playerHeight = ((window.tracks.length - index) * 60) + 25;
    playerContainer = $(".playerContainer")[0];
    playerContainer.style["margin-top"] = playerHeight;
    if (document.body.scrollHeight < playerHeight + 300) {
        window.scrollTo(0,document.body.scrollHeight);
    }
    else {
        window.scrollTo(0,document.body.scrollHeight - 50 - 60 * (index + 1));
    }
    $("#videoPlayer" + currentVideoPlayer).show();
    currentVideoPlayer = currentVideoPlayer === 1 ? 2 : 1;
    console.log("Now currentvideoplayer is " + currentVideoPlayer);
    $("#videoPlayer" + currentVideoPlayer).hide();
    videoPlayer = $("#videoPlayer" + currentVideoPlayer)[0];
    videoPlayer["src"] = "about:blank";
}

function initPlayer(index)
{
    track = window.tracks[index];
    $(track).addClass("current");
    
    trackPosition = $(track).find(".trackPosition");
    number = trackPosition.text();
    direction = trackPosition[0].getAttribute("data-direction");
    $(".playerPosition").text(number).removeClass("up").removeClass("down").addClass(direction);

    artist = $(track).find(".trackArtist").text();
    $(".playerArtist").text(artist);
    title = $(track).find(".trackTitle").text();
    $(".playerTitle").text(title);

    videoUrl = track.getAttribute("data-videourl");
    videoDuration = parseInt(track.getAttribute("data-videoduration"));
    videoDuration = videoDuration === NaN ? 18 : videoDuration;
    videoPlayer = $("#videoPlayer" + currentVideoPlayer)[0];
    videoPlayer["src"] = videoUrl;

    videoPlayer.onload = function() 
    {
        if (videoPlayer["src"] === "about:blank") return;
        console.log("onload");

        setTimeout(function() {
            switchPlayer(index);
            setTimeout(function() { 
                $(track).removeClass("current"); 
                if (index < window.tracks.length) {
                    playTrack(index + 1); 
                }
            }, videoDuration * 1000);
        }, 1500);

        setTimeout(function() {
            showTrackLabel(index);
        }, 2500);
    }
}

function showTrackLabel(index)
{
    trackPosition = $(track).find(".trackPosition");
    trackPosition.removeClass("off").addClass("on");
    trackArtistTitle = $(track).find(".trackArtistTitle");
    trackArtistTitle.removeClass("off").addClass("on");
    trackCover = $(track).find(".trackCover");
    trackCover.removeClass("off").addClass("on");
    trackPeak = $(track).find(".trackPeak");
    trackPeak.removeClass("off").addClass("on");
    trackLast = $(track).find(".trackLast");
    trackLast.removeClass("off").addClass("on");
    trackWeeks = $(track).find(".trackWeeks");
    trackWeeks.removeClass("off").addClass("on");
    
    $(".playerLabel").show(500);
}