
import Auth from './firebase/auth';


const auth = new Auth;

auth.onAuthStateChanged();

export function menu() {
    //切換頁面
    document.getElementById('home_link').addEventListener('click', async () => {
        auth.switch_page('Functional_interface.html');
    })

    document.getElementById('info_link').addEventListener('click', async () => {
        auth.switch_page('information.html');
    })

    //刪除帳號
    document.getElementById('delete').addEventListener('click', async () => {
        auth.delete_account();
    })

    //登出帳號
    document.getElementById('logout').addEventListener('click', async () => {
        auth.Sign_out()
    })

}



