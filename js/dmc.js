$(document).ready(function()
{
    window.tracks = $(".track").toArray().reverse();
});

function startChartTour()
{
    window.scrollTo(0,document.body.scrollHeight);

    playTrack(0);
}

function playTrack(index)
{
    clearPlayer();
    setTimeout(initPlayer(index), 0);
}

function clearPlayer()
{
    $("#videoPlayer").hide();
    $(".playerLabel").hide();
    videoPlayer = $("#videoPlayer")[0];
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
    videoPlayer = $("#videoPlayer")[0];
    videoPlayer["src"] = videoUrl;

    videoPlayer.onload = function() 
    {
        setTimeout(function() {
            $("#videoPlayer").show();

            if (index < window.tracks.length) 
            {
                setTimeout(function() { 
                    $(track).removeClass("current"); 
                    playTrack(index + 1); 
                }, videoDuration * 1000);
            }
        }, 1500);

        setTimeout(function() {
            showTrackLabel(index);
        }, 3000);
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