var player1_score = 0;
var player2_score = 0;
var player1_pass = 0;
var player2_pass = 0;
var tiles_left =[];
var current_move = true; //true is player1, false is player2
var selected_tile = '';
var start = true;
var letters = [];

const noTileBonus = 25;
var tiles = [['a',9,1],['b',2,3],['c',2,3],['d',4,2],['e',12,1],['f',2,4],['g',3,2],['h',2,4],['i',9,1],['j',1,8],['k',1,5],['l',4,1],['m',2,3],['n',6,1],['o',8,1],['p',2,3],['q',1,10],['r',6,1],['s',4,1],['t',6,1],['u',4,1],['v',2,4],['w',2,4],['x',1,8],['y',2,4],['z',1,10]]
//add wild tiles later -['wild',2,0]

//create the scrabble board
for (var i = 1; i < 226; i++) {
  if ((i >= 2 && i <= 15) || (i >= 212 && i<=224) || (i%15==0) || (i%15==1)){
  $('.scrabble-board').append(`<div class="cell ${i} droptarget outer" id="${i}"  ondragenter="return dragEnterBoard(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoBoard(event)" ondragover="return dragOver(event)" draggable="true" ondragstart="return dragStartBoard(event)"></div>`);
} else {
  $('.scrabble-board').append(`<div class="cell ${i} droptarget" id="${i}"  ondragenter="return dragEnterBoard(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoBoard(event)" ondragover="return dragOver(event)" draggable="true" ondragstart="return dragStartBoard(event)"></div>`);
  }
}
//create the tiles
for (index in tiles){
  for (var i = 0; i < tiles[index][1]; i++) {
    tiles_left.push([tiles[index][0],tiles[index][2]]);
  }
}


//start game at the center cell
$('.113').addClass('start');
getStartTiles();
$('.message').append(`<p>Your turn</p>`);
getTurn();


function getTurn(){
  if (current_move){
    $('.tile-holder1').addClass('active').removeClass('inactive').addClass('t-inactive')
    $('.tile-holder2').addClass('inactive').removeClass('active')
    //$('.tile-holder1').children().addClass('t-active').removeClass('t-inactive');
    $('.player-id').empty();
    $('.player-id').append('Player 1')
  } else if (!current_move){
    $('.tile-holder2').addClass('active').removeClass('inactive').addClass('t-inactive')
    $('.tile-holder1').addClass('inactive').removeClass('active')
    //$('.tile-holder2').children().addClass('t-active').removeClass('t-inactive');
    $('.player-id').empty();
    $('.player-id').append('Player 2')
  }
}

function getStartTiles(){
  for (var i = 0; i < 14; i++) {
    var random_index = randomIndex(tiles_left.length)
    while (tiles_left[random_index]== undefined){
      random_index = randomIndex(tiles_left.length)
    }
    var tile = (tiles_left[random_index][0]);
    tiles_left.splice(random_index, 1 )
    if ((i%2)){
      $('.tile-holder1').append(`<div class="tile ${tile} droptarget" id="${tile}" draggable="true" ondragenter="return dragEnterHolder(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoHolder(event)" ondragover="return dragOver(event)" ondragstart="return dragStartHolder(event)"></div>`);
    } else {
      $('.tile-holder2').append(`<div class="tile ${tile} droptarget" id="${tile}" draggable="true" ondragenter="return dragEnterHolder(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoHolder(event)" ondragover="return dragOver(event)" ondragstart="return dragStartHolder(event)"></div>`);
    }
  }
  updateTileInfo();
}

function refillTiles(){
  var tiles_needed = 0;
  var tile_holder ='';
  if (current_move){
    tiles_needed = $('.tile-holder1').children('.t-active').length;
    tile_holder = '.tile-holder1';
  } else {
    tiles_needed = $('.tile-holder2').children('.t-active').length;
    tile_holder = '.tile-holder2';
  }
  getTiles(tiles_needed,tile_holder);
}

function getTiles(tiles_needed,tile_holder){
  for (var i = 0; i < tiles_needed; i++) {
    var random_index = randomIndex(tiles_left.length)
    while (tiles_left[random_index]== undefined){
      random_index = randomIndex(tiles_left.length)
    }
    var tile = (tiles_left[random_index][0]);
    tiles_left.splice(random_index, 1 );
    $(tile_holder).children('.t-active').filter(":first").addClass(tile).attr('id',tile).removeClass('t-active');
  }
}

function randomIndex(length){
  return  Math.floor(Math.random() * (length + 1));
}

$('.play').on('click', function(){
  if (checkPlacement()){
    if (start){
      if (checkStart()){
        checkWord();
        archiveWord();
        start = false;
      }
    } else {
     checkWord();
     archiveWord();
    }
    letters = [];
    refillTiles();
    updateTileInfo();
    current_move = !current_move;
    getTurn();
  }
})

function updateTileInfo(){
  $('.tiles-left').empty();
  $('.tiles-left').append(`<h4>Tiles left : ${tiles_left.length}</h4>`);
}

function checkPlacement(){
  var curr_direction = '';
  var prev_direction = '';

  letters.sort(function(a, b) {
    return a[0] - b[0];
  });

  for(i = 0; i < letters.length - 1; i++){
    var id_1 = letters[i][0]
    var id_2 = letters[i+1][0]
    var left = parseInt(id_1) - 1;
    var right = parseInt(id_1) + 1;
    var top = parseInt(id_1) - 15;
    var bottom = parseInt(id_1) + 15;
    prev_direction = curr_direction;

    switch(parseInt(id_2)){
      case left :
        console.log("left")
        curr_direction = 'horizontal';
        break;
      case right :
        console.log("right")
        curr_direction = 'horizontal';
        break;
      case top :
        console.log("top")
        curr_direction = 'vertical';
        break;
      case bottom :
        console.log("bottom")
        curr_direction = 'vertical';
        break;
      default :
        alert('Use letters either horizonally or vertically to make words');
        return false;
    }
    if (curr_direction !== prev_direction && prev_direction !== ''){
      alert('Use letters either horizonally or vertically to make words');
      return false;
    }
  }
  //checkValidity(curr_direction);
  return true;
}


function checkStart(){
  if (!$('.113').hasClass('s-active')){
    $('.message').append(`<p>Start your word at the star</p>`)
  return false
  }
  return true;
}

function addScore(score){
  if (!current_move){
    player1_score += score;
    $('#p1-score').empty();
    $('#p1-score').append(player1_score);
  } else {
    player2_score += score;
    $('#p2-score').empty();
    $('#p2-score').append(player2_score);
  }
}

function displayLastMove(success, score, word) {
  if (!current_move) {
    $('#p1-last').empty();
    if (success == 1) {
        $('#p1-last').append(word + ' - ' + score + 'points');
        $('.words').append(word + '<br>')
    } else {
        $('#p1-last').append('Invalid! ' + score + 'points');
    }
    addScore(score)
} else {
    $('#p2-last').empty();
    if (success == 1) {
        $('#p2-last').append(word + ' - ' + score + 'points');
        $('.words').append(word + '<br>')
    } else {
        $('#p2-last').append('Invalid! ' + score + 'points');
    }
    addScore(score)
  }

}

function archiveWord(){
  $('.scrabble-board').children().each(function (i,el) {
    if ($(el).hasClass('s-active')){
      $(this).removeClass('s-active').addClass('v-active').removeClass('droptarget');
    }
});
}

function dragStartHolder(ev) {
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData("Text_1", ev.target.getAttribute('id'));
   ev.dataTransfer.setData("Text_2", ev.target.getAttribute('id'));
   ev.dataTransfer.setData("Text_3", 'holder');
   selected_tile = ev.target;
   $(ev.target).addClass('t-active').removeClass('t-inactive')
   return true;
}
function dragStartBoard(ev) {
  if ($(ev.target).hasClass('s-active')){
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData("Text_1", ev.target.getAttribute('id'));
   ev.dataTransfer.setData("Text_2", ev.target.getAttribute('value'));
   ev.dataTransfer.setData("Text_3", 'board');
   //ev.target.style.opacity = "0.6";
   selected_tile = ev.target;
   return true;
 }
   return false;
}

function dragEnterBoard(ev) {
   ev.preventDefault();
   if ( $(ev.target).hasClass("droptarget") && !$(ev.target).hasClass("r-active") && !$(ev.target).hasClass("s-active")) {
      ev.target.style.border = "1px dotted red";
     }
   return true;
}
function dragEnterHolder(ev) {
   ev.preventDefault();
   if ( $(ev.target).hasClass("droptarget") && $(ev.target).hasClass("t-active")) {
      ev.target.style.border = "1px dotted red";
     }
   return true;
}

function dragOver(ev) {
    ev.preventDefault();
}

function dragLeave(ev) {
  if ( $(ev.target).hasClass("droptarget") ) {
        ev.target.style.border = "";
    }
}

function dragDropOntoBoard(ev) {
   ev.preventDefault();
   if ( $(ev.target).hasClass("droptarget") && !$(ev.target).hasClass("r-active") && !$(ev.target).hasClass("s-active")) {
     var data_1 = ev.dataTransfer.getData("Text_1");
     var data_2 = ev.dataTransfer.getData("Text_2");
     var origin = ev.dataTransfer.getData("Text_3");
    ev.target.style.border = "";
    //ev.target.style.opacity = "1";
    if (origin == 'board'){
      $(ev.target).addClass(data_2);
      $(selected_tile).removeClass('s-active').removeClass(data_2);
      var tempArr = letters.map(function(arr){ return arr[0]})
      letters.splice(tempArr.indexOf(data_1),1);
    } else {
      $(ev.target).addClass(data_2);
      $(selected_tile).removeClass(data_2);
      $(selected_tile).removeAttr('id');
      $(selected_tile).removeClass('t-inactive').addClass('t-active');
    }
    $(ev.target).addClass('s-active');
    $(ev.target).attr('value',data_2)
    letters.push([$(ev.target).attr('id'),data_2]);

  }
  return true;
}

function dragDropOntoHolder(ev) {
  ev.preventDefault();
  if ( $(ev.target).hasClass("droptarget")) {
    var data_1 = ev.dataTransfer.getData("Text_1");
    var data_2 = ev.dataTransfer.getData("Text_2");
    var origin = ev.dataTransfer.getData("Text_3");
    ev.target.style.border = "";
    if (origin == "holder"){
      $(selected_tile).removeClass(data_2);
      $(selected_tile).removeAttr('id')
      $(selected_tile).removeClass('t-inactive').addClass('t-active');
    } else if (data_1 !== ''){
      $('#' + data_1).removeClass('s-active').removeClass(data_2);
      var tempArr = letters.map(function(arr){ return arr[0]})
      letters.splice(tempArr.indexOf(data_1),1);
    }
    $(ev.target).addClass(data_2).addClass('t-inactive').removeClass('t-active');
    $(ev.target).attr('id',data_2);
  }
  return true;
}

function checkWord(){
  let proxy = "https://galvanize-cors-proxy.herokuapp.com/"
  let tempLetters = []
  for(index in letters){
    tempLetters.push(letters[index][1])
  }
  let word = tempLetters.join('')
  $.ajax({
    url: proxy + 'http://www.wordgamedictionary.com/api/v1/references/scrabble/' + word + '\?key=1.0612195181598369e30',
    method: 'GET'
  }).then( function(result){

      var xml = new XMLSerializer().serializeToString(result)
      var xmlDoc = $.parseXML(xml);
      var $xml = $(xmlDoc)
      var success = $xml.find('scrabble').text();
      var score = $xml.find('scrabblescore').text();
      displayLastMove(success,parseInt(score),word);

  }).catch(function(error){
    console.log('Error:',error);
  });
}
