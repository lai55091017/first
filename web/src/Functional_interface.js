// 引入 Firebase 模块
import {
    getDatabase,
    ref,
    set,
    child,
    push,
    update,
    get,
    limitToLast,
    query,
    onValue,        //資料變化時觸發事件(回傳所有資料)
    onChildAdded,   //新增資料時觸發事件(先回傳所有內容再回傳新增的資料)
    onChildChanged,  //更改資料時觸發事件(回傳修改內容)
    onChildRemoved,  //移除資料時觸發事件
    onChildMoved,     //更改資料排序時觸發事件
} from "firebase/database";

import "./scss/Functional_interface.scss";

//引入自訂函式檔案
import Auth from './js/firebase/auth';
import FirebaseDB from './js/firebase/Realtime Database';
import * as gamefunctions from './js/script';

// 初始化 Firebase 应用
const auth = new Auth;
const db = new FirebaseDB;



//----------------------loading動畫--------------
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});

document.addEventListener('DOMContentLoaded', () => {

    //取得用戶名稱
    db.read_username_once().then(username => {
        document.getElementById('username').textContent = `歡迎${username}玩家`;
    })

    // 聊天室
    const messageInput = document.getElementById('message_input');  //聊天室輸入框
    const sendButton = document.getElementById('send_button');      //聊天室按鈕
    //聊天室訊息加入到資料庫
    sendButton.addEventListener('click', () => {

        currentTime().then(formattedDateTime => {

            const messageText = messageInput.value;
            db.read_username_once()
                .then(username => {
                    if (messageText.trim() !== '') {

                        const messagedata = {
                            text: messageText,
                            username: username,
                            timestamp: formattedDateTime,   //时间戳
                        }
                        // 将消息寫入数据库
                        db.write_data("messages", messagedata)

                        // 清空输入框
                        messageInput.value = '';
                    }
                })

        })
        .catch((error) => {
            console.error(error);
        })

        .catch(error => {
            console.error('取得用戶姓名失敗', error);
        });


    });

    // 聊天室資料庫並輸出到畫面
    const chatBox = document.getElementById('chat_box');
    db.GetRef('messages')
    .then(messagesref => {
        onValue(messagesref, (snapshot) => {
            db.read_username_once()
                .then(username => {
                    // 獲取訊息資料
                    const message_val = snapshot.val();

                    const message_element = document.createElement('div');
                    const message_date_element = document.createElement('div');

                    message_element.id = 'message';
                    message_date_element.id = 'message_date';

                    if (message_val.username === username) {
                        message_element.id = 'personal_message';
                        message_date_element.id = 'personal_message_date';
                    }

                    message_element.textContent = `${message_val.username}:${message_val.text} `;
                    message_date_element.textContent = ` 時間:${message_val.timestamp}`;

                    chatBox.appendChild(message_element);
                    chatBox.appendChild(message_date_element);

                    // 将聊天室滚动条移动到底部函数
                    const messageContainer = document.querySelector('.message_container');
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                })
                .catch(error => {
                    console.error('取得用戶姓名失敗', error);
                });

        });
    })
    .catch((error) => {
        console.error(error);
    });

    
    //刪除帳號
    document.getElementById('delete').addEventListener('click', async () => {
        auth.delete_account();
    })

    //登出帳號
    document.getElementById('logout').addEventListener('click', async () => {
        auth.Sign_out()
    })

    //遊戲內容載入
    gamefunctions.init()
})

//當前時間
function currentTime() {
    return new Promise((resolve, reject) => {
        // 获取当前时间
        const currentTime = new Date();
        // 获取年月日时分秒
        const year = currentTime.getFullYear();
        const month = currentTime.getMonth() + 1; // 月份从 0 开始，需要加 1
        const date = currentTime.getDate();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        // 格式化日期时间
        const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        resolve(formattedDateTime)
        reject('日期格式化失敗')
    })


}






