
// 導入 Three.js 的核心程式
import * as THREE from 'three';

// 導入 Three.js 的 PointerLockControls 模組，作為遊戲中的玩家控制器
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 用來渲染3D畫面的畫布
const canvas = document.querySelector('#canvas');

// 場景基本元件們
let camera, scene, renderer, playerController, role;

//滑鼠
const pointer = new THREE.Vector2();

/* -------------------- 玩家屬性設定 ---------------------- */
// 玩家身高
const playerHight = 10;

// 玩家移動速度
const playerMoveSpeed = 400.0;

// 玩家移動時的摩擦力 (越小則腳底越滑)
const playerMoveFriction = 10.0;

// 玩家跳躍高度
const playerJumpHight = 250.0;

// 玩家重量 (墜落速度)
const playerWeight = 70.0;
/* -------------------------------------------------------- */

// 只要是放在這個陣列裡面的模型，玩家踩到時就可以站在上面
const all_Cube = [];

// 交集點
let INTERSECTED;

// 射線，用途: 不停向下發射射線來檢查腳下是否有方塊
let raycaster;

// 是否正在向前走
let moveForward = false;

// 是否正在向後走
let moveBackward = false;

// 是否正在向左走
let moveLeft = false;

// 是否正在右走
let moveRight = false;

// 是否能跳躍
let canJump = false;

// 上一次畫面更時的時間，用來計算每幀間隔差了多少時間
let prevTime = performance.now();

// 移動速度
const velocity = new THREE.Vector3();

// 移動方向
const direction = new THREE.Vector3();

 //聊天室是否打開
let isChatRoomOpen = false;

// 初始化場景
function initScene() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
}

// 初始化鏡頭
function initCamera() {
	camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 1, 1000 );
	camera.position.y = playerHight;
}

// 初始化渲染器
function initRenderer() {
	renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } ); // antialias 開啟抗鋸齒效果
	renderer.setPixelRatio( window.devicePixelRatio ); // 將設備的像素比設置給渲染器，這樣就能使用最適合這個設備的像素比來渲染
	renderer.setSize( canvas.clientWidth, canvas.clientHeight );
}

// 初始化玩家控制器
function initPlayerController() {
	playerController = new PointerLockControls( camera, canvas );
	// 获取玩家控制器对象
	let playerObject = playerController.getObject();
	scene.add( playerObject );
}

//玩家模型
function player_mesh(){
	const GLTFloader = new GLTFLoader();
    GLTFloader.load('mesh/Xbot.glb', (gltf) => {

        // 创建并放置第一个角色
        role = gltf.scene;
		role.scale.set(2, 2, 2);
        scene.add(role);

    }, undefined,(err) => console.error(err))
}


// 設定暫停遊戲時的半透明黑色遮罩
function setUpBlocker() {

    const blocker = document.getElementById( 'blocker' ); 			//黑色遮罩
	const crosshair = document.getElementById('crosshair');			//十字架准心
	const menu = document.getElementById('menu');	
	const messageInput = document.querySelector('#message_input');	//輸入框

    blocker.addEventListener( 'click',  () =>  { 
		playerController.lock(); 
	});

	let isGamesStart = false; //遊戲是否開始

    // 鎖定後隱藏鼠標，即遊戲開始
    playerController.addEventListener( 'lock', () => {
        blocker.style.display = 'none';			//關閉黑色遮罩
		crosshair.style.display = 'block'; 		//顯示準心
		canvas.style.display = 'block'; 		//開啟相機
		menu.style.display = 'none';			//隱藏菜單
		messageInput.style.display = 'none';	//隱藏輸入框
		chat_box.style.display = 'none';
		chat_box2.style.display = 'block';
        isGamesStart = true 					//遊戲開始

    });

    // 解鎖後顯示鼠標，即遊戲暫停
    playerController.addEventListener( 'unlock', () => {
		if( !isChatRoomOpen ) {
			blocker.style.display = 'block';		//開啟黑色遮罩
			crosshair.style.display = 'none'; 		//隱藏準心
			menu.style.display = 'block';			//顯示菜單
			isGamesStart = false 					//遊戲暫停
		}
    });

    //監聽玩家是否按下開起聊天室的按鍵(暫定為Enter鍵) 
    addEventListener('keydown',(event) => {
		if (event.code == 'Enter' || event.code == 'NumpadEnter') {
			
			if (!isChatRoomOpen & isGamesStart) {
				messageInput.style.display = 'block';
				chat_box.style.display = 'block';
				chat_box2.style.display = 'none';
				document.querySelector('#message_input').focus();
				isChatRoomOpen = true;
				playerController.unlock();

			} else {
				event.preventDefault(); // 阻止默认行为（比如换行）
				if (messageInput.value.trim() !== '') {					// 如果输入框中有内容	
					document.querySelector('#send_button').click(); 	// 发送按钮
				}
				document.querySelector('#message_input').blur(); 		// 失去消息输入框的焦点
				isChatRoomOpen = false;
				if(isGamesStart){										//如果遊戲開始就鎖定玩家控制器
					playerController.lock();
				}
			}
		}
		// 将聊天室滚动条移动到底部函数
		scrollToBottom()
	});
}

// 将聊天室滚动条移动到底部函数
function scrollToBottom() {
	const messageContainer = document.querySelector('.message_container');
	messageContainer.scrollTop = messageContainer.scrollHeight;
}

// 設定玩家移動
function setUpMovement() {

	// 按下 WASD 做移動
	function onKeyDown( event ) { 
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;

			case 'Space':
				if ( canJump === true ) velocity.y += playerJumpHight;
				canJump = false;
				break;
		}
	};

	// 放開 WASD 停止移動
	function onKeyUp( event ) { 
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );
}

//射線投射器
function initRaycaster() {
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
}

function initFloor() {

	const color = new THREE.Color();

	// 地板
	let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	floorGeometry.rotateX( -Math.PI / 2 ); // 讓地板平放 (原本是垂直擺放)

	// vertex displacement
	const vertex = new THREE.Vector3();
	let position = floorGeometry.attributes.position;

	for ( let i = 0, l = position.count; i < l; i ++ ) {
		vertex.fromBufferAttribute( position, i );
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
		position.setXYZ( i, vertex.x, vertex.y, vertex.z );

	}
	floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
	position = floorGeometry.attributes.position; // 讀取幾何形的頂點位置
	const colorsFloor = [];

	for ( let i = 0, l = position.count; i < l; i ++ ) { 
		// 隨機設置顏色
		color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		// 把設定好的隨機顏色存到陣列
		colorsFloor.push( color.r, color.g, color.b );
	}

	// 把設定好的隨機顏色陣列 設定 到地板幾何形 的顏色中
	floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );
	const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } ); // 使用頂點顏色來渲染立方體
	const floor = new THREE.Mesh( floorGeometry, floorMaterial );
	scene.add( floor );
}

function initCube() {

	const color = new THREE.Color();

	// toNonIndexed 會將 BoxGeometry 轉換成 BufferGeometry 包含轉換後的頂點數組
	const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();
	const position_ = boxGeometry.attributes.position; // 讀取幾何形的頂點位置
	const colorsBox = [];

	for ( let i = 0, l = position_.count; i < l; i ++ ) {
		color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		colorsBox.push( color.r, color.g, color.b );
	}
	boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

	for ( let i = 0; i < 500; i ++ ) {

		const boxMaterial = new THREE.MeshPhongMaterial( { 
			specular: 0xffffff, // 方塊反光要呈現的顏色
			flatShading: true, // 是否使用平面著色 (所有三角形都會被渲染為平面，不考慮光照或反射等因素)
			vertexColors: true // 是否使用頂點顏色來渲染材質
		});
		boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 ); // 設置隨機顏色
		const box = new THREE.Mesh( boxGeometry, boxMaterial );

		// 隨機設定方塊的分佈位置
		box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

		scene.add( box );
		all_Cube.push( box ); // 把放進場景的方塊全都放進 all_Cube 陣列中
	}
}
//光
function initLight() {
	scene.add( new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 ) );
}

function isPlayerOnGround( PlayerPosition ) {

	// 以玩家的位置偉起點
	raycaster.ray.origin.copy( PlayerPosition );

	// 向下10個單位發射一條射線
	raycaster.ray.origin.y -= 10;

	// 取得射線擊中的目標中，是 all_Cube 陣列裡面的所有目標
	const intersections = raycaster.intersectObjects( all_Cube, false );

	// 如果大於0，就表示腳下有方塊
	const isPlayerOnGround = intersections.length > 0;

	// 回傳腳下是否有方塊的結果
	return isPlayerOnGround;
}

// 抓取鼠標位置
function onPointerMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function resize() {
	camera.aspect = canvas.clientWidth / canvas.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( canvas.clientWidth, canvas.clientHeight );
}



function animate() {
    requestAnimationFrame(animate);

	const a = playerController.getObject().position
	const b = playerController.getObject().rotation
	if(role){
		role.position.set(a.x, a.y - 3, a.z - 2)
		role.rotation.y = b.y + Math.PI
	}



    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    prevTime = time;

    if (playerController.isLocked && !isChatRoomOpen) {
        const PlayerPosition = playerController.getObject().position;
        const isPlayerStandOnCube = isPlayerOnGround(PlayerPosition);

        velocity.x -= velocity.x * playerMoveFriction * delta;
        velocity.z -= velocity.z * playerMoveFriction * delta;
        velocity.y -= 9.8 * playerWeight * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * playerMoveSpeed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * playerMoveSpeed * delta;

        if (isPlayerStandOnCube) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        playerController.moveRight(-velocity.x * delta);
        playerController.moveForward(-velocity.z * delta);

        PlayerPosition.y += (velocity.y * delta);

        if (PlayerPosition.y < playerHight) {
            velocity.y = 0;
            PlayerPosition.y = playerHight;
            canJump = true;
        }
    }

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, false);

    // if (intersects.length > 0) {
    //     if (INTERSECTED != intersects[0].object) {
    //         if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

    //         INTERSECTED = intersects[0].object;
    //         INTERSECTED.material.emissive.setHex(0xff0000);
    //     }
    // } else {
    //     INTERSECTED = null;
    // }

    renderer.render(scene, camera);
}


export function init() {
	initScene();
	initCamera();
	initRenderer();
	initPlayerController();
	player_mesh()
	setUpBlocker();
	setUpMovement();
	initRaycaster();
	initFloor();
	initCube();
	initLight();
	window.addEventListener( 'resize', resize );
	window.addEventListener( 'fullscreenchange', resize )
	// 當鼠標移動會觸發事件
	document.addEventListener( 'mousemove', onPointerMove );
	animate();
	
}

