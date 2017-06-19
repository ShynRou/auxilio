const Joi = require('joi');
const Boom = require('boom');
const UUID = require('uuid');

module.exports = {
  method: ['POST'],
  path: '/api/auth/login',
  config: {
    validate: {
      payload: {
        username: Joi.string().min(3).max(64).required(),
        password: Joi.string().min(6).max(64).required()
      }
    }
  },
  description: 'provides the user login',
  handler: function (request, reply) {
    if (request.payload.username == 'username' && request.payload.password == 'password') {


      const sid = UUID.v4();
      request.server.app.db.sessions.insert({
          sid,
          username: request.payload.username,
          password: request.payload.password,
        });

      request.cookieAuth.set({sid: sid});
      return reply(true);
    }

    return reply(Boom.unauthorized());
  }
};