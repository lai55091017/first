import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import DoorAnimation from './DoorAnimation';
import InteractableObject from './InteractableObject';
import PopupWindow from './PopupWindow';
import wordlegame from "./wordlegame.js";
import MemoryCardGame from "../memorycard.js";

class Controller {

    constructor(scene, camera, canvas) {
        this.popupWindow = new PopupWindow();
        this.camera = camera;
        this.canvas = canvas;
        this.scene = scene;
        this.controls = new PointerLockControls(camera, this.canvas);
        this.__setupMovement();
        this.__setupListeners();
        this.__setupActions();
        this.isGame = false;  // 是否再遊戲中
        camera.position.y = this.playerHight;
        this.scene.add(camera);

        this.isInteractiveObjects = false //檢測是否滑鼠指向互動物件
        this.Other_functions = false //其他功能是否開啟
        this.speed = 0; // 新增速度的變數，用於偵測玩家的速度來播放不同動作
        this.isOpen = false;
        this.doors = {}; // 新增用來存放門的物件
        this.doorAnimation = null;
        this.isClickable = true;
        this.__setwordlegame()
        this.scene_options_Index = 0; // 初始聚焦索引
        this._setmemorygame();


    }

    // 設置門和初始化動畫
    // 設置門
    setDoors(leftDoor, rightDoor, doorType) {
        // 存儲每對門物件，以 doorType 作為鍵名
        this.doors[doorType] = { left: leftDoor, right: rightDoor };

        // 可以根據需要為每對門設置動畫
        console.log(`設定了 ${doorType} 的門：`, this.doors[doorType]);
    }

    __setwordlegame() {
        this.WordleGameUI = $("#WordleGame");
        this.guessGrid = document.getElementById("guess-grid");
        this.keyboard = document.getElementById("keyboard");
        this.WordleGame = new wordlegame(this.guessGrid, this.keyboard);
        this.WordleGameUI.hide();
    }

    //設置記憶遊戲
    _setmemorygame() {
        this.memorygame_container = new MemoryCardGame;
        this.memorygame_container_UI = $("#memorygame_container"); // 確保是 jQuery 對象
        this.memorygame_container_UI.hide();
    }

    //設置移動參數
    __setupMovement() {
        this.playerHight = 1.66;
        this.moveDistance = 16.0;
        this.moveFriction = 10;
        this.jumpHight = 250.0;
        this.gravity = 8.0;
        this.movingForward = false;
        this.movingBackward = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.canJump = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
    }

    //設置事件監聽器
    __setupListeners() {
        document.addEventListener('keydown', this.__handleKeyDown.bind(this));
        document.addEventListener('keyup', this.__handleKeyUp.bind(this));
        document.addEventListener('mousedown', this.__onMouseDown.bind(this));
        document.addEventListener('mousemove', this.__onMouseMove.bind(this));
    }

    //設置動作
    __setupActions() {
        this.walk_forward = () => { };
        this.walk_left = () => { };
        this.walk_backward = () => { };
        this.walk_right = () => { };
        this.run = () => { };
        this.idle = () => { };
        this.walk = () => { };
    }

    //處理鍵盤按下事件
    __handleKeyDown(event) {
        // console.log(event.code)
        if (!this.canJump || !this.isGame) return;
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) this.moveDistance = 16;
        const actions = {
            'KeyW': () => { this.movingForward = true; this.walk_forward(); }, // W鍵向前
            'KeyA': () => { this.movingLeft = true; this.walk_left(); }, // A鍵向左
            'KeyS': () => { this.movingBackward = true; this.walk_backward(); }, // S鍵向後 
            'KeyD': () => { this.movingRight = true; this.walk_right(); }, // D鍵向右
            'Space': () => { this.velocity.y += this.jumpHight; this.canJump = false; }, // 空白鍵可以跳
            'ShiftLeft': () => { this.run(); this.moveDistance = 40; }, // 左Shift可以奔跑
            'KeyM': () => {
                this.__scene_options()
            },
            'KeyF': () => {
                this.__toggleDoor('home');    // 開關家裡的門
                this.__toggleDoor('library'); // 開關圖書館的門
                this.__toggleDoor('school');  // 開關學校的門
            },

        }
        if (actions[event.code]) actions[event.code]();
    };

    //處理鍵盤放開事件
    __handleKeyUp(event) {
        const actions = {
            'KeyW': () => { this.movingForward = false; this.idle(); },
            'KeyA': () => { this.movingLeft = false; this.idle(); },
            'KeyD': () => { this.movingRight = false; this.idle(); },
            'KeyS': () => { this.movingBackward = false; this.idle(); },
            'ShiftLeft': () => { this.walk(); },
        };
        if (actions[event.code]) actions[event.code]();
    }

    //重置狀態
    __resetState() {
        this.movingForward = false;
        this.movingBackward = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.canJump = false;
        this.idle();
    }


    //物體的 Y 軸旋轉角度
    __getRotationShaveXZ(object) {
        const quaternion = object.quaternion.clone();
        const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
        return new THREE.Euler(0, euler.y, 0, 'ZXY');
    }

    //處理碰撞事件
    __handleCollisions(playerBody) {
        // 如果玩家碰撞到牆壁，將速度設置為 0
        playerBody.addEventListener('collision', (event) => {
            console.log("碰撞到牆壁");
            const contact = event.contact;
            const normal = contact.normal; // 碰撞法線

            // 如果撞到牆壁，停止移動
            if (Math.abs(normal.x) > 0.5) {
                this.velocity.x = 0;
                playerBody.velocity.x = 0;
            }
            if (Math.abs(normal.z) > 0.5) {
                this.velocity.z = 0;
                playerBody.velocity.z = 0;
            }
        });
    }

    update(delta) {
        const player = this.camera;
        const playerPosition = player.position;
        const playerBody = player.userData.physicsBody;

        if (!playerBody) return;

        // 獲取相機的朝向
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();

        // 計算移動方向向量
        const moveDirection = new THREE.Vector3();
        if (this.movingForward) moveDirection.z = -1;
        if (this.movingBackward) moveDirection.z = 1;
        if (this.movingLeft) moveDirection.x = -1;
        if (this.movingRight) moveDirection.x = 1;

        // 計算相機前向和右向的向量
        const forwardVector = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z);
        const rightVector = new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x);

        // 計算最終移動向量
        const finalMove = new THREE.Vector3();
        finalMove.addScaledVector(forwardVector, moveDirection.z);
        finalMove.addScaledVector(rightVector, moveDirection.x);
        finalMove.normalize();

        // 使用鋼體進行移動，而不是相機
        playerBody.velocity.x = -finalMove.x * this.moveDistance;
        playerBody.velocity.z = -finalMove.z * this.moveDistance;

        // 同步相機位置
        playerPosition.copy(playerBody.position);

        // // 跳躍
        // playerPosition.y += this.velocity.y * delta;
        // if (playerPosition.y < this.playerHight) {
        //     this.velocity.y = 0;
        //     playerPosition.y = this.playerHight;
        //     this.canJump = true;
        // }

        // 跳躍(有問題)
        playerPosition.y += this.velocity.y * delta;
        if (playerBody.position.y < this.playerHight) {
            this.velocity.y = 0;
            playerPosition.y = playerBody.position.y + this.playerHight / 2;
            this.canJump = true;
        }

        const characterData = player.children[0].children[0].userData;
        const { currentActionName, previousActionName } = characterData;
        const rotation = this.__getRotationShaveXZ(player);
        const position = new THREE.Vector3(playerPosition.x, playerPosition.y - this.playerHight, playerPosition.z)
        return { context: 'playerMove', position, rotation, currentActionName, previousActionName };
    }

    //設置畫面鎖定控制
    setupBlocker(blocker) {
        blocker.addEventListener('click', () => { this.controls.lock(); });
        this.controls.addEventListener('lock', () => {
            this.__toggleGameUI("blocker", false);
            document.addEventListener('keydown', (event) => { this.__chatroom(event); });
            this.isGame = true;
        });
        this.controls.addEventListener('unlock', () => {
            this.__resetState();
            if (this.isGame) {
                this.__toggleGameUI("blocker", true);
                document.removeEventListener('keydown', (event) => { this.__chatroom(event); });
                this.isGame = false;
            }
        });
    }

    //切換遊戲介面
    __toggleGameUI(isGameActive, powerswitch) {
        switch (isGameActive) {
            case "blocker":
                document.getElementById('blocker').style.display = powerswitch ? 'block' : 'none'; // 黑色遮罩
                document.getElementById('crosshair').style.display = powerswitch ? 'none' : 'block'; // 十字准心
                document.getElementById('menu').style.display = powerswitch ? 'block' : 'none'; // 菜单
                const mainMenu = $('#main_menu');
                if (powerswitch) {
                    // 顯示並應用淡入動畫
                    mainMenu
                        .removeClass('animate__fadeOutDown') // 確保移除隱藏動畫
                        .addClass('animate__fadeInUp')    // 添加顯示動畫
                        .css('display', 'block');      // 顯示元素
                } else {
                    // 隱藏並應用淡出動畫
                    mainMenu
                        .removeClass('animate__fadeInUp')  // 確保移除顯示動畫
                        .addClass('animate__fadeOutDown');   // 添加隱藏動畫

                    // 延遲動畫結束後隱藏元素
                    setTimeout(() => {
                        mainMenu.css('display', 'none');
                    }, 200); // 動畫時間：1秒（根據 Animate.css 的默認動畫時長設置）
                }
                break;
            case "chatroom":
                document.getElementById('message_input').style.display = powerswitch ? 'block' : 'none';
                document.getElementById('chat_box').style.display = powerswitch ? 'block' : 'none';
                document.getElementById('content').style.display = powerswitch ? 'block' : 'none';
                break;
            case "scene_options":
                document.getElementById('scene_options').style.display = powerswitch ? 'block' : 'none'; // 菜单
                break;
        }



    }

    // 聊天室
    __chatroom = (event) => {
        const messageInput = document.querySelector('#message_input');
        if (event.key === 'Enter' && !this.isInteractiveObjects && !this.Other_functions) {
            this.isGame = false;
            this.__toggleGameUI("chatroom", true);
            this.controls.unlock();

            messageInput.focus();
            // 發送消息
            if (messageInput.value.trim() !== "") {
                document.querySelector('#send_button').click();
            }
        }
        else if (event.key === 'Escape') {
            this.__toggleGameUI("chatroom", false);
            // 確保在適當的時機捕獲滑鼠
            setTimeout(() => {
                this.controls.lock(); // 重新鎖定滑鼠
            }, 200); // 延遲保證切換狀態後能夠正確鎖定
        }
    }

    __scene_options = () => {
        const menu = document.getElementById('scene_options');

        if (menu.style.display === 'none') {
            this.scene_options_Index = 0; // 初始聚焦索引
            this.__toggleGameUI("scene_options", true);
            this.isGame = false;
            this.Other_functions = true;

            // 確保場景選單內的按鈕存在
            const buttons = menu.querySelectorAll('button');
            if (buttons.length > 0) {
                buttons[0].focus(); // 預設聚焦到按鈕 id=0
            }

            // 添加鍵盤事件處理
            document.addEventListener('keydown', this.__Scene_option_controls);
        }
    };

    // 處理場景選單控制鍵
    __Scene_option_controls = (event) => {

        const menu = document.getElementById('scene_options');
        if (!menu || menu.style.display === 'none') return;

        const buttons = menu.querySelectorAll('button');
        if (buttons.length === 0) return;
        // 根據按鍵處理左右切換
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            this.scene_options_Index = (this.scene_options_Index - 1 + buttons.length) % buttons.length;
            buttons[this.scene_options_Index].focus();
        } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            this.scene_options_Index = (this.scene_options_Index + 1) % buttons.length;
            buttons[this.scene_options_Index].focus();
        } else if (event.code === 'Enter') {
            buttons[this.scene_options_Index].click(); // 執行當前按鈕點擊事件
            this.isGame = true;
            this.Other_functions = false;
            document.removeEventListener('keydown', this.__Scene_option_controls); // 移除事件處理
        } else if (event.code === 'Escape') {
            this.isGame = true;
            this.Other_functions = false;
            document.removeEventListener('keydown', this.__Scene_option_controls); // 移除事件處理
        }
    };


    CloseButton = () => {
        $('#close_wordlegame').on('click', () => {
            this.WordleGameUI.fadeOut(500);
            this.WordleGame.disableKeyboard();
            // 確保在適當的時機捕獲滑鼠
            setTimeout(() => {
                this.controls.lock(); // 重新鎖定滑鼠
            }, 200); // 延遲保證切換狀態後能夠正確鎖定
        });
        $('#close_memorygame').on('click', () => {
            this.memorygame_container_UI.fadeOut(500);

            // 確保在適當的時機捕獲滑鼠
            setTimeout(() => {
                this.controls.lock(); // 重新鎖定滑鼠
            }, 200); // 延遲保證切換狀態後能夠正確鎖定
        });
    };
    __wordlegame = (event) => {
        if (event.code === 'KeyF' && this.isGame === true) {
            this.isGame = false;
            this.WordleGameUI.fadeIn(500);
            this.WordleGame.enableKeyboard();
            this.controls.unlock();
        }
        else if (event.code === 'Escape') {
            this.WordleGameUI.fadeOut(500);
            this.WordleGame.disableKeyboard();
            // 確保在適當的時機捕獲滑鼠
            setTimeout(() => {
                this.controls.lock(); // 重新鎖定滑鼠
            }, 200); // 延遲保證切換狀態後能夠正確鎖定
        }
    }
    __memorycardgame = (event) => {
        if (event.code === 'KeyF' && this.isGame === true) {
            this.isGame = false;
            this.memorygame_container_UI.fadeIn(500);
            this.controls.unlock();
        }
        else if (event.code === 'Escape') {
            this.memorygame_container_UI.fadeOut(500);

            // 確保在適當的時機捕獲滑鼠
            setTimeout(() => {
                this.controls.lock(); // 重新鎖定滑鼠
            }, 200); // 延遲保證切換狀態後能夠正確鎖定
        }
    }

    // 開關門的方法（以對應的門對為參數）
    __toggleDoor(doorType) {
        const door = this.doors[doorType];
        if (!door) {
            console.error(`門類型 ${doorType} 尚未初始化`);
            return;
        }

        // 使用 DoorAnimation 來開關門
        const { left, right } = door;
        this.doorAnimation = new DoorAnimation(left, right);
        if (this.isOpen) {
            this.doorAnimation.closeDoors();
        } else {
            this.doorAnimation.openDoors();
        }
        this.isOpen = !this.isOpen;
    }

    __onMouseMove() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(0, 0);
        raycaster.setFromCamera(mouse, this.camera);
        raycaster.layers.set(1); // 將射線設置為檢測特定圖層
        raycaster.precision = 0.00001;
        raycaster.far = 8; // 調整射線的長度

        // 射線檢測是否與場景中的物體相交
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        // 獲取十字準心和提示元素
        const crosshair = document.getElementById('crosshair');
        let actionPrompt = document.getElementById('action_prompt');

        // 如果提示元素不存在，動態創建
        if (!actionPrompt) {
            actionPrompt = document.createElement('div');
            actionPrompt.id = 'action_prompt';
            actionPrompt.style.position = 'absolute';
            actionPrompt.style.bottom = '40%';
            actionPrompt.style.left = '50%';
            actionPrompt.style.transform = 'translateX(-50%)';
            actionPrompt.style.padding = '10px 20px';
            actionPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            actionPrompt.style.color = 'white';
            actionPrompt.style.fontSize = '14px';
            actionPrompt.style.borderRadius = '5px';
            actionPrompt.style.display = 'none'; // 初始隱藏
            actionPrompt.textContent = '按 F 鍵進行交互';
            document.body.appendChild(actionPrompt);
        }

        if (intersects.length > 0) {
            const object = intersects[0].object;

            // 檢測是否為目標物件
            if (object) {
                crosshair.style.borderColor = '#ff0000d4'; // 高亮顯示十字準心
                crosshair.style.transform = 'scale(1.5)'; // 放大十字準心
                crosshair.style.transition = 'all 0.3s ease';
                crosshair.classList.add('active');
                // 特定的互動物件
                if (object.name === 'Wordle Game') {
                    this.isInteractiveObjects = true;
                    actionPrompt.style.display = 'block'; // 顯示提示
                    document.addEventListener('keydown', this.__wordlegame);
                    this.CloseButton()
                } else if (object.name === 'Memory Game') {
                    this.isInteractiveObjects = true;
                    actionPrompt.style.display = 'block'; // 顯示提示
                    document.addEventListener('keydown', this.__memorycardgame);
                    this.CloseButton()
                }
            }
        }
        else {
            // 沒有指向物件時，隱藏提示並恢復十字準心
            crosshair.style.borderColor = 'white';
            crosshair.style.transform = 'scale(1)';
            crosshair.classList.remove('active');
            actionPrompt.style.display = 'none'; // 隱藏提示
            this.isInteractiveObjects = false;
            document.removeEventListener('keydown', this.__wordlegame);
        }
    }


    __onMouseDown() {
        if (!this.isGame) return;
        // 使用Raycaster檢測玩家點擊了啥物件
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(0, 0);

        // 透過Raycaster檢測
        raycaster.setFromCamera(mouse, this.camera);
        raycaster.layers.set(1);
        raycaster.precision = 0.00001;
        raycaster.far = 8;// 調整射線的長度
        // 檢查是否與門物件相交
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;// 獲取相交的物件
            console.log(object.name);

            const originalColor = object.material.emissive.clone();

            if (object.name === 'Wordle Game' || object.name === 'Memory Game') {
                return;
            } else if (object && this.isClickable) {
                this.isClickable = false; // 禁止點擊操作

                object.material.emissive.set(1, 1, 1); //選擇顏色發光
                object.material.emissiveIntensity = 0.1; // 發光強度
                // 顯示彈窗
                const ITO = InteractableObject.find(item => item.id === object.name);

                this.popupWindow.show(
                    ITO.chineseName,
                    ITO.englishName,
                    // { x: event.clientX, y: event.clientY }
                );
                const englishName = InteractableObject.find(item => item.id === object.name).englishName;
                this.popupWindow.speak(englishName);

                setTimeout(() => {
                    this.isClickable = true;
                    this.popupWindow.hide();
                    object.material.emissive = originalColor;
                }, 3000);
            } else {
                console.log('無可互動物件');
            }
        }
    }



}
export default Controller;