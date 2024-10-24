import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    doc,
    setDoc,
 } from 'firebase/firestore';
 import { getApps } from 'firebase/app';

class Firestore {
    constructor() {
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
        this.db = getFirestore(this.app);
    }

    async write_data() {
        try {
            await setDoc(doc(this.db, "cities", "LA"), {
                name: "Los Angeles",
                state: "CA",
                country: "USAw"
            });
            console.log("寫入數據成功");
        } catch (error) {
            console.error("寫入數據失敗:", error);
        }
    }
}
export default Firestore

