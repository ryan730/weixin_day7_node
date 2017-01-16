/**
 * Created by zhuyan6 on 17/1/13.
 */
'use strict'
var Koa = require( 'koa' );
var path = require( 'path' );
var fs = require( 'fs' );
var Generator = require( './wechat/generator.js' );

var wechat_file = path.join( __dirname, './config/wechat.txt' );

var Promise = require( 'bluebird' );
var writeFileAsync = Promise.promisify( fs.writeFile );
var readFileAsync = Promise.promisify( fs.readFile );

var port = 1234;
var config = {
    wechat:{
        appID:'wxf848d9d2a2aac359',
        appSecret:'3a289a4245eb47e6ff13a20d86f9a5c2',
        token:'woshiryan',
        getAccessToken:function() {
            console.log( 'rrr:', fs.existsSync( wechat_file ) );
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

var app = new Koa();

console.log( 'app:', app );

app.use( Generator( config.wechat ) );

app.listen( port );
console.log( 'listening:', port );
