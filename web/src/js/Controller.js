import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import DoorAnimation from './DoorAnimation';
import InteractableObject from './InteractableObject';
import PopupWindow from './PopupWindow';

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
        this.speed = 0; // 新增速度的變數，用於偵測玩家的速度來播放不同動作
        this.isOpen = false;
        this.libDoorL = null;
        this.libDoorR = null;
        this.modelChair = null;
        this.modelTable = null;
        this.modelCounter = null;
        this.modelBookshelf = null;
        this.doorAnimation = null;
        this.WordleGame = $("#WordleGame");
    }

    // 設置門和初始化動畫
    setDoors(libDoorL, libDoorR) {
        this.libDoorL = libDoorL;
        this.libDoorR = libDoorR;
        this.doorAnimation = new DoorAnimation(libDoorL, libDoorR);

        console.log('已將門從FI.js傳遞至Ctrlr.js')
    }

    setChairAndTable(modelChair, modelTable) {
        this.modelChair = modelChair;
        this.modelTable = modelTable;
    }

    setCounter(modelCounter) {
        this.modelCounter = modelCounter;
    }

    setBookshelf(modelBookshelf) {
        this.modelBookshelf = modelBookshelf;
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
        if (!this.canJump || !this.isGame) return;
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) this.moveDistance = 16;
        const actions = {
            'KeyW': () => { this.movingForward = true; this.walk_forward(); }, // W鍵向前
            'KeyA': () => { this.movingLeft = true; this.walk_left(); }, // A鍵向左
            'KeyS': () => { this.movingBackward = true; this.walk_backward(); }, // S鍵向後 
            'KeyD': () => { this.movingRight = true; this.walk_right(); }, // D鍵向右
            'Space': () => { this.velocity.y += this.jumpHight; this.canJump = false; }, // 空白鍵可以跳
            'ShiftLeft': () => { this.run(); this.moveDistance = 40; }, // 左Shift可以奔跑
            'KeyF': () => { this.__toggleDoor(); } // F鍵可以開關門
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


    //更新角色
    // update(delta) {

    //     const player = this.camera;
    //     const playerPosition = player.position;
    //     // const playerBody = player.userData.physicsBody;
    //     // console.log(playerBody);

    //     // if (!playerBody) return;

    //     // 随着时间速度会因摩擦力减小
    //     this.velocity.x -= this.velocity.x * this.moveFriction * delta;
    //     this.velocity.z -= this.velocity.z * this.moveFriction * delta;
    //     this.velocity.y -= 9.8 * this.gravity * delta;

    //     // 玩家移动方向
    //     this.direction.z = Number(this.movingForward) - Number(this.movingBackward);
    //     this.direction.x = Number(this.movingRight) - Number(this.movingLeft);
    //     this.direction.normalize();

    //     // 更新玩家的移动速度
    //     if (this.movingForward || this.movingBackward) {
    //         this.velocity.z -= this.direction.z * this.moveDistance * delta
    //     };
    //     if (this.movingLeft || this.movingRight){
    //         this.velocity.x -= this.direction.x * this.moveDistance * delta
    //     };

    //     // 玩家移动
    //     this.controls.moveRight(- this.velocity.x * delta);
    //     this.controls.moveForward(- this.velocity.z * delta);

    //     // 防止角色穿牆
    //     // this.__handleCollisions(playerBody);

    //     // 跳躍
    //     playerPosition.y += this.velocity.y * delta;
    //     if (playerPosition.y < this.playerHight) {
    //         this.velocity.y = 0;
    //         playerPosition.y = this.playerHight;
    //         this.canJump = true;
    //     }

    //     // 計算速度
    //     const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    //     this.speed = speed; // 更新速度變數

    //     const characterData = player.children[0].children[0].userData;
    //     const { currentActionName, previousActionName } = characterData;
    //     const rotation = this.__getRotationShaveXZ(player);
    //     const position = new THREE.Vector3(playerPosition.x, playerPosition.y - this.playerHight, playerPosition.z)
    //     return { context: 'playerMove', position, rotation, currentActionName, previousActionName };

    // } 

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
        // playerPosition.x = playerBody.position.x;
        // playerPosition.z = playerBody.position.z;

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
            document.addEventListener('keydown', this.__chatroom);
            this.isGame = true;
        });
        this.controls.addEventListener('unlock', () => {
            this.__resetState();
            if (this.isGame) {
                this.__toggleGameUI("blocker", true);
                document.removeEventListener('keydown', this.__chatroom);
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
                document.getElementById('main_menu').style.display = powerswitch ? 'block' : 'none';
                break;
            case "chatroom":
                document.getElementById('message_input').style.display = powerswitch ? 'block' : 'none';
                document.getElementById('chat_box').style.display = powerswitch ? 'block' : 'none';
                document.getElementById('content').style.display = powerswitch ? 'block' : 'none';
                break;
        }



    }

    // 聊天室
    __chatroom = (event) => {
        const messageInput = document.querySelector('#message_input');
        if (event.key === 'Enter') {
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

    // 開關門方法
    __toggleDoor() {
        if (!this.doorAnimation) {
            console.error('門未初始化');
            return;
        }

        if (this.isOpen) {
            // 關門
            this.doorAnimation.closeDoors();
            // 先註解，要是門動畫有問題再用這個
            // this.libDoorL.rotation.y = 0;
            // this.libDoorR.rotation.y = 0;
        } else {
            // 開門
            this.doorAnimation.openDoors();
            // 先註解，要是門動畫有問題再用這個
            // this.libDoorL.rotation.y = -Math.PI / 2; // 左門 -90度
            // this.libDoorR.rotation.y = Math.PI / 2;  // 右門 90度

            // 5秒後自動關門
            setTimeout(() => {
                this.doorAnimation.closeDoors(); // 關門動畫
                this.isOpen = false;  // 重置門的狀態
            }, 5000); // 這裡的5000是指5秒後自動關門
        }

        // 切換門的狀態
        this.isOpen = !this.isOpen;
    }


    __onMouseDown(event) {
        // 使用Raycaster檢測玩家點擊了啥物件
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(0, 0);

        // 透過Raycaster檢測
        raycaster.setFromCamera(mouse, this.camera);
        raycaster.layers.set(1);
        raycaster.precision = 0.00001;
        // 檢查是否與門物件相交
        const intersects = raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            // console.log(intersects);
            const object = intersects[0].object;// 獲取相交的物件
            // 判斷是否有可互動物件
            const color = new THREE.Color(Math.random(), Math.random(), Math.random())
            object.material.color = color;
            console.log(object.name);

            if (object.name === 'Door' | object.name === 'Chair' | object.name === 'Table' | object.name === 'Counter' | object.name === 'Bookshelf') {

                // 顯示彈窗
                const ITO = InteractableObject.find(item => item.id === object.name);
                this.popupWindow.show(
                    ITO.chineseName,
                    ITO.englishName,
                    { x: event.clientX, y: event.clientY });

                const englishName = InteractableObject.find(item => item.id === object.name).englishName;
                this.popupWindow.speak(englishName);

                // this.WordleGame.toggle();

            } else {
                console.log('無可互動物件');

            }
        }
    }



}
export default Controller;