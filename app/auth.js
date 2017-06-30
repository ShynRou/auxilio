module.exports = function (server) {

  const cache = server.cache(
    {segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000}
  );
  server.app.cache = cache;

  server.auth.strategy('session', 'cookie', 'try', {
    password: '>kshdl:_As,d_:?=§$.,uadI((/§ujSda>dja#sl",das34ohsjd,mN;S:;DAp=)"3434>',
    cookie: 'SID',
    isSecure: false,
    validateFunc: function (request, session, callback) {
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

    }
  });

  console.log('AUTH INITILIZED')
};