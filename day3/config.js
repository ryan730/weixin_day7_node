/**
 * Created by zhuyan6 on 17/1/18.
 */
var path = require( 'path' );
var fs = require( 'fs' );

var Promise = require( 'bluebird' );
var wechat_file = path.join( __dirname, './config/wechat.txt' );
var writeFileAsync = Promise.promisify( fs.writeFile );
var readFileAsync = Promise.promisify( fs.readFile );

var port = 1234;
var config = {
    wechat:{
        appID:'wxf848d9d2a2aac359',
        appSecret:'3a289a4245eb47e6ff13a20d86f9a5c2',
        token:'woshiryan',
        getAccessToken:function() {
            console.log( 'wechat_file:', fs.existsSync( wechat_file ) );
            if ( !fs.existsSync( wechat_file ) ) {
                writeFileAsync( wechat_file, '' );
            };
            return readFileAsync( wechat_file, 'utf8' );
        },
        saveAccessToken:function( data ) {
            var data = JSON.stringify( data );
            return writeFileAsync( wechat_file, data, 'utf8' );
        }
    }
};