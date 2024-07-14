
//引入自訂函式檔案
import Auth from './js/firebase/auth';
import "./scss/index.scss";

// 初始化 Firebase 应用
const auth = new Auth;

//登入表單
const user_login = document.getElementById('login')
if(user_login){
    user_login.addEventListener('submit', async (event) => {
        event.preventDefault(); // 阻止默认提交行为

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.login(email, password);
    });
}


// 獲取圖片元素
// const emailLoginButton = document.getElementById('emailLoginButton');
// const googleLoginButton = document.getElementById('googleLoginButton');
// const facebookLoginButton = document.getElementById('facebookLoginButton');

// 其他登入
// if (emailLoginButton && googleLoginButton && facebookLoginButton) {
//     //電子郵件登入
//     emailLoginButton.addEventListener('click', async () => {
//         auth.email_login()
//     });
//     //google登入
//     googleLoginButton.addEventListener('click', async () => {
//         auth.google_login()
//     });
//     //facebook登入
//     facebookLoginButton.addEventListener('click', async () => {
//         auth.facebook_login()
//     });
// }