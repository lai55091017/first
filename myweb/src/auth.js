// 引入 Firebase 模块
import * as firebase from 'firebase/app';
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    EmailAuthProvider,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut
} from 'firebase/auth';
import * as firebaseui from 'firebaseui';


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
const ui = new firebaseui.auth.AuthUI(auth);

//註冊
export function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // 注册成功
        const user = userCredential.user;
        console.log("使用者創建成功.");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("建立使用者時出錯:", errorMessage);
        return errorMessage
    });
}

//登入
export function login(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // 登入成功 
    const user = userCredential.user;
    // 跳转到指定页面
    window.location.href = "Functional_interface.html";
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    });
}

//刪除帳號
export function delete_account(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
            auth.currentUser.delete()
            .then(() => {
                console.log('用戶已刪除');
            })
            .catch((error) => {
                console.error('刪除用戶失敗:', error.message);
            });
        }else
            console.log('用戶未登入');
    });
}

//登出帳號
export function Sign_out(){
    signOut(auth)
    .then(() => {
        // 登出成功，可以在这里执行相关操作，比如跳转到登录页面或者刷新页面
        console.log("用户已登出");
        window.location.href = login_page; // 跳转到登录页面
    })
    .catch((error) => {
        // 登出失败，输出错误信息
        console.error("登出失败:", error.message);
    });
}


//其他登入 (還有很多問題)
export function email_login(){
    ui.start('#firebaseui-auth-container', {
        signInOptions: [{
            provider: EmailAuthProvider.PROVIDER_ID,
            signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
            forceSameDevice: false,
            emailLinkSignIn: function() {
                return {
                    url: 'https://www.example.com/completeSignIn?showPromo=1234',
                    dynamicLinkDomain: 'example.page.link',
                    handleCodeInApp: true,
                    android: {
                        packageName: 'com.example.android',
                        installApp: true,
                        minimumVersion: '12'
                    }
                };
            }
        }],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
    });
}

export function google_login(){
    ui.start('#firebaseui-auth-container', {
        signInOptions: [{
            provider: GoogleAuthProvider.PROVIDER_ID,
            clientId: '82010977170-fbsve9kb834u6q33vjgkviltr5u00ag5.apps.googleusercontent.com' // 客户端 ID
        }],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        signInSuccessUrl: 'Functional_interface.html'
    });
}

export function facebook_login(){
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            FacebookAuthProvider.PROVIDER_ID
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.FACEBOOK
    });
}

// //監控用戶目前狀態
// onAuthStateChanged(auth, (user) => {
//     if (user) {
    // 已登入
    // https://firebase.google.com/docs/reference/js/auth.user
    
    // console.log('用戶已登入：', user.uid);
    //其他資料
    //   console.log('電子郵件是否進行驗證：', user.emailVerified);
    //   console.log('其他登入驗證：', user.isAnonymous);
    //   console.log('使用者建立和登入時間的其他元資料：', user.metadata);
    //   console.log('每個提供者的附加信息，例如顯示名稱和個人資料資訊：', user.providerData);
    //   user.getIdToken()
    //     .then((idToken) => {
    //         // 在这里可以使用获取到的新的 ID 令牌进行需要的操作，比如发送给服务器等
    //         console.log('刷新令牌：', idToken);
    //     })
    //     .catch((error) => {
    //         console.error('刷新 ID 令牌時發生錯誤：', error);
    //     });
//     }else {
//     // 未登入
//     console.log('用戶未登入');
//     }
// });



