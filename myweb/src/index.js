// 引入 Firebase 模块
import * as firebase from 'firebase/app';
import { 
    getAuth,
    onAuthStateChanged
} from 'firebase/auth';
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
// 導入uuid
const uuidv4 = require('uuid').v4;


//引入函式檔案
import * as authfunctions from './auth';
import * as Datafunctions from './Realtime Database';
import * as gamefunctions from './game';

const firebaseConfig = {
    apiKey: "AIzaSyC5Eq5Nq3eAqp4E8L7VdGjj5J5PXl8rDbU",
    authDomain: "myfirebase-428e3.firebaseapp.com",
    projectId: "myfirebase-428e3",
    storageBucket: "myfirebase-428e3.appspot.com",
    messagingSenderId: "82010977170",
    appId: "1:82010977170:web:a78e91ea074e6b1319074b",
    measurementId: "G-SGMLFBMS0Q",
    databaseURL: "https://myfirebase-428e3-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  
// 初始化 Firebase 应用
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


const username_element = document.getElementById('username');
Datafunctions.read_username_once().then(username => {
    username_element.textContent = `歡迎${username}玩家請點擊開始遊戲`;
})
//遊戲內容載入
const canvas = document.getElementById('canvas');
if(canvas){
    gamefunctions.init()
}

//監聽資料
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('用戶已登入：', user.uid);
        // Datafunctions.read()
    }else {
      console.log('用戶未登入');
    }
});

// 聊天室
const messageInput = document.getElementById('message_input');  //聊天室輸入框
const sendButton = document.getElementById('send_button');      //聊天室按鈕

//聊天室訊息加入到資料庫
if(messageInput && sendButton){
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value;

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


        Datafunctions.read_username_once()
        .then(username => {
            if (messageText.trim() !== '') {

                const messagedata = {
                    text: messageText,
                    username: username,
                    timestamp: formattedDateTime,   //时间戳
                }
                // 将消息寫入数据库
                Datafunctions.WriteMessageData(messagedata)

                // 清空输入框
                messageInput.value = '';
            }
        })
        .catch(error => {
            console.error('取得用戶姓名失敗', error);
        });


    });
}

// 聊天室資料庫並輸出到畫面
const chatBox = document.getElementById('chat_box');
const chatBox2 = document.getElementById('chat_box2');
let first_message = false;
if(chatBox){
    Datafunctions.GetRef('message')
    .then(messagesref =>{
        onValue(messagesref, (snapshot) => {
            //第一個訊息不顯示
            if(!first_message){
                first_message = true;
                return
            }
            Datafunctions.read_username_once()
            .then(username => {
                // 獲取訊息資料
                const message_val = snapshot.val();

                //舊訊息
                const message_element = document.createElement('div');
                const message_date_element = document.createElement('div');

                message_element.id = 'message';
                message_date_element.id = 'message_date';

                if (message_val.username === username) {
                    message_element.id = 'personal_message';
                    message_date_element.id = 'personal_message_date';
                }
                
                message_element.textContent = `${message_val.username}:${message_val.text} `;
                message_date_element.textContent =` 時間:${message_val.timestamp}`;

                chatBox.appendChild(message_element);
                chatBox.appendChild(message_date_element);

                //新訊息
                const new_message_element = document.createElement('div');
                const new_message_date_element = document.createElement('div');
    
                new_message_element.id = 'message';
                new_message_date_element.id = 'message_date';

                if (message_val.username === username) {
                    new_message_element.id = 'personal_message';
                    new_message_date_element.id = 'personal_message_date';
                }
    
                new_message_element.textContent = `${message_val.username}:${message_val.text} `;
                new_message_date_element.textContent =` 時間:${message_val.timestamp}`;
                
                //新增淡化消失動畫
                new_message_element.classList.add('fade_in_out');
                new_message_date_element.classList.add('fade_in_out');

                chatBox2.appendChild(new_message_element);
                chatBox2.appendChild(new_message_date_element);

                new_message(new_message_element, new_message_date_element)
                
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
}

let timer
//新增訊息後計時結束時消失
function new_message(messageElement, MessageDateElement) {
        // 啟動計時器(4000毫秒 = 4秒)
        timer = setTimeout(() => {
            messageElement.remove(); // 消息淡出後移除元素
            MessageDateElement.remove();
        }, 4000);
}

//註冊表單
const user_register = document.getElementById('register')
if(user_register){
    user_register.addEventListener('submit', async (event) => {
        event.preventDefault(); // 阻止默認提交行為

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const error_message = document.getElementById('error_message');
        //資料
        let userdata = {
          username: username,
          email: email,
          friends_list:[username]
        }
        
        try {
            // 调用注册函数并等待其完成
            authfunctions.register(email, password).then((result) =>{
                if(result == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                    error_message.innerHTML = "密碼不足六個字"
                }else if(result == "Firebase: Error (auth/email-already-in-use)."){
                    error_message.innerHTML = "Emall已被使用"
                }else if(result == "Firebase: Error (auth/invalid-email)."){
                    error_message.innerHTML = "Emall格式不正確"
                }
            })
            
            // 等待一小段时间（例如100毫秒），确保当前用户对象已经更新
            await new Promise(resolve => setTimeout(resolve, 2000))

            // 保存用户数据
            Datafunctions.writeUserData(userdata);


        } catch (error) {
            // 处理注册过程中的错误
            console.error("注册过程中出错：", error);
        }
    });
}

//登入表單
const user_login = document.getElementById('login')
if(user_login){
    user_login.addEventListener('submit', async (event) => {
        event.preventDefault(); // 阻止默认提交行为

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        authfunctions.login(email, password);
    });
}

//刪除帳號
const Delete_account = document.getElementById('delete');
if(Delete_account){
    Delete_account.addEventListener('click', async () => {
        authfunctions.delete_account();
    })
}

//登出帳號
const logout_account = document.getElementById('logout');
if(logout_account){
    logout_account.addEventListener('click', async () => {
        authfunctions.Sign_out()
    })
}

// 獲取圖片元素
const emailLoginButton = document.getElementById('emailLoginButton');
const googleLoginButton = document.getElementById('googleLoginButton');
const facebookLoginButton = document.getElementById('facebookLoginButton');

// 其他登入
if (emailLoginButton && googleLoginButton && facebookLoginButton) {
    //電子郵件登入
    emailLoginButton.addEventListener('click', async () => {
        authfunctions.email_login()
    });
    //google登入
    googleLoginButton.addEventListener('click', async () => {
        authfunctions.google_login()
    });
    //facebook登入
    facebookLoginButton.addEventListener('click', async () => {
        authfunctions.facebook_login()
    });
}