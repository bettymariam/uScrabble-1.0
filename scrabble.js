let player1_score = 0;
let player2_score = 0;
let tiles_left =[];
let current_move = true; //true for player1, false for player2
let selected_tile = '';
let start = true; //first play
let letters = []; //letters played on a turn
let valid_words = []; //words validated by the API

const noTileBonus = 25;
let tiles = [['a',9,1],['b',2,3],['c',2,3],['d',4,2],['e',12,1],['f',2,4],['g',3,2],['h',2,4],['i',9,1],['j',1,8],['k',1,5],['l',4,1],['m',2,3],['n',6,1],['o',8,1],['p',2,3],['q',1,10],['r',6,1],['s',4,1],['t',6,1],['u',4,1],['v',2,4],['w',2,4],['x',1,8],['y',2,4],['z',1,10]]
//add wild tiles later -['wild',2,0]

// The cells on the scrabble board are numbered from 1-225. The cells on the boundary of the board have a class name of 'outer'
function createScrabbleBoard(){
  for (let i = 1; i < 226; i++) {
    if ((i >= 2 && i <= 15) || (i >= 212 && i<=224) || (i%15==0) || (i%15==1)){
    $('.scrabble-board').append(`<div class="cell ${i} droptarget outer" id="${i}"  ondragenter="return dragEnterBoard(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoBoard(event)" ondragover="return dragOver(event)" draggable="true" ondragstart="return dragStartBoard(event)"></div>`);
  } else {
    $('.scrabble-board').append(`<div class="cell ${i} droptarget" id="${i}"  ondragenter="return dragEnterBoard(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoBoard(event)" ondragover="return dragOver(event)" draggable="true" ondragstart="return dragStartBoard(event)"></div>`);
    }
  }
}

//create tile bag
function createTiles(){
  for (index in tiles){
    for (let i = 0; i < tiles[index][1]; i++) {
      tiles_left.push([tiles[index][0],tiles[index][2]]);
    }
  }
}

$(document).ready(function () {
  $("#exchange").hide();
  $("#popup").hide().fadeIn(1000);
  $("#play-start").append(`<div class="p play-click"></div>`);
  $("#play-start").append(`<div class="l play-click"></div>`);
  $("#play-start").append(`<div class="a play-click"></div>`);
  $("#play-start").append(`<div class="y play-click"></div>`);
  $("#play-start").append(`<p>Click here to start</p>`);


  $("#play-start").on("click", function (e) {
      e.preventDefault();
      $("#popup").fadeOut(1000);
      $("#play-start").remove();
  });

  $('.main').show();
  createScrabbleBoard();
  createTiles();
  $('.113').addClass('start');
  getStartTiles();
  $('.message').append(`<p>Your turn. Start your word at the star</p>`);
  getTurn();
});


function getTurn(){
  if (current_move){
    $('.tile-holder1').addClass('active').removeClass('inactive').addClass('t-inactive')
    $('.tile-holder2').addClass('inactive').removeClass('active')
    $('.player-id').empty();
    $('.player-id').append('Player 1')
  } else if (!current_move){
    $('.tile-holder2').addClass('active').removeClass('inactive').addClass('t-inactive')
    $('.tile-holder1').addClass('inactive').removeClass('active')
    $('.player-id').empty();
    $('.player-id').append('Player 2')
  }
}

function randomIndex(length){
  return  Math.floor(Math.random() * (length + 1));
}


function getStartTiles(){
  for (let i = 0; i < 14; i++) {
    let random_index = randomIndex(tiles_left.length)
    while (tiles_left[random_index]== undefined){
      random_index = randomIndex(tiles_left.length)
    }
    let tile = (tiles_left[random_index][0]);
    tiles_left.splice(random_index, 1 )
    if ((i%2)){
      $('.tile-holder1').append(`<div class="tile ${tile} droptarget t1" id="${tile}" draggable="true" ondragenter="return dragEnterHolder(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoHolder(event)" ondragover="return dragOver(event)" ondragstart="return dragStartHolder(event)"></div>`);
    } else {
      $('.tile-holder2').append(`<div class="tile ${tile} droptarget t2" id="${tile}" draggable="true" ondragenter="return dragEnterHolder(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoHolder(event)" ondragover="return dragOver(event)" ondragstart="return dragStartHolder(event)"></div>`);
    }
  }
  updateTileInfo();
}

function refillTiles(){
  let tiles_needed = 0;
  let tile_holder ='';
  var tile = '.tile-holder'

  tile += (current_move ? 1 : 2);
  tiles_needed = $(tile).children('.t-active').length;
  tile_holder = tile;
  getTiles(tiles_needed,tile_holder);
}

function getTiles(tiles_needed,tile_holder){
  for (let i = 0; i < tiles_needed; i++) {
    let random_index = randomIndex(tiles_left.length)
    while (tiles_left[random_index]== undefined){
      random_index = randomIndex(tiles_left.length)
    }
    let tile = (tiles_left[random_index][0]);
    tiles_left.splice(random_index, 1 );
    $(tile_holder).children('.t-active').filter(":first").addClass(tile).attr('id',tile).removeClass('t-active');
  }
}



$('.play').on('click', function(){
  $('.message').empty();
  if (checkIfTilesPlayed()){
    var turnFn = start ? firstTurn : otherTurns
    checkPlacement(turnFn)
  } else {
    alert('Place tiles to play!');
  }
})

function firstTurn (score) {
  if (checkStart()){
    start = false;
    endTurn(score);
  }
}

function otherTurns (score) {
  endTurn(score);
}

function endTurn(score){
  letters = [];
  valid_words = [];
  updateScore(parseInt(score));
  displayLastMove();
  archiveWord();
  refillTiles();
  updateTileInfo();
  current_move = !current_move;
  getTurn();
}


$('.exchange').on('click', function(e){
  //e.preventDefault();
  $('.tile-holder').empty();
  $('#exchange').show();
  $('#exchange').children().show();
  var t ='.t'
  t += (current_move? 1 : 2);
  console.log(t);
    $(t).each(function(){
      $('.tile-holder').append($(this));
      $('.tile-holder').addClass('t-active');
    })
})

$('#exchange-button').on('click',function(e){
  let ex_Arr = [];
  let tile_info = '';
  let tile_holder = '';
  if (current_move){
    tile_info = '.t1';
    tile_holder = '.tile-holder1';
  } else {
    tile_info = '.t2';
    tile_holder = '.tile-holder2';
  }
  $(tile_info).each(function(){
    if (!$(this).hasClass('ex')){
      $(tile_holder).append(`<div class="tile ${$(this).attr('id')} droptarget t1" id="${$(this).attr('id')}" draggable="true" ondragenter="return dragEnterHolder(event)" ondragleave="return dragLeave(event)" ondrop="return dragDropOntoHolder(event)" ondragover="return dragOver(event)" ondragstart="return dragStartHolder(event)"></div>`);
      $(tile_holder).addClass('t-inactive').removeClass('t-active');
    } else {
      ex_Arr.push([$(this).attr('id')]);
      $(this).removeClass($(this).attr('id'));
      $(this).removeAttr('id');
      $(this).addClass('t-active').removeClass('t-inactive').removeClass('ex');
      $(tile_holder).append($(this))
    }
  })
  $('.tile-holder').empty();
  $('#exchange').hide();
  refillTiles();
  $.each(ex_Arr, function(key,value){
    tiles_left.push([value]);
  })
  current_move = !current_move;
  getTurn();
})

$('#exchange').on('click','.tile',function(e){
   e.preventDefault();
  $(this).attr('border-color','red');
  $(this).addClass('ex');
})

$('.pass').on('click', function(){
  current_move = !current_move;
  getTurn();
})

$('.clear').on('click',function(){
  letters.forEach(function(element,index){
    let cell = element[0];
    let value = element[1];
    if (current_move){
      $('.t1').each(function(){
        if ($(this).hasClass('t-active')){
          $(this).addClass(value).addClass('t-inactive').removeClass('t-active').attr('id', value);
          return false;
        }
      })
    } else {
      $('.t2').each(function(){
        if ($(this).hasClass('t-active')){
          $(this).addClass(value).addClass('t-inactive').removeClass('t-active').attr('id', value);
          return false;
        }
      })
    }
    $('#' + cell).removeClass(value).removeClass('s-active').removeAttr('value');
  })
  letters=[];
})

function checkStart(){
  if (!$('.113').hasClass('s-active')){
    $('.message').empty();
    $('.message').append(`<p>Start your word at the star</p>`)
  return false
  }
  return true;
}

function checkIfTilesPlayed(){
  if (current_move){
    if ($('.tile-holder1').children().hasClass('t-active')) {
      return true;
    }
  } else {
    if ($('.tile-holder2').children().hasClass('t-active')) {
      return true;
    }
  }
  return false;
}

function updateTileInfo(){
  $('.tiles-left').empty();
  $('.tiles-left').append(`<h4>Tiles left : ${tiles_left.length}</h4>`);
}

function displayTotalScore(){
  if (current_move){
    $('#p1-score').empty();
    $('#p1-score').append('Total Score: ' + player1_score);
  } else {
    $('#p2-score').empty();
    $('#p2-score').append('Total Score: ' + player2_score);
  }
}

function displayLastMove() {
  if (current_move) {
    $('#p1-last').empty();
    $('#p1-last').append('Last move: ')
    console.log(valid_words);
    $.each(valid_words, function(key, value) {
    $('#p1-last').append(valid_words[key][0] + ' - ' + valid_words[key][1]);
    $('.words').append(valid_words[key][0] + '<br>')
    });
  } else {
    $('#p2-last').empty();
    $('#p2-last').append('Last move: ')
    $.each(valid_words, function(key, value) {
      $('#p2-last').append(valid_words[key][0] + ' - ' + valid_words[key][1]);
      $('.words').append(valid_words[key][0] + '<br>')
    });
  }
  displayTotalScore();
}

function updateScore(score){
  if (current_move){
    console.log(player1_score);
    player1_score += score;
  } else {
    player2_score += score;
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
   selected_tile = ev.target;
   return true;
 }
   return false;
}

function dragEnterBoard(ev) {
   ev.preventDefault();
   if ( $(ev.target).hasClass("droptarget") && !$(ev.target).hasClass("v-active") && !$(ev.target).hasClass("s-active")) {
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
   if ( $(ev.target).hasClass("droptarget") && !$(ev.target).hasClass("v-active") && !$(ev.target).hasClass("s-active")) {
     let data_1 = ev.dataTransfer.getData("Text_1");
     let data_2 = ev.dataTransfer.getData("Text_2");
     let origin = ev.dataTransfer.getData("Text_3");
    ev.target.style.border = "";
    if (origin == 'board'){
      $(ev.target).addClass(data_2);
      $(selected_tile).removeClass('s-active').removeClass(data_2);
      let tempArr = letters.map(function(arr){ return arr[0]})
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
    let data_1 = ev.dataTransfer.getData("Text_1");
    let data_2 = ev.dataTransfer.getData("Text_2");
    let origin = ev.dataTransfer.getData("Text_3");
    ev.target.style.border = "";
    if (origin == "holder"){
      $(selected_tile).removeClass(data_2);
      $(selected_tile).removeAttr('id')
      $(selected_tile).removeClass('t-inactive').addClass('t-active');
    } else if (data_1 !== ''){
      $('#' + data_1).removeClass('s-active').removeClass(data_2);
      let tempArr = letters.map(function(arr){ return arr[0]})
      letters.splice(tempArr.indexOf(data_1),1);
    }
    $(ev.target).addClass(data_2).addClass('t-inactive').removeClass('t-active');
    $(ev.target).attr('id',data_2);
  }
  return true;
}
