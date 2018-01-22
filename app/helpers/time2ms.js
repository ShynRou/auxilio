
const units = {
  years:  31536000000,
  year: 31536000000,
  y:  31536000000,
  a:  31536000000,
  months: 2628000000,
  month:  2628000000,
  m:  2628000000,
  weeks:  604800000,
  week: 604800000,
  w:  604800000,
  days: 86400000,
  day:  86400000,
  d:  86400000,
  hours:  3600000,
  hour: 3600000,
  h:  3600000,
  minutes:  60000,
  minute: 60000,
  min:  60000,
  seconds:  1000,
  second: 1000,
  sec:  1000,
  s:  1000,
  ms: 1,
};

module.exports = function (timeString) {
  const match =
    /^([\d.]+) ?(\w+)$/.exec(timeString.toLowerCase());
  if(!match || !match[1] || !match[2]) {
    throw new TypeError(timeString + ' is not a valid timeString');
  }
  const unit = match[2].toLowerCase();
  let value = parseFloat(match[1]);

  return value*units[unit];
};

