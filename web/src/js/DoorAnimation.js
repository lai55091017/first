import * as THREE from 'three';

class DoorAnimation {

    constructor(libDoorL, libDoorR) {
        this.libDoorR = libDoorL;
        this.libDoorL = libDoorR;
        this.duration = 1000; // 1000為動畫時間也就是1秒，1500就是1.5秒
    }

    // 開門
    openDoors() {
        this.animateDoors(-Math.PI / 2, Math.PI / 2);
    }

    // 關門
    closeDoors() {
        this.animateDoors(0, 0);
    }

    // 選轉
    animateDoors(targetRotationL, targetRotationR) {
        const initialRotationL = this.libDoorL.rotation.y;
        const initialRotationR = this.libDoorR.rotation.y;

        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const t = Math.min(elapsedTime / this.duration, 1);  // 計算動畫進度(0到1)

            // 計算每幀的角度
            this.doorL.rotation.y = THREE.MathUtils.lerp(initialRotationL, targetRotationL, t);
            this.doorR.rotation.y = THREE.MathUtils.lerp(initialRotationR, targetRotationR, t);

            if (t < 1) {
                requestAnimationFrame(animate);  // 沒達到目標就進行下一幀
            }
        };

        requestAnimationFrame(animate);  // 開始動畫
    }
}

export default DoorAnimation;