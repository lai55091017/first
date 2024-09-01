import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CharacterManager {

    constructor( scene, camera ) {
        this.scene = scene;
        this.camera = camera;
        this.gltfLoader = new GLTFLoader();
    }

    //載入角色
    async loadCharacter() {

        const meshContainer = new THREE.Group();
        const gltf = await this.__loadGTLFAsync( './player_model/Character.glb' );
        const mesh = gltf.scene;
        meshContainer.add( mesh );
        mesh.rotation.y = THREE.MathUtils.degToRad( 180 );
        meshContainer.getMesh = function() { return this.children[0] }

        await this.__loadAnimations( gltf );
        return meshContainer;

    }

    //隱藏角色
    hiddenMesh( mesh ) {
        mesh.traverse( 
            object => { 
                if( object.isMesh ) { object.visible = false; }
            }
        );
    }

    //綁定動作
    bindAction( controller, mesh ) {
        const actions = ['walk_forward', 'walk_left', 'walk_backward', 'walk_right', 'run', 'idle', 'walk'];
        actions.forEach(action => {
            controller[action] = () => { 
                this.__setCurrentAction(mesh, action); 
            };
        });
    }

    //更新角色動畫
    updateCharactersAnimation( delta, playerList ){
        
        for( const meshContainer of playerList ) {

            const characterData = meshContainer.children[0].userData;
            const { animations, currentActionName, previousActionName, mixer } = characterData;

            // 偵測速度並更新動作
            const speed = this.__getSpeed(meshContainer); 
            this.__detectSpeedAndSetAction(meshContainer.children[0], speed);
            
            if( currentActionName !== previousActionName ) {
                console.log(currentActionName)
                const startAction = animations[previousActionName].action;
                const endAction = animations[currentActionName].action;
                this.__executeCrossFade(startAction, endAction, 0.2);
                characterData.previousActionName = currentActionName;
            }
    
            mixer.update( delta );
    
        }

    }

    //設定角色動作
    __setCurrentAction ( mesh, actionName ) {
        switch( actionName ) {
            case 'run': {
                switch( mesh.userData.currentActionName ) {
                    case 'walk_forward': mesh.userData.currentActionName = 'run_forward'; break;
                    case 'walk_left': mesh.userData.currentActionName = 'run_left'; break;
                    case 'walk_right': mesh.userData.currentActionName = 'run_right'; break;
                }
                break;
            }
            case 'walk': {
                switch( mesh.userData.currentActionName ) {
                    case 'run_forward': mesh.userData.currentActionName = 'walk_forward'; break;
                    case 'run_left': mesh.userData.currentActionName = 'walk_left'; break;
                    case 'run_right': mesh.userData.currentActionName = 'walk_right'; break;
                }
                break;
            }
            default: { mesh.userData.currentActionName = actionName; }
        }
    }

    // 獲取角色的速度
    // 新版，這個是return meshContainer.userData.speed
    __getSpeed(meshContainer) {
        // 假設 meshContainer 有一個 speed 屬性，該屬性會隨時間更新
        return meshContainer.userData.speed || 0; 
    }

    /*
        舊版，這個是return playerController.speed
        __getSpeed(meshContainer) {
        // 假設 meshContainer 有一個 speed 屬性，該屬性會隨時間更新
        return playerController.speed || 0;
    }
    */

    // 偵測角色速度並設定相應的動作
    __detectSpeedAndSetAction(mesh, speed) {
        if (speed === 0) {
            this.__setCurrentAction(mesh, 'idle');
        } else if (speed > 0 && speed <= 100) {
            this.__setCurrentAction(mesh, 'walk');
        } else if (speed > 100 && speed <= 400) {
            this.__setCurrentAction(mesh, 'walk_forward');
        } else if (speed > 400) {
            this.__setCurrentAction(mesh, 'run');
        }
    }

    //執行動畫淡入淡出時間
    __executeCrossFade ( startAction, endAction, duration ) {

        endAction.enabled = true;
        endAction.setEffectiveTimeScale( 1 );
        endAction.setEffectiveWeight( 1 );
        endAction.time = 0;
        if ( startAction ) { startAction.crossFadeTo( endAction, duration, true ); } 
        else { endAction.fadeIn( duration ); }
        
    }

    //載入動畫
    async __loadAnimations( gltf ) {

        if (!gltf || !gltf.scene) {
            throw new Error('Invalid gltf or scene');
        }

        const animationGLBFiles = [ 
            './character_action/default/idle.glb', 
            './character_action/default/run_forward.glb', 
            './character_action/default/run_left.glb', 
            './character_action/default/run_right.glb', 
            './character_action/default/walk_forward.glb',
            './character_action/default/walk_backward.glb',
            './character_action/default/walk_right.glb',
            './character_action/default/walk_left.glb',
            './character_action/default/jump_start.glb',
            './character_action/default/jump_loop.glb',
            './character_action/default/jump_end.glb',
        ];

        const character = gltf.scene;
        const mixer = new THREE.AnimationMixer( character );
        const animations = {};
        character.userData = { 
            mixer, 
            animations: {}, 
            currentActionName: 'idle', 
            previousActionName: 'idle' 
        };
        
        await Promise.all( animationGLBFiles.map( async ( file ) => {
            const loadedGltf = await this.__loadGTLFAsync( file );
            if (!loadedGltf || !loadedGltf.scene || !loadedGltf.animations || loadedGltf.animations.length === 0) {
                throw new Error(`Failed to load animation: ${file}`);
            }
            const clip = loadedGltf.animations[0];
            const action = mixer.clipAction( clip );
            const name = clip.name.slice( 0, -2 );
            const weight = name === 'idle' ? 1 : 0;
            action.enabled = true;
            action.setEffectiveTimeScale( 1 );
            action.setEffectiveWeight( weight );
            action.play();
            animations[name] = { action, name };
            this.scene.add(loadedGltf.scene);
        }));

        character.userData.animations = animations;

        return;
    }

    //載入模型
    async __loadGTLFAsync( url ) { 

        return new Promise( ( resolve, reject ) => { 
    
            this.gltfLoader.load( url, resolve, undefined, reject ); 
    
        }); 
    
    }

}

export default CharacterManager;