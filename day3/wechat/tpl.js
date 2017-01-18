/**
 * Created by zhuyan6 on 17/1/18.
 */
var ejs = require( 'ejs' );
var heredoc = require( 'heredoc' );

var tpl = heredoc( function() {
    /*
    <xml>
        <ToUserName><![CDATA[<% fromUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<% toUserName %>]]></FromUserName>
        <CreateTime><% now %></CreateTime>
        <MsgType><![CDATA[<% msgType %>]]></MsgType>
        <% if(msgType === 'text') { %>
            <Content><![CDATA[<%- content %>]]></Content>
        <% } else if (msgType === 'image') { %>
             <Image>
                <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
             </Image>
        <% } else if (msgType === 'voice') { %>
             <Voice>
                <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
             </Voice>
        <% } else if (msgType === 'video') { %>
             <Video>
                 <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
                 <Title><![CDATA[<% content.title %>]]></Title>
                 <Description><![CDATA[<% content.description %>]]></Description>
             </Video>
        <% } else if (msgType === 'music') { %>
             <Music>
                 <Title><![CDATA[<% content.title %>]]></Title>
                 <Description><![CDATA[<% content.description %>]]></Description>
                 <MusicUrl><![CDATA[<% content.musicUrl %>]]></MusicUrl>
                 <HQMusicUrl><![CDATA[<% content.hqMusicUrl %>]]></HQMusicUrl>
                 <ThumbMediaId><![CDATA[<% content.thumbMediaId %>]]></ThumbMediaId>
             </Music>
        <% } else if (msgType === 'news') { %>
             <ArticleCount>2</ArticleCount>
             <Articles>
             <% content.forEach(function( item ) { %>
                 <item>
                     <Title><![CDATA[<% item.title1 %>]]></Title>
                     <Description><![CDATA[<% item.description1 %>]]></Description>
                     <PicUrl><![CDATA[<% item.picurl %>]]></PicUrl>
                     <Url><![CDATA[<% item.url %>]]></Url>
                 </item>
            <% }) %>
             </Articles>
        <% }  %>
    </xml>
    */
} );

var compiled = ejs.compile( tpl );

exports = module.exports = {
    compiled:compiled
}