const Bcrypt = require('bcrypt');
const Boom = require('boom');

const DB_AUTH_USERS = 'users';
const DB_AUTH_SESSIONS = 'sessions';

const Auth = function (server) {

  this.server = server;

  const cache = server.cache(
    { segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 }
  );
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', 'try', {
    password: this.server.config.auth.cookie.password,
    cookie: this.server.config.auth.cookie.name,
    isSecure: this.server.config.auth.cookie.isSecure,
    validateFunc: this.validateCookie
  });

  this.users = server.plugins['hapi-mongodb'].db.collection(DB_AUTH_USERS);

  console.log('AUTH INITIALIZED');
};


Auth.prototype.validateCookie = function (request, session, callback) {

  try {
    let sessionObj = this.sessions.find(session.sid);

    if (sessionObj) {
      return callback(null, true, sessionObj);
    }
    else {
      return callback(null, false);
    }
  }
  catch (e) {
    return callback(err, false);
  }
};

Auth.prototype.validateUsername = function (username) {

  if (!username) {
    return username;
  }

  let result = {
    string: typeof username === 'string',
    minLength: username.length >= this.server.config.auth.rules.username.minLength,
    maxLength: username.length <= this.server.config.auth.rules.username.maxLength,
    pattern: !this.server.config.auth.rules.username.pattern
    || new RegExp(this.server.config.auth.rules.username.pattern).test(username),
  };

  result.valid = result.string && result.minLength && result.maxLength && result.pattern;

  return result;
};

Auth.prototype.validatePassword = function (password) {
  if (!password) {
    return password;
  }

  let result = {
    string: typeof password === 'string',
    minLength: password.length >= this.server.config.auth.rules.password.minLength,
    maxLength: password.length <= this.server.config.auth.rules.password.maxLength,
    pattern: !this.server.config.auth.rules.password.pattern
    || new RegExp(this.server.config.auth.rules.password.pattern).test(password),
  };

  result.valid = result.string && result.minLength && result.maxLength && result.pattern;

  return result;
};

Auth.prototype.validateEmail = function (email) {
  if (!email) {
    return email;
  }

  const result = Joi.string().email().validate(email) || {};
  result.valid = !result.error;
  return result;
};


Auth.prototype.login = async function (username, password, request) {

  let entry = await this.users.findOne({_id: input.username});
  if (entry && await bcrypt.compare(password, entry.password)) {

    const sid = UUID.v4();
    if(entry.sid && entry.sid.length !== undefined) {
      entry.sid.push(sid);
    }
    else {
      entry.sid = [sid];
    }
    this.users.update(entry);

    request.cookieAuth.set({sid: sid});
    return request;
  }
  else {
    throw Boom.unauthorized('username not found');
  }
};

Auth.prototype.register = function (username, password, email, request) {
  if(this.users) {
    let validation = this.validateUsername(username);
    if (!validation || !validation.valid) {
      throw Boom.badData('username invalid', { username: validation });
    }

    let entry = this.users.findOne({ username });
    console.log(username);
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

    return Bcrypt.hash(password, this.server.config.auth.salt).then(function (hash) {
        if (hash) {
          entry = {
            username: username,
            password: hash,
            email: email,
          };

          this.users.add(entry);
          return true;
        }
        throw Boom.internal('could not generate hash');
      }
    ).then( (success) => success && this.login(username, password, request));
  }
  else {
    throw Boom.internal('user collection not found');
  }
};

Auth.prototype.logout = function (request) {
  this.sessions.findAndRemove({sid: request.credentials.sid});
  request.cookieAuth.clear();
};

module.exports = Auth;