
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
const connect = new Connect('ws://localhost:8080');
// const connect = new Connect( 'https://my-websocket-server-ci74yzkzzq-as.a.run.app' );
// const connect = new Connect('https://my-websocke-server3-485354531854.asia-east1.run.app');

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
// $('#continue').on("click", function () {
//     controller.setupBlocker(blocker);
// })
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

    init_physics();
    connect.onJoin = onPlayerJoin;
    connect.onLeave = onPlayerLeave;
    connect.onMove = onPlayerMove;
    connect.onMessage = onPlayerMessage;
    controller.setupBlocker(document.getElementById('blocker'));
    controller.setupBlocker(document.getElementById('continue'));

    // 導入(載入)模型
    loadModels();
    // loadModels1();
}

/*********************************** Websocket Event *********************************************/

let playerBody;
let targetBody;
let currentPlayer = null; // 定義全域變數來存儲當前玩家角色
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
            // camera.userData.physicsBody = playerBody;
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
            currentPlayer = true; // 保存玩家角色到全域變數
            console.log(currentPlayer);
            // 將玩家移動到 (0, 0, 0)
            if (currentPlayer) {
                playerBody.position.set(1, 1, 0); // 設定玩家位置
                console.log(`玩家位置:`, playerBody.position);
            } else {
                console.log(`玩家角色未初始化`);
            }
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
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3));
    scene.add(new THREE.DirectionalLight(0xffffff, 3));
}
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

function init_renderer() {
    const canvas = renderer.domElement;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(canvas);
}

function init_other() {
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
    cannonDebugger.update()

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

//嚴重bug會刪到多人的物體
function clearSceneModelsAndPhysics() {
    // 白名單：保留的物件名稱（可以根據具體需求添加名稱）
    const preservedNames = ['Player', 'PlayerModel', 'MainCamera', 'PlayerLight'];

    function recursiveDispose(object) {
        // 保留白名單中的物件
        if (preservedNames.includes(object.name)) {
            console.log(`保留物件: ${object.name}`);
            return;
        }

        // 遞歸清理子物件
        while (object.children.length > 0) {
            const child = object.children[0];
            recursiveDispose(child); // 清理子物件
            object.remove(child); // 從父物件中移除
        }

        // 如果是 Mesh，釋放其幾何體和材質
        if (object instanceof THREE.Mesh) {
            if (object.geometry) {
                object.geometry.dispose();
                // console.log(`已釋放幾何體: ${object.name}`);
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => mat.dispose());
                } else {
                    object.material.dispose();
                }
                // console.log(`已釋放材質: ${object.name}`);
            }
        }

        // 如果綁定了剛體，移除剛體
        if (object.userData.physicsBody) {
            const physicsBody = object.userData.physicsBody;
            const index = cannon_world.bodies.indexOf(physicsBody);
            if (index !== -1) {
                cannon_world.bodies.splice(index, 1);
                // console.log(`已從物理世界移除剛體: ${object.name}`);
            }
        }

        // 從場景中移除物件
        if (object.parent === scene) {
            // console.log(`已從場景中移除容器: ${object.name}`);
            scene.remove(object);
        }
    }

    // 遍歷場景的頂層物件
    while (scene.children.length > 0) {
        const object = scene.children[0];
        recursiveDispose(object); // 清理每個頂層物件
    }

    console.log('場景清理完成');
}


// 導入場景模型2.0
async function loadModels(scenePath = './mesh/glb/total.glb') {
    try {
        init_scene();
        // 加載新場景
        console.log(`正在加載場景：${scenePath}`);
        let library = await icas.loadGLTF(scenePath); // 非同步加載場景文件
        scene.add(library.scene);
        console.log(`場景加載完成: ${scenePath}`);


        scene.position.set(0, 0, 0);// 本地位置
        const worldPosition = new THREE.Vector3(0, 0, 0);// 世界位置
        //將本地座標轉換為世界座標
        scene.localToWorld(worldPosition);

        console.log(`本地座標場景位置:`, scene.position);
        console.log(`世界座標場景位置:`, worldPosition);

        // 調試場景結構
        // library.scene.traverse((child) => {
        //     console.log(`加載的場景物件: ${child.name}, 類型: ${child.constructor.name}`);
        // });

        // 綁定物理引擎
        library.scene.traverse((child) => {
            if (child.isMesh) {
                create_physics_body_box(child); // 為每個模型綁定剛體
                // console.log(`綁定剛體到物件: ${child.name}`);
            }
        });

        // 處理場景中特定物件
        function processSceneObjects(scene) {
            const objects = {
                doors: [],
                chairs: [],
                tables: [],
                counters: [],
                bookshelves: [],
                sofas: []
            };

            // 使用正則表達式匹配物件名稱
            scene.traverse((child) => {
                if (child.isMesh && child.name) {
                    if (/LIB_Door_(Left|Right)/.test(child.name)) {
                        child.name = 'Door';
                        objects.doors.push(child);
                    } else if (/.*Door_(L|R)/.test(child.name)) {
                        child.name = 'Door';
                        objects.doors.push(child);
                    } else if (/^Chair_\d+_\d+$/.test(child.name)) {
                        child.name = 'Chair';
                        objects.chairs.push(child);
                    } else if (/^LIB_Table_\d+$/.test(child.name)) {
                        child.name = 'Table';
                        objects.tables.push(child);
                    } else if (/^.*_table/.test(child.name)) {
                        child.name = 'Table';
                        objects.tables.push(child);
                    } else if (/^counter_\d+$/.test(child.name)) {
                        child.name = 'Counter';
                        objects.counters.push(child);
                    } else if (/^Bookshelf_\d+$/.test(child.name)) {
                        child.name = 'Bookshelf';
                        objects.bookshelves.push(child);
                    } else if (/^Sofa_\d+$/.test(child.name)) {
                        child.name = 'Sofa';
                        objects.sofas.push(child);
                    }
                }
            });

            console.log('找到所有物件:', objects);
            // 確保找到所有關鍵物件
            if (
                objects.doors.length === 2 ||
                objects.chairs.length > 0 ||
                objects.tables.length > 0 ||
                objects.counters.length > 0 ||
                objects.bookshelves.length > 0 ||
                objects.sofas.length > 0
            ) {
                console.log('好消息，找到圖書館的所有物件了');
                // 設置圖層
                objects.doors.forEach((door) => door.layers.set(1));
                objects.chairs.forEach((chair) => chair.layers.set(1));
                objects.tables.forEach((table) => table.layers.set(1));
                objects.counters.forEach((counter) => counter.layers.set(1));
                objects.bookshelves.forEach((bookshelf) => bookshelf.layers.set(1));
                objects.sofas.forEach((sofa) => sofa.layers.set(1));

                // 傳遞到控制器
                controller.setDoors(objects.doors[0], objects.doors[1]);
                controller.setChairs(objects.chairs);
                controller.setTables(objects.tables);
                controller.setCounters(objects.counters);
                controller.setBookshelves(objects.bookshelves);
                controller.setSofas(objects.sofas);
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

function showSceneOptions() {
    const menu = document.createElement('div');
    menu.id = 'scene_options';

    // const scenes = {
    //     'Library': './mesh/glb/Library_update_Final_6.glb',
    //     'Home': './mesh/glb/Home_8.glb',
    //     'School': './mesh/glb/School.glb',
    // };
    const scenes = [
        'Library',
        'Home',
        'School',
    ];

    scenes.forEach(
        async (sceneName) => {
            const button = document.createElement('button');
            button.textContent = `${sceneName}`;
            // button.style.margin = '10px';
            button.onclick = async () => {
                // 清理舊場景
                // await loadModels(point); // 使用非同步的場景加載

                document.body.removeChild(menu); // 清除選單
                console.log(` find the scene: ${sceneName}`);

                scene.position.set(0, 0, 0);// 本地位置
                const worldPosition = new THREE.Vector3(0, 0, 0);// 世界位置
                //將本地座標轉換為世界座標
                scene.localToWorld(worldPosition);
                //將本地座標轉換為世界座標

                console.log(`本地座標場景位置:`, scene.position);
                console.log(`世界座標場景位置:`, worldPosition);

                currentPlayer = true; // 保存玩家角色到全域變數
                // console.log(currentPlayer);

                // 將玩家移動到 (0, 0, 0)
                if (button.textContent == 'Library') {
                    // playerBody.position.set(1, 1, 0); // 設定玩家位置
                    playerBody.position.set(0, 0, 0); // 將角色移動到目標位置
                    console.log(`角色已移動到: ${sceneName}, 位置: `);
                    console.log(`玩家位置:`, playerBody.position);
                } else if (button.textContent == 'Home') {
                    console.log(`角色已移動到: ${sceneName} `);
                    playerBody.position.set(20, 0, 1); // 將角色移動到目標位置
                    console.log(`玩家位置:`, playerBody.position);

                } else if (button.textContent == 'School') {
                    console.log(`角色已移動到: ${sceneName}`);
                    playerBody.position.set(2, 0, 2);
                    console.log(`玩家位置: `, playerBody.position);

                } else {
                    console.log(`玩家角色未初始化`);
                }
            }

            menu.appendChild(button);
        });


    // // 假設場景中有目標點和玩家角色
    // const targetPoints =
    // {
    //     'library': 'new THREE.Vector3(0, 0, 0)',
    //     'home': ' new THREE.Vector3(20, 0, 0) ',
    //     'school': 'new THREE.Vector3(-20, 0, 0) '
    // };

    // Object.entries(targetPoints).forEach(([pointName, point]) => {
    //     const button = document.createElement("button");
    //     button.textContent = ` ${ pointName }`;
    //     console.log(`目標點: ${ pointName }, 位置: ${ point }`);
    //     document.body.removeChild(menu); // 清除選單

    //     // 按下按鈕時移動玩家到該目標點
    //     button.onclick = async () => {
    //         if (currentPlayer) {
    //             playerBody.position.copy(point); // 將角色移動到目標位置
    //             console.log(`角色已移動到: ${ pointName }, 位置: `, point);
    //         } else {
    //             console.error("玩家角色未初始化！");
    //         }
    //     };

    //     // 添加按鈕到頁面
    //     menu.appendChild(button);
    // });

    const closeButton = document.createElement('button');
    closeButton.textContent = '取消';
    // closeButton.style.margin = '10px';
    closeButton.onclick = () => document.body.removeChild(menu);
    menu.appendChild(closeButton);

    document.body.appendChild(menu);
}



controller.__toggleDoor = function () {
    if (!this.doorAnimation) {
        console.error('門未初始化');
        return;
    }

    if (this.isOpen) {
        this.doorAnimation.closeDoors();
    } else {
        this.doorAnimation.openDoors();
        showSceneOptions(this); // 顯示場景切換選單
    }

    this.isOpen = !this.isOpen;
};





/*-----------------------------------暫停模式menu--------------------------------------------------*/

const main_menu = $("#main_menu");
const menu_btn = $(".btn");

//toggle代表切換顯示和消失，fade代表淡入淡出，500(0.5秒)是淡入淡出的時間
// menu_btn.on('click', async () => {
//     main_menu.fadeToggle(500);
// })

const instruction = $("#instruction_container");

instruction.hide();

$("#instruction").on('click', async () => {
    instruction.fadeToggle(500);
})

const WordleGame = $("#WordleGame");

WordleGame.hide();

$('#Game').on('click', async () => {
    WordleGame.fadeToggle(500);
})


/*-----------------------------------關閉按鈕--------------------------------------------------*/
//$(document).ready() 是 jQuery 提供的一個事件，主要用於確保 DOM 完全加載後執行 JavaScript 代碼。
$(document).ready(function () {

    $(".close").click(function () {
        // 獲取按鈕的 ID
        const buttonId = $(this).attr('id');
        // 使用 switch...case 根據按鈕 ID 處理
        switch (buttonId) {
            case 'close_instruction'://id=close_instruction
                instruction.fadeToggle(500);
                break;
            case 'close_wordlegame'://id=close_wordlegame
                WordleGame.fadeToggle(500);
                break;
            default:
                console.log('未知的按鈕 ID');
        }
    });
})
/*-----------------------------------wordlegame--------------------------------------------------*/

// 定義單字和它的中文意思
const wordMeanings = {
    apple: "蘋果",
    banana: "香蕉",
    grape: "葡萄",
    orange: "橘子",
    guava: "芭樂",
    dog: "狗",
    cat: "貓",
    cow: "牛",
    pig: "豬",
    bird: "鳥",
    sheep: "羊",
    chicken: "雞",
    pencil: "鉛筆",
    eraser: "橡皮擦",
    ruler: "尺",
    fork: "叉子",
    spoon: "湯匙",
    america: "美國",
    china: "中國",
    taiwan: "台灣",
    japan: "日本",
    korea: "韓國",
    rice: "飯",
    noodle: "麵",
    soup: "湯",
    meat: "肉",
    bed: "床",
    bread: "麵包",
    bedroom: "臥室",
    kitchen: "廚房",
    livingroom: "客廳",
    bathroom: "浴室",
    balcony: "陽台",
    socket: "插座",
    sofa: "沙發",
    tv: "電視",
    wardrobe: "衣櫃",
    fridge: "冰箱",
    table: "桌子",
    chair: "椅子",
    window: "窗戶",
    blackboard: "黑板",
    door: "門",
    school: "學校",
    classroom: "教室",
    teacher: "老師",
    student: "同學",
    class: "班級",
    homework: "作業",
    wall: "牆壁",
    fan: "電扇",
    chalk: "粉筆",
    clock: "時鐘",
    book: "書",
    pen: "筆",
    pencil: "鉛筆",
    eraser: "橡皮擦",
    notebook: "筆記本",
    computer: "電腦",
    restroom: "洗手間",
    library: "圖書館",
    platform: "司令台",
    playground: "操場",
    backpack: "背包",
    bookcase: "書櫃",
    mirror: "鏡子",

};

// 獲得中文意思
function getChineseMeaning(word) {
    return wordMeanings[word.toLowerCase()] || "未知";
};

// 單字主題和對應的單字庫
const themes = {
    // 解釋："key": ["value0", "value1", "value2"] key就相當於目錄的名字，value就是key裡面的值，這樣可以方便獲取相關資料
    "水果": ["apple", "banana", "grape", "orange", "guava"],
    "動物": ["dog", "cat", "cow", "pig", "bird", "sheep", "chicken"],
    "工具": ["pencil", "eraser", "ruler", "fork", "spoon"],
    "國家": ["america", "china", "taiwan", "japan", "korea"],
    "食物": ["rice", "noodle", "soup", "meat", "bread"],
    "家裡": ["bed", "bedroom", "kitchen", "livingroom", "bathroom", "balcony", "socket", "sofa", "tv", "wardrobe", "fridge"],
    "學校": ["table", "chair", "window", "blackboard", "door", "school", "classroom", "teacher", "student", "class", "homework",
        "wall", "fan", "chalk", "clock", "book", "pen", "pencil", "eraser", "notebook", "computer", "restroom", "library", "platform", "playground", "backpack", "bookcase", "mirror"
    ],

};

// 隨機選擇一個主題和對應的單字庫
const themeNames = Object.keys(themes);
const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
const wordList = themes[randomTheme];  // 取得隨機選中的單字庫
let answer = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase(); // 從單字庫中選擇隨機一個單字作謎底
let chineseAnswer = getChineseMeaning(answer); // 獲取答案的中文意思

// 更新標題顯示選定的主題名稱
document.querySelector("h1").textContent = `本次的主題是 ${randomTheme}`;

// 測試用，顯示隨機到的主題和單字，完成後記得刪(不然可以直接從控制台看到答案)
console.log(`主題: ${randomTheme}, 答案: ${answer}`);

// 遊戲設定(參數)
const maxAttempts = 6; // 最大嘗試次數
let currentAttempt = 0;
let currentGuess = "";

// 選擇HTML元素
const guessGrid = document.getElementById("guess-grid");
const keyboard = document.getElementById("keyboard");

// ------------------------------遊戲UI部分------------------------------
// 初始化，遊戲介面
function initGame() {
    // 讓一行的格子數和答案長度相同
    const columns = answer.length; // 行=答案長度
    guessGrid.style.gridTemplateColumns = `repeat(${columns}, 50px)`;

    // 創建格子
    for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < answer.length; j++) {
            const box = document.createElement("div");
            box.classList.add("letter-box");
            guessGrid.appendChild(box);
        }
    }

    // 創建虛擬鍵盤
    const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let count = 0;

    keys.forEach(letter => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = letter;
        key.onclick = () => handleKeyPress(letter);
        key.setAttribute("data-key", letter);
        keyboard.appendChild(key);

        // 虛擬鍵盤每7個字母就換行，7*4 (26個英文字母+退回鍵+提交鍵)
        count++;
        if (count % 7 === 0) {
            keyboard.appendChild(document.createElement("br"));
        }
    });

    // 加入退回鍵和提交鍵
    const backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key");
    backspaceKey.textContent = "退回";
    backspaceKey.onclick = () => handleKeyPress("BACKSPACE");
    keyboard.appendChild(backspaceKey);

    const submitKey = document.createElement("div");
    submitKey.classList.add("key");
    submitKey.textContent = "提交";
    submitKey.onclick = submitGuess; // 直接連接提交函數
    keyboard.appendChild(submitKey);
}

// ------------------------------遊戲運行部分------------------------------
// 重新開始遊戲的初始化，清空上局遊戲的相關變數 (處理問題1)
function resetGame() {
    currentAttempt = 0;
    currentGuess = "";

    // 隨機選擇主題和單字庫
    const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
    const wordList = themes[randomTheme];
    answer = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    chineseAnswer = getChineseMeaning(answer);

    // 測試用：顯示隨機主題和單字
    console.log(`主題: ${randomTheme}, 答案: ${answer}`);

    // 更新標題顯示選定的主題名稱
    document.querySelector("h1").textContent = `本次的主題是 ${randomTheme}`;

    // 清空現有的格子
    guessGrid.innerHTML = "";

    // 清空上一局遊戲的虛擬鍵盤
    keyboard.innerHTML = "";

    // 重新初始化遊戲，根據新答案生成正確數量的格子
    initGame();

    // 清除方塊內文字和內容
    const boxes = document.querySelectorAll(".letter-box");
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove("correct", "present", "absent");
    });

    // 重置虛擬鍵盤的顏色
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.classList.remove("correct", "present", "absent"); // 清除狀態
        key.style.backgroundColor = "#ffffff"; // 重置格的顏色
        key.style.color = "#333"; // 重置字的顏色
    });
}

// 處理鍵盤的輸入，包括添加字母和退回鍵
function handleKeyPress(letter) {
    if (letter === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1); // 刪除最後一個輸入的字母
    } else if (currentGuess.length < answer.length) {
        currentGuess += letter;  // 添加單字
    }
    updateGuessGrid();  // 更新當前猜測的單字格顯示
}

// 更新當前猜測的單字格顯示
function updateGuessGrid() {
    const boxes = guessGrid.querySelectorAll(".letter-box");
    const offset = currentAttempt * answer.length;
    // 清空目前顯示的字母格
    for (let i = 0; i < answer.length; i++) {
        boxes[offset + i].textContent = currentGuess[i] || ""; // 如果有字母就顯示，否則清空
    }
}

// 同步更新鍵盤顏色
function updateKeyboardStatus(letter, status) {
    const key = document.querySelector(`.key[data - key= "${letter}"]`);
    if (key) {
        // 檢查目前的狀態避免鍵盤被刷新覆蓋，調整優先級為綠(correct)>黃(present)>灰(absent)
        if (status === "correct") {
            key.style.backgroundColor = "#6aaa64"; // 虛擬鍵盤顏色設為綠色，字母正確，位置正確
            key.style.color = "#fff";
        } else if (status === "present" && !key.classList.contains("correct")) {
            if (key.style.backgroundColor !== "rgb(106, 170, 100)") { // 避免覆蓋 correct 顏色
                key.style.backgroundColor = "#c9b458"; // 虛擬鍵盤顏色設為黃色，字母正確，位置錯誤
                key.style.color = "#fff";
            }
        } else if (status === "absent" && !key.classList.contains("correct") && !key.classList.contains("present")) {
            if (key.style.backgroundColor !== "rgb(106, 170, 100)" && key.style.backgroundColor !== "rgb(201, 180, 88)") {
                key.style.backgroundColor = "#787c7e"; // 虛擬鍵盤顏色設為灰色，字母錯誤
                key.style.color = "#fff";
            }
        }
    }
}


// 提交答案並檢查是否正確
function submitGuess() {
    // if (currentGuess.length !== answer.length) {
    //     alert("Please enter a word with the correct length."); // 若提交的單字和答案長度不同則告訴用戶 " 請輸入一個長度正確的單字 "
    //     return;
    // }

    const boxes = guessGrid.querySelectorAll(".letter-box");
    const offset = currentAttempt * answer.length;

    // 臨時保存答案 (處理問題3)
    const answerLetters = answer.split("");
    const guessLetters = currentGuess.split("");

    // 第一輪：檢查綠色
    for (let i = 0; i < guessLetters.length; i++) {
        const box = boxes[offset + i];
        if (guessLetters[i] === answerLetters[i]) {
            box.classList.add("correct");
            answerLetters[i] = null; // 將已匹配的字母設為 null，避免重複計算
            updateKeyboardStatus(guessLetters[i], "correct"); // 同步鍵盤顏色
        }
    }

    // 第二輪：檢查黃色
    for (let i = 0; i < guessLetters.length; i++) {
        const box = boxes[offset + i];
        if (!box.classList.contains("correct")) { // 避免重複標記綠色
            const letterIndex = answerLetters.indexOf(guessLetters[i]);
            if (letterIndex !== -1) {
                box.classList.add("present");
                answerLetters[letterIndex] = null; // 標記已匹配的字母
                updateKeyboardStatus(guessLetters[i], "present"); // 同步鍵盤顏色
            } else {
                box.classList.add("absent"); // 不包含的字母
                updateKeyboardStatus(guessLetters[i], "absent"); // 同步鍵盤顏色
            }
        }
    }

    // 檢查是否猜對
    if (currentGuess === answer) {
        alert(`You guessed the word! The word was: ${answer}(${chineseAnswer})`); // 若猜的單字和答案匹配則告訴用戶 " 恭喜！你猜對了 "
        setTimeout(resetGame, 1000); // 1秒後刷新遊戲
        return;
    }

    // 重置當前猜測並增加次數
    currentAttempt++;
    currentGuess = "";

    if (currentAttempt >= maxAttempts) {
        alert(`Game over! The word was: ${answer}(${chineseAnswer})`); // 如果猜測次數>最大猜測次數就告訴用戶 "遊戲結束！這個單字是_____。"
        setTimeout(resetGame, 1000); // 1秒後刷新遊戲
    }
}

// 添加鍵盤事件監聽 (處理問題4)
document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();

    if (key === "ENTER") {
        submitGuess();
    } else if (key === "BACKSPACE") {
        handleKeyPress("BACKSPACE");
    } else if (/^[A-Z]$/.test(key)) { // 只允許輸入字母 A~Z
        handleKeyPress(key);
    }
});

// 初始化，遊戲
initGame();