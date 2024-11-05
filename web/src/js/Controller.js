import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class Controller {

    constructor(scene, camera, canvas) {
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
    }

    //設置移動參數
    __setupMovement() {
        this.playerHight = 1.66;
        this.moveDistance = 16.0;
        this.moveFriction = 10;
        this.jumpHight = 20.0;
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
            'KeyW': () => { this.movingForward = true; this.walk_forward(); },
            'KeyA': () => { this.movingLeft = true; this.walk_left(); },
            'KeyS': () => { this.movingBackward = true; this.walk_backward(); },
            'KeyD': () => { this.movingRight = true; this.walk_right(); },
            'Space': () => { this.velocity.y += this.jumpHight; this.canJump = false; },
            'ShiftLeft': () => { this.run(); this.moveDistance = 40; },
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

    //更新角色
    update(delta) {

        const player = this.camera;
        const playerPosition = player.position;
        // 随着时间速度会因摩擦力减小
        this.velocity.x -= this.velocity.x * this.moveFriction * delta;
        this.velocity.z -= this.velocity.z * this.moveFriction * delta;
        this.velocity.y -= 9.8 * this.gravity * delta;
        // 玩家移动方向
        this.direction.z = Number(this.movingForward) - Number(this.movingBackward);
        this.direction.x = Number(this.movingRight) - Number(this.movingLeft);
        this.direction.normalize();
        // 更新玩家的移动速度
        if (this.movingForward || this.movingBackward) this.velocity.z -= this.direction.z * this.moveDistance * delta;
        if (this.movingLeft || this.movingRight) this.velocity.x -= this.direction.x * this.moveDistance * delta;
        // 玩家移动
        this.controls.moveRight(- this.velocity.x * delta);
        this.controls.moveForward(- this.velocity.z * delta);
        playerPosition.y += this.velocity.y * delta;
        // 跳躍
        if (playerPosition.y < this.playerHight) {
            this.velocity.y = 0;
            playerPosition.y = this.playerHight;
            this.canJump = true;
        }

        // 計算速度
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
        this.speed = speed; // 更新速度變數

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
                document.querySelector('.function_key').style.display = powerswitch ? 'block' : 'none'; // 功能按鍵
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

}

export default Controller;