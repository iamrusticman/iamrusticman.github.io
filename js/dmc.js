$(document).ready(function()
{
    renderTracks();
    renderTracksOut();
    window.currentVideoPlayer = 1;
    window.currentVideoIndex = 0;
    initializeEvents();
});

function renderTracks()
{
    var source = $("#tracks-template").html();
    var template = Handlebars.compile(source);
    var dataUrl = getDataUrl();
    $.ajax({
        url: dataUrl,
        dataType: "json",
        success: function(response) {
            var html = template({ tracks: response.slice(0, 50) });
            $(".chartContent").html(html);
            setTimeout(function() {
                window.tracks = $(".chartContent").find(".track").toArray().reverse();
            }, 0);
        },
        error: function(request, error) {
            console.log(error);
        }
    });
}

function renderTracksOut()
{
    var source = $("#tracksOut-template").html();
    var template = Handlebars.compile(source);
    var dataUrl = getDataUrl();
    $.ajax({
        url: dataUrl,
        dataType: "json",
        success: function(response) {
            var html = template({ tracks: response.slice(50, response.length) });
            $(".tracksOutContent").html(html);
            setTimeout(function() {
                window.outTracks = $(".tracksOutContent").find(".track").toArray().reverse();
            }, 0);
        },
        error: function(request, error) {
            console.log(error);
        }
    });
}

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

function showTracksOut()
{
    $(".tracksOutContent").find(".trackOutCell").removeClass("off").addClass("on");
}

function playThatChart()
{
    cancelAllEvents();
    clearCurrentTrack();
    clearPlayerLabel();
    pauseCurrentPlayer();
    window.scrollTo(0,document.body.scrollHeight);
    showTracksOut();
    playTrack(0);
}

function playTrack(index, full = false)
{
    window.currentVideoIndex = index;
    scrollPage(index);
    setTimeout(loadTrack(index, full), 0);
}

function playOutTrack(index, full = false)
{
    window.scrollTo(0, document.body.scrollHeight);
    var playerHeight = ((window.tracks.length - index) * 60) + 70;
    var playerContainer = $(".playerContainer")[0];
    playerContainer.style["margin-top"] = playerHeight;
    setTimeout(loadTrack(index, full, true), 0);
}

function scrollPage(index)
{
    window.scrollTo(0,document.body.scrollHeight - $(".tracksOutContent")[0].clientHeight - 180 - 60 * (index + 1) - index - (70 * (60 - index) / 60));
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
    var playerHeight = ((window.tracks.length - index) * 60) + 70;
    var playerContainer = $(".playerContainer")[0];
    playerContainer.style["margin-top"] = playerHeight;
    if (document.body.scrollHeight < playerHeight + 300) {
        window.scrollTo(0,document.body.scrollHeight);
    }
    else {
        scrollPage(index);
    }
}

function loadTrack(index, full = false, out = false)
{
    var track = out ? window.outTracks[index] : window.tracks[index];
    $(track).addClass("current");

    if (!out) scrollPlayer(index);
    
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

            if (full || out) return;            
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
    if (index === -1) {
        index = window.outTracks.indexOf(track);
        playOutTrack(index, true);
    }
    else {
        playTrack(index, true);
    }
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
    var returnedUrl = url.replace("https://youtu.be/", "https://www.youtube.com/embed/")
    if (!full)
        returnedUrl = returnedUrl.replace("?t=", "?start=");
    else
        returnedUrl = returnedUrl.replace("?t=", "?xxx=");
    return returnedUrl + (returnedUrl.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
}

function getDataUrl()
{
    var day = getChartDate();
    var mm = day.getMonth() + 1; // getMonth() is zero-based
    var dd = day.getDate();
    var strDate = [day.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');

    return "../data/" + strDate + ".json";
}

function displayWeekDescription() 
{
    var day = getChartDate();
    var mm = day.getMonth() + 1; // getMonth() is zero-based
    var dd = day.getDate();
    var strDate = [(dd>9 ? '' : '0') + dd,
          (mm>9 ? '' : '0') + mm,
          day.getFullYear()
         ].join('/');

    var weekNumber = getWeekNumber(day);

    var weekDescriptionHtml = "";

    if (day >= new Date(2017, 6, 4)) {
        weekDescriptionHtml += "<span class='previousWeek'><a href='javascript:goToPreviousWeek()'><<</a></span>"
    }
    weekDescriptionHtml += "<span class='weekNumber'>Week " + weekNumber + " (" + strDate + ")</span>"
    if (day + 6 <= getToday()) {
        weekDescriptionHtml += "<span class='nextWeek'><a href='javascript:goToNextWeek()'>>></a></span>"
    }

    $(".weekDescription").html(weekDescriptionHtml);
}

function getChartDate()
{
    var day = getToday();
    if (getUrlVars()["date"] != null) {
        day = new Date(getUrlVars()["date"])
    }
    while (day.getDay() != 6) {
        day = day.addDays(-1);
    }
    return day;
}

function getWeekNumber(d) 
{
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

function goToPreviousWeek()
{
    var day = getChartDate().addDays(-7);
    var mm = day.getMonth() + 1; // getMonth() is zero-based
    var dd = day.getDate();
    var strDate = [day.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');

    document.location = document.location.href.substring(0, document.location.href.indexOf('?')) + '?date=' + strDate;
}

function goToNextWeek()
{
    var day = getChartDate().addDays(7);
    var mm = day.getMonth() + 1; // getMonth() is zero-based
    var dd = day.getDate();
    var strDate = [day.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');

    document.location = document.location.href.substring(0, document.location.href.indexOf('?')) + '?date=' + strDate;
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getToday() 
{
    var date = new Date()
    date.setHours(0,0,0,0);
    return date;
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}