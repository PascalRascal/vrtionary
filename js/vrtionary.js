function VRtionary(options) {
  this.uid;
  this.auth = firebase.auth();
  this.db = firebase.database().ref();
  var did = findGetParameter('did');
  this.uid = null;
  this.drawingId = null;
  this.team = 1;
  this.roomId = findGetParameter('room');
  if (!this.roomId) {
    this.roomId = generateRoomName();
  }
  this.room = this.db.child('rooms').child(this.roomId);
  this.room.update({
    teamcount: 4,
  });

  if (did) {
    this.drawingId = did;
  }
  if (options.titleDiv) {
    this.titleDiv = titleDiv;
  } else {
    this.titleDiv = {};
  }
  if (options.shareDiv) {
    this.shareDiv = options.shareDiv;
  } else {
    this.shareDiv = {};
  }
  if (options.authorDiv) {
    this.authorDiv = options.authorDiv;
  }
  if (options.meshLineMaker) {
    this.mlMaker = options.meshLineMaker;
    var _this = this;
    this.team1shapes = this.room.child('team' + 1).child('shapes');
    this.team1shapes.on('child_added', function(e){
        _this.draw3DShape(e, 1);
    })
    this.team1shapes.on('child_removed', function(e){
        _this.remove(e.val().shapeId);
    })
    this.team2shapes = this.room.child('team' + 2).child('shapes');
    this.team2shapes.on('child_added', function(e){
        _this.draw3DShape(e, 2);
    })
    this.team2shapes.on('child_removed', function(e){
        _this.remove(e.val().shapeId);
    })
    this.team3shapes = this.room.child('team' + 3).child('shapes');
    this.team3shapes.on('child_added', function(e){
        _this.draw3DShape(e, 3);
    })
    this.team3shapes.on('child_removed', function(e){
        _this.remove(e.val().shapeId);
    })
    this.team4shapes = this.room.child('team' + 4).child('shapes');
    this.team4shapes.on('child_added', function(e){7
        _this.draw3DShape(e, 4);
    })
    this.team4shapes.on('child_removed', function(e){
        _this.remove(e.val().shapeId);
    })
  }
  if (options.lCanvas) {
    this.lCanvas = options.lCanvas;
    console.log('lcanvas yo');
    var _this = this;
      this.shapes = this.room.child('team' + this.team).child('shapes');
  var _this = this;
  //WHAT THE FUCK??
  this.shapes.on('child_added', function(e) {
      console.log(e);
    _this.draw2DShape(e);
  });
      console.log('lcanvas yo');

    this.lCanvas.on('shapeSave', function(e) {
      var shape = e.shape;
      console.log(shape);
      var sID = randId();
      var shapeData = {
        strokeWidth: lc.tool.strokeWidth,
        color: lc.tool.color,
        linePoints2D: [],
        shapeId: sID,
        height: Math.ceil(lc.height),
        width: Math.ceil(lc.width),
      };
      var points = [];

      for (var i = 0; i < shape.points.length; i++) {
        shapeData.linePoints2D[i] = [];
        shapeData.linePoints2D[i][0] = shape.points[i].x;
        shapeData.linePoints2D[i][1] = shape.points[i].y;
      }

      _this
        .push2DShape(shapeData)
    });
  }
  if (options.vrButton) {
    this.vrButton = options.vrButton;
  }
  if (options.editLink) {
    this.editLink = options.editLink;
  }
  if (options.viewLink) {
    this.viewLink = options.viewLink;
  }
}
VRtionary.prototype.setTeam = function(teamNumber) {
  this.team = teamNumber;
  if (this.shapes) {
    this.shapes.off('child_added');
  }

  this.shapes = this.room.child('team' + this.team).child('shapes');
  if (this.lCanvas) {
    this.lCanvas.clear();
    var _this = this;
    //WHAT THE FUCK?
    this.shapes.on('child_added',function(e) {
      _this.draw2DShape(e);
    });
  }
  

  console.log(this.team);
};

VRtionary.prototype.setTeamScore = function(newScore){
    this.room.child('team' + this.team).update({
        score: newScore
    })
}

VRtionary.prototype.ultimateClear = function(){
    this.shapes.set(null);
    this.lCanvas.clear();
}

VRtionary.prototype.setTeamTime = function(newTime){
    this.room.child('team' + this.team).update({
        time: newTime
    })
}

VRtionary.prototype.setClockElement = function(clock){
    this.room.child('team' + this.team).child('time').on('child_changed', function(s){
        console.log(s.val());
    })
}


VRtionary.setTeamScore = function(newScore){
    this.room.child('team' + this.team).update({
        score: newScore
    })
}

VRtionary.setTeamWord = function(newWord){
    this.room.child('team' + this.team).update({
        teamWord: newWord
    })
}
VRtionary.prototype.init = function() {
  //Initiate Authentication and Database
  this.auth = firebase.auth();
  this.db = firebase.database().ref();
  if (this.room) {
    //this.setDrawing(this.drawingId);
  } else {
    var oldId = localStorage.getItem('did');
    if (oldId) {
      this.drawingId = oldId;
    }
  }

  //Declare All the Cool Events
  this.auth.onAuthStateChanged(this.setUID.bind(this));

};

VRtionary.prototype.createRoom = function(roomname, teamcount) {
  this.room = this.db.child('rooms').child(roomname);
  this.room.update({
    teamcount: teamcount,
  });
};
VRtionary.prototype.setRoom = function(roomname) {
  this.room = this.db.child('rooms').child(roomname);
};
VRtionary.prototype.setUID = function(user) {
  if (user) {
    this.uid = user.uid;
    this.setDrawing(this.drawingId);
  } else {
    this.uid = null;
  }
};

VRtionary.prototype.login = function() {
  this.auth.signInAnonymously().catch(function(error) {
    console.log(error);
  });
};
VRtionary.prototype.push2DShape = function(s) {
  this.room.child('team' + this.team).child('shapes').push(s);
};
VRtionary.prototype.clearShapes = function() {
  this.room.child('team' + this.team).child('shapes').set(null);
};
VRtionary.prototype.draw2DShape = function(s) {
  var shape = s.val();
  var lc = this.lCanvas;
  //If no drawing exists
  /**
     * The promise part is probs unneccessary
     */
  var p1 = new Promise(function(resolve, reject) {
    if (shape.linePoints2D) {
      var newShape = [];
      for (var i = 0; i < shape.linePoints2D.length; i++) {
        newShape.push(
          LC.createShape('Point', {
            x: shape.linePoints2D[i][0],
            y: shape.linePoints2D[i][1],
            size: shape.strokeWidth,
            color: shape.color,
          })
        );
      }
      resolve(newShape);
    }
  });
  p1.then(function(shape) {
    var memeShape = LC.createShape('LinePath', {points: shape});
    lc.saveShape(memeShape, false);
  });
  p1.catch(function(reason) {
    console.log(reason);
  });
};

/**
 * VR Environment Functions
 * */
VRtionary.prototype.draw3DShape = function(s, teamNumber) {
  var shape = s.val();
  var shapeId = shape.shapeId;
  /**
     * Todo: Make height+width not bound in stone
     */
  var maxHeight = 480;
  var maxWidth = 720;

  var points = generate3DPoints(shape.linePoints2D, maxWidth, maxHeight, teamNumber);
  this.mlMaker.createMeshLine(points, shape.color, shape.strokeWidth, shapeId, teamNumber);
};
VRtionary.prototype.undraw3DShape = function(s) {
  var shape = s.val();
};

VRtionary.prototype.remove = function (id){
    this.mlMaker.el.removeObject3D(id);
}
/**
 Thanks for
http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
**/
//what am i gonna do? parse the string myslef? LMFAO
function findGetParameter(parameterName) {
  var result = null, tmp = [];
  location.search.substr(1).split('&').forEach(function(item) {
    tmp = item.split('=');
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  });
  return result;
}
var randId = function() {
  return Math.random().toString(36).substr(2, 12);
};
var options = {
  did: 212,
  meme: 'fuckOff',
};
var generate2DPoints = function(shape) {
  var newShape = LC.createShape('LinePath');
  for (var i = 0; i < shape.linePoints2D.length; i++) {
    newShape.addPoint(
      LC.createShape('Point', {
        x: shape.linePoints2D[i][0],
        y: shape.linePoints2D[i][1],
        size: shape.strokeWidth,
        color: shape.color,
      })
    );
  }
  return newShape;
};

var lineCount = 0;
var generate3DPoints = function(points, maxWidth, maxHeight, tn) {
  //TODO: Implement Proper depth for lines on top of each other
  if (points.length) {
    var width = 4*maxWidth;
    var height = maxHeight;
    var radius = maxWidth / (2 * Math.PI);
    var points3D = [];
    var spline = new BSpline(points, 3);
    var bsplinePoints = [];
    for (var i = 0; i <= 1; i += 1 / (points.length * 4)) {
      bsplinePoints.push(spline.calcAt(i));
    }

    for (var i = 0; i < bsplinePoints.length; i++) {
      points3D[i] = [];
      points3D[i][0] = Math.cos(2 * Math.PI * (((tn-1) * maxWidth) + bsplinePoints[i][0]) / width) *
        radius;
      points3D[i][1] = maxHeight / 2 - bsplinePoints[i][1];
      points3D[i][2] = Math.sin(2 * Math.PI * (((tn-1) * maxWidth) + bsplinePoints[i][0]) / width) *
        radius;
    }

    return points3D;
  } else {
  }
};

function generateRoomName() {
  var words = [
    'Cat',
    'Dog',
    'Cute',
    'Big',
    'Fat',
    'Huge',
    'Rude',
    'Crude',
    'Hat',
    'Act',
    'Fun',
    'Red',
    'Beg',
    'Bro',
    'Boa',
    'Bed',
    'Bub',
    'Oaf',
    'Rub',
    'Sax',
    'Bat',
    'Mat',
    'Hog',
    'Cog',
    'Rug',
    'Bug',
    'Play',
    'Chip',
    'Ohio',
    'Draw',
    'Out',
    'In',
    'And',
    'Weee',
  ];

  var gameName = '';
  for (var i = 0; i < 3; i++) {
    gameName = gameName + words[Math.floor(Math.random() * words.length)];
  }
  return gameName;
}
