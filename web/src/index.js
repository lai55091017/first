
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

        auth.login(email, password);
    });
})