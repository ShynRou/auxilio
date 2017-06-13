module.exports = {
  method: ['GET'],
  path: '/cli/{param*}',
  config: {
    //auth: { mode: 'try' },
  },
  description: 'simple web CLI',
  handler: {
    directory: {
      path: 'app/www/cli'
    }
  }
};