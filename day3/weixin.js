/**
 * Created by zhuyan6 on 17/1/18.
 */
exports.reply = function *( next ) {
    var message = this.message;
    console.log('message:',message)
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

        }else {
            this.content = '你说的是:' + message.Content;

        }
    }
    yield next;
};
