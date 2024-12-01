import "./scss/information.scss";
import "./scss/menu.scss";
import * as menu from './js/menu.js';
import Firestore from "./js/firebase/Firestore.js";
// import "./js/firebase/Search";

let hasUnsavedChanges = false; // 標記是否有未保存的變動
const fs = new Firestore;
//----------------------loading動畫--------------
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});
;

/*------------------------------------新增卡片功能-----------------------------------------*/
document.getElementById('card_form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表單的默認提交行為

    // 獲取輸入的英文和中文
    const englishText = document.getElementById('english_text').value;
    const chineseText = document.getElementById('chinese_text').value;

    newCard(englishText, chineseText)

    // 清空表單
    document.getElementById('card_form').reset();

    // 將卡片寫入資料庫
    fs.add_user_card({
        "card": [{ words: englishText, translate: chineseText }]
    })

});


let card_number = 0;
function newCard(englishText, chineseText) {
    card_number += 1;
    const newCard = document.createElement('div');
    newCard.className = 'contantbox';

    // 將新卡片添加到容器
    document.querySelector('.contair').appendChild(newCard);


    // 設置卡片內容
    newCard.innerHTML = `
        <div id="card${card_number}">
            <h1 id="word${card_number}">${englishText}</h1>
            <p id="chinese${card_number}">${chineseText}</p>
            
            <button class="edit_btn">
            <svg class="feather feather-edit" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg></button>
            <button class="delete_btn">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"></path>
            </svg>
            </button>
     </div>
        <div id="edit_form">
            <label for="english_text">英文</label>
            <input type="text" id="edit_english_text${card_number}" value="${englishText}" placeholder="輸入英文" pattern="[a-zA-Z\s]+" title="只能輸入英文字母" required><br>
            <label for="chinese_text">中文</label>
            <input type="text"  id="edit_chinese_text${card_number}" value="${chineseText}" required><br>
            <button id="save_btn">保存</button>
        </div>

        <dialog id="dialog_box${card_number}">
            <h1 id="dialog_word${card_number}">${englishText}</h1>
            <p id="dialog_chinese${card_number}">${chineseText}</p>
            <button id="close">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 30 30">
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
            </svg>
            </button>
            <button class="speak_btn" data-text="${englishText}">說英文</button>
        </dialog>
        
    `;

    const speakButtons = newCard.querySelectorAll('.speak_btn');

    // 語音按鈕事件
    speakButtons.forEach(button => {
        button.addEventListener('click', function () {
            const textToSpeak = this.getAttribute('data-text');
            speak(textToSpeak);
        });
    });

    // 語音合成函數
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // 設定語言，根據需要可更改
        speechSynthesis.speak(utterance);
    }


    const dialog = document.querySelector(`#dialog_box${card_number}`);
    // 將點擊的卡片內容顯示在 dialog 中

    // 隱藏edit_form
    newCard.querySelector('#edit_form').style.display = 'none';

    const cardbody = newCard.querySelector(`#card${card_number}`);
    const editBtn = newCard.querySelector('.edit_btn');
    const deleteButton = newCard.querySelector('.delete_btn');
    const closeBtn = newCard.querySelector(`#close`)

    // 編輯按鈕
    editBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // 避免dialog跳出
        // 隱藏卡片
        cardbody.style.display = 'none';
        // 顯示編輯表單
        newCard.querySelector('#edit_form').style.display = 'block';
    });

    save_btn(card_number)


    function save_btn(card_number) {
        // 保存按鈕
        newCard.querySelector('#save_btn').addEventListener('click', function (event) {
            event.stopPropagation(); // 避免dialog跳出

            const newEnglishText = document.querySelector(`#edit_english_text${card_number}`).value;
            const newChineseText = document.querySelector(`#edit_chinese_text${card_number}`).value;

            // 正確選取字詞元素並更新內容
            document.getElementById(`word${card_number}`).textContent = newEnglishText;
            document.getElementById(`chinese${card_number}`).textContent = newChineseText;
            document.getElementById(`dialog_word${card_number}`).textContent = newEnglishText;
            document.getElementById(`dialog_chinese${card_number}`).textContent = newChineseText;

            //顯示卡片
            cardbody.style.display = 'block';
            fs.delete_user_card({
                "card": [{ words: englishText, translate: chineseText }]
            })
            fs.update_user_card({
                "card": [{ words: newEnglishText, translate: newChineseText }]
            })
            // 隱藏編輯表單
            newCard.querySelector('#edit_form').style.display = 'none';
        });



        if (cardbody.style.display !== 'none') {
            cardbody.addEventListener('click', function () {

                dialog.showModal();
            });
            // 綁定關閉 dialog 的按鈕事件
            closeBtn.addEventListener('click', function () {
                dialog.close();
            });
        }
    }
    // 刪除按鈕
    deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();  // 阻止事件冒泡，避免觸發 dialog 顯示
        newCard.remove();  // 删除卡片
        hasUnsavedChanges = true;
        // 刪除卡片資料
        fs.delete_user_card({
            "card": [{ words: englishText, translate: chineseText }]
        })
    });


}



// /*------------------------------------音訊卡片功能-----------------------------------------*/
// function toggleAudio(audioId, buttonId) {
//     let audioElement = document.getElementById(audioId);
//     let buttonElement = document.getElementById(buttonId).getElementsByTagName('img')[0];

//     if (audioElement.paused) {
//         audioElement.play();
//         buttonElement.src = "/img/pause.png";  // 修改為暫停圖標
//         buttonElement.alt = "Pause";
//     } else {
//         audioElement.pause();
//         buttonElement.src = "/img/play.png";  // 修改為播放圖標
//         buttonElement.alt = "Play";
//     }
// }

// 音樂播放控制
// document.querySelectorAll('button').forEach(button => {
//     button.addEventListener('click', function () {
//         let audioId = this.previousElementSibling.id;
//         let buttonId = this.id;
//         toggleAudio(audioId, buttonId);
//     });
// });


//---------------------玩家資料顯示區----------------------


document.addEventListener('DOMContentLoaded', () => {
    fs.get_user_data().then(data => {
        document.getElementById('username').textContent = `歡迎${data.username}玩家`;
    })

    // 讀取菜單
    fetch('menu.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('menu_container').innerHTML = data;
            menu.menu();
        })
        .catch(error => console.error('Error loading menu:', error));

})


// 顯示資料庫中的卡片
fs.get_user_data().then(data => {
    for (let i = 0; i < data.card.length; i++) {
        newCard(data.card[i].words, data.card[i].translate)
    }
})

//---------------儲存按鈕-----------------------------
document.addEventListener("DOMContentLoaded", function () {
    // 綁定「儲存」按鈕事件
    document.getElementById("save_button").addEventListener("click", function () {
        // 模擬保存邏輯，例如更新資料庫
        console.log("變動已保存到資料庫");
        fs.commit_data();

        // 將狀態設為已保存
        hasUnsavedChanges = false;
    });

    // 模擬單字卡或資料庫變動
    function simulateChange() {
        hasUnsavedChanges = true;
        console.log("偵測到變動，需要保存");
    }

    // 示例：監控輸入框的變動
    document.getElementById("english_text").addEventListener("change", simulateChange);
    document.querySelector(".contair").addEventListener("change", simulateChange);

    
    
    // 示例：模擬單字卡操作時的變動
    // document.querySelector(".save_btn").addEventListener("click", simulateChange);

    // 在用戶嘗試離開頁面時提示
    window.addEventListener("beforeunload", function (event) {
        if (hasUnsavedChanges) {
            // 提示用戶
            event.preventDefault();
            event.returnValue = "您有未保存的變動，確定要離開嗎？"; // 部分瀏覽器需要設置 returnValue
        }
    });
});
// /*------------------------------------搜尋功能-----------------------------------------*/
// JavaScript 部分
document.addEventListener("DOMContentLoaded", () => {
    const sortOptions = document.getElementById('sortOptions');

    const searchBar = document.getElementById('searchBar');
    const container = document.querySelector('.contair');

    // 共用函數：根據排序選項進行排序
    function sortCards(cards, sortOption) {
        if (sortOption === "a_z") {
            return cards.sort((a, b) => a.words.localeCompare(b.words)); // 按字母排序
        }
        return cards; // 原有排序
    }
    // ------------------共用函數：搜尋功能--------------------------
    function performSearch() {
        const query = searchBar.value.trim().toLowerCase(); // 獲取搜尋內容並轉小寫

        fs.get_user_data()
            .then(data => {
                // 過濾卡片
                const filteredCards = data.card.filter(card =>
                    card.words.toLowerCase().includes(query)
                );

                // 取得目前的排序選項
                const sortOption = sortOptions.value;

                // 根據選項排序並渲染卡片
                const sortedCards = sortCards(filteredCards, sortOption);
                renderCards(sortedCards);
            })
            .catch(error => console.error("搜尋錯誤:", error));

    }


    // 共用函數：渲染卡片
    function renderCards(cards) {
        container.innerHTML = ""; // 清空卡片容器
        cards.forEach(card => newCard(card.words, card.translate)); // 渲染卡片
    }
    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });


    // 排序選項變更事件
    sortOptions.addEventListener('change', () => {
        console.log("排序選項被更改");
        fs.get_user_data()
            .then(data => {
                // 搜尋框是否有內容
                const query = searchBar.value.trim().toLowerCase();

                // 過濾（如果有搜尋內容）
                let cards = data.card;
                if (query) {
                    cards = cards.filter(card =>
                        card.words.toLowerCase().includes(query)
                    );
                }

                // 根據選項排序並渲染卡片
                const sortOption = sortOptions.value;
                const sortedCards = sortCards(cards, sortOption);
                renderCards(sortedCards);
            })
            .catch(error => console.error("排序錯誤:", error));
    });
});

