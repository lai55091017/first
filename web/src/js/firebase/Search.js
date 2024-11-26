// import { initializeApp, getApps } from 'firebase/app';
// import {
//     getFirestore,
//     doc,
//     setDoc,
//     updateDoc,
//     arrayUnion,
//     arrayRemove,
//     getDoc,
//     writeBatch,
//     collection, query, where, orderBy, getDocs
// } from 'firebase/firestore';
// import {
//     getAuth,
//     onAuthStateChanged
// } from 'firebase/auth';

// class Search {
//     constructor() {

//         // Firebase 設定
//         this.firebaseConfig = {
//             apiKey: "AIzaSyCQjbkj3r9cPL_alEoZRfnx7-nCEgjZasc",
//             authDomain: "cyut-3d-rpg.firebaseapp.com",
//             databaseURL: "https://cyut-3d-rpg-default-rtdb.firebaseio.com",
//             projectId: "cyut-3d-rpg",
//             storageBucket: "cyut-3d-rpg.appspot.com",
//             messagingSenderId: "485354531854",
//             appId: "1:485354531854:web:569d6af236aa3d8889e05f",
//             measurementId: "G-5ZTY53LH0R"
//         };

//         // 檢查應用是否已初始化
//         if (!getApps().length) {
//             this.app = initializeApp(this.firebaseConfig);
//         } else {
//             this.app = getApps()[0]; // 使用已初始化的應用
//         }

//         // 初始化 Firebase 認證和資料庫
//         this.auth = getAuth(this.app);
//         this.db = getFirestore(this.app);
//         // 初始化批次操作
//         this.batch = writeBatch(this.db);

//         // 使用 Promise 監聽用戶登入狀態變化
//         this.authReady = new Promise((resolve) => {
//             onAuthStateChanged(this.auth, (user) => {
//                 this.user = user;
//                 this.uid = user ? user.uid : null;
//                 resolve(); // 狀態更新完畢，解決 Promise
//             });
//         });
//     }

// }


// export default Search;
