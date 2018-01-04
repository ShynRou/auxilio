const Bcrypt = require('bcrypt');
const Boom = require('boom');
const UUID = require('uuid');
const Joi = require('joi');

const DB_AUTH_USERS = 'users';

const Auth = function (server) {

  this.server = server;

  const cache = server.cache(
    { segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 }
  );
  server.app.cache = cache;

  server.auth.strategy('jwt', 'jwt', {
    key: server.app.config.auth.cookie.secret,
    cookieKey: server.app.config.auth.cookie.name,
    verifyOptions: {
      ignoreExpiration: false,
      algorithms: ['HS256']
    },
    validate: this.validateCookie
  });

  server.auth.default({ strategy: 'jwt', mode: 'try' });

  this.users = server.plugins['hapi-mongodb'].db.collection(DB_AUTH_USERS);

  console.log('AUTH INITIALIZED');
};


Auth.prototype = {
  validateCookie: async function (request, session, callback) {

    try {
      let userObj = await this.users.findOne({ _id: session.username });

      if (userObj && userObj.sessions && userObj.sessions.find((s) => s && s.sid === session.sid)) {
        return callback(null, true, userObj);
      }
      else {
        return callback(null, false);
      }
    }
    catch (e) {
      return callback(err, false);
    }
  },

  validateUsername: function (username) {

    if (!username) {
      return username;
    }

    let result = {
      string: typeof username === 'string',
      minLength: username.length >= this.server.app.config.auth.rules.username.minLength,
      maxLength: username.length <= this.server.app.config.auth.rules.username.maxLength,
      pattern: !this.server.app.config.auth.rules.username.pattern
      || new RegExp(this.server.app.config.auth.rules.username.pattern).test(username),
    };

    result.valid = result.string && result.minLength && result.maxLength && result.pattern;

    return result;
  },

  validatePassword: function (password) {
    if (!password) {
      return password;
    }

    let result = {
      string: typeof password === 'string',
      minLength: password.length >= this.server.app.config.auth.rules.password.minLength,
      maxLength: password.length <= this.server.app.config.auth.rules.password.maxLength,
      pattern: !this.server.app.config.auth.rules.password.pattern
      || new RegExp(this.server.app.config.auth.rules.password.pattern).test(password),
    };

    result.valid = result.string && result.minLength && result.maxLength && result.pattern;

    return result;
  },

  validateEmail: function (email) {
    if (!email) {
      return email;
    }

    const result = Joi.string().email().validate(email) || {};
    result.valid = !result.error;
    return result;
  },


  login: async function (username, password, request, responseToolkit) {

    let entry = await this.users.findOne({ _id: username });
    if (entry && await Bcrypt.compare(password, entry.password)) {

      const sid = UUID.v4();
      if (entry.sid && entry.sid.length !== undefined) {
        entry.sid.push(sid);
      }
      else {
        entry.sid = [sid];
      }
      this.users.save(entry);

      return responseToolkit
        .response({ success: true, key: this.server.app.config.auth.cookie.name, value: sid })
        .type('application/json')
        .state(this.server.app.config.auth.cookie.name, sid);
    }
    else {
      throw Boom.unauthorized('username not found');
    }
  },

  register: async function (username, password, email, request, responseToolkit) {
    if (this.users) {
      let validation = this.validateUsername(username);
      if (!validation || !validation.valid) {
        throw Boom.badData('username invalid', { username: validation });
      }

      let entry = await this.users.findOne({ _id: username });
      console.log(username, entry);
      if (entry) {
        throw Boom.conflict('username already taken', { username: { taken: true } });
      }

      validation = this.validatePassword(password);
      if (!validation || !validation.valid) {
        throw Boom.badData('password invalid', { password: validation });
      }

      validation = this.validateEmail(email);
      if (!validation) {
        throw Boom.badData('email invalid', { email: validation });
      }

      return Bcrypt.hash(password, this.server.app.config.auth.salt).then((hash) => {
          if (hash) {
            entry = {
              _id: username,
              password: hash,
              email: email,
            };

            this.users.insert(entry);
            return true;
          }
          throw Boom.internal('could not generate hash');
        }
      ).then((success) => {
        if (success) {
          return this.login(username, password, request, responseToolkit);
        }
      });
    }
    else {
      throw Boom.internal('user collection not found');
    }
  },

  logout: async function (request, responseToolkit) {
    let user = await this.users.findOne({ _id: request.credentials._id });
    let index = user.sessions && user.sessions.findIndex((s) => s && s.sid === request.credentials.session);
    if (index >= 0) {
      user.sessions.splice(index);
      this.users.save(user);
      return responseToolkit
        .response({ success: true })
        .type('application/json')
        .unstate(this.server.app.config.auth.cookie.name);
    }
    return responseToolkit
      .response({ success: false })
      .type('application/json');
  }
};

module.exports = Auth;