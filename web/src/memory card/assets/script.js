// 翻牌
const flip = document.querySelectorAll('.memory-card');
// 難易度
const easy = document.getElementById('easy');
const normal = document.getElementById('normal');
const hard = document.getElementById('hard');
// 重置
const reset = document.getElementById('reset');
// 偷看
const look = document.getElementById('look');
const end = document.querySelector("#end");
const resetEndlook = document.querySelector("#reset_look");

// 初始設定
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let cardNum = 28;
let mathedCard = 0;
let gamemode = 0;

function flipCard() {
  // 翻牌
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    // 第一次點擊
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // 第二次點擊
  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  // 檢查是否為同一張卡片
  const firstCardAlt = firstCard.querySelector('.front-face').alt || firstCard.querySelector('.front-face').getAttribute('cardID');
  const secondCardAlt = secondCard.querySelector('.front-face').getAttribute('cardID') || secondCard.querySelector('.front-face').alt;
  // 檢查是否匹配
  let isMatch = firstCardAlt === secondCardAlt || secondCardAlt === firstCardAlt;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  // 匹配成功後移除點擊事件
  firstCard.closest('.show').classList = "hide";
  secondCard.closest('.show').classList = "hide";
  // 檢查是否完成遊戲
  mathedCard += 2;
  if (mathedCard === cardNum) {
    setTimeout(() => {
      end.addEventListener('click', resetGame);
      const hide = document.querySelectorAll('.hide');
      hide.forEach(card => card.classList = 'none');
      if (document.title == "記憶力翻牌小遊戲") {
        end.innerHTML = "已通關";
      }
      else if (document.title == "Memory Card Game") {
        end.innerHTML = "Finish";
      }
      else if (document.title == "メモリカードゲーム") {
        end.innerHTML = "ゲームクリア";
      }
      end.classList = "text"
    }, 500);
  } else {
    resetBoard();
  }
}

function unflipCards() {
  // 鎖定遊戲版面
  lockBoard = true;
  // 非匹配卡片翻回去
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 500);
}

function resetCard() {
  // 卡片重置
  end.classList = "none"
  const hide = document.querySelectorAll('.hide');
  hide.forEach(card => card.classList = 'none');
  const show = document.querySelectorAll('.show');
  show.forEach(card => card.classList = 'none');
  const flip = document.querySelectorAll('.memory-card.flip');
  flip.forEach(card => card.classList = 'memory-card');
  setTimeout(() => {
    for (let i = 0; i < cardNum; i++) {
      document.querySelector(".none").classList = "show";
    }
  }, 100);
  setTimeout(() => {
    shuffle();
  }, 100);
}

function difficultyChoose() {
  if (gamemode === 0) { resetEndlook.classList = "ts-wrap is-center-aligned"; }
  // 難易度選擇
  const modes = {
    easy: {
      id: 'easy',
      class: 'memory-game-easy',
      cardNum: 16,
      message: {
        '記憶力翻牌小遊戲': '切換為簡單模式。',
        'Memory Card Game': 'Switch to Easy Mode.',
        'メモリカードゲーム': '簡単モードに切り替え。'
      }
    },
    normal: {
      id: 'normal',
      class: 'memory-game-normal',
      cardNum: 28,
      message: {
        '記憶力翻牌小遊戲': '切換為普通模式。',
        'Memory Card Game': 'Switch to Normal Mode.',
        'メモリカードゲーム': '普通モードに切り替え。'
      }
    },
    hard: {
      id: 'hard',
      class: 'memory-game-hard',
      cardNum: 40,
      message: {
        '記憶力翻牌小遊戲': '切換為困難模式。',
        'Memory Card Game': 'Switch to Hard Mode.',
        'メモリカードゲーム': '困難モードに切り替え。'
      }
    }
  };

  const mode = modes[this.id];
  if (mode) {
    if (gamemode !== mode.cardNum) {
      gamemode = mode.cardNum;
      document.querySelector("#difficulty").classList = mode.class;
      cardNum = mode.cardNum;
      mathedCard = 0;
      resetCard();
      const title = document.title;
      if (mode.message[title]) {
        alert(mode.message[title]);
      }
    } else {
      const title = document.title;
      if (title === '記憶力翻牌小遊戲') {
        alert("已經是" + mode.id + "模式了。");
      } else if (title === 'Memory Card Game') {
        alert("It was " + mode.id + " Mode.");
      } else if (title === 'メモリカードゲーム') {
        alert(mode.id + "モードでした");
      }
    }
  }
}

function lookCard() {
  // 鎖定遊戲版面
  lockBoard = true;
  hasFlippedCard = false;
  flip.forEach(card => card.removeEventListener('click', flipCard));
  // 重置第一次點擊
  const lookCardback = document.querySelectorAll(".memory-card");
  firstCard = null;
  // 偷看
  lookCardback.forEach(card => card.classList.add('flip'));
  setTimeout(() => {
    const lookCardback = document.querySelectorAll(".memory-card");
    lookCardback.forEach(card => card.classList.remove('flip'));
  }, 1200);
  // 偷看結束
  setTimeout(() => { lockBoard = false; }, 800);
  setTimeout(() => {
    flip.forEach(card => card.addEventListener('click', flipCard));
  }, 1200);
}

function resetGame() {
  // 重置遊戲
  if (document.title == "記憶力翻牌小遊戲") {
    alert("重置遊戲。");
  }
  else if (document.title == "Memory Card Game") {
    alert("Game reset.");
  }
  else if (document.title == "メモリカードゲーム") {
    alert("ゲームリセット。");
  }
  if (mathedCard === cardNum) { end.removeEventListener('click', resetGame) }
  mathedCard = 0;
  resetCard();
  shuffle();
}

function resetBoard() {
  // 重置遊戲變數
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  // 卡片
  const cards = document.querySelectorAll('.show');
  // 洗牌
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cardNum);
    card.style.order = randomPos;
  });
}

// 為每張卡片添加點擊事件
flip.forEach(card => card.addEventListener('click', flipCard));
// 難易度的點擊事件
easy.addEventListener('click', difficultyChoose);
normal.addEventListener('click', difficultyChoose);
hard.addEventListener('click', difficultyChoose);
// 重置的點擊事件
reset.addEventListener('click', resetGame);
// 偷看的點擊事件
look.addEventListener('click', lookCard);
