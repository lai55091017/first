// 引入 Firebase 模块
import * as firebase from 'firebase/app';
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
const db = getDatabase(app);
const auth = getAuth(app);

//取得參考路徑
export function GetRef(path_name){
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        switch (path_name){
          case "users":
            resolve(ref(db, 'users/' + user.uid)); //用戶資料路徑
            break;
          case "message":
            resolve(ref(db, 'messages')); //訊息路徑
            break;
        }
      } else {
        reject("用戶未登入");
      }
    })
  })
} 

//寫入訊息資料
export function WriteMessageData(messagedata) {
  GetRef("message")
    .then(messageRef => {
      update(messageRef, messagedata)
        .then(() => {
          console.log('訊息資料更新成功');
        })
        .catch((updateError) => {
          console.error('更新訊息資料時出錯: ', updateError);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}


//寫入用戶資料
export function writeUserData(userdata) {
  GetRef("users")
  .then(UserRef =>{
    set(UserRef, userdata)
    .then(() => {
      console.log('用戶資料寫入成功');
      // 跳转到指定页面
      window.location.href = "Functional_interface.html";
    })
    .catch((error) => {
      console.error('寫入用戶資料時出錯: ', error);
    });
  })
  .catch((error) => {
    console.error(error);
  });
  
}

//更改用戶資料
export function updateUserData(userdata) {
  GetRef("users")
  .then(UserRef =>{
    update(UserRef, userdata)
    .then(() => {
      console.log('用戶資料更改成功');
    })
    .catch((error) => {
      console.error('更改用戶資料時出錯: ', error);
    });
  })
  .catch((error) => {
    console.error(error);
  });
}


// 監聽資料是否更改
export function read(){
  GetRef("users")
  .then(UserRef =>{
    onValue(UserRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

// 監聽並取得username
export function read_username_once(){
  return new Promise((resolve, reject) => {
    GetRef("users")
    .then(UserRef =>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const unsubscribe = onValue(UserRef, (snapshot) => {
  
            const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            // 回傳username
            resolve(username);
          }, {
            //執行一次
            onlyOnce: true
          });
          // 返回一個取消訂閱的函數，以便需要時可以取消事件監聽
          return unsubscribe;
        } 
        else {
            reject("用户未登录");
        }
      })
    });
  })
  .catch((error) => {
    console.error(error);
  });
}


  
  // get
  // const dbRef = ref(getDatabase());
  // get(child(dbRef, `users/${userId}`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });