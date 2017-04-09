var lc,
    canvasWidth = 720,
    canvasHeight = 480,
    vrtionary,
    timer = 30, 
    x;
var words = ['cat', 'rhino', 'hand', 'house', 'window', 'computer', 'man', 'woman', 'love', 'hate', 'envy',
         'greed', 'sloth', 'water', 'rain', 'storm', 'tornado', 'hurricane', 'planet', 'jupiter', 'candy',
         'phone', 'laptop', 'chips', 'soda', 'poptart', 'sleep', 'ohio', 'school', 'pencil', 'pen', 'foot',
         'nose', 'Middle East', 'bacteria', 'door', 'television', 'money', 'chair', 'jump', 'elephant',
         'scissors', 'point', 'glue', 'star', 'tree', 'airplane', 'bird', 'superhero', 'superman', 'tail', 'basketball',
         'baseball', 'football', 'soccer', 'cricket', 'japan', 'mouth', 'tooth', 'glasses', 'hat',
         'javascript', 'c#', 'java', 'jar', 'php', 'smile', 'cheek', 'jail', 'cop', 'ear', 'drum', 'guitar',
         'microphone', 'milk', 'cow', 'turtle', 'giant', 'wings', 'burger', 'spider', 'daddy long legs', 'baby', 'monkey',
         'ape', 'arm', 'shoe' ];

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
}

//Returns a random word
function newWord() {
    return words[Math.floor((Math.random() * words.length))];
}

//(re)start countdown timer
function resetTimer() {
    clearInterval(x);
    timer = 30;
    $("#count_down").html(timer);
    x = setInterval(function () {
        timer = timer - 1;
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
        if (timer <= 0) {
            clearInterval(x);
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
    
    resizeCanvas();
    resetTimer();
    $('#word_hint').html(newWord);
});

$(window).resize(function () {
    resizeCanvas();
});

$(".team").click(function () {
    if (!$(this).attr("class").includes("selected")) {
        $(".team.selected").removeClass("selected");
        $(this).addClass("selected");
        lc.clear();
        switch ($(this).attr("class").split(/\s+/)[1]) {
        case "red":
            vrtionary.setTeam(1);
            lc.setColor("primary", "#ff0000");
            break;
        case "blue":
            vrtionary.setTeam(2);
            lc.setColor("primary", "#0f0fff");
            break;
        case "green":
            vrtionary.setTeam(3);
            lc.setColor("primary", "#32CD32");
            break;
        case "yellow":
            vrtionary.setTeam(4);
            lc.setColor("primary", "#fff000");
            break;
        }
    }
});

$('#skip').click(function () {
    if (timer > 0) {
        $('#word_hint').html(newWord);
        lc.clear();
        resetTimer();
    }
});

$('#next').click(function () {
    if (timer > 0) {
        $('#word_hint').html(newWord);
        lc.clear();
        resetTimer();
        givePoint();
    }
});