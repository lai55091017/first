import { initializeApp, getApps } from 'firebase/app';
import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    writeBatch,
    collection, query, where, orderBy, getDocs
} from 'firebase/firestore';
import {
    getAuth,
    onAuthStateChanged
} from 'firebase/auth';

class Firestore {
    constructor() {

        // Firebase 設定
        this.firebaseConfig = {
            apiKey: "AIzaSyCQjbkj3r9cPL_alEoZRfnx7-nCEgjZasc",
            authDomain: "cyut-3d-rpg.firebaseapp.com",
            databaseURL: "https://cyut-3d-rpg-default-rtdb.firebaseio.com",
            projectId: "cyut-3d-rpg",
            storageBucket: "cyut-3d-rpg.appspot.com",
            messagingSenderId: "485354531854",
            appId: "1:485354531854:web:569d6af236aa3d8889e05f",
            measurementId: "G-5ZTY53LH0R"
        };

        // 檢查應用是否已初始化
        if (!getApps().length) {
            this.app = initializeApp(this.firebaseConfig);
        } else {
            this.app = getApps()[0]; // 使用已初始化的應用
        }

        // 初始化 Firebase 認證和資料庫
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        // 初始化批次操作
        this.batch = writeBatch(this.db);

        // 使用 Promise 監聽用戶登入狀態變化
        this.authReady = new Promise((resolve) => {
            onAuthStateChanged(this.auth, (user) => {
                this.user = user;
                this.uid = user ? user.uid : null;
                resolve(); // 狀態更新完畢，解決 Promise
            });
        });
    }

    // 確保用戶狀態已更新的 helper 函數
    async __ensureAuth() {
        await this.authReady;
        if (!this.uid) {
            throw new Error("用戶尚未登入");
        }
    }

    // 新增用戶資料
    async new_user_data(user_data) {
        try {
            await this.__ensureAuth(); // 確保用戶狀態已更新
            await setDoc(doc(this.db, "users", this.uid), user_data);
            console.log("寫入用戶數據成功");
            // 跳轉到指定頁面
            window.location.href = "Functional_interface.html";
        } catch (error) {
            console.error("寫入用戶數據失敗:", error);
        }
    }

    // 保存場景InteractableObject
    async save_InteractableObject(data) {
        try {

            // 保存至 Firestore
            const docRef = doc(this.db, "configurations", "InteractableObject");
            await setDoc(docRef, {data});
            console.log("InteractableObject 保存成功");
        } catch (error) {
            console.error("保存 InteractableObject 失敗:", error);
        }
    }

    // 讀取場景InteractableObject
    async load_InteractableObject() {
        try {
            const docRef = doc(this.db, "configurations", "InteractableObject");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data().data;
                return data; // 返回讀取到的數據
            } else {
                console.log("InteractableObject 不存在");
                return null; // 返回 null 表示不存在
            }
        } catch (error) {
            console.error("讀取 InteractableObject 失敗:", error);
            return null;
        }
    }

    // 保存場景regexMapping
    async save_scene_regex_mapping(data) {
        try {
            // 將正則表達式轉換為字串
            const serializedMapping = data.map(({ type, regex, newName }) => ({
                type,
                regex: regex.toString(), // 將正則表達式轉為字串
                newName,
            }));
    
            // 保存至 Firestore
            const docRef = doc(this.db, "configurations", "scene_regex_mapping");
            await setDoc(docRef, { mapping: serializedMapping });
            console.log("regexMapping 保存成功");
        } catch (error) {
            console.error("保存 regexMapping 失敗:", error);
        }
    }
    
    // 讀取場景regexMapping
    async load_scene_regex_mapping() {
        try {
            const docRef = doc(this.db, "configurations", "scene_regex_mapping");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const serializedMapping = docSnap.data().mapping;
    
                // 將字串轉回正則表達式
                const regexMapping = serializedMapping.map(({ type, regex, newName }) => ({
                    type,
                    regex: new RegExp(regex.slice(1, regex.lastIndexOf('/')), regex.slice(regex.lastIndexOf('/') + 1)), // 還原正則表達式
                    newName,
                }));
    
                // console.log("regexMapping 還原成功:", regexMapping);
                return regexMapping;
            } else {
                console.error("無法找到 regexMapping 文檔");
                return null;
            }
        } catch (error) {
            console.error("讀取 regexMapping 失敗:", error);
        }
    }
    

    // 增加卡片資料
    async add_user_card(card_data) {
        try {
            await this.__ensureAuth(); // 確保用戶狀態已更新
            this.batch.update(doc(this.db, "users", this.uid), {
                card: arrayUnion(...card_data.card)
            });
            console.log("更新用戶數據成功");
        } catch (error) {
            console.error("更新用戶數據失敗:", error);
        }
    }

    // 刪除卡片資料
    async delete_user_card(card_data) {
        try {
            await this.__ensureAuth(); // 確保用戶狀態已更新
            this.batch.update(doc(this.db, "users", this.uid), {
                card: arrayRemove(...card_data.card)
            });
            console.log(card_data);
            console.log("更新用戶數據成功");
        } catch (error) {
            console.error("更新用戶數據失敗:", error);
        }
    }

    // 新增一個用於更新卡片的函數
    async update_user_card(card_data) {
        try {
            await this.__ensureAuth();
            // 你可以在這裡自定義更新邏輯，例如逐個更新卡片
            for (let card of card_data.card) {
                // 假設你有一些特定的欄位來標識卡片，可以在這裡更新
                this.batch.update(doc(this.db, "users", this.uid), {
                    card: arrayUnion(card) // 或使用你的邏輯來更新卡片
                });
            }
            console.log("卡片更新成功");
        } catch (error) {
            console.error("卡片更新失敗:", error);
        }
    }


    // 取得用戶資料
    async get_user_data() {
        try {
            await this.__ensureAuth(); // 確保用戶狀態已更新
            const docRef = doc(this.db, "users", this.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("取得用戶數據失敗:", error);
        }
    }



    //提交批次
    async commit_data() {
        try {
            this.batch.commit();
            this.batch = writeBatch(this.db);
        } catch (error) {
            console.error("寫入資料庫失敗:", error);
            this.batch = writeBatch(this.db);
        }
    }
    

}

export default Firestore;
