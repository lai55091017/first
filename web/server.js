const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const server = http.createServer();
const wss = new WebSocket.Server({ server: server });
const userList = [];

wss.on('connection', connect);

//連接到客戶端
function connect(ws) {

    const socket = ws;
    const uuid = generateUUID();
    socket.uuid = uuid;
    userList.push(uuid);

    console.log(uuid)

    console.log(`用戶 ${uuid} 連線成功`);

    socket.on('error', console.error);
    socket.on('message', receiveUserData);
    socket.on('close', userLeave);

    //接收用戶傳來的資料
    function receiveUserData(message) {
        const data = JSON.parse(message);
        switch (data.context) {
            case 'playerMove': {
                const context = 'move';
                const messageForUser = {
                    context, uuid,
                    position: data.position,
                    rotation: data.rotation,
                    currentActionName: data.currentActionName,
                    previousActionName: data.previousActionName,
                };
                sendToOtherUser(messageForUser, uuid);
                break;
            }
            case 'userReady': {
                const context = 'join';
                const messageForUser = { context, userList };
                sendToAllUser(messageForUser);
                break;
            }
            case 'sendMessage': {
                const context = 'message';
                const messageForUser = {
                    context, uuid,
                    message: data.message,
                    timestamp: data.timestamp,
                    username: data.username
                };
                sendToAllUser(messageForUser);
                break;
            }
        }
    }
}

//生成隨機uuid
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//發送給所有用戶(包含自己)
function sendToAllUser(data) {

    wss.clients.forEach(client => {
        data.uuid = client.uuid;
        const message = JSON.stringify(data);
        client.send(message);

    });

}

//發送給其他用戶(不包含自己)
function sendToOtherUser(data, myUUID) {

    const message = JSON.stringify(data);

    wss.clients.forEach(client => {
        const isUserReady = client.readyState === WebSocket.OPEN;
        const isMyself = client.uuid !== myUUID;
        if (isUserReady && isMyself) { client.send(message); }
    });

}

//用戶斷開連線
function userLeave() {

    let disconnectedUUID;

    const connectedUUIDs = new Set([...wss.clients].map(client => client.uuid));

    for (let i = userList.length - 1; i >= 0; i--) {

        const isUUIDNotExist = !connectedUUIDs.has(userList[i]);

        if (isUUIDNotExist) {

            disconnectedUUID = userList[i];

            userList.splice(i, 1);

        }

    }

    console.log(`用戶 ${disconnectedUUID} 已經斷開連線`);

    sendToAllUser({ context: 'leave', disconnectedUUID });

}

//根據請求的 URL 來構建檔案路徑，然後進行處理。
//它會檢查檔案是否存在、檔案類型等，並根據檔案類型返回相應的內容給用戶。
function onRequest(request, response) {

    let filePath = '.' + request.url;

    // 請求 ./ 的話，就傳 public 裡面的 index.html 給使用者
    if (filePath === './') { filePath = './public/index.html'; }

    // 不是請求 ./，也不是請求 ./node_modules 的話，那就一律導往 ./public
    // 所以請求 ./node_modules 的話，是可以正常訪問 ./node_modules 的
    else if (!filePath.startsWith('./node_modules')) { filePath = './public' + request.url; }

    const extname = path.extname(filePath);

    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.glb': contentType = 'model/gltf-binary'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./public/404.html', (error, content) => {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}

server.on('request', onRequest);

server.listen(8080, () => { console.log('伺服器已經啟動，伺服器網址為: http://localhost:8080/'); });