/**
 @name compress
 @param {string} str
 @return {string} str
 @desc Receives string as an input and shortens the string by reducing consecutive character repetitions		
**/
function compress(str) {
  var currentCounter = 0;
  var finalString = str[0];

  // Looping through the string
  for (var i = 1; i < str.length; i++) {
    currentCounter++;    // Incrementing counter
    if (str[i] !== str[i-1]) {
      finalString += currentCounter+str[i];  // Concatenating counter and next new letter
      currentCounter = 0;   
    }
  }

  // If 'i' reaches to end or length of 'i' is 1 letter then just adding counter to its end.
  if (i == str.length || str.length === 1) {
     finalString += currentCounter+1;
  }

  return finalString;
}


 var str = 'aaaabbaaaababbbcccccccccccc';
//a4b2a4b1a1b3c12

console.log(compress(str));
