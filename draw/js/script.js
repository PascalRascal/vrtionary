var lc,
    canvasWidth = 720,
    canvasHeight = 480,
    vrtionary,
    timer = 30, 
    x,
    words = ['cat', 'rhino', 'hand', 'house', 'window', 'computer', 'man', 'woman', 'love', 'hate', 'envy',
         'greed', 'sloth', 'water', 'rain', 'storm', 'tornado', 'hurricane', 'planet', 'jupiter', 'candy',
         'phone', 'laptop', 'chips', 'soda', 'poptart', 'sleep', 'ohio', 'school', 'pencil', 'pen', 'foot',
         'nose', 'Middle East', 'bacteria', 'door', 'television', 'money', 'chair', 'jump', 'elephant',
         'scissors', 'point', 'glue', 'star', 'tree', 'airplane', 'bird', 'superhero', 'superman', 'tail', 'basketball',
         'baseball', 'football', 'soccer', 'cricket', 'japan', 'mouth', 'tooth', 'glasses', 'hat',
         'javascript', 'c#', 'java', 'jar', 'php', 'smile', 'cheek', 'jail', 'cop', 'ear', 'drum', 'guitar',
         'microphone', 'milk', 'cow', 'turtle', 'giant', 'wings', 'burger', 'spider', 'daddy long legs', 'baby', 'monkey',
         'ape', 'arm', 'shoe' ];
//assign modal defaults
$.modal.defaults = {
  closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
  escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
  clickClose: false,       // Allows the user to close the modal by clicking the overlay
  closeText: 'Close',     // Text content for the close <a> tag.
  closeClass: '',         // Add additional class(es) to the close <a> tag.
  showClose: false,        // Shows a (X) icon/link in the top-right corner
  modalClass: "modal",    // CSS class added to the element being displayed in the modal.
  spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
  showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
  fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
  fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
};
//Zoom the canvas so the entire canvas is always visible
function resizeCanvas() {
    var heightRatio = ($(window).height() - 20) / canvasHeight,
        widthRatio = ($(window).width() - 20) / canvasWidth;
    
    if (canvasHeight > $(window).height() || canvasWidth > $(window).width()) {
        //window is too small
        if (heightRatio >= widthRatio) {
            lc.setZoom(heightRatio);
        } else {
            lc.setZoom(widthRatio);
        }
    } else if (canvasHeight < $(window).height() && canvasWidth < $(window).width()) {
        //canvas is too small
        if (heightRatio <= widthRatio) {
            lc.setZoom(heightRatio);
        } else {
            lc.setZoom(widthRatio);
        }
    }
}

//adds one to selected team's score
function givePoint() {
    $('.team.selected').html(parseInt($('.team.selected').html(), 10) + 1);
    vrtionary.setTeamScore(parseInt($('.team.selected').html(), 10));
}

//Assigns a new word to the team and resets the timer and canvas
function newWord() {
    $('#word_hint').html(words[Math.floor((Math.random() * words.length))]);
    resetTimer();
    vrtionary.ultimateClear();
    vrtionary.setTeamTime(30);
}

//(re)start countdown timer
function resetTimer() {
    clearInterval(x);
    timer = 30;
    $("#count_down").html(timer);
    x = setInterval(function () {
        timer = timer - 1;
        vrtionary.setTeamTime(timer);
        $("#count_down").html(timer);
        if (timer <= 5) {
            clearInterval(x);
            finalCountdown();
        }
    }, 1000);
}

//Up the refresh-rate of the timer for the last few seconds
function finalCountdown() {
    timer = 50;
    $("#count_down").html(timer / 10);
    x = setInterval(function () {
        timer = timer - 1;
        $("#count_down").html((timer / 10).toFixed(1));
        vrtionary.setTeamTime((timer / 10).toFixed(1));
        if (timer <= 0) {
            clearInterval(x);
            newWord();
        }
    }, 100);
}

//on document.ready
$(function () {
    //Initialize canvas component
    lc = LC.init(document.getElementsByClassName('canvas core')[0], {
        primaryColor: '#ff0000',
        defaultStrokeWidth: 2,
        imageSize: {width: canvasWidth, height: canvasHeight},
        backgroundColor: '#fff'
    });
    vrtionary = new VRtionary({lCanvas: lc});
    vrtionary.setClockElement();
    resizeCanvas();
    $('#overlay').hide();
    $('#overlay').modal();
    $.modal
});

$(window).resize(function () {
    resizeCanvas();
});

$(".team_button").click(function () {
    var team = $(".team_button").index(this) + 1;
    
    vrtionary.setTeam(team);
    
    $(".team:nth-child(" + team + ")").addClass("selected");
    lc.setColor("primary", $(this).css("background-color"));
    $.modal.close();
    
    newWord();
});

$('#skip').click(function () {
    if (timer > 0) {
        newWord();
    }
});

$('#next').click(function () {
    if (timer > 0) {
        newWord();
        givePoint();
    }
});