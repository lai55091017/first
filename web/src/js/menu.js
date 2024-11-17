
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

    document.getElementById('power').addEventListener('click', async () => {
        auth.Sign_out()
    })
    const menu = document.querySelector(".menu");
    const toggle = document.querySelector(".toggle");


    toggle.addEventListener("click", () => {
        menu.classList.toggle("active");
        //如果 menu 已經有 "active" 類別，則移除它。
        //如果沒有 "active" 類別，則新增它。
    })

    $('#function_li').on('click', async () => { $("#main_menu").fadeToggle(500); })
}



