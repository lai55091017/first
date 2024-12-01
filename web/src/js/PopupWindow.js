// PopupWindow.js 這個是彈窗功能

class PopupWindow {
    constructor() {
        this.popup = document.createElement('div');
        this.popup.className = 'model_info animate__animated'; // 基礎動畫類
        document.body.appendChild(this.popup);
        //popupWindow先隱藏
        this.popup.style.display = 'none';
    }


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
        speechSynthesis.speak(utterance);
    }


}

export default PopupWindow;