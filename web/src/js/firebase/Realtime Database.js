// 引入 Firebase 模块
import * as firebase from 'firebase/app';
import { 
  getDatabase,
  ref,
  set,
  child,
  push,
  update,
  remove,
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

class FirebaseDB {
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
    this.db = getDatabase(this.app);
    this.auth = getAuth(this.app);
  }

  GetRef(path_name) {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          switch (path_name){
            case "users":
              resolve(ref(this.db, 'users/' + user.uid)); //用戶資料路徑
              break;
            case "messages":
              resolve(ref(this.db, 'messages')); //訊息路徑
              break;
            case "online_users":
              resolve(ref(this.db, 'online_users')); //線上玩家路徑
              break;
            case "word_cards":
              resolve(ref(this.db, 'word_cards/' + user.uid)); //單字卡路徑
              break;
          }
        } else {
          reject("用戶未登入");
        }
      })
    })
  }

  // 將資料寫入資料庫
  write_data(ref, data) {
    this.GetRef(ref)
      .then(target_ref => {
        update(target_ref, data)
        .then(() => {
          console.log(`訊息${ref}資料更新成功`);
        })
        .catch((error) => {
          console.error(`更新${ref}訊息資料時出錯: `, error);
        });
      })
      .catch((error) => {console.error(error);});
  }

  // 設定資料
  set_data(ref, data) {
    this.GetRef(ref)
      .then(target_ref => {
        set(target_ref, data)
        .then(() => {
          console.log(`訊息${ref}資料更新成功`);
        })
        .catch((error) => {
          console.error(`更新${ref}訊息資料時出錯: `, error);
        });
      })
      .catch((error) => {console.error(error);});
  }

  // 增加單字卡資料
  Add_word_card_information(ref, data) {
    this.GetRef(ref)
    .then(target_ref => {
      push(target_ref, data)
          .then(() => {
              console.log('New data added successfully.');
          })
          .catch((error) => {
              console.error('Error adding new data:', error);
          });
    })
    .catch((error) => {
        console.error('Error getting data reference:', error);
    })
  }

  // 寫入用戶資料
  writeUserData(userdata) {
    this.GetRef("users")
      .then(UserRef => {
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

  // 讀取列表資料
  read_data_list(ref) {
    return new Promise((resolve, reject) => {
      this.GetRef(ref)
        .then(target_ref => {
          onAuthStateChanged(this.auth, (user) => {
            if (user) {
              onValue(target_ref, (snapshot) => {
                const dataList = [];
                snapshot.forEach((childSnapshot) => {
                  const item = childSnapshot.val();
                  dataList.push(item);
                });
                resolve(dataList);
              }, {
                //執行一次
                onlyOnce: true
              });
            } else {
              reject("用户未登录");
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 讀取資料
  read_data(ref) {
    return new Promise((resolve, reject) => {
      this.GetRef(ref)
        .then(target_ref => {
          onAuthStateChanged(this.auth, (user) => {
            if (user) {
              onValue(target_ref, (snapshot) => {
                resolve(snapshot)
              }, {
                //執行一次
                onlyOnce: true
              });
            }
            else {
              reject("用户未登录");
            }
          });
        });
    });
  }

  //刪除線上用戶
  delete_online_user_data() {
    this.GetRef("online_users")
      .then(Ref => {
        remove(Ref)
        .then(() => {
          console.log('用戶線上用戶資料刪除成功');
        })
        .catch((error) => {
          console.error('刪除線上用戶資料時出錯: ', error);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 更新用戶資料
  updateUserData(userdata) {
    this.GetRef("users")
      .then(UserRef => {
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

  // 讀取用戶姓名
  read_username_once() {
    return new Promise((resolve, reject) => {
      this.GetRef("users")
        .then(UserRef => {
          onAuthStateChanged(this.auth, (user) => {
            if (user) {
              onValue(UserRef, (snapshot) => {

                const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                // 回傳username
                resolve(username);
              }, {
                //執行一次
                onlyOnce: true
              });
            }
            else {
              reject("用户未登录");
            }
          });
        });
    });
  }
}
export default FirebaseDB;