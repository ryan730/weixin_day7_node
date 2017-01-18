/**
 * Created by zhuyan6 on 17/1/16.
 */
var xml2js = require('xml2js');
var Promise = require('bluebird');
var tpl = require('./tpl');

exports.tpl = function(content,message) {
    var info = {};
    var type = 'text';
    var fromUsername = message.FromUserName;
    var toUsername = message.ToUserName;

    if(Array.isArray(content)) {
        type = 'news'
    }

    type = content.type || type;
    info.content = content;
    info.createTime = new Date().getTime();
    info.msgType = type;
    info.toUsername = fromUsername;
    info.fromUsername = toUsername;

    return tpl.compiled(info);
}

exports.parseXMLAsync = function(xml) {
    return new Promise(function(resolve ,reject){
        xml2js.parseString(xml,{trim:true},function(err,content){
            if(err) reject(err);
            else resolve(content);
        })
    })
}

exports.formatMessage = function(data) {
    var message = {};
    function parse(result){
        if(typeof result === 'object') {
            var keys = Object.keys(result);
            for( var i = 0; i<keys.length;i++){
                var item = result[keys[i]];
                var key = keys[i];

                if(!(item instanceof Array) || item.length ===0 ){
                    continue;
                }

                if(item.length ===1 ){
                    var val = item[0];
                    if(typeof val === 'object') {
                        message[key] = parse(val)
                    }else {
                        message[key] = (val || '').trim();
                    }
                }else {
                    message[key] = [];
                    for( var j = 0; j<item.length;j++){
                        message[key].push(parse(item[j]));
                    }
                }
            }
        }
    }
    parse(data);
    return message;
}