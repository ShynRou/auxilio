const input = document.getElementById('input');
const log = document.getElementById('log');

const history = [];
var historyPointer = -1;

const isInt = function (value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
};

const toMarkdown = function (obj, indent = '' ) {
  indent = ' '.repeat(indent.length);
  if(!obj)
    return null;

  let result = '';

  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'boolean':
      result += indent+obj;
      break;
    case 'object':
      for (let key in obj) {
        if(isInt(key)) {
          result += `${indent}${key}.\n${toMarkdown(obj[key], indent+'  ')}\n`;
        }
        else {
          result += `${indent}- ${key}:\n${toMarkdown(obj[key], indent+'  ')}\n`;
        }
      }
      result = result.substr(0,result.length-1);
    break;
  }

  return result;
};


const sendMessage = function (message) {
  history.push(message);
  historyPointer = history.length;
  return new Promise((resolve,reject) => {
    var request = new XMLHttpRequest();
    request.open("POST","/api");
    request.addEventListener('load', function(event) {
      if (request.status >= 200 && request.status < 300) {
        resolve(JSON.parse(request.responseText));
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
    log.innerHTML = log.innerHTML + '<h3>&gt; '+safeInput+'</h3>';
    sendMessage(safeInput)
      .then(
        (answer) => {
          let text = toMarkdown(answer);
          console.log(text);
          log.innerHTML = log.innerHTML + '<br>' + parse(text);
          log.scrollTop = log.scrollHeight;
        })
      .catch(
        (err) => {
          console.error(err)
        }
      );      
  }
  else if(event.keyCode === 38) { // UP
    historyPointer = historyPointer === 0 ? history.length : (historyPointer - 1);
    input.value = history[historyPointer] || '';
  }
  else if(event.keyCode === 40) { // DOWN
    historyPointer = historyPointer === history.length ? 0 : (historyPointer + 1);
    input.value = history[historyPointer] || '';
  }
};