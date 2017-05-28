$(document).ready(function()
{
    window.tracks = $(".track").toArray().reverse();
});

function startChartTour()
{
    playTrack(tracks.length-1);
}

function playTrack(index)
{
    track = window.tracks[index];
    videoUrl = track.getAttribute("data-videourl");
    videoPlayer = $("#videoPlayer")[0];
    videoPlayer["src"] = videoUrl;
}