// PopupWindow.js 這個是彈窗功能

class PopupWindow {
    constructor() {
        this.popup = document.createElement('div');
        this.popup.className = 'model_info animate__animated'; // 基礎動畫類
        document.body.appendChild(this.popup);
        //popupWindow先隱藏
        this.popup.style.display = 'none';
        //sound
        this.soundControl();
        this.globalRate = 1; // 默認語速
        this.globalVolume = 1; // 默認音量
    }


    /**
     * 顯示彈窗
     * @param {string} chineseName 中文名稱
     * @param {string} englishName 英文名稱
     * @param {object} position 彈窗位置
     */
    show(chineseName, englishName, position) {
        this.popup.innerHTML = `
            <h1> CARD</h1>
            <p>中文名稱：${chineseName}</p>
            <p>英文名稱：${englishName}</p>
        `; // 這裡使用的是``而不是''，``可以創建多行字串、使用${}直接插入變數或表達式。而''只能創建單行字串且需使用+來串接變數
        // this.popup.style.left = `${position.x}px`;
        // this.popup.style.top = `${position.y}px`;

        // 顯示並加入動畫
        $(this.popup)
            .removeClass('animate__zoomOut') // 確保移除隱藏動畫
            .addClass('animate__zoomIn')    // 添加顯示動畫
        setTimeout(() => {
            this.popup.style.display = 'block';//顯示
        }, 200);

    }

    /**
     * hide() 隱藏彈窗
     *      使用 animate.css 的動畫效果
     *      1. 移除顯示動畫
     *      2. 添加隱藏動畫
     *      3. 等待 200 毫秒後隱藏彈窗
     */
    hide() {

        $(this.popup)
            .removeClass('animate__zoomIn')  // 確保移除顯示動畫
            .addClass('animate__zoomOut')   // 添加隱藏動畫
        setTimeout(() => {
            this.popup.style.display = 'none';//隱藏
        }, 200);
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // 設定語言，根據需要可更改
        utterance.rate = this.globalRate; // 應用全局語速
        utterance.volume = this.globalVolume; // 應用全局音量
        speechSynthesis.speak(utterance);
    }

    /**
     *  soundControl() 調整聲音
     *      調整語速和音量
     *      並將調整的值儲存在全局變數globalRate和globalVolume
     *      供speak()使用
     */
    soundControl() {
        const rateControl = document.getElementById("rate");
        const volumeControl = document.getElementById("volume");
        // 調整語速
        rateControl.addEventListener("input", () => {
            this.globalRate = parseFloat(rateControl.value); // 更新全局語速
            console.log(`語速: ${this.globalRate}`);
        });

        // 調整音量
        volumeControl.addEventListener("input", () => {
            this.globalVolume = parseFloat(volumeControl.value); // 更新全局音量
            console.log(`音量: ${this.globalVolume}`);
        });

    }
}
export default PopupWindow;