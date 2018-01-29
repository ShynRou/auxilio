const Bcrypt = require('bcrypt');
const Boom = require('boom');
const UUID = require('uuid');
const Joi = require('joi');
const JWT = require('jsonwebtoken');

const DB_AUTH_USERS = 'users';
const DB_AUTH_GROUPS = 'groups';

const Auth = function (server) {

  this.server = server;

  const cache = server.cache(
    {segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000}
  );
  server.app.cache = cache;

  server.auth.strategy('jwt', 'jwt', {
    key: server.app.config.auth.cookie.secret,
    cookieKey: server.app.config.auth.cookie.name,
    verifyOptions: {
      ignoreExpiration: false,
      algorithms: ['HS256']
    },
    validate: (decoded, request) => this.validateCookie(decoded, request)
  });

  server.auth.default({strategy: 'jwt', mode: 'try'});

  this.users = server.plugins['hapi-mongodb'].db.collection(DB_AUTH_USERS);
  this.groups = server.plugins['hapi-mongodb'].db.collection(DB_AUTH_GROUPS);

  // assemble cookie options

  this.cookieOptions = {
    ttl: server.app.config.auth.cookie.ttl, // expires a year from today
    encoding: 'none',    // we already used JWT to encode
    domain: server.app.config.auth.cookie.domain,
    isSecure: server.app.config.auth.cookie.isSecure,
    isHttpOnly: server.app.config.auth.cookie.isHttpOnly,    // prevent client alteration
    clearInvalid: server.app.config.auth.cookie.clearInvalid, // remove invalid cookies
    strictHeader: server.app.config.auth.cookie.strictHeader,   // don't allow violations of RFC 6265
    isSameSite: false,
    path: server.app.config.auth.cookie.path
  };

  console.log('AUTH INITIALIZED');
};


Auth.prototype = {
  validateCookie: async function (decoded, request) {

    try {
      let userObj = await this.users.findOne({_id: decoded.userId});

      if (userObj) {
        let currentTime = Date.now();
        let aliveSessions = (userObj.sessions || []).filter(s => s.ttl + s.t > currentTime);
        if (aliveSessions.length !== userObj.sessions) {
          userObj.sessions = aliveSessions;
          this.users.save(userObj);
        }
        if (userObj.sessions.find((s) => s && s.sid === decoded.sid)) {
          const result = {
            isValid: true,
            credentials: {
              id: userObj._id,
              scope: userObj.groups,
              email: userObj.email,
              avatar: userObj.avatar,
            }
          };
          return result;
        }
      }
      return {isValid: false};
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  },

  validateuserId: function (userId) {

    if (!userId) {
      return userId;
    }

    let result = {
      string: typeof userId === 'string',
      minLength: userId.length >= this.server.app.config.auth.rules.userId.minLength,
      maxLength: userId.length <= this.server.app.config.auth.rules.userId.maxLength,
      pattern: !this.server.app.config.auth.rules.userId.pattern
      || new RegExp(this.server.app.config.auth.rules.userId.pattern).test(userId),
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


  login: async function (userId, password, request, responseToolkit) {

    let entry = await this.users.findOne({_id: userId});
    if (entry && await Bcrypt.compare(password, entry.password)) {

      const session = {sid: UUID.v4(), ttl: this.server.app.config.auth.cookie.ttl, t: Date.now()};
      if (entry.sessions && entry.sessions.length !== undefined) {
        entry.sessions.push(session);
      }
      else {
        entry.sessions = [session];
      }
      this.users.save(entry);


      let credentials = {...session, userId};
      let token = JWT.sign(credentials, this.server.app.config.auth.cookie.secret);

      return responseToolkit
        .response(JSON.stringify({
          success: true,
          key: this.server.app.config.auth.cookie.name,
          value: token,
          ttl: this.server.app.config.auth.cookie.ttl,
          t: Date.now()
        }))
        .type('application/json')
        .state(this.server.app.config.auth.cookie.name, token, this.cookieOptions);
    }
    else {
      throw Boom.unauthorized('userId and password invalid');
    }
  },

  register: async function (userId, password, email, request, responseToolkit) {
    if (this.users) {
      let validation = this.validateuserId(userId);
      if (!validation || !validation.valid) {
        throw Boom.badData('userId invalid', {userId: validation});
      }

      let entry = await this.users.findOne({_id: userId});
      if (entry) {
        throw Boom.conflict('userId already taken', {userId: {taken: true}});
      }

      validation = this.validatePassword(password);
      if (!validation || !validation.valid) {
        throw Boom.badData('password invalid', {password: validation});
      }

      validation = this.validateEmail(email);
      if (!validation) {
        throw Boom.badData('email invalid', {email: validation});
      }

      let groups = [];
      // IF NO USERS, FIRST IS ADMIN
      if (await this.users.count() === 0) {
        await this.groups.update({_id: 'admin'}, {name: 'Admin'}, {upsert: true});
        groups.push('admin');
      }

      return Bcrypt.hash(password, this.server.app.config.auth.salt).then((hash) => {
          if (hash) {
            entry = {
              _id: userId,
              password: hash,
              email: email,
              groups: groups,
            };

            this.users.insert(entry);
            return true;
          }
          throw Boom.internal('could not generate hash');
        }
      ).then((success) => {
        return {success};
      });
    }
    else {
      throw Boom.internal('user collection not found');
    }
  },

  logout: async function (request, responseToolkit) {
    let user = await this.users.findOne({_id: request.credentials._id});
    let index = user.sessions && user.sessions.findIndex((s) => s && s.sid === request.credentials.session);
    if (index >= 0) {
      user.sessions.splice(index);
      this.users.save(user);
      return responseToolkit
        .response({success: true})
        .type('application/json')
        .unstate(this.server.app.config.auth.cookie.name);
    }
    return responseToolkit
      .response({success: false})
      .type('application/json');
  },

  changePassword: async function (userId, oldPassword, newPassword) {
    let entry = await this.users.findOne({_id: userId});
    if (entry && await Bcrypt.compare(oldPassword, entry.password)) {
      entry.password = await Bcrypt.hash(newPassword, this.server.app.config.auth.salt);
      this.users.save(entry);
    }
    else {
      throw Boom.unauthorized('userId and password invalid');
    }
  }
};

module.exports = Auth;