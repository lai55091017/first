import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class Controller {

    constructor( scene, camera, canvas ){
        this.camera = camera;
        this.canvas = canvas;
        this.scene = scene;
        this.controls = new PointerLockControls( camera, this.canvas );
        this.__setupMovement();
        this.__setupListeners();
        this.__setupActions();
        this.isGameStarted = false;  // 游戏是否开始
        this.chatmode = false;  // 初始化聊天模式為關閉
        camera.position.y = this.playerHight;
        this.scene.add( camera );
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
        this.walk_forward = () => {};
        this.walk_left = () => {};
        this.walk_backward = () => {};
        this.walk_right = () => {};
        this.run = () => {};
        this.idle = () => {};
        this.walk = () => {};
    }

    //處理鍵盤按下事件
    __handleKeyDown( event ) {
        if( !this.canJump || this.chatmode ) return;
        if( ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes( event.code ) ) this.moveDistance = 16;
        const actions = {
            'KeyW':  () => { this.movingForward  = true; this.walk_forward();  },
            'KeyA':  () => { this.movingLeft     = true; this.walk_left();     },
            'KeyS':  () => { this.movingBackward = true; this.walk_backward(); },
            'KeyD':  () => { this.movingRight    = true; this.walk_right();    },
            'Space': () => { this.velocity.y += this.jumpHight; this.canJump = false; },
            'ShiftLeft': () => { this.run(); this.moveDistance = 40; },
        }
        if ( actions[ event.code ] ) actions[ event.code ]();
    };

    //處理鍵盤放開事件
    __handleKeyUp( event ) { 
        if(this.chatmode) return;
        const actions = {
            'KeyW': () => { this.movingForward  = false; this.idle(); },
            'KeyA': () => { this.movingLeft     = false; this.idle(); },
            'KeyD': () => { this.movingRight    = false; this.idle(); },
            'KeyS': () => { this.movingBackward = false; this.idle(); },
            'ShiftLeft': () => { this.walk(); },
        };
        if ( actions[ event.code ] ) actions[ event.code ]();
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
    __getRotationShaveXZ( object ) {
        const quaternion = object.quaternion.clone();
        const euler = new THREE.Euler().setFromQuaternion( quaternion, 'YXZ' );
        return new THREE.Euler(0, euler.y, 0, 'ZXY');
    }

    //更新角色
    update ( delta ) {
        
        const player = this.camera;
        const playerPosition = player.position;
    
        this.velocity.x -= this.velocity.x * this.moveFriction * delta;
        this.velocity.z -= this.velocity.z * this.moveFriction * delta;
        this.velocity.y -= 9.8 * this.gravity * delta;

        this.direction.z = Number( this.movingForward ) - Number( this.movingBackward );
        this.direction.x = Number( this.movingRight ) - Number( this.movingLeft );
        this.direction.normalize();

        if ( this.movingForward || this.movingBackward ) this.velocity.z -= this.direction.z * this.moveDistance * delta;
        if ( this.movingLeft || this.movingRight ) this.velocity.x -= this.direction.x * this.moveDistance * delta;

        this.controls.moveRight( - this.velocity.x * delta );
        this.controls.moveForward( - this.velocity.z * delta );
        playerPosition.y += this.velocity.y * delta;

        if ( playerPosition.y < this.playerHight ) { 
            this.velocity.y = 0; 
            playerPosition.y = this.playerHight; 
            this.canJump = true; 
        }

        const characterData = player.children[0].children[0].userData;
        const { currentActionName, previousActionName } = characterData;
        const rotation = this.__getRotationShaveXZ( player );
        const position = new THREE.Vector3(playerPosition.x, playerPosition.y - this.playerHight, playerPosition.z)
        return { context: 'playerMove', position, rotation, currentActionName, previousActionName };

    }

    //設置畫面鎖定控制
    setupBlocker( blocker ) {
        blocker.addEventListener( 'click', () => { this.controls.lock(); } );
        this.controls.addEventListener( 'lock', () => {  
            this.__toggleGameUI(true);
            this.isGameStarted = true;
            this.chatmode = false; 
            document.addEventListener('keydown', this.__chatroom);
        });
        this.controls.addEventListener( 'unlock', () => {  
             this.__resetState();
             this.__toggleGameUI(false);
             this.isGameStarted = false;
             document.removeEventListener('keydown', this.__chatroom);
             
        });
    }

    //切換遊戲介面
    __toggleGameUI(isGameActive) {
        const blocker = document.getElementById('blocker');             // 黑色遮罩
        const crosshair = document.getElementById('crosshair');         // 十字准心
        const menu = document.getElementById('menu');                   // 菜单
        const messageInput = document.querySelector('#message_input');  // 输入框
        const chatBox = document.querySelector('#chat_box');            // 聊天框
        const chatBox2 = document.querySelector('#chat_box2');          // 备用聊天框

        blocker.style.display = isGameActive ? 'none' : 'block';
        crosshair.style.display = isGameActive ? 'block' : 'none';
        menu.style.display = isGameActive ? 'none' : 'block';
        messageInput.style.display = 'none';
        chatBox.style.display = 'none';
        chatBox2.style.display = isGameActive ? 'block' : 'none';
    }

    __chatroom = (event) => {
        if (event.key === 'Enter') {
            const messageInput = document.querySelector('#message_input');
            if (!this.chatmode) {
                // 進入聊天模式
                this.chatmode = true;
                messageInput.style.display = 'block';
                messageInput.focus();
            } else {
                // 發送消息
                const message = messageInput.value;
                if (message.trim() !== "") {
                    document.querySelector('#send_button').click();
                }
                this.chatmode = false;
                messageInput.style.display = 'none';
            }
        }
    }


}

export default Controller;


