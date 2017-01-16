/**
 * Created by zhuyan6 on 17/1/13.
 */
'use strict'

var sha1 = require( 'sha1' );
var Promise = require( 'bluebird' );//参考:https://my.oschina.net/goskyblue/blog/534634
var Request = Promise.promisify( require( 'request' ) );

var prefix =  'https://api.weixin.qq.com/cgi-bin/token';
var api = {
    accessToken: prefix + '?grant_type=client_credential'
};

function Wechat( opts ) {
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken()
        .then( function( data ) {
            try {
                data = JSON.parse( data );
            }catch ( e ) {
                return that.updateAccessToken();
            }
            if ( that.isValidAccessToken( data ) ) {
                return Promise.resolve( data );
            }else {
                return that.updateAccessToken();
            }
        } )
        .then( function( data ) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;
            that.saveAccessToken( data );
        } );
}

Wechat.prototype.isValidAccessToken = function( data ) {
    if ( !data || !data.access_token || !data.expires_in ) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = ( new Date().getTime() );

    if ( now < expires_in ) {
        return true;
    }else {
        return false;
    }
};

Wechat.prototype.updateAccessToken = function( opts ) {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken +
        '&appid=' + appID +
        '&secret=' + appSecret;
    console.log( '提交的请求:', url );
    return new Promise( function( resolve, reject ) {
        Request( { url:url, json:true } ).then( function( response ) {
            console.log( 'response:', response.body );
            var data = response.body;
            var now = ( new Date().getTime() );
            var expires_in = now + ( data.expires_in - 20 ) * 1000;
            data.expires_in = expires_in;
            resolve( data );
        } );
    } );

};

module.exports = function( opts ) {
    var wechat = new Wechat( opts );
    return function *( next ) {
        console.log( this.query );
        var token = opts.token;

        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;

        var str = [ token, timestamp, nonce ].sort().join( '' );//拼接规则
        var sha = sha1( str );

        console.log( 'sha:', sha );
        console.log( 'signature:', signature );
        if ( this.method === 'GET' ) {
            if ( sha === signature ) {//本地服务拼接与微信远端吻合
                this.body = echostr + '';
            }else {
                this.body = 'wrong';
            }
        }
        if ( this.method === 'POST' ) {
            if ( sha !== signature ) {//本地服务拼接与微信远端吻合
                this.body = 'wrong';
                return false;
            }else {

            }
        }

    };
};

