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
        this.objLoader = new OBJLoader();
        this.mtlLoader = new MTLLoader();
        this.gltfLoader = new GLTFLoader();
    }

    // 新增FBX載入方法
    loadFBX(path) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(path, resolve, undefined, reject);
        });
    }
    
    // 新增OBJ載入方法
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

    // 新增GLTF載入方法
    loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(path, resolve, undefined, reject);
        });
    }
}

export default ICAS;