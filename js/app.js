function generateGameName() {
    var words = ['cat', 'dog', 'cute', 'big', 'fat', 'huge', 
    'rude', 'crude', 'hat', 'act', 'fun', 'red', 'beg', 'bro', 'boa', 'bed', 'bub', 'oaf', 'rub', 'sax',
    'bat', 'mat', 'hog', 'cog', 'rug', 'bug', 'play', 'chip', 'ohio', 'draw', 'out', 'in', 'and', 'weee']

    var gameName = '';
    for(var i = 0; i < 3; i++){
        gameName = gameName + words[Math.floor(Math.random() * words.length)]
    }
    return gameName;
}
var yo = new VRtionary({});
//Hide the modal
$('#gameDetailsModal').hide();
$('#createGameButton').click(()=>{
    window.location = 'https://vrtionary.surge.sh/draw'
})
$('#joinGameButton').click(() => {
    $('#gameDetailsModal').modal();
})

$('#joinInVR').click(()=>{
    var roomName = $('#roomInput').val();
    window.location = 'https://vrtionary.surge.sh/vr/?room=' + roomName;
})

$('#joinAsPainter').click(()=>{
        var roomName = $('#roomInput').val();
        window.location = 'https://vrtionary.surge.sh/draw/?room=' + roomName;
})
