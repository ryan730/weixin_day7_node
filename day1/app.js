/**
 * Created by zhuyan6 on 17/1/13.
 */
'use strict'
var Koa = require( 'koa' );
var sha1 = require( 'sha1' );
var port = 1234;
var config = {
    wechat:{
        appID:'wxf848d9d2a2aac359',
        appSecret:'3a289a4245eb47e6ff13a20d86f9a5c2',
        token:'woshiryan'
    }
};

var app = new Koa();

console.log( 'app:', app );

app.use( function *( next ) {
    console.log( this.query );
    var token = config.wechat.token;
    var signature = this.query.signature;
    var nonce = this.query.nonce;
    var timestamp = this.query.timestamp;
    var echostr = this.query.echostr;

    var str = [ token, timestamp, nonce ].sort().join( '' );//拼接规则
    var sha = sha1( str );

    if ( sha === signature ) {//本地服务拼接与微信远端吻合
        this.body = echostr + '';
    }else {
        this.body = 'wrong';
    }
} );

app.listen( port );
console.log( 'listening:', port );
