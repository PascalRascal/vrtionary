var lc,
    canvasWidth = 720,
    canvasHeight = 480;

//Zoom the canvas so the entire canvas is always visible
function resizeCanvas() {
    var heightRatio = ($(window).height() -20) / canvasHeight,
        widthRatio = ($(window).width() -20) / canvasWidth;
    
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

$(function () {
    //Initialize canvas component
    lc = LC.init(document.getElementsByClassName('canvas core')[0], {
        primaryColor: '#ff0000',
        defaultStrokeWidth: 2,
        imageSize: {width: canvasWidth, height: canvasHeight},
        backgroundColor: '#fff'
    });
    
    resizeCanvas();
});

$(window).resize(function () {
    resizeCanvas();
});

$(".team").click(function () {
    if (!$(this).attr("class").includes("selected")) {
        $(".team.selected").removeClass("selected");
        $(this).addClass("selected");
        lc.clear();
        lc.setColor("primary", $(this).css("background-color"));
    }
});