/**
 * Created by zhuyan6 on 17/1/16.
 */
var Promise = require( 'bluebird' );//参考:https://my.oschina.net/goskyblue/blog/534634
var Request = Promise.promisify( require( 'request' ) );
var util = require( './util' );
var fs = require( 'fs' );
var prefix =  'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload:prefix + 'media/upload?'
};

function Wechat( opts ) {
    if ( Wechat.instance ) {
        return Wechat.instance;
    }else {
        if ( !( this instanceof arguments.callee ) ) {
            return new arguments.callee();
        }else {
            Wechat.instance = this;
        }
    }
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
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
    console.log( 'updateAccessToken-提交的请求:', url );
    return new Promise( function( resolve, reject ) {
        Request( { url:url, json:true } ).then( function( response ) {
            console.log( 'updateAccessToken-返回的结果:', response.body );
            var data = response.body;
            var now = ( new Date().getTime() );
            var expires_in = now + ( data.expires_in - 20 ) * 1000;
            data.expires_in = expires_in;
            resolve( data );
        } );
    } );
};

Wechat.prototype.fetchAccessToken = function( opts ) {
    var that = this;
    if ( this.access_token && this.expires_in ) {
        if ( this.isValidAccessToken( this ) ) {
            return Promise.resolve( this );
        }
    }
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

            return Promise.resolve( data );
        } );
};

Wechat.prototype.uploadMaterial = function( type, filepath ) {
    var form = {
        media:fs.createReadStream( filepath )
    };
    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = api.upload +
                    'access_token=' + data.access_token +
                    '&type=' + type;
                console.log( 'uploadMaterial-提交的请求:', url );
                Request( { url:url, method:'POST', json:true, formData:form } )
                    .then( function( response ) {
                        console.log( 'uploadMaterial-返回的结果:', response.body );
                        var data = response.body;
                        if ( data ) {
                            resolve( data );
                        } else {
                            throw new Error( 'upload material fails!' );
                        }
                    } )
                    .catch( function( err ) {
                        reject( err );
                    } );
            } );
    } );
};

Wechat.prototype.reply = function() {
    var content = this.content;
    var message = this.message;

    var xml = util.tpl( content, message );

    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
    console.log( 'this.body:', content, this.body );
};

module.exports = Wechat;
