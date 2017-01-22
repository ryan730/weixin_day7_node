/**
 * Created by zhuyan6 on 17/1/22.
 */
var argv;
try {
    argv = JSON.parse( process.env.npm_config_argv ).original;
}	catch ( ex ) {
    argv = process.argv;
}
var last = argv[ argv.length - 1 ];
var fileIndex = ( last && last.indexOf( '--' ) !== -1 ) ?
    parseInt( last.replace( /\D/g, '' ) )  : '1';

var filePath = 'day' + fileIndex + '/app.js';
console.log( 'filePath:', filePath );
require( filePath );
