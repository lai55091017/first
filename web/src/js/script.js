import * as THREE from 'three';
import Controller from './Controller.js';
import Connect from './Connect.js';
import CharacterManager from './CharacterManager.js';
import ICAS from './ImportCharacterAndScene.js'; 

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

function init_scene() {
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 5, 50);
}
function init_camera() {
    camera.fov = 75;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.near = 0.1;
    camera.far = 100;
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
        { type: 'glb', path: './mesh/glb/lilbrary.glb' },
        { type: 'fbx', path: './mesh/fbx/lilbray.fbx' },
        { type: 'obj', path: './mesh/obj/lilbray2.obj' },
        { type: 'json', path: './mesh/json/Test_Library.json' }
    ];

    for (const model of models) {
        let loadedModel;
        try {
            switch (model.type) {
                case 'glb':
                    loadedModel = await icas.loadGLTF(model.path);
                    scene.add(loadedModel.scene);
                    break;
                case 'fbx':
                    loadedModel = await icas.loadFBX(model.path);
                    scene.add(loadedModel);
                    break;
                case 'obj':
                    loadedModel = await icas.loadOBJ(model.path, model.mtlPath);
                    scene.add(loadedModel);
                    break;
                case 'json':
                    loadedModel = await icas.loadJSON(model.path);
                    scene.add(loadedModel);
                    break;
                default:
                    console.error('Unknown model type:', model.type);
            }
        } catch (error) {
            console.error('Error loading model:', model.path, error);
        }
    }
}

export function init() {
    init_scene();
    init_camera();
    init_renderer();
    init_other();
    connect.onJoin = onPlayerJoin;
    connect.onLeave = onPlayerLeave;
    connect.onMove = onPlayerMove;
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
            // document.getElementById('instructions').remove();

        } else {
            scene.add(character);
        }

    }
}
function onPlayerLeave(data) {

    const uuid = data.disconnectedUUID;
    const index = connect.playerList.findIndex(player => player.uuid === uuid);

    const isFoundResult = index !== -1;
    if (isFoundResult) {
        scene.remove(connect.playerList[index]);
        connect.playerList.splice(index, 1);
    }
}
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