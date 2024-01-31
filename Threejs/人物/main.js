import * as THREE from 'three'

import { OrbitControls } from 'OrbitControls'

import { GLTFLoader } from 'GLTFLoader'

let model, scene, renderer, camera, cameraControl

function init(){
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1.0)
    document.body.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add( directionalLight );

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xFFBF00, 1);
    scene.add( hemisphereLight );

    const GLTFloader = new GLTFLoader();
    GLTFloader.load('mesh/doll_03_teacher.gltf', (gltf) => {

        // 创建并放置第一个角色
        const character1 = gltf.scene.clone();
        character1.position.set(0, 0, 0);
        scene.add(character1);

    }, undefined,(err) => console.error(err))

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 7)
    cameraControl = new OrbitControls(camera, renderer.domElement)
}
function render(){
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}
init()
render()