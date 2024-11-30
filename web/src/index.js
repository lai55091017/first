
//引入自訂函式檔案
import Auth from './js/firebase/auth';
import "./scss/index.scss";

// 初始化 Firebase 應用
const auth = new Auth;

//登入表單
document.addEventListener('DOMContentLoaded', () => {

    auth.auto_login();

    document.getElementById('login').addEventListener('submit', async (event) => {
        event.preventDefault(); // 阻止默認提交行為

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const error_message = document.getElementById('error_message');

        auth.login(email, password).then((result) => {
            console.log(result);
            if (result == "Firebase: Error (auth/invalid-email).") {
                error_message.innerHTML = "Emall格式不正確"
            } else if (result == "Firebase: Error (auth/missing-password).") {
                error_message.innerHTML = "請輸入密碼"
            }
        })
    });
})