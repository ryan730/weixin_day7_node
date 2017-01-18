/**
 * Created by zhuyan6 on 17/1/13.
 */
'use strict'

var sha1 = require( 'sha1' );
var Wechat = require( './wechat.js' );
var util = require( './util.js' );

var getRawBody = require( 'raw-body' );

module.exports = function( opts ,handler) {
    var wechat = new Wechat( opts );
    //yield getRawBody->yield util.parseXMLAsync->yield util.formatMessage->yield weixin()->wechat.reply()
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
        console.log( 'method:', this.method );
        if ( this.method === 'GET' ) {
            if ( sha === signature ) {//本地服务拼接与微信远端吻合
                this.body = echostr + '';
            }else {
                this.body = 'wrong22';
            }
            return false;
        }
        if ( this.method === 'POST' ) {
            if ( sha !== signature ) {//本地服务拼接与微信远端吻合
                this.body = 'wrong';
                return false;
            }
        }

        var data = yield getRawBody( this.req, {//buffer转字符(xml)
            length:this.length,
            limit:'1mb',
            encoding:this.charset
        } );

        var content = yield util.parseXMLAsync( data );//xml 转 json

        var message = yield util.formatMessage( content.xml );//xml 转 json

        this.message =  message;

        yield handler.call( this, next );

        wechat.reply.call( this );

        //console.log('this.req:',this.req)
        //console.log('this.req:',data);
        //console.log('data.toString:',data.toString());
        //console.log( 'message:', message );

    };
};

