import "./scss/information.scss";



/*-----------------------loading--------------------*/
$(window).on("load", function () {
    $(".loading_wrapper").fadeOut("slow");
});


/*------------------------------------新增卡片功能-----------------------------------------*/
document.getElementById('card-form').addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止表單的默認提交行為

    // 獲取輸入的英文和中文
    const englishText = document.getElementById('english-text').value;
    const chineseText = document.getElementById('chinese-text').value;

    // 創建新卡片
    const newCard = document.createElement('div');
    newCard.className = 'contantbox';

    // 設置卡片內容
    newCard.innerHTML = `
        <h1>${englishText}</h1>
        <p>${chineseText}</p>
        <button class="edit-btn">
        <svg class="feather feather-edit" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg></button>
        <button class="delete-btn">刪除</button>
        
    `;
    // 將新卡片添加到容器
    document.querySelector('.contair').appendChild(newCard);

    // 綁定卡片的點擊事件，顯示對應的內容在 dialog 中
    newCard.addEventListener('click', function () {
        const dialog = document.getElementById('dialog');
        const dialogContent = document.querySelector('#dialog');
        // 將點擊的卡片內容顯示在 dialog 中
        dialogContent.innerHTML = `
        <a>${englishText}</a>
        <a>${chineseText}</a>
        <button id="close" onclick="closedialog()">X</button>
        <audio id="audio" src="audio.mp3" controls></audio>
    `;
        // 顯示 dialog
        dialog.showModal();

    });
    // 清空表單
    document.getElementById('card-form').reset();
});

/*------------------------------------音訊卡片功能-----------------------------------------*/
function toggleAudio(audioId, buttonId) {
    let audioElement = document.getElementById(audioId);
    let buttonElement = document.getElementById(buttonId).getElementsByTagName('img')[0];

    if (audioElement.paused) {
        audioElement.play();
        buttonElement.src = "/img/pause.png";  // 修改為暫停圖標
        buttonElement.alt = "Pause";
    } else {
        audioElement.pause();
        buttonElement.src = "/img/play.png";  // 修改為播放圖標
        buttonElement.alt = "Play";
    }
}

// 為所有按鈕添加事件監聽器
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function () {
        let audioId = this.previousElementSibling.id;
        let buttonId = this.id;
        toggleAudio(audioId, buttonId);
    });
});


/*------------------跳窗--------------------*/
function closedialog() {
    dialog.close();
}