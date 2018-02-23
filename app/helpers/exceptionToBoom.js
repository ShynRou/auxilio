const Boom = require('boom');

module.exports = function (error) {
  if (error) {
    switch (error.name) {
      case 'TypeError':
        return Boom.badRequest(error.message);
    }
  }

  return Boom.boomify(error);
};