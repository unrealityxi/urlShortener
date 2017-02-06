module.exports = function(length = 5){
  const letters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var max = letters.length;
  var randomized = "";
  
  for (let i = 0; i < length; i++){
    randomized += letters[Math.floor(Math.random() * max)];
  }
  
  return randomized
  
}