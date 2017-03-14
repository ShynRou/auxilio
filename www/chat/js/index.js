const input = document.getElementById('input');
const log = document.getElementById('log');


const sendMessage = function (message) {
  // TODO: add your send Function Here;
  return new Promise((resolve,reject) => {
    setTimeout(() => resolve(message), 500);
  });
}

input.onkeydown = (event) => {
  if(event && event.keyCode === 13) {
    var safeInput = input.value.replace(/[<>]/g, '');
    
    input.value = '';
    sendMessage(safeInput)
      .then(
        (answer) => {
          log.innerHTML = log.innerHTML + '<br>' + safeInput; 
        })
      .catch(
        (err) => {
          console.err(err)
        }
      );      
  }
};