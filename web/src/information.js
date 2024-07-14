import "./scss/information.scss";

function toggleAudio(audioid, buttonid) {
    let audioElement = document.getElementById(audioid);
    let buttonElement = document.getElementById(buttonid).getElementsByTagName('img')[0];

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

function addMusicCard(musicName, audioUrl, imageUrl) {
    const cardList = document.getElementById('cardList');
    const newCardId = `audio${cardList.children.length + 1}`;
    const newButtonId = `button${cardList.children.length + 1}`;
    
    const newCard = document.createElement('li');
    newCard.innerHTML = `
        <div class="card">
            <a href="">
                <span>${musicName}</span><br>
                <span>10月無口な君を忘れる</span>
            </a>
            <audio id="${newCardId}" src="${audioUrl}"></audio>
            <button id="${newButtonId}">
                <img src="/img/play.png" alt="Play">
            </button>
        </div>
    `;
    
    cardList.appendChild(newCard);
    
    const newImageCard = document.createElement('li');
    newImageCard.innerHTML = `
        <div class="card">
            <a href="">
                <img src="${imageUrl}" alt="">
            </a>
        </div>
    `;
    
    cardList.appendChild(newImageCard);

    document.getElementById(newButtonId).addEventListener('click', function() {
        toggleAudio(newCardId, newButtonId);
    });
}

addMusicCard("賴的歌", "audio.mp3", "/img/aaa.jpg");
addMusicCard("賴的歌", "audio.mp3", "/img/aaa.jpg");
addMusicCard("賴的歌", "audio.mp3", "/img/aaa.jpg");


// document.getElementById('newCardForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const musicName = document.getElementById('musicName').value;
//     const audioUrl = document.getElementById('audioUrl').value;
//     const imageUrl = document.getElementById('imageUrl').value;
    
//     addMusicCard(musicName, audioUrl, imageUrl);
    
//     document.getElementById('newCardForm').reset();
// });
