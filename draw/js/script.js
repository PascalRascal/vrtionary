var lc
console.log('yaaaaaaaaa');
  $(document).ready(function(){
    var canvasWidth = 720;
    var canvasHeight = 480;
    lc = LC.init(document.getElementsByClassName('canvas core')[0], {
      primaryColor: '#ff0000', 
      defaultStrokeWidth: 2, 
      imageSize: {width: canvasWidth, height: canvasHeight}, 
      backgroundColor: '#fff'});
      
      var cel = lc.containerEl;
      if(cel.clientHeight > canvasHeight || cel.clientWidth > canvasWidth){
        console.log("WOOOO");
        console.log(lc.zoom);
        lc.setZoom((canvasHeight/canvasWidth) / (cel.clientHeight/cel.canvasWidth));
                console.log(lc.zoom);

      }
  });
