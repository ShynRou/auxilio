const input = document.getElementById('input');
const log = document.getElementById('log');


const sendMessage = function (message) {
  return new Promise((resolve,reject) => {
    var request = new XMLHttpRequest();
    request.open("POST","/api/");
    request.addEventListener('load', function(event) {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.responseText);
      } else {
        reject(request.responseText);
      }
    });
    request.send(message);
  });
};

input.onkeydown = (event) => {
  if(event && event.keyCode === 13) {
    var safeInput = input.value.replace(/[<>]/g, '');
    
    input.value = '';
    sendMessage(safeInput)
      .then(
        (answer) => {
          log.innerHTML = log.innerHTML + '<br>' + snarkdown(answer);
        })
      .catch(
        (err) => {
          console.err(err)
        }
      );      
  }
};