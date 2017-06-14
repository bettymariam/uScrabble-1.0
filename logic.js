//const rp = require('request-promise')

function checkPlacement(cb){
  let curr_direction = '';
  let prev_direction = '';
  if (letters.length === 1 && start === true){
    alert('Build first word using atleast two letters');
    return false;
  }
  if (letters.length === 1 && start !== true) {
    if (!checkIfConnected(parseInt(letters[0][0]))){
      alert('Build words using atleast one letter that is already on the board');
      return false;
    } else {
      curr_direction = 'none';
    }
  }

  letters.sort(function(a, b) {
    return a[0] - b[0];
  });

  for(i = 0; i < letters.length - 1; i++){
    let id_1 = parseInt(letters[i][0]);
    let id_2 = parseInt(letters[i+1][0]);
    let left = id_1 - 1;
    let right = id_1 + 1;
    let top = id_1 - 15;
    let bottom = id_1 + 15;
    prev_direction = curr_direction;

    switch(parseInt(id_2)){
      case left :
        curr_direction = 'horizontal';
        break;
      case right :
        curr_direction = 'horizontal';
        break;
      case top :
        curr_direction = 'vertical';
        break;
      case bottom :
        curr_direction = 'vertical';
        break;
      default :
        if (!checkIfPlacedBetweenExistingLetters(id_1,id_2,curr_direction)){
          alert('Use letters either horizonally or vertically to make words');
          return false;
        }
    }
    if (curr_direction !== prev_direction && prev_direction !== ''){
      alert('Use letters either horizonally or vertically to make words');
      return false;
    }
  }

  checkValidity(curr_direction, cb);
}

function checkIfConnected(id) {
  if ($('#' + (id + 1)).hasClass('v-active')) return true;
  if ($('#' + (id - 1)).hasClass('v-active')) return true;
  if ($('#' + (id + 15)).hasClass('v-active')) return true;
  if ($('#' + (id - 15)).hasClass('v-active')) return true;
  return false;
}

function checkIfPlacedBetweenExistingLetters(id_1, id_2, curr_direction){
  if (curr_direction === ''){
    if (checkRight(id_1, id_2, curr_direction)){
      return true;
    } else if (checkBottom(id_1, id_2, curr_direction)){
      return true;
    } else {
      return false;
    }
  } else if (curr_direction === 'horizontal'){
    return checkRight(id_1, id_2, curr_direction)
  } else {
    return checkBottom(id_1, id_2, curr_direction)
  }
}

function checkRight(id_1, id_2, curr_direction){
  let next_cell = $('.scrabble-board').children('#'+(id_1+1));
  while ($(next_cell).hasClass('v-active')){
    next_cell = $(next_cell).next();
    if ($(next_cell).hasClass(id_2)){
      curr_direction = 'horizontal'
      return true;
    } else if ($(next_cell).hasClass('outer')){
      return false;
    }
  }
  return false;
}

function checkBottom(id_1, id_2, curr_direction){
  let next_id = id_1 + 15;
  let next_cell = $('.scrabble-board').children('#'+(next_id));
  while ($(next_cell).hasClass('v-active')){
    next_id += 15
    next_cell = $('.scrabble-board').children('#'+(next_id));
    if ($(next_cell).hasClass(id_2)){
      curr_direction = 'vertical'
      return true;
    } else if ($(next_cell).hasClass('outer')){
      return false;
    }
  }
  return false;
}

function leftSide(id, left){
  let temp_Arr = [];
  let left_cell = '#' + left;
  for(let j=1; j<15; j++){
    if ($(left_cell).hasClass('v-active') || $(left_cell).hasClass('s-active')){
      temp_Arr.unshift($(left_cell).attr('value'));
      if ($(left_cell).hasClass('outer')){
        return temp_Arr;
      }
    } else {
      return temp_Arr;
    }
    left -= 1;
    left_cell = '#' + (left - 1);
  }
  return temp_Arr;
}

function above(id, top){
  let temp_Arr = [];
  let top_cell = '#' + top;
  for(let j=1; j<15; j++){
    if ($(top_cell).hasClass('v-active') || $(top_cell).hasClass('s-active')){
      temp_Arr.unshift($(top_cell).attr('value'));
      if ($(top_cell).hasClass('outer')){
        return temp_Arr;
      }
    } else {
      return temp_Arr;
    }
    top -= 15;
    top_cell = '#' + top;
  }
  return temp_Arr;
}

function down(id, bottom){
  let temp_Arr = [];
  let bottom_cell = '#' + bottom;
  for(let j=1; j<15; j++){
    if ($(bottom_cell).hasClass('v-active') || $(bottom_cell).hasClass('s-active')){
      temp_Arr.push($(bottom_cell).attr('value'));
      if ($(bottom_cell).hasClass('outer')){
        return temp_Arr;
      }
    } else {
      return temp_Arr;
    }
    bottom += 15;
    bottom_cell = '#' + bottom;
  }
  return temp_Arr;
}

function rightSide(id, right){
  let temp_Arr = [];
  right_cell = '#' + right;
  for(let j=1; j<15; j++){
    if ($(right_cell).hasClass('v-active') || $(right_cell).hasClass('s-active')){
      temp_Arr.push($(right_cell).attr('value'));
      if ($(right_cell).hasClass('outer')){
        return temp_Arr;
      }
    } else {
      return temp_Arr;
    }
    right += 1;
    right_cell = '#' + right;
  }
  return temp_Arr;
}


function checkValidity(curr_direction, cb){
  let words = [];
  var joinedWords = [];
  for(let i = 0; i < letters.length; i++){
    let id = letters[i][0];
    let left = parseInt(id) - 1;
    let right = parseInt(id) + 1;
    let top = parseInt(id) - 15;
    let bottom = parseInt(id) + 15;
    let temp_Arr = [];

    if(i == 0){
      firstLetter(i,id, top, bottom, left, right, temp_Arr, words, curr_direction, cb);
    } else if ((i!==0)&&(i !== letters.length-1)){
      middleLetter(i,id, top, bottom, left, right, temp_Arr, words, curr_direction, cb);
    } else if ((i === (letters.length-1))){
      lastLetter(i,id, top, bottom, left, right, temp_Arr, words, curr_direction, cb);
    }
  }
  $.map(words, function(word,index){
    if (word.length > 1){
      joinedWords.push(word.join(''))
    }
  })
  let promises = createPromises(joinedWords)
  checkWord(promises,cb);
}

function createPromises(words){
  var promises = $.map(words, function (word, index) {
      return $.ajax({ url: makeUrl(word), method: 'GET'})
  })
  return promises;
}

function makeUrl(word){
  let proxy = "https://galvanize-cors-proxy.herokuapp.com/";
  let url = proxy + 'http://www.wordgamedictionary.com/api/v1/references/scrabble/' + word + '\?key=1.0612195181598369e30'
  return url;
}

function checkWord(promises, cb){
  let total_score = 0;
  let allValid = false;
  Promise.all(promises).then(function(results){
    console.log(results)
    results.map(function(result){
      console.log(result);
      let xml = new XMLSerializer().serializeToString(result)
      console.log(xml);
      let xmlDoc = $.parseXML(xml);
      let $xml = $(xmlDoc);
      let success = $xml.find('scrabble').text();
      let word = $xml.find('word').text();
      let score = parseInt($xml.find('scrabblescore').text());
      total_score += score
      if (success == 1) {
        allValid = true;
        let temp_Arr = [word,score]
        if (valid_words) {
          valid_words.push(temp_Arr);
        } else {
          valid_words = [temp_Arr];
        }
      }
      else {
        allValid = false;
        alert('Invalid word');
      }
    });
    if (allValid){
      cb(total_score);
    }
 }).catch(function(error){
    console.log('Error:',error);
 });
}

function calculateScore(words){
  let score = 0;
  $.each(words, function(index, value){
    score += tiles.map(function(element){
     let tile = element.indexOf(value);
     return tiles[tile][2];
    })
  })
  return score;
}

function firstLetter(i, id, top, bottom, left, right, temp_Arr, words, curr_direction, cb){
  console.log("first letter")
  temp_Arr = above(id, top);
  temp_Arr.push($('#'+(id)).attr('value'));
  words.push(temp_Arr.concat(down(id, bottom)));
  temp_Arr = [];
  temp_Arr = leftSide(id, left);
  temp_Arr.push($('#'+(id)).attr('value'));
  words.push(temp_Arr.concat(rightSide(id,right)));
}

function middleLetter(i, id, top, bottom, left, right, temp_Arr, words, curr_direction, cb){
  console.log("other letters")
  let str = ''
  temp_Arr = [];
  if (curr_direction == 'horizontal') {
    temp_Arr = above(id, top);
    temp_Arr.push($('#'+(id)).attr('value'))
    str = temp_Arr.concat(down(id, bottom));
    if (str.length > 1){
      words.push(str);
    }
  } else {
    temp_Arr = leftSide(id, left);
    temp_Arr.push($('#'+(id)).attr('value'));
    str = temp_Arr.concat(rightSide(id,right))
    if (str.length > 1){
      words.push(str);
    }
  }
}

function lastLetter(i, id, top, bottom, left, right, temp_Arr, words, curr_direction, cb){
  console.log("last letter")
  let str = ''
  temp_Arr = [];
  if (curr_direction === 'horizontal') {
    temp_Arr = above(id, top);
    temp_Arr.push($('#'+(id)).attr('value'))
    str = temp_Arr.concat(down(id, bottom))
    if (str.length > 1){
      words.push(str);
    }
  } else {
    temp_Arr = leftSide(id, left);
    temp_Arr.push($('#'+(id)).attr('value'));
    str = temp_Arr.concat(rightSide(id,right));
    if (str.length > 1){
      words.push(str);
    }
  }
}
