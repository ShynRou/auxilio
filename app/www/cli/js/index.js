const input = document.getElementById('input');
const log = document.getElementById('log');

const isInt = function (value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
};

const toSnarkdown = function ( obj, indent = '' ) {
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
          result += `${toSnarkdown(obj[key], indent + key+'. ')}\n`;
        }
        else {
          result += `${indent}**${key}**:\n${toSnarkdown(obj[key], indent+'- ')}\n`;
        }
      }
      result = result.substr(0,result.length-1);
    break;
  }

  console.log(result);
  return result;
};


const sendMessage = function (message) {
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
    sendMessage(safeInput)
      .then(
        (answer) => {
          log.innerHTML = log.innerHTML + '<br>' + snarkdown(toSnarkdown(answer));
        })
      .catch(
        (err) => {
          console.error(err)
        }
      );      
  }
};