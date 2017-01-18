1.随mac 起一个python 简单服务
 * python -m SimpleHTTPServer 3333

2.下载 ngrok 远端穿透本地服务
 * ./ngrok/ngrok -config ngrok.cfg -subdomain 你临时的二级域名 3333

3.如果上面的挂了,可以用nodejs 的 localtunnel 服务,参考:http://blog.csdn.net/k605726828/article/details/49913459
 * npm i -g localtunnel
 * 使用 lt --subdomain 你临时的二级域名 --port 3333
 * 结果映射到 https://你临时的二级域名.localtunnel.me/

4.安装koa后,起node服务
 * node --harmony app.js
