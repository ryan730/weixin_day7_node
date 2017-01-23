/**
 * Created by zhuyan6 on 17/1/18.
 */
var config = require( './config' );
var Wechat = require( './wechat/wechat.js' );
var wechatApi = new Wechat( config.wechat );

exports.reply = function *( next ) {
    var message = this.message;
    console.log( 'message:', message );
    if ( message.MsgType === 'event' ) {
        if ( message.Event === 'subscribe' ) {
            message.EventKey && console.log( '扫描二维码进来:' + message.EventKey + ' ' + message.ticket );
            this.content = '哈哈,你订阅了找个号';

        } else if ( message.Event === 'unsubscribe' ) {
            console.log( '取消关注' );
            this.content = '';

        } else if ( message.Event === 'LOCATION' ) {
            this.content = '您的位置是:' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;

        } else if ( message.Event === 'CLICK' ) {
            this.content = '您点击了菜单:' + message.EventKey;

        } else if ( message.Event === 'SCAN' ) {
            this.content = '关注后扫描二维码:' + '扫描二维码进来:' + message.EventKey + ' ' + message.ticket;

        } else if ( message.Event === 'VIEW' ) {
            this.content = '点钟菜单里的链接:' + message.EventKey;

        }
    }else if ( message.MsgType === 'text' ) {
        if ( message.Content === '1' ) {
            this.content = '你说的是:' + '第一';

        }else if ( message.Content === '2' ) {
            this.content = '你说的是:' + '第二';

        }else if ( message.Content === '3' ) {
            this.content = [
                {
                    title:'图文内容1',
                    description:'这里是个描述1',
                    picUrl:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1484759393&di=0fbd6ead130c5f76c167fd18a2e417a5&src=http://d.5857.com/boguanglinlin_150410/desk_012.jpg',
                    url:'https://baidu.com'
                }
            ];

        }else if ( message.Content === '4' ) {
            this.content = [
                {
                    title:'图文内容1',
                    description:'这里是个描述1',
                    picUrl:'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1484759393&di=0fbd6ead130c5f76c167fd18a2e417a5&src=http://d.5857.com/boguanglinlin_150410/desk_012.jpg',
                    url:'https://baidu.com'
                },
                {
                    title:'图文内容2-1',
                    description:'这里是个描述2',
                    picUrl:'http://c.hiphotos.baidu.com/image/pic/item/9358d109b3de9c82330b0f896e81800a19d8434e.jpg',
                    url:'http://qq.com'
                }
            ];

        }else if ( message.Content === '5' ) {
            var data = yield wechatApi.uploadMaterial( 'image', __dirname + '/2.jpg' );
            var reply = {
                type:'image',
                mediaId:data.media_id
            };
            this.content = reply;
        }else if ( message.Content === '6' ) {
            var data = yield wechatApi.uploadMaterial( 'video', __dirname + '/2.mp4' );
            var reply = {
                type:'video',
                title:'回复视频',
                description:'一段视频',
                mediaId:data.media_id
            };
            this.content = reply;
        }else if ( message.Content === '7' ) {
            var data = yield wechatApi.uploadMaterial( 'image', __dirname + '/2.jpg' );
            var reply = {
                type:'music',
                title:'回复音乐',
                description:'一段视频',
                musicUrl:'http://yinyueshiting.baidu.com/data2/music/122873158/49046814400128.mp3?xcode=a6006b0c745741dd35dc224202a6daff',
                thumbMediaId:data.media_id
            };
            this.content = reply;
        }else if ( message.Content === '8' ) {//下面都是永久素材上传
            var data = yield wechatApi.uploadMaterial( 'image', __dirname + '/2.jpg', { type:'image' } );
            var reply = {
                type:'image',
                mediaId:data.media_id
            };
            this.content = reply;
        }else if ( message.Content === '9' ) {
            var data = yield wechatApi.uploadMaterial( 'video', __dirname + '/2.mp4', { type:'video', description:JSON.stringify( { title:'title', introduction:'introduction' } ) } );
            var reply = {
                type:'video',
                title:'回复视频',
                description:'一段视频',
                mediaId:data.media_id
            };
            this.content = reply;
        }else if ( message.Content === '10' ) {
            var picData = yield wechatApi.uploadMaterial( 'image', __dirname + '/2.jpg', { type:'image' } );
            var media = {
                articles:[
                    {
                        title: 'title1',
                        thumb_media_id: picData.media_id,
                        author: 'ryan',
                        disgest: '摘要',
                        show_cover_pic: 1,
                        content:'内容',
                        content_source_url:'https://github.com'
                    },
                    {
                        title: 'title2',
                        thumb_media_id: picData.media_id,
                        author: 'ryan',
                        disgest: '摘要',
                        show_cover_pic: 1,
                        content:'内容',
                        content_source_url:'https://github.com'
                    } ]
            };

            data = yield wechatApi.uploadMaterial( 'news', media, {} );
            console.log( 'content-10-1:', data );
            data = yield wechatApi.downloadMaterial( data.media_id, 'news', {} );
            console.log( 'content-10-2:', data );


            var items = data.news_item;
            var news = [];
            items.forEach( function( item ) {
                news.push( {
                    title:item.title,
                    decription:item.digest,
                    picUrl:picData.url,
                    url:item.url
                } );
            } );

            this.content = news;
        }else {
            this.content = '你说的是:' + message.Content;

        }
    }
    yield next;
};
