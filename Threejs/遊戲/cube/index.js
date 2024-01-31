import * as THREE from 'three'
import { OrbitControls } from 'Addons'
import { RGBELoader } from 'Addons';

let scene, renderer, camera, cameraControl

function init_scene(){ // 場景
    scene = new THREE.Scene();
}
function init_camera(){ // 鏡頭
    let fov = 45 // 鏡頭角度
    let aspect = window.innerWidth / window.innerHeight // 畫面的寬高比例
    let near = 0.01 // 近面距離
    let far = 1000 // 遠面距離(最遠可以看到哪裡)

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(50, 30, 50)
    camera.lookAt(scene.position);
}
function init_renderer(){ // 渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const rgbeLoader = new RGBELoader();
    rgbeLoader.setPath('./').load("drackenstein_quarry_puresky_4k.hdr", function ( hdrEquirect ) {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping // 使用半球狀的映射方式
        scene.environment = hdrEquirect // 設定場景的光照環境 ( 沒設定的話就不會有光照效果 )
        scene.background = hdrEquirect // 設定場景的背景圖 ( 沒設定的話只是看不到圖而已 )
    });
}
function init_cameraControl(){ //鏡頭控制器
    cameraControl = new OrbitControls(camera, renderer.domElement)
    cameraControl.enablePan = true; // 平移
    cameraControl.enableZoom = true; // 縮放
    cameraControl.enableDamping = true; // 阻尼效果
    cameraControl.dampingFactor = 0.06; // 阻尼系數
    cameraControl.autoRotate = false;   // 自動旋轉 
    cameraControl.maxPolarAngle = Math.PI * 0.45; // 限制上下的旋轉範圍
}
function init_floor(){ // 地板
    const geoFloor = new THREE.BoxGeometry( 500, 0.1, 500 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x777777, roughness: 0.5, metalness: 0.5 } )
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor )
    mshStdFloor.receiveShadow = true
    scene.add( mshStdFloor )
}
function init_model(){ // 模型
    const cube_Geometry = new THREE.BoxGeometry( 30, 10, 30 );
    const cube_Material = new THREE.MeshStandardMaterial( { color: 0x000000, roughness: 0, metalness: 1 } )
    const cube = new THREE.Mesh( cube_Geometry, cube_Material )
    cube.position.set(0, 5, 0);
    scene.add( cube )
}
function render(){ // 渲染
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    cameraControl.update()
}
function init(){ // 初始化
    init_scene()
    init_renderer()
    init_camera()
    init_cameraControl()
    init_floor()
    init_model()
    window.addEventListener( 'resize', onWindowResize );
    render()
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init()