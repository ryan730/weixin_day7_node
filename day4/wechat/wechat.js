/**
 * Created by zhuyan6 on 17/1/16.
 */
var _ = require( 'lodash' );
var Promise = require( 'bluebird' );//参考:https://my.oschina.net/goskyblue/blog/534634
var Request = Promise.promisify( require( 'request' ) );
var util = require( './util' );
var fs = require( 'fs' );
var prefix =  'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary:{//临时素材
        upload:prefix + 'media/upload?',
        download:prefix + 'media/get?'
    },
    permanent:{//永久素材
        upload:prefix + 'material/add_material?',
        download:prefix + 'material/get_material?',
        uploadNews:prefix + 'material/add_news?',
        uploadNewsPic:prefix + 'material/uploadimg?',

        del:prefix + 'media/del_material?',
        update:prefix + 'media/update_news?',
        count:prefix + 'media/get_materialcount?',
        batch:prefix + 'media/batchget_material?'

    }

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

Wechat.prototype.uploadMaterial = function( type, material, permanent ) {
    var form = {};
    var uploadUrl = api.temporary.upload;
    if ( permanent ) {
        uploadUrl = api.permanent.upload;
        _.extend( form, permanent );
    }
    if ( type === 'pic' ) {
        uploadUrl = api.permanent.uploadNewsPic;
    }else if ( type === 'news' ) {
        uploadUrl = api.permanent.uploadNews;
        form = material;
    }else {
        form.media = fs.createReadStream( material );
    }

    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = uploadUrl +
                    'access_token=' + data.access_token;
                if ( !permanent ) {//不是上传永久素材
                    url += '&type=' + type;
                }else {
                    form.access_token = data.access_token;
                }

                var options = {
                    method:'POST',
                    url:url,
                    json:true
                };

                if ( type === 'news' ) {
                    options.body = form;
                }else {
                    options.formData = form;
                }
                console.log( 'uploadMaterial-提交的请求:', url );

                Request( options )
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

Wechat.prototype.downloadMaterial = function( mediaId, type, permanent ) {
    var downloadUrl = api.temporary.download;
    if ( permanent ) {
        downloadUrl = api.permanent.download;
    }
    var that = this;
    return new Promise( function( resolve, reject ) {
        //console.log( 'this:', this );
        that.fetchAccessToken()
            .then( function( data ) {
                var url = downloadUrl +
                    'access_token=' + data.access_token;

                var form = {};
                var options = {
                    method:'POST',
                    url:url,
                    json:true
                };

                if ( permanent ) {
                    form.media_id = mediaId;
                    form.access_token = data.access_token;
                    options.body = form;
                }else {
                    if ( type === 'video' ) {//不是上传永久素材
                        url = url.replace( 'https://', 'http://' );
                    }
                    url += '&media_id=' + mediaId;
                }

                console.log( 'downloadMaterial-提交的请求:', url, form, mediaId );

                if ( type === 'news' || type === 'video' ) {
                    Request( options )
                    .then( function( response ) {
                        console.log( 'downloadMaterial-返回的结果:', response.body );
                        var data = response.body;
                        if ( data ) {
                            resolve( data );
                        } else {
                            throw new Error( 'download material fails!' );
                        }
                    } )
                    .catch( function( err ) {
                        reject( err );
                    } );
                }else {
                    resolve( url );
                }

            } );
    } );
};

Wechat.prototype.deleteMaterial = function( mediaId ) {
    var that = this;
    var form = {
        media_id:mediaId
    };
    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = api.permanent.del +
                    'access_token=' + data.access_token + '&media_id=' + mediaId;

                var options = {
                    method:'POST',
                    url:url,
                    json:true,
                    body:form
                };

                Request( options )
                .then( function( response ) {
                    console.log( 'deleteMaterial-返回的结果:', response.body );
                    var data = response.body;
                    if ( data ) {
                        resolve( data );
                    } else {
                        throw new Error( 'delet material fails!' );
                    }
                } )
                .catch( function( err ) {
                    reject( err );
                } );
            } );
    } );
};

Wechat.prototype.countMaterial = function() {
    var that = this;
    var form = {
        media_id:mediaId
    };
    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = api.permanent.count +
                    'access_token=' + data.access_token;

                var options = {
                    method:'GET',
                    url:url,
                    json:true
                };

                Request( options )
                    .then( function( response ) {
                        console.log( 'countMaterial-返回的结果:', response.body );
                        var data = response.body;
                        if ( data ) {
                            resolve( data );
                        } else {
                            throw new Error( 'count material fails!' );
                        }
                    } )
                    .catch( function( err ) {
                        reject( err );
                    } );
            } );
    } );
};

Wechat.prototype.batchMaterial = function( opts ) {
    var that = this;

    opts.type = opts.type || 'image';
    opts.offset = opts.offset || 0;
    opts.count = opts.count || 1;

    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = api.permanent.batch +
                    'access_token=' + data.access_token;

                var options = {
                    method:'POST',
                    url:url,
                    json:true,
                    body:opts
                };

                Request( options )
                    .then( function( response ) {
                        console.log( 'countMaterial-返回的结果:', response.body );
                        var data = response.body;
                        if ( data ) {
                            resolve( data );
                        } else {
                            throw new Error( 'count material fails!' );
                        }
                    } )
                    .catch( function( err ) {
                        reject( err );
                    } );
            } );
    } );
};

Wechat.prototype.updateMaterial = function( mediaId, news ) {
    var that = this;
    var form = {
        media_id:mediaId
    };

    _.extend( form, news );

    var that = this;
    return new Promise( function( resolve, reject ) {
        that.fetchAccessToken()
            .then( function( data ) {
                var url = api.permanent.del +
                    'access_token=' + data.access_token + '&media_id=' + mediaId;

                var options = {
                    method:'POST',
                    url:url,
                    json:true,
                    body:form
                };

                Request( options )
                    .then( function( response ) {
                        console.log( 'uploadMaterial-返回的结果:', response.body );
                        var data = response.body;
                        if ( data ) {
                            resolve( data );
                        } else {
                            throw new Error( 'update material fails!' );
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
