// 導入模組
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 測試

class ICAS {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.fbxLoader = new FBXLoader();
        // 有問題，先使用fbx或glb this.objLoader = new OBJLoader();
        // 有問題，先使用fbx或glb this.mtlLoader = new MTLLoader();
        this.gltfLoader = new GLTFLoader();
        this.jsonLoader = new THREE.ObjectLoader();
    }

    // 新增FBX載入方法
    loadFBX(path) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(path, resolve, undefined, reject);
        });
    }
    
    // 新增OBJ載入方法
    /* 有問題，先使用fbx或glb
    loadOBJ(path, mtlPath) {
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            this.mtlLoader.load(mtlPath, (materials) => {
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(path, resolve, undefined, reject);
            });
        });
    }
    */

    // 新增GLTF載入方法
    loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(path, resolve, undefined, reject);
        });
    }

    // 新增JOSN載入方法
    loadJSON(path) {
        return new Promise((resolve, reject) => {
            this.jsonLoader.load(path, resolve, undefined, reject);
        });
    }
}

export default ICAS;