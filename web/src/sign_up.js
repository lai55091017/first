//引入自訂函式檔案
import Auth from './js/firebase/auth';
import FirebaseDB from './js/firebase/Realtime Database';
import "./scss/sign_up.scss";

// 初始化 Firebase 应用
const auth = new Auth;
const db = new FirebaseDB;

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
            email: email,
            friends_list: [username]
        }

        try {
            // 调用注册函数并等待其完成
            auth.register(email, password).then((result) => {
                if (result == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                    error_message.innerHTML = "密碼不足六個字"
                } else if (result == "Firebase: Error (auth/email-already-in-use).") {
                    error_message.innerHTML = "Emall已被使用"
                } else if (result == "Firebase: Error (auth/invalid-email).") {
                    error_message.innerHTML = "Emall格式不正確"
                }
            })

            // 等待一小段时间（例如100毫秒），确保当前用户对象已经更新
            await new Promise(resolve => setTimeout(resolve, 2000))

            // 保存用户数据
            db.writeUserData(userdata);


        } catch (error) {
            // 处理注册过程中的错误
            console.error("注册过程中出错：", error);
        }
    });
})

