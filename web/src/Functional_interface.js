
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
import Auth from './js/firebase/auth';

// import { count } from "firebase/firestore";


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
// const connect = new Connect('ws://localhost:8080');
const connect = new Connect('https://my-websocke-server-1-485354531854.asia-east1.run.app');

const icas = new ICAS(scene, camera);
const auth = new Auth;
auth.onAuthStateChanged();
//----------------------loading動畫--------------
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});

$('#info').on("click", function () {
    auth.switch_page('information.html');
})

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
                        timestamp: formattedDateTime,   // 儲存時間戳(即時間資訊)
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


// 格式化當前時間
function currentTime() {
    return new Promise((resolve, reject) => {
        // 獲取當前時間
        const currentTime = new Date();
        // 獲取年、月、日、時、分、秒
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1; // 月份從0開始，需要加1
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

// 初始化
function init() {
    init_scene();
    init_camera();
    init_renderer();
    init_other();

    init_physics();
    connect.onJoin = onPlayerJoin;
    connect.onLeave = onPlayerLeave;
    connect.onMove = onPlayerMove;
    connect.onMessage = onPlayerMessage;
    controller.setupBlocker(document.getElementById('blocker'));
    controller.setupBlocker(document.getElementById('continue'));

    // 導入(載入)模型
    loadModels();
}

/*********************************** Websocket Event *********************************************/
let playerBody;
let targetBody;
let currentPlayer = false; // 定義全域變數來存儲當前玩家角色
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

            // 註冊玩家的碰撞事件
            playerBody.addEventListener('collide', handlePlayerCollision);

            // 為玩家添加角色
            camera.add(character);
            currentPlayer = true; // 保存玩家角色到全域變數
            animate();

        } else {
            scene.add(character);
            console.log('其他玩家加入', uuid);
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

            // 如果用户没有手動向上滾動（即滾動條接近底部），則自動滾動到底部
            if (chatBox.scrollTop >= scrollableHeight - 500) {
                chatBox.scrollTop = chatBox.scrollHeight; // 滾動到底部
            }

            // 输出调试信息
            console.log(chatBox.scrollTop, chatBox.scrollHeight);

        }
    })
}

/*********************************** Three.js *********************************************/
// 初始化場景
function init_scene() {
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 5, 50);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3));
    // scene.add(new THREE.DirectionalLight(0xffffff, 3));
}
// 初始化相機
function init_camera() {
    camera.fov = 75;//設置相機的視野範圍,1超近-100超遠

    camera.aspect = window.innerWidth / window.innerHeight;//是一個屬性，用於定義相機的長寬比（aspect ratio）

    // near 表示最近的可見距離，far 表示最遠的可見距離
    camera.near = 0.1;
    camera.far = 100;
    camera.layers.enableAll();//相機能顯示所有的層
    camera.updateProjectionMatrix();//更新相機的投影矩陣
    //投影矩陣 是將 3D 場景投影到 2D 屏幕上的數學模型，用於定義相機的視野範圍和投影方式
    //當 camera.aspect 發生變化時，必須調用 camera.updateProjectionMatrix()，以重新計算相機的投影矩陣。
}
// 初始化渲染器
function init_renderer() {
    const canvas = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);
}
// 初始化其他
function init_other() {
    window.addEventListener('resize', resize);
    window.addEventListener('fullscreenchange', resize);
    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
// 動畫
function animate() {

    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    prevTime = time;

    // 傳送錨點

    // 玩家移動值
    // console.log(playerBody.position);

    // 玩家旋轉值
    // console.log(camera.rotation);

    const playerData = controller.update(delta);

    characterManager.updateCharactersAnimation(delta, connect.playerList);
    connect.socket.send(JSON.stringify(playerData));

    // 更新物理世界
    cannon_world.step(1 / 60); // 固定步長為 1/60 秒
    // 顯示鋼體
    // cannonDebugger.update()

    checkCollisionEnd()



    renderer.render(scene, camera);

}

// 傳送錨點
/*********************************** Physics *********************************************/
// 初始化物理引擎
function init_physics() {

    cannon_world.gravity.set(0, -9.8, 0);
    // 碰撞偵測
    cannon_world.broadphase = new CANNON.NaiveBroadphase()
    cannon_world.solver.iterations = 10;
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

    return body;

}

// 追踪玩家與特定物體的碰撞狀態
let isCollidingWithTarget = false;
function handlePlayerCollision(event) {
    // console.log(targetBody, event.body);
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
    try {
        init_scene();
        // 加載新場景
        let library = await icas.loadGLTF('./mesh/glb/Four_Scene_3.glb');
        scene.add(library.scene);

        // 綁定物理引擎
        library.scene.traverse((child) => {
            if (child.isMesh && !(/^Park_Playground.*/).test(child.name)) {
                create_physics_body_box(child); // 為每個模型綁定剛體
                // console.log(`綁定剛體到物件: ${child.name}`);
            }
        });

        //從 CANNON 世界中訪問所有剛體
        const allBodies = cannon_world.bodies;
        console.log("剛體數量:", allBodies.length);
        //綁定特定鋼體
        targetBody = allBodies[19]

        // 調整玩家位置
        if (currentPlayer) {
            camera.rotation.set(0, 3, 0);
            playerBody.position.set(14, 1.5, -3.5); // 設定玩家位置
        } else {
            console.log(`玩家角色未初始化`);
        }

        // 讀取調整場景資料
        const regexMapping = await fs.load_scene_regexmapping()

        // 處理場景中特定物件
        function processSceneObjects(scene) {

            const objects = {};

            // 遍歷場景中的物件
            scene.traverse((child) => {
                if (child.isMesh && child.name) {
                    for (const { type, regex, newName } of regexMapping) {
                        if (regex.test(child.name)) {
                            child.name = newName;
                            if (!objects[type]) objects[type] = [];
                            objects[type].push(child); // 根據類型分類
                            break;
                        }
                    }
                }
            });

            console.log('找到所有物件:', objects);

            // 確保找到所有關鍵物件
            const hasAllObjects = Object.values(objects).some((list) => list.length > 0);

            if (hasAllObjects) {

                // 統一設置圖層
                Object.values(objects).forEach((list) =>
                    list.forEach((item) => item.layers.set(1))
                );
                // 設定動畫物件(傳遞控制器和物件列表給控制器)
                controller.setDoors(objects.doors[0], objects.doors[1], 'home'); // 家裡的門
                controller.setDoors(objects.doors[2], objects.doors[3], 'library'); // 圖書館的門
                controller.setDoors(objects.doors[4], objects.doors[5], 'school'); // 學校的門
            } else {
                console.log('壞消息，某些關鍵物件遺失!');
            }
        }


        // 在加載場景後執行處理
        processSceneObjects(library.scene);


    } catch (error) {
        console.error('加載場景失敗:', error);
    }
}


/*-----------------------------------場景切換--------------------------------------------------*/
// 顯示場景切換選單
function showSceneOptions() {
    const menu = document.createElement('div');
    let count = 0;
    menu.id = 'scene_options';
    const scenes = [
        'Library',
        'Home',
        'School',
        'Park'
    ];

    scenes.forEach(
        async (sceneName) => {
            const button = document.createElement('button');
            button.id = count;
            button.textContent = `${sceneName}`;
            count++;
            button.onclick = async () => {
                // 傳送錨點
                document.getElementById('scene_options').style.display = 'none'
                if (button.textContent == 'Home') { // 家裡
                    playerBody.position.set(-2.5, 1.5, 3.5); // 將角色移動到目標位置
                    camera.rotation.set(0, 0, 0);
                    console.log(`角色已移動到: ${sceneName} `);
                } else if (button.textContent == 'Library') { // 圖書館
                    console.log(`角色已移動到: ${sceneName} `);
                    playerBody.position.set(-31.5, 1.5, 4); // 將角色移動到目標位置
                    camera.rotation.set(0, 0, 0);

                } else if (button.textContent == 'School') { // 學校
                    console.log(`角色已移動到: ${sceneName}`);
                    playerBody.position.set(-62, 1.5, 5); // 將角色移動到目標位置
                    camera.rotation.set(0, 0, 0);
                } else if (button.textContent == 'Park') { // 遊樂園
                    console.log(`角色已移動到: ${sceneName}`);
                    playerBody.position.set(42, 1, 5); // 將角色移動到目標位置
                    camera.rotation.set(0, 0, 0);
                } else {
                    console.log(`玩家角色未初始化`);
                }
            }

            menu.appendChild(button);
        });

    const closeButton = document.createElement('button');
    closeButton.textContent = '取消';
    closeButton.onclick = () => document.getElementById('scene_options').style.display = 'none' // 隱藏選單;
    menu.appendChild(closeButton);

    document.body.appendChild(menu);
    document.getElementById('scene_options').style.display = 'none' // 隱藏選單
}


showSceneOptions()



/*-----------------------------------暫停模式menu--------------------------------------------------*/

const instruction = $("#instruction_container");

instruction.hide();

$("#instruction").on('click', async () => {
    instruction.fadeToggle(500);
})

const sound = $("#sound_container");

sound.hide();

$("#sound").on('click', async () => {
    sound.fadeToggle(500);
})
/*-----------------------------------memorycard遊戲區域--------------------------------------------------*/
// const memorygame_container = $("#memorygame_container"); // 確保是 jQuery 對象


// $('#Game').on('click', async () => {
//     memorygame_container.fadeToggle(500);
// });

// 傳送錨點
/*-----------------------------------關閉按鈕--------------------------------------------------*/
//$(document).ready() 是 jQuery 提供的一個事件，主要用於確保 DOM 完全加載後執行 JavaScript 代碼

// const WordleGame = $("#WordleGame");
// WordleGame.hide();
$(document).ready(function () {

    $(".close").click(function () {
        // 獲取按鈕的 ID
        const buttonId = $(this).attr('id');
        // 使用 switch...case 根據按鈕 ID 處理
        switch (buttonId) {
            case 'close_instruction'://id=close_instruction
                instruction.fadeToggle(500);
                break;
            case 'close_sound':// id = close_sound
                sound.fadeToggle(500);
                break;
            case 'close_card':// id = close_card
                card_box.fadeOut(500);
                break;
            default:
                console.log('未知的按鈕 ID');
        }
    });
})
/*-----------------------------------card區域--------------------------------------------------*/
const card_container = $("#card_container");
const card_box = $("#card_box");
// 從 Firestore 中抓取資料
const interactableObjects = await fs.load_scene_InteractableObject();

$("#card").on('click', async () => {
    card_box.fadeIn(500);
    // 首次渲染
    renderPage();
})

/*-----------------------------------分頁器--------------------------------------------------*/
// 分頁設定
const itemsPerPage = 12; // 每頁顯示的卡片數量
let currentPage = 1; // 當前頁面
// DOM 元素

const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// 渲染當前頁面的卡片
function renderPage() {
    // 計算分頁資料
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = interactableObjects.slice(startIndex, endIndex);

    // 清空舊的卡片
    card_container.empty();

    // 渲染當前頁面的卡片
    pageItems.forEach((object) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
       <h3 class="title">${object.englishName}</h3>
        <p class="description">${object.chineseName}</p>
    `;
        card_container.append(card);//jquery是用append
    });

    // 更新頁碼顯示
    pageInfo.textContent = `第 ${currentPage} 頁，共 ${Math.ceil(
        interactableObjects.length / itemsPerPage
    )} 頁`;

    // 控制按鈕狀態
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled =
        currentPage === Math.ceil(interactableObjects.length / itemsPerPage);
}

// 初始化分頁功能
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(interactableObjects.length / itemsPerPage)) {
        currentPage++;
        renderPage();
    }
});

