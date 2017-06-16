const cache = server.cache(
  { segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 }
);
server.app.cache = cache;

server.auth.strategy('session', 'cookie', true, {
  password: '>kshdl:_As,d_:?=§$.,uadI((/§ujSdadja#sl",das34ohsjd,mN;S:;DAp=)"3434>',
  cookie: 'SID',
  redirectTo: '/api/auth/login',
  isSecure: false,
  validateFunc: function (request, session, callback) {

    cache.get(session.sid, (err, cached) => {

      if (err) {
        return callback(err, false);
      }

      if (!cached) {
        return callback(null, false);
      }

      return callback(null, true, cached.account);
    });
  }
});