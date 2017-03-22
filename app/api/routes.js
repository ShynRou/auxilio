/**
 * Created by dustinh on 19.08.2016.
 */

module.exports = function load(server) {
  var glob = require( 'glob' ),
      path = require( 'path' );

  console.log("==============================================================================");
  console.log("INITIALIZING ROUTES");
  glob.sync( __dirname+'/**/*.route.js' ).forEach( function( file ) {
    let route = require( path.resolve( file ) );
    server.route(route);
    console.log( `[${route.method.join(', ')}] ${route.path} ${route.config && route.config.auth ? `n=n==(${route.config.auth})` : ''} ${route.description ? '//'+route.description : '' }`);
  });
  console.log("==============================================================================");
};