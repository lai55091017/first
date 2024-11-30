//引入自訂函式檔案
import Auth from './js/firebase/auth';
import "./scss/sign_up.scss";
import Firestore from './js/firebase/Firestore';

// 初始化 Firebase 應用
const auth = new Auth;
const fs = new Firestore;

//註冊表單

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('register').addEventListener('submit', async (event) => {
        event.preventDefault(); // 阻止默認提交行為

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const error_message = document.getElementById('error_message');
        //資料
        let userdata = {
            username: username,
            email: email
        }

        try {
            // 調用註冊函數並等待其完成
            auth.register(email, password).then((result) => {
                if (username == "") {
                    
                    error_message.innerHTML = "請輸入名稱"
                } else if (result == "Firebase: Error (auth/email-already-in-use).") {
                    error_message.innerHTML = "Emall已被使用"
                } else if (result == "Firebase: Error (auth/invalid-email).") {
                    error_message.innerHTML = "Emall格式不正確"
                } else if (result == "Firebase: Error (auth/missing-password).") {
                    error_message.innerHTML = "請輸入密碼"
                } else if (result == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                    error_message.innerHTML = "密碼不足六個字"
                }
            })

            // 等待一小段時間（例如 100 毫秒），確保當前用戶對象已經更新
            await new Promise(resolve => setTimeout(resolve, 2000))

            // 保存用戶數據
            fs.new_user_data(userdata)


        } catch (error) {
            // 處理註冊過程中的錯誤
            console.error("註冊過程發生了錯誤：", error);
        }
    });
})

