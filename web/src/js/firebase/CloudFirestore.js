import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

class CloudFirestore {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyCQjbkj3r9cPL_alEoZRfnx7-nCEgjZasc",
            authDomain: "cyut-3d-rpg.firebaseapp.com",
            projectId: "cyut-3d-rpg",
            storageBucket: "cyut-3d-rpg.appspot.com",
            messagingSenderId: "485354531854",
            appId: "1:485354531854:web:569d6af236aa3d8889e05f",
            measurementId: "G-5ZTY53LH0R",
          };
          
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }
}

