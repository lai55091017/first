
import "./scss/Functional_interface.scss";
import "./scss/menu.scss";

import * as THREE from 'three';
import CANNON from "cannon";
import CannonDebugger from 'cannon-es-debugger'

import Controller from './js/Controller.js';
import Connect from './js/Connect.js';
import CharacterManager from './js/CharacterManager.js';
import ICAS from './js/ImportCharacterAndScene.js';
import * as menu from './js/menu.js';

import FirebaseDB from './js/firebase/Realtime Database';
import Firestore from "./js/firebase/Firestore.js";



const db = new FirebaseDB;
const fs = new Firestore;

let prevTime = performance.now();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const cannon_world = new CANNON.World();
// 創建 Cannon.js 的 DebugRenderer
const cannonDebugger = new CannonDebugger(scene, cannon_world, {
    // options...
})

const controller = new Controller(scene, camera, renderer.domElement);
const characterManager = new CharacterManager(scene, camera);
const connect = new Connect('ws://localhost:8080');
// const connect = new Connect( 'https://my-websocket-server-ci74yzkzzq-as.a.run.app' );
const icas = new ICAS(scene, camera);

//----------------------loading動畫--------------
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});
// 創建 LoadingManager
// const loadingManager = new THREE.LoadingManager(
//     function () { // onLoad
//         console.log("所有資源已加載完成");
//         document.getElementById("progress-bar-container").style.display = "none";
//     },
//     function (itemUrl, itemsLoaded, itemsTotal) { // onProgress
//         const progress = (itemsLoaded / itemsTotal) * 100;
//         document.getElementById("progress-bar").style.width = progress + "%";
//         console.log(`加載進度：${progress.toFixed(2)}%`);
//     },
//     function (error) { // onError
//         console.error("加載出錯:", error);
//     }
// );

document.addEventListener('DOMContentLoaded', () => {

    // 讀取菜單
    fetch('menu.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('menu_container').innerHTML = data;
            menu.menu();
        })
        .catch(error => console.error('Error loading menu:', error));


    fs.get_user_data().then(fs => {
        document.getElementById('username').textContent = `歡迎${fs.username}玩家`;

        // 聊天室
        const messageInput = document.getElementById('message_input');  //聊天室輸入框
        const sendButton = document.getElementById('send_button');      //聊天室按鈕
        sendButton.addEventListener('click', () => {

            currentTime().then(formattedDateTime => {

                const messageText = messageInput.value;



                if (messageText.trim() !== '') {

                    const messagedata = {
                        context: 'sendMessage',
                        message: messageText,
                        username: fs.username,
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
                .catch((error) => { console.error(error); })
        });
    })
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
    loadModels();
    init_physics();
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

let playerBody
let targetBody
//玩家加入
async function onPlayerJoin(data) {
    const players = new Set(connect.playerList.map(player => player.uuid));

    for (const uuid of data.userList) {
        if (players.has(uuid)) continue;

        const character = await characterManager.loadCharacter();
        character.uuid = uuid;
        connect.playerList.push(character);

        // 如果是當前玩家
        if (uuid === data.uuid) {
            characterManager.bindAction(controller, character.getMesh());
            characterManager.hiddenMesh(character.getMesh());

            // 為玩家添加物理剛體
            playerBody = Player_body(character.getMesh(), 0.5, 1.75);
            camera.userData.physicsBody = playerBody;

            // // 偵測玩家碰撞
            // body.addEventListener('collide', (event) => {
            //     const contact = event.contact;
            //     // const collidedObject = contact.other;
            //     console.log(contact.bi.id);
            //     if (contact.bi.id === 21) {
            //         console.log('碰撞到門');
            //     }
            // });

            // 註冊玩家的碰撞事件
            playerBody.addEventListener('collide', handlePlayerCollision);

            // 為玩家添加角色
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
//顯示玩家聊天室
function onPlayerMessage(data) {

    fs.get_user_data().then(fs => {

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
    
    
                if (data.username === fs.username) {
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
    
            // 容器的可见高度
            const scrollableHeight = chatBox.scrollHeight - chatBox.clientHeight;
    
            // 如果用户没有手动向上滚动（即滚动条接近底部），则自动滚动到底部
            if (chatBox.scrollTop >= scrollableHeight - 500) {
                chatBox.scrollTop = chatBox.scrollHeight; // 滚动到底部
            }
    
            // 输出调试信息
            console.log(chatBox.scrollTop, chatBox.scrollHeight);
    
        }
    })
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
    camera.layers.enableAll();//相機能顯示所有的層
    camera.updateProjectionMatrix();
}

function init_renderer() {
    const canvas = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);
}

function init_other() {
    // scene.add(new THREE.GridHelper(100, 1000, 0x0ff0f0, 0xcccccc));
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



function animate() {

    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    const playerData = controller.update(delta);
    
    characterManager.updateCharactersAnimation(delta, connect.playerList);
    connect.socket.send(JSON.stringify(playerData));

      // 更新物理世界
    cannon_world.step(1 / 60); // 固定步長為 1/60 秒
    // cannonDebugger.update()

    checkCollisionEnd()

    // 更新模型的位置和旋轉
    scene.traverse(function (object) {
        if (object.userData.physicsBody) {
            const body = object.userData.physicsBody;

            // const worldPosition = new THREE.Vector3();
            // object.localToWorld(worldPosition);

            // if (object.name === 'Entry') {
            //     body.position.x = camera.position.x;
            //     body.position.y = camera.position.y - controller.playerHight / 2;
            //     body.position.z = camera.position.z;

            //     console.log(body);
                
            //     body.rotation.copy(camera.quaternion);
            // }
            // object.position.copy(body.position);
            // object.quaternion.copy(body.quaternion); // 因為兩者pivot point不同所以無法同步
            
            
        }
    });

    renderer.render(scene, camera);

}

// 導入場景模型2.0
async function loadModels() {
    try {
        let library = await icas.loadGLTF('./mesh/glb/Library_Freeze.glb');
        scene.add(library.scene);

        //綁定物理引擎
        library.scene.traverse(function (child) {
            if (child.name !== 'Scene' &&
                // !child.name.match(/^Bookshelf/) &&
                !child.name.match(/^Chair/) &&
                // !child.name.match(/^Table/) &&
                // !child.name.match(/^Door/) &&
                // !child.name.match(/^LIB/) &&
                // !child.name.match(/^wall/) &&
                // !child.name.match(/^Floor/) &&
                // !child.name.match(/^counter/) &&
                // !child.name.match(/^piller/) &&
                !child.name.match(/^Mesh/) 
            ) {
                create_physics_body_box(child);
                if (child.name.match(/^LIB/)) {
                    targetBody = child.userData.physicsBody;
                }
                // console.log('綁定物理引擎:', child.name, child);
            }
        })

    } catch (error) {
        console.error('Error loading model:', error);
    }
}

/*********************************** Physics *********************************************/
function init_physics() {

    cannon_world.gravity.set(0, -9.82, 0);
    // 碰撞偵測
    cannon_world.broadphase = new CANNON.NaiveBroadphase()
    cannon_world.solver.iterations = 10;

    // 設定接觸事件
    cannon_world.addEventListener('contact', (event) => {
        console.log('接觸！');
        // 處理接觸事件
    });
    
    cannon_world.addEventListener('endContact', (event) => {
        console.log('結束接觸！');
        // 處理結束接觸事件
    });

}

// 創建剛體(方塊) 大小以模型為準
function create_physics_body_box(model) {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // 獲取模型的尺寸或使用自定義尺寸
    const size = boundingBox.getSize(new THREE.Vector3());


    // 創建剛體
    const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(center.x, center.y, center.z),
        shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
    });

    // 添加到物理世界
    cannon_world.addBody(body);

    // 將剛體存儲在模型的 userData 屬性中
    model.userData.physicsBody = body; 

    return body;

}
// 玩家剛體(圓柱體)
function Player_body(model, radius, height, radialSegments = 16) {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // 創建剛體
    const body = new CANNON.Body({
        mass: 1,
        fixedRotation: true,
        position: new CANNON.Vec3(center.x, center.y, center.z),
        quaternion: new CANNON.Quaternion().setFromEuler(Math.PI / 2, 0, 0),
        shape: new CANNON.Cylinder(radius, radius, height, radialSegments),
    });

    // 添加到物理世界
    cannon_world.addBody(body);

    // 將剛體存儲在模型的 userData 屬性中
    model.userData.physicsBody = body; 

    return body;

}

// 追踪玩家與特定物體 (targetBody) 的碰撞狀態
let isCollidingWithTarget = false;
function handlePlayerCollision(event) {
  const otherBody = event.body;
  if (otherBody === targetBody) {
    if (!isCollidingWithTarget) {
      isCollidingWithTarget = true;
      console.log('玩家和目標之間開始碰撞');
    }
  }
}

// 檢查碰撞是否結束的函數
function checkCollisionEnd() {
  if (isCollidingWithTarget) {
    // 檢查玩家和目標是否仍在接觸
    const isStillColliding = cannon_world.contacts.some(contact =>
      (contact.bi === playerBody && contact.bj === targetBody) ||
      (contact.bi === targetBody && contact.bj === playerBody)
    );

    if (!isStillColliding) {
      isCollidingWithTarget = false;
      console.log('玩家和目標之間的碰撞已結束');
    }
  }
}
// 導入場景模型
async function loadModels() {
    const models = [
        { type: 'glb', path: './mesh/glb/Scene_Library.glb' },
        { type: 'fbx', path: './mesh/fbx/player.fbx' }
    ];

    // const progressBar = document.getElementById("progress-bar");
    // let totalBytesLoaded = 0;
    // let totalBytes = 0;
    // // 計算每個模型的加載進度
    // const onProgress = (xhr) => {
    //     if (xhr.lengthComputable) {
    //         const percentComplete = (xhr.loaded / xhr.total) * 100;
    //         console.log(`加載進度: ${percentComplete.toFixed(2)}%`);

    //         // 更新總進度
    //         totalBytesLoaded += xhr.loaded;
    //         totalBytes += xhr.total;

    //         const overallProgress = (totalBytesLoaded / totalBytes) * 100;
    //         progressBar.style.width = overallProgress + "%";
    //     }
    // };

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
                    libDoorL.name = 'Door';
                    libDoorR.name = 'Door';

                    if (libDoorL && libDoorR) {
                        console.log('好消息，找到圖書館的門了');
                        libDoorL.layers.set(1);
                        libDoorR.layers.set(1);
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
    // 加載 GLB 模型的函數
    // async function loadGLBModel(path, onProgress) {
    //     return new Promise((resolve, reject) => {
    //         const loader = new THREE.GLTFLoader();
    //         loader.load(
    //             path,
    //             (gltf) => resolve(gltf),
    //             onProgress,
    //             (error) => reject(error)
    //         );
    //     });
    // }
}