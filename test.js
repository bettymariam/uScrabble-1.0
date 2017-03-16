function checkValidity(curr_direction){
  var temp_Arr = [];
  for(let i = 0; i < letters.length; i++){
    var id_1 = letters[i][0]
    var left = parseInt(id_1) - 1;
    var right = parseInt(id_1) + 1;
    var top = parseInt(id_1) - 15;
    var bottom = parseInt(id_1) + 15;

    while (i == 0){

      if (curr_direction == 'horizontal') {
        for(var j = 0; j < 12; j++){
          if ($('.scrabble-board').children('#'+(left+j)).hasClass('v-active')){
            letters.unshift($('.scrabble-board').children('#'+(left+j)).attr('value'));

            if ($('.scrabble-board').children('#'+(left+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(top+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(top+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(top+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(top+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }


      } else {
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(top+j)).hasClass('v-active')){
            letters.unshift ($('.scrabble-board').children('#'+(top+j)).attr('value'));

            if ($('.scrabble-board').children('#'+(top+j)).hasClass('outer')){
               break;
            }
          } else {
            break;
          }
        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(left+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(left+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(left+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(left+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(right+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(right+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(right+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(right+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
      }
    }
    while ((i!==0)&&(i !== letters.length-1)){
      if (curr_direction == 'horizontal') {
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(top+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(top+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(top+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(top+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
      } else {
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(left+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(left+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(left+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(left+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(right+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(right+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(right+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(right+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
      }
    }
    while ((i !== letters.length-1)){
      if (curr_direction == 'horizontal') {
        for(var j = 0; j < 12; j++){
          if ($('.scrabble-board').children('#'+(right+j)).hasClass('v-active')){
            letters.unshift($('.scrabble-board').children('#'+(right+j)).attr('value'));

            if ($('.scrabble-board').children('#'+(right+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(top+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(top+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(top+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(top+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i+7].unshift($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            } else {
              temp_Arr[i+7] = ($('.scrabble-board').children('#'+(bottom+j)).attr('value'));
            }
            if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
      } else {
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('v-active')){
            letters.unshift ($('.scrabble-board').children('#'+(bottom+j)).attr('value'));

            if ($('.scrabble-board').children('#'+(bottom+j)).hasClass('outer')){
               break;
            }
          } else {
            break;
          }
        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(left+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(left+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(left+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(left+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }

        }
        for(var j=0; j<12; j++){
          if ($('.scrabble-board').children('#'+(right+j)).hasClass('v-active')){
            if (temp_Arr[i]){
              temp_Arr[i].shift($('.scrabble-board').children('#'+(right+j)).attr('value'));
            } else {
              temp_Arr[i] = [$('.scrabble-board').children('#'+(right+j)).attr('value')];
            }
            if ($('.scrabble-board').children('#'+(right+j)).hasClass('outer')){
              break;
            }
          } else {
            break;
          }
        }
      }
    }
  }
  console.log(temp_Arr);
}
