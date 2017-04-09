var lc
  $(document).ready(function(){
    var canvasWidth = 720;
    var canvasHeight = 480;
    lc = LC.init(document.getElementsByClassName('canvas core')[0], {
      primaryColor: '#ff0000', 
      defaultStrokeWidth: 2, 
      imageSize: {width: canvasWidth, height: canvasHeight}, 
      backgroundColor: '#fff'});
      
      var cel = lc.containerEl;
	  //Zoom the canvas so the entire canvas is always visible
      if(canvasHeight > cel.clientHeight || canvasWidth > cel.clientWidth){
		  var heightRatio = (canvasHeight / cel.clientHeight);
		  var widthRatio = canvasWidth / cel.clientWidth
		  if(heightRatio >= widthRatio){
			lc.setZoom(1 / heightRatio);
		  } else {
			lc.setZoom(1 / widthRatio);
		  }
      }
  });