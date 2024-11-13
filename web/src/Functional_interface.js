
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

}
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
    pen: "筆",
    eraser: "橡皮擦",
    book: "書",
    table: "桌子",
    chair: "椅子",
    teacher: "老師"
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
    "教室": ["pen", "eraser", "book", "table", "chair", "teacher"]
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
    const key = document.querySelector(`.key[data-key="${letter}"]`);
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
    if (currentGuess.length !== answer.length) {
        alert("Please enter a word with the correct length."); // 若提交的單字和答案長度不同則告訴用戶 " 請輸入一個長度正確的單字 "
        return;
    }

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
        alert("Congratulations! You guessed the word!"); // 若猜的單字和答案匹配則告訴用戶 " 恭喜！你猜對了 "
        setTimeout(resetGame, 1000); // 1秒後刷新遊戲
        return;
    }

    // 重置當前猜測並增加次數
    currentAttempt++;
    currentGuess = "";

    if (currentAttempt >= maxAttempts) {
        alert(`Game over! The word was: ${answer} (${chineseAnswer})`); // 如果猜測次數>最大猜測次數就告訴用戶 "遊戲結束！這個單字是_____。"
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