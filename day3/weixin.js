/**
 * Created by zhuyan6 on 17/1/18.
 */
exports.reply = function*( next ) {
    var message = this.message;

    if ( message.MsgType === 'event' ) {
        if ( message.Event === 'subscribe' ) {
            message.EventKey && console.log( '扫描二维码进来:' + message.EventKey + ' ' + message.ticket );
            this.body = '哈哈,你订阅了找个号';

        } else if ( message.Event === 'unsubscribe' ) {
            console.log( '取消关注' );
            this.body = '';

        } else if ( message.Event === 'LOCATION' ) {
            this.body ='您的位置是:'+message;

        } else if ( message.Event === 'subscribe' ) {

        } else if ( message.Event === 'subscribe' ) {

    }
}
};
