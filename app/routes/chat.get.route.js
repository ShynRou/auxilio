module.exports = {
  method: ['GET'],
  path: '/chat/{param*}',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'chat for text based api',
  handler: {
    directory: {
      path: 'app/www/chat'
    }
  }
};