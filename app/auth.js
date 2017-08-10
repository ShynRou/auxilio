const Bcrypt = require('bcrypt');
const Boom = require('boom');

const DB_AUTH_USERS = 'auth.users';

const Auth = function (server) {

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

  this.users = server.plugins.loki.db.getCollection(DB_AUTH_USERS);
  if (this.users) {
    this.users = server.plugins.loki.db.addCollection(DB_AUTH_USERS, {
      unique: ['username', 'email'],
    });
  }

  console.log('AUTH INITIALIZED');
};


Auth.prototype.validateCookie = function (request, session, callback) {

  try {
    let sessionObj = request.server.app.db.sessions.find(session.sid);

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


Auth.prototype.isValidLogin = function (username, password) {
  // TODO: add user management
  return (username == 'username' && password == 'password');
};


Auth.prototype.register = function (username, password, email) {

  if(this.users) {
    let entry = this.users.find({ username });
    if (entry) {
      throw Boom.conflict('username already taken', { username: { taken: true } });
    }

    let validation = this.validateUsername(username);
    if (!validation || !validation.valid) {
      throw Boom.badData('username invalid', { username: validation });
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
      }
    );
  }
  else {
    throw Boom.internal('user collection not found');
  }
};


Auth.prototype.login = function (request, username, password) {

  if (this.isValidLogin(username, password)) {
    const sid = UUID.v4();
    request.server.app.db.sessions.insert({
      sid,
      username: username,
    });

    request.cookieAuth.set({ sid: sid });
    return true;
  }
  return false;
};

Auth.prototype.logout = function (request) {
  console.log(request.credentials);
  // request.server.app.db.sessions.find({sid: request.credentials.sid});
  // request.cookieAuth.clear();
};

module.exports = Auth;