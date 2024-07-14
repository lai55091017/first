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

class Auth{
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyCQjbkj3r9cPL_alEoZRfnx7-nCEgjZasc",
            authDomain: "cyut-3d-rpg.firebaseapp.com",
            projectId: "cyut-3d-rpg",
            storageBucket: "cyut-3d-rpg.appspot.com",
            messagingSenderId: "485354531854",
            appId: "1:485354531854:web:569d6af236aa3d8889e05f",
            measurementId: "G-5ZTY53LH0R",
            databaseURL: "https://cyut-3d-rpg-default-rtdb.firebaseio.com/"
          };

        // 初始化 Firebase 应用
        this.app = firebase.initializeApp(this.firebaseConfig);
        this.auth = getAuth(this.app);
        this.ui = new firebaseui.auth.AuthUI(this.auth);
    }

    // 註冊設定
    register(email, password) {
        return createUserWithEmailAndPassword(this.auth, email, password)
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

    // 登入設定
    login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            // 登入成功
            const user = userCredential.user;
            console.log("使用者登入成功.");
            // 跳转到指定页面
            window.location.href = "Functional_interface.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("登入時出錯:", errorMessage);
            return errorMessage
        });
    }

    // 登出設定
    Sign_out() {  
        signOut(this.auth).then(() => {
            // 登出成功，可以在这里执行相关操作，比如跳转到登录页面或者刷新页面
            console.log("用户已登出");
            window.location.href = "index.html"; // 跳转到登录页面
        }).catch((error) => {
            // 登出失败，输出错误信息
            console.error("登出失败:", error.message);
        });
    }

    
    //監聽資料
    onAuthStateChanged() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                console.log('用戶已登入：', user.uid);
                console.log('電子郵件是否進行驗證：', user.emailVerified);
                console.log('其他登入驗證：', user.isAnonymous);
                console.log('使用者建立和登入時間的其他元資料：', user.metadata);
                console.log('每個提供者的附加信息，例如顯示名稱和個人資料資訊：', user.providerData);
                console.log('使用者的電子郵件地址：', user.email);
            }else {
            console.log('用戶未登入');
            }
        });
    }

    //刪除帳號設定
    delete_account() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                user.delete().then(() => {
                    console.log('開始刪除用戶');
                    user.delete()
                    .then(() => {
                        console.log('用戶已刪除');
                        window.location.href = "index.html"
                    })
                    .catch((error) => {
                        console.error('刪除用戶失敗:', error.message);
                    });
                })
                .catch((error) => {
                    console.error('開始刪除用戶時發生錯誤:', error.message);
                });
            } else {
                console.log('用戶未登入');
                window.location.href = "index.html"
            }
        });
    }

    
}
export default Auth;

// //其他登入 (還有很多問題)
// export function email_login(){
//     ui.start('#firebaseui-auth-container', {
//         signInOptions: [{
//             provider: EmailAuthProvider.PROVIDER_ID,
//             signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
//             forceSameDevice: false,
//             emailLinkSignIn: function() {
//                 return {
//                     url: 'https://www.example.com/completeSignIn?showPromo=1234',
//                     dynamicLinkDomain: 'example.page.link',
//                     handleCodeInApp: true,
//                     android: {
//                         packageName: 'com.example.android',
//                         installApp: true,
//                         minimumVersion: '12'
//                     }
//                 };
//             }
//         }],
//         credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
//     });
// }

// export function google_login(){
//     ui.start('#firebaseui-auth-container', {
//         signInOptions: [{
//             provider: GoogleAuthProvider.PROVIDER_ID,
//             clientId: '82010977170-fbsve9kb834u6q33vjgkviltr5u00ag5.apps.googleusercontent.com' // 客户端 ID
//         }],
//         credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
//         signInSuccessUrl: 'Functional_interface.html'
//     });
// }

// export function facebook_login(){
//     ui.start('#firebaseui-auth-container', {
//         signInOptions: [
//             FacebookAuthProvider.PROVIDER_ID
//         ],
//         credentialHelper: firebaseui.auth.CredentialHelper.FACEBOOK
//     });
// }

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



