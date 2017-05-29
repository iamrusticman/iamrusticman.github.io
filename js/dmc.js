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
    videoPlayer = $("#videoPlayer")[0];
    videoPlayer["src"] = "#";
    $("#videoPlayer").hide();
}

function initPlayer(index)
{
    track = window.tracks[index];
    
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
        $("#videoPlayer").show();
        $(".playerLabel").show(500);

        if (index >= 0) 
        {
            setTimeout(function(){ playTrack(index + 1); }, videoDuration * 1000);
        }
    }
}