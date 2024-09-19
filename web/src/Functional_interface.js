
import "./scss/Functional_interface.scss";
import "./scss/menu.scss";

import * as THREE from 'three';
import Controller from './js/Controller.js';
import Connect from './js/Connect.js';
import CharacterManager from './js/CharacterManager.js';
import ICAS from './js/ImportCharacterAndScene.js';
import * as menu from './js/menu.js';

import FirebaseDB from './js/firebase/Realtime Database';
import Firestore from './js/firebase/Firestore';




const db = new FirebaseDB;
const firestore = new Firestore;

let prevTime = performance.now();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({ antialias: true });

const controller = new Controller(scene, camera, renderer.domElement);
const characterManager = new CharacterManager(scene, camera);
const connect = new Connect('ws://localhost:8080');
// const connect = new Connect( 'https://my-websocket-server-ci74yzkzzq-as.a.run.app' );
// init();
const icas = new ICAS(scene, camera);

//----------------------loading動畫--------------
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});

firestore.write_data();


document.addEventListener('DOMContentLoaded', () => {

    // 讀取菜單
    fetch('menu.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('menu_container').innerHTML = data;
        menu.menu();
    })
    .catch(error => console.error('Error loading menu:', error));

    db.read_username_once().then(username => {
        document.getElementById('username').textContent = `歡迎${username}玩家`;
    })
    
    // 聊天室
    const messageInput = document.getElementById('message_input');  //聊天室輸入框
    const sendButton = document.getElementById('send_button');      //聊天室按鈕
    sendButton.addEventListener('click', () => {

        currentTime().then(formattedDateTime => {

            const messageText = messageInput.value;
            db.read_username_once().then(username => {

                if (messageText.trim() !== '') {

                    const messagedata = {
                        context: 'sendMessage',
                        message: messageText,
                        username: username,
                        timestamp: formattedDateTime,   //时间戳
                    }

                    try {
                        connect.socket.send(JSON.stringify(messagedata));
                        // 清空输入框
                        messageInput.value = '';
                    } catch (err) {
                        console.error('Error sending message:', err);
                    }
    
                }
            })

        })
        .catch((error) => {console.error(error);})
    });

    //遊戲內容載入
    init()
})


//格式化當前時間
function currentTime() {
    return new Promise((resolve, reject) => {
        // 获取当前时间
        const currentTime = new Date();
        // 获取年月日时分秒
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1; // 月份从 0 开始，需要加 1
        const date = currentTime.getDate();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        // 格式化日期时间
        const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        resolve(formattedDateTime)
        reject('日期格式化失敗')
    })


}

function init() {
    init_scene();
    init_camera();
    init_renderer();
    init_other();
    connect.onJoin = onPlayerJoin;
    connect.onLeave = onPlayerLeave;
    connect.onMove = onPlayerMove;
    connect.onMessage = onPlayerMessage;
    controller.setupBlocker(document.getElementById('blocker'));

    // 導入(載入)模型
    // loadModels();
}

function animate() {

    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    const playerData = controller.update(delta);
    characterManager.updateCharactersAnimation(delta, connect.playerList);
    connect.socket.send(JSON.stringify(playerData));
    renderer.render(scene, camera);

}

/*********************************** Websocket Event *********************************************/

//玩家加入
async function onPlayerJoin(data) {

    const players = new Set(connect.playerList.map(player => player.uuid));

    for (const uuid of data.userList) {

        if (players.has(uuid)) continue;

        const character = await characterManager.loadCharacter();
        character.uuid = uuid;
        connect.playerList.push(character);

        if (uuid === data.uuid) {
            characterManager.bindAction(controller, character.getMesh());
            characterManager.hiddenMesh(character.getMesh());
            camera.add(character);
            animate();

        } else {
            scene.add(character);
        }

    }
}
//玩家離開
function onPlayerLeave(data) {

    const uuid = data.disconnectedUUID;
    const index = connect.playerList.findIndex(player => player.uuid === uuid);

    const isFoundResult = index !== -1;
    if (isFoundResult) {
        scene.remove(connect.playerList[index]);
        connect.playerList.splice(index, 1);
    }
}
//玩家移動
function onPlayerMove(data) {

    const meshContainer = connect.playerList.find(player => player.uuid === data.uuid);

    if (meshContainer) {
        const characterData = meshContainer.children[0].userData;
        meshContainer.position.copy(data.position);
        meshContainer.rotation.copy(data.rotation);
        characterData.currentActionName = data.currentActionName;
        characterData.previousActionName = data.previousActionName;
    }
}
//玩家聊天室
function onPlayerMessage(data) {

    // 聊天室資料庫並輸出到畫面
    const chatBox = document.getElementById('chat_box');
    const playermessage = connect.playerList.find(player => player.uuid === data.uuid);

    if (playermessage) {
        const message_element = document.createElement('div');
        const message_date_element = document.createElement('div');

        message_element.id = 'message';
        message_date_element.id = 'message_date';

        if (connect.playerList.find(player => player.uuid === data.uuid)) {
            message_element.id = 'personal_message';
            message_date_element.id = 'personal_message_date';
        }
        
        message_element.textContent = `${data.username}:${data.message}`;
        message_date_element.textContent = ` 時間:${data.timestamp}`;

        chatBox.appendChild(message_element);
        chatBox.appendChild(message_date_element);

        // 将聊天室滚动条移动到底部函数
        const messageContainer = document.querySelector('.message_container');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
}

/*********************************** Three.js *********************************************/
function init_scene() {
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 5, 50);
}
function init_camera() {
    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
}
function init_renderer() {
    const canvas = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);
}
function init_other() {
    scene.add(new THREE.GridHelper(100, 1000, 0x0ff0f0, 0xcccccc));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3));
    scene.add(new THREE.DirectionalLight(0xffffff, 3));
    window.addEventListener('resize', resize);
    window.addEventListener('fullscreenchange', resize);
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
// 導入場景模型
async function loadModels() { // 這個async function我記得之前問chatGPT它是跟我說這叫異步函數(非同步函數)
    const models = [ // const一個陣列，type是模型的檔案格式，path是模型所在的位置
        { type: 'glb', path: './mesh/glb/Library_Full.glb' }
    ];

    for (const model of models) {
        let loadedModel; // 宣告一個名為loadedModel的變數，用來儲存每次加載的模型
        try { // 這個try的註解放在後面的catch那邊
            switch (model.type) { // 使用switch根據model(模型)的type(檔案格式)來執行對應格式的程式
                case 'glb':
                    loadedModel = await icas.loadGLTF(model.path); // 這個await只能用在async function裡，用來暫停非同步函數的執行，直到await後面的非同步操作完成並返回結果後才能結束暫停
                    scene.add(loadedModel.scene); // 把剛剛載入的模型加到場景中

                    // 找門，要用來做開關設置的
                    const libDoorL = loadedModel.scene.getObjectByName('LIB_Door_Left');
                    const libDoorR = loadedModel.scene.getObjectByName('LIB_Door_Right');

                    if (libDoorL && libDoorR) {
                        console.log('好消息，找到圖書館的門了');
                        // 傳到Ctrl.js
                        controller.setDoors(libDoorL, libDoorR);

                        // 存起來，目前先註解怕之後要改
                        // this.libDoorL = libDoorL;
                        // this.libDoorR = libDoorR;
                    } else {
                        console.log('壞消息，沒門!');
                    }

                    break;
                case 'fbx':
                    loadedModel = await icas.loadFBX(model.path);
                    scene.add(loadedModel);
                    break;
                // case 'obj': // 出了點錯先註解掉，obj可能會有mtl(材質)文件跟著
                //     loadedModel = await icas.loadOBJ(model.path, model.mtlPath);
                //     scene.add(loadedModel);
                //     break;
                case 'json':
                    loadedModel = await icas.loadJSON(model.path);
                    scene.add(loadedModel);
                    break;
                default: // 如果不是上面這些格式就紀錄錯誤訊息:Unknown model type(未知的檔案格式)
                    console.error('Unknown model type:', model.type);
            }
        } catch (error) { // 為防止加載時出錯，所以用try...catch來抓錯，只要出現加載錯誤就傳送錯誤訊息:Error loading model
            console.error('Error loading model:', model.path, error);
        }
    }
}