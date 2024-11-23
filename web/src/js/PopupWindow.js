// PopupWindow.js 這個是彈窗功能

import * as THREE from 'three';

class PopupWindow {
    constructor() {
        this.popup = document.createElement('div');
        this.popup.className = 'model_info';
        // this.popup.style.position = 'absolute'; // 設定彈窗為絕對位置(absolute)，如果有問題再試試看fixed
        // this.popup.style.background = 'rgba(0, 0, 0, 0.8)'; // 背景為透明度80%的黑底
        // this.popup.style.color = 'white'; // 顏色為白色
        // this.popup.style.padding = '10px'; // 內留白為10px
        // this.popup.style.borderRadius = '5px'; // 圓角5px，不是必需的，只是為了讓它看起來沒那麼尖銳
        this.popup.style.display = 'none'; // 初始為隱藏(因為是互動後才彈出所以要先隱藏)
        document.body.appendChild(this.popup);
    }

    show(chineseName, englishName, position) {
        this.popup.innerHTML = `
            <h1> CARD</h1>
            <p>中文名稱：${chineseName}</p>
            <p>英文名稱：${englishName}</p>
        `; // 這裡使用的是``而不是''，``可以創建多行字串、使用${}直接插入變數或表達式。而''只能創建單行字串且需使用+來串接變數
        // this.popup.style.left = `${position.x}px`;
        // this.popup.style.top = `${position.y}px`;
        this.popup.style.display = 'block'; // 顯示彈窗
    }

    hide() {
        this.popup.style.display = 'none'; // 隱藏彈窗
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // 設定語言，根據需要可更改
        speechSynthesis.speak(utterance);
    }


}

export default PopupWindow;