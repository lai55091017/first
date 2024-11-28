class WordleGame {
    constructor(guessGrid, keyboard) {
        /*
            建構函式
            初始化遊戲資料，包括單字對應中文意思、主題及其他變數。
         */
        this.wordMeanings = {
            apple: "蘋果",
            banana: "香蕉",
            grape: "葡萄",
            orange: "橘子",
            guava: "芭樂",
            dog: "狗",
            cat: "貓",
            cow: "牛",
            pig: "豬",
            bird: "鳥",
            sheep: "羊",
            chicken: "雞",
            pencil: "鉛筆",
            eraser: "橡皮擦",
            ruler: "尺",
            fork: "叉子",
            spoon: "湯匙",
            america: "美國",
            china: "中國",
            taiwan: "台灣",
            japan: "日本",
            korea: "韓國",
            rice: "飯",
            noodle: "麵",
            soup: "湯",
            meat: "肉",
            bed: "床",
            bread: "麵包",
            bedroom: "臥室",
            kitchen: "廚房",
            livingroom: "客廳",
            bathroom: "浴室",
            balcony: "陽台",
            socket: "插座",
            sofa: "沙發",
            tv: "電視",
            wardrobe: "衣櫃",
            fridge: "冰箱",
            table: "桌子",
            chair: "椅子",
            window: "窗戶",
            blackboard: "黑板",
            door: "門",
            school: "學校",
            classroom: "教室",
            teacher: "老師",
            student: "同學",
            class: "班級",
            homework: "作業",
            wall: "牆壁",
            fan: "電扇",
            chalk: "粉筆",
            clock: "時鐘",
            book: "書",
            pen: "筆",
            notebook: "筆記本",
            computer: "電腦",
            restroom: "洗手間",
            library: "圖書館",
            platform: "司令台",
            playground: "操場",
            backpack: "背包",
            bookcase: "書櫃",
            mirror: "鏡子",
        };
        this.themes = {
            "水果": ["apple", "banana", "grape", "orange", "guava"],
            "動物": ["dog", "cat", "cow", "pig", "bird", "sheep", "chicken"],
            "工具": ["pencil", "eraser", "ruler", "fork", "spoon"],
            "國家": ["america", "china", "taiwan", "japan", "korea"],
            "食物": ["rice", "noodle", "soup", "meat", "bread"],
            "家裡": ["bed", "bedroom", "kitchen", "livingroom", "bathroom", "balcony", "socket", "sofa", "tv", "wardrobe", "fridge"],
            "學校": ["table", "chair", "window", "blackboard", "door", "school", "classroom", "teacher", "student", "class", "homework",
                "wall", "fan", "chalk", "clock", "book", "pen", "notebook", "computer", "restroom", "library", "platform", "playground", "backpack", "bookcase", "mirror"
            ],
        };

        this.maxAttempts = 6; // 最大嘗試次數
        this.currentAttempt = 0; // 當前嘗試次數
        this.currentGuess = ""; // 玩家當前猜測的單字
        this.isKeyboardEnabled = false; // 是否啟用鍵盤輸入

        this.guessGrid = guessGrid; // 猜測格的 DOM 元素
        this.keyboard = keyboard; // 鍵盤的 DOM 元素
        this.boxes = guessGrid.querySelectorAll(".letter-box");
        this.submitGuess = this.submitGuess.bind(this);

        this.initGame(); // 初始化遊戲
        this.bindEvents();
        this.GameUI();
    }

    /*
        根據單字取得其對應的中文意思
        @param {string} word - 英文字母組成的單字
        @returns {string} 對應的中文意思，若無匹配則返回 "未知"
     */
    getChineseMeaning(word) {
        return this.wordMeanings[word.toLowerCase()] || "未知";
    }

    // 隨機選擇一個主題和單字作為答案，並記錄中文意思。
    initGame() {
        const themeNames = Object.keys(this.themes); // 取得主題名稱
        const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)]; // 隨機選擇主題
        this.wordList = this.themes[randomTheme]; // 根據選擇的主題取得單字庫
        this.answer = this.wordList[Math.floor(Math.random() * this.wordList.length)].toUpperCase(); // 隨機選擇答案
        this.chineseAnswer = this.getChineseMeaning(this.answer); // 取得答案的中文意思
        console.log(`主題: ${randomTheme}, 答案: ${this.answer}`); // 測試用：顯示隨機主題和單字
        // 更新標題顯示選定的主題名稱
        document.querySelector("h1").textContent = `本次的主題是 ${randomTheme}`;
    }

    resetGame() {
        // 重置遊戲狀態
        this.currentAttempt = 0;
        this.currentGuess = "";
    
        // 隨機選擇主題和單字庫
        const themeNames = Object.keys(this.themes); // 獲取所有主題名稱
        const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
        this.wordList = this.themes[randomTheme];
        this.answer = this.wordList[Math.floor(Math.random() * this.wordList.length)].toUpperCase();
        this.chineseAnswer = this.getChineseMeaning(this.answer);
    
        // 測試用：顯示隨機主題和答案
        console.log(`主題: ${randomTheme}, 答案: ${this.answer}`);
    
        // 更新標題顯示選定的主題名稱
        document.querySelector("h1").textContent = `本次的主題是：${randomTheme}`;
    
        // 清空猜測格和虛擬鍵盤內容
        this.guessGrid.innerHTML = "";
        this.keyboard.innerHTML = "";
    
        // 重新初始化遊戲界面
        this.GameUI();
    
        // 清除先前的格子內容與樣式
        this.boxes.forEach(box => {
            box.textContent = "";
            box.classList.remove("correct", "present", "absent");
        });
    
        // 重置虛擬鍵盤的顏色與狀態
        const keys = document.querySelectorAll(".key");
        keys.forEach(key => {
            key.classList.remove("correct", "present", "absent");
            key.style.backgroundColor = ""; // 使用預設顏色
            key.style.color = ""; // 使用預設文字顏色
        });
    }

    // 處理鍵盤輸入
    handleKeyPress(letter) {
        if (letter === "BACKSPACE") {
            this.currentGuess = this.currentGuess.slice(0, -1); // 刪除最後一個輸入的字母
        } else if (this.currentGuess.length < this.answer.length) {
            this.currentGuess += letter; // 添加新輸入字母
        }
        this.updateGuessGrid()
    }

    // 創建遊戲UI
    GameUI() {
        // 讓一行的格子數和答案長度相同
        const columns = this.answer.length; // 行=答案長度
        this.guessGrid.style.gridTemplateColumns = `repeat(${columns}, 50px)`;
    
        // 創建格子
        for (let i = 0; i < this.maxAttempts; i++) {
            for (let j = 0; j < this.answer.length; j++) {
                const box = document.createElement("div");
                box.classList.add("letter-box");
                this.guessGrid.appendChild(box);
            }
        }
    
        // 創建虛擬鍵盤
        const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        let count = 0;
    
        keys.forEach(letter => {
            const key = document.createElement("div");
            key.classList.add("key");
            key.textContent = letter;
            key.onclick = () => this.handleKeyPress(letter);
            key.setAttribute("data-key", letter);
            this.keyboard.appendChild(key);
    
            // 虛擬鍵盤每7個字母就換行，7*4 (26個英文字母+退回鍵+提交鍵)
            count++;
            if (count % 7 === 0) {
                this.keyboard.appendChild(document.createElement("br"));
            }
        });
    
        // 加入退回鍵和提交鍵
        const backspaceKey = document.createElement("div");
        backspaceKey.classList.add("key");
        backspaceKey.textContent = "退回";
        backspaceKey.onclick = () => this.handleKeyPress("BACKSPACE");
        this.keyboard.appendChild(backspaceKey);
    
        const submitKey = document.createElement("div");
        submitKey.classList.add("key");
        submitKey.textContent = "提交";
        submitKey.onclick = this.submitGuess; // 直接連接提交函數
        this.keyboard.appendChild(submitKey);
    }

    // 更新當前猜測的單字格顯示
    updateGuessGrid() {
        const offset = this.currentAttempt * this.answer.length;
        this.boxes = this.guessGrid.querySelectorAll(".letter-box");
        // 清空目前顯示的字母格
        for (let i = 0; i < this.answer.length; i++) {
            this.boxes[offset + i].textContent = this.currentGuess[i] || ""; // 如果有字母就顯示，否則清空
        }
    }

    // 送出答案
    submitGuess() {
        if (this.currentGuess.length !== this.answer.length) {
            alert("請輸入一個長度正確的單字");
            return;
        }
    
        const offset = this.currentAttempt * this.answer.length;
        const answerLetters = [...this.answer];
        const guessLetters = [...this.currentGuess];
    
        // 檢查綠色標記（字母正確且位置正確）
        guessLetters.forEach((letter, i) => {
            const box = this.boxes[offset + i];
            if (letter === answerLetters[i]) {
                box.classList.add("correct");
                answerLetters[i] = null; // 移除已標記的字母
                this.updateKeyboardStatus(letter, "correct");
            }
        });
    
        // 檢查黃色標記（字母正確但位置錯誤）
        guessLetters.forEach((letter, i) => {
            const box = this.boxes[offset + i];
            if (!box.classList.contains("correct")) {
                const index = answerLetters.indexOf(letter);
                if (index !== -1) {
                    box.classList.add("present");
                    answerLetters[index] = null;
                    this.updateKeyboardStatus(letter, "present");
                } else {
                    box.classList.add("absent");
                    this.updateKeyboardStatus(letter, "absent");
                }
            }
        });
    
        // 判斷結果
        if (this.currentGuess === this.answer) {
            alert(`恭喜！你猜對了！答案是：${this.answer} (${this.chineseAnswer})`);
            setTimeout(() => this.resetGame(), 1000);
        } else if (++this.currentAttempt >= this.maxAttempts) {
            alert(`遊戲結束！答案是：${this.answer} (${this.chineseAnswer})`);
            setTimeout(() => this.resetGame(), 1000);
        }
    
        this.currentGuess = ""; // 清空當前猜測
    }
    
    updateKeyboardStatus(letter, status) {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        if (!key) return;
    
        const colors = {
            correct: "#6aaa64", // 綠色
            present: "#c9b458", // 黃色
            absent: "#787c7e",  // 灰色
        };
    
        // 只有當狀態比目前高時才更新顏色
        if (
            (status === "correct") ||
            (status === "present" && key.style.backgroundColor !== colors.correct) ||
            (status === "absent" && !["rgb(106, 170, 100)", "rgb(201, 180, 88)"].includes(key.style.backgroundColor))
        ) {
            key.style.backgroundColor = colors[status];
            key.style.color = "#fff";
        }
    }

    // 啟用鍵盤輸入
    enableKeyboard() {
        this.isKeyboardEnabled = true;
    }

    // 禁用鍵盤輸入
    disableKeyboard() {
        this.isKeyboardEnabled = false;
    }


    // 綁定鍵盤事件
    bindEvents() {
        document.addEventListener("keydown", (event) => {
            // 檢查鍵盤是否啟用
            if (!this.isKeyboardEnabled) return;
    
            const key = event.key.toUpperCase();
    
            if (this.currentAttempt >= this.maxAttempts || this.currentGuess === this.answer) {
                return;
            }
    
            switch (key) {
                case "ENTER":
                    this.submitGuess();
                    break;
                case "BACKSPACE":
                    this.handleKeyPress("BACKSPACE");
                    break;
                default:
                    if (/^[A-Z]$/.test(key)) {
                        this.handleKeyPress(key);
                    }
                    break;
            }
        });
    }
    
    
}

export default WordleGame;
