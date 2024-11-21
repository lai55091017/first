// ImportCharacterAndScene.js 主要用來導入角色和場景

// 導入模組
import { reject } from 'lodash';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 測試

class ICAS {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.fbxLoader = new FBXLoader();
        this.gltfLoader = new GLTFLoader();
        this.jsonLoader = new THREE.ObjectLoader();
    }
    
    // 新增FBX載入方法
    loadFBX(path) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(path, resolve, undefined, reject);
        });
    }

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