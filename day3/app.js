/**
 * Created by zhuyan6 on 17/1/13.
 */
'use strict'
var Koa = require( 'koa' );
var Generator = require( './wechat/generator.js' );
var config = require('./config');
var weixin = require('./weixin');

var app = new Koa();

var generator = Generator( config.wechat ,weixin.reply)

console.log( 'app:', app );
//console.log( 'generator:', generator );

app.use( generator );

app.listen( port );
console.log( 'listening:', port );
