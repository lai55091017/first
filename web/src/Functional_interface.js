
import "./scss/Functional_interface.scss";
import "./scss/menu.scss";

import * as THREE from 'three';
import Controller from './js/Controller.js';
import Connect from './js/Connect.js';
import CharacterManager from './js/CharacterManager.js';
import ICAS from './js/ImportCharacterAndScene.js';
import * as menu from './js/menu.js';

import FirebaseDB from './js/firebase/Realtime Database';




const db = new FirebaseDB;

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
            .catch((error) => { console.error(error); })
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
    loadModels();
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

        const message_box = document.createElement('div');
        const message_element = document.createElement('div');
        const message_date_element = document.createElement('div');
        const message_item = document.createElement('div');
        const message_name = document.createElement('div');
        const name = document.createElement('span');
        const message_total = document.createElement('div');

        message_total.className = 'message message_item';
        message_item.className = 'message_item';
        message_box.id = 'message_box';
        message_element.id = 'message';
        message_date_element.id = 'message_date';
        message_name.className = 'name';

        if (connect.playerList.find(player => player.uuid === data.uuid)) {
            message_element.id = 'personal_message';
            message_date_element.id = 'personal_message_date';
        }

        name.textContent = `${data.username}`;
        message_element.textContent = `${data.message}`;
        message_date_element.textContent = ` 時間:${data.timestamp}`;

        //span丟到.name
        message_name.appendChild(name);
        //訊息時間丟到#message_box;
        message_box.appendChild(message_element);
        message_box.appendChild(message_date_element);
        //#message_box和.name丟到#message_item
        message_item.appendChild(message_name);
        message_item.appendChild(message_box);
        //#message_item丟到.message_total
        message_total.appendChild(message_item);
        //.message_total丟到#chat_box，訊息顯示在聊天室
        chatBox.appendChild(message_total);


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
async function loadModels() {
    const models = [
        { type: 'glb', path: './mesh/glb/Library_Full.glb' },
        // { type: 'fbx', path: './mesh/fbx/Library_Full.fbx' },
        // { type: 'obj', path: './mesh/obj/lilbray2.obj' },
        // { type: 'json', path: './mesh/json/Test_Library.json' }
    ];

    for (const model of models) {
        let loadedModel;
        try {
            switch (model.type) {
                case 'glb': 
                    loadedModel = await icas.loadGLTF(model.path); 
                    scene.add(loadedModel.scene);
                    loadedModel.scene.traverse(function (child) {
                        // 检查子对象的类型，或者使用名称等其他标识
                        // if (child.isMesh) {
                        //     console.log('找到Mesh:', child.name, child);
                        //     // 在此处对子对象进行操作
                        // } else if (child.isGroup) {
                        //     console.log('找到Group:', child.name, child);
                        //     // 在此处对Group进行操作
                        // }
                        // 可以尋找場景裡的子对象
                        if (child.isGroup) {
                            if(child.name === 'Scene') {
                                console.log('找到Group:', child.name, child);
                            }
                        }
                    });
                
                    // 你可以根据需要访问特定的子对象，例如通过名称
                    const specificObject = loadedModel.scene.getObjectByName('LIB_Door_Left');
                    if (specificObject) {
                        console.log('找到指定对象:', specificObject);
                        
                        // 对该对象进行操作
                        //向上移動
                        specificObject.position.y = -100;
                    } 
                    break;
                case 'fbx':
                    loadedModel = await icas.loadFBX(model.path);
                    scene.add(loadedModel);
                    break;
                case 'obj':
                    loadedModel = await icas.loadOBJ(model.path, model.mtlPath);
                    scene.add(loadedModel);
                    break;
                case 'json':
                    loadedModel = await icas.loadJSON(model.path);
                    scene.add(loadedModel);
                    break;
                default:
                    console.error('Unknown model type:', model.type);
            }
        } catch (error) {
            console.error('Error loading model:', model.path, error);
        }
    }
}