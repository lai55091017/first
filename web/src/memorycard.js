import "./scss/memorycard.scss";

// 引入 jQuery

class MemoryCardGame {


  /*------------------------  */

  constructor() {

    /*------------------------初始化 DOM 元素----------------------*/
    // 翻牌
    this.flip = document.querySelectorAll('.memory-card');
    // 難易度
    this.easy = document.getElementById('easy'),
      this.normal = document.getElementById('normal'),
      this.hard = document.getElementById('hard'),
      // 重置
      this.reset = document.getElementById('reset'),
      // 偷看
      this.look = document.getElementById('look'),
      this.end = document.querySelector('#end'),
      this.resetEndlook = document.querySelector('#reset_look'),


      // 初始設定
      this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = false;
    this.secondCard = false;
    this.cardNum = 28;
    this.mathedCard = 0;
    this.gamemode = 0;



    /*---簡單記住 .bind(this) 的使用場景

   1.回調函數（如 setTimeout、forEach）：
    方法作為回調函數傳遞時，必須 .bind(this)，否則 this 的指向會丟失。
  
   2.事件處理器：
     當方法作為事件處理器時，綁定 this，以確保 this 始終指向 class 實例。*/
    this.flipCard = this.flipCard.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.difficultyChoose = this.difficultyChoose.bind(this);
    this.lookCard = this.lookCard.bind(this);
    this.checkForMatch = this.checkForMatch.bind(this);
    this.initEvents = this.initEvents.bind(this);
    this.disableCards = this.disableCards.bind(this);
    this.shuffle = this.shuffle.bind(this);

    // 初始化事件處理器
    this.initEvents();
  }

  initEvents() {
    // 為每張卡片添加點擊事件
    this.flip.forEach(card => card.addEventListener('click', this.flipCard));
    // 為難易度按鈕添加點擊事件
    this.easy.onclick = (event) => this.difficultyChoose(event);
    this.normal.onclick = (event) => {
      this.difficultyChoose(event)
    };

    this.hard.onclick = (event) => this.difficultyChoose(event);
    // 為重置和偷看按鈕添加點擊事件
    this.reset.addEventListener('click', this.resetGame);
    this.look.addEventListener('click', this.lookCard);
  }
  flipCard(event) {
    const card = event.currentTarget;
    if (!card.classList.contains('memory-card')) {
      console.warn('Clicked element is not a memory card:', card);
      return;
    }

    // 翻牌
    if (this.lockBoard) return;
    if (card === this.firstCard) return;
    card.classList.add('flip');
    if (!this.hasFlippedCard) {
      // 第一次點擊
      this.hasFlippedCard = true;
      this.firstCard = card;
      return;
    }
    // 第二次點擊
    this.secondCard = card;
    this.checkForMatch();
  }

  checkForMatch() {
    // 檢查是否為同一張卡片
    const firstCardAlt = this.firstCard.querySelector('.front-face').alt || this.firstCard.querySelector('.front-face').getAttribute('cardID');
    const secondCardAlt = this.secondCard.querySelector('.front-face').getAttribute('cardID') || this.secondCard.querySelector('.front-face').alt;
    // 檢查是否匹配
    let isMatch = firstCardAlt === secondCardAlt || secondCardAlt === firstCardAlt;
    isMatch ? this.disableCards() : this.unflipCards();
  }

  disableCards() {
    // 匹配成功後移除點擊事件
    this.firstCard.closest('.show').classList = "hide";
    this.secondCard.closest('.show').classList = "hide";
    // 檢查是否完成遊戲
    this.mathedCard += 2;
    if (this.mathedCard === this.cardNum) {
      console.log('完成遊戲');
      setTimeout(() => {
        this.end.addEventListener('click', this.resetGame);
        const hide = document.querySelectorAll('.hide');
        hide.forEach(card => card.classList = 'none');
        this.end.innerHTML = "已通關 Finish";
        this.end.classList = "text"
      }, 500);
    } else {
      this.resetBoard();
    }
  }

  unflipCards() {
    // 鎖定遊戲版面
    this.lockBoard = true;
    // 非匹配卡片翻回去
    setTimeout(() => {
      this.firstCard.classList.remove('flip');
      this.secondCard.classList.remove('flip');
      this.resetBoard();
    }, 500);
  }

  resetCard() {
    // 卡片重置
    this.end.classList = "none"
    const hide = document.querySelectorAll('.hide');
    hide.forEach(card => card.classList = 'none');
    const show = document.querySelectorAll('.show');
    show.forEach(card => card.classList = 'none');
    const flip = document.querySelectorAll('.memory-card.flip');
    flip.forEach(card => card.classList = 'memory-card');
    setTimeout(() => {
      for (let i = 0; i < this.cardNum; i++) {
        document.querySelector(".none").classList = "show";
      }
    }, 100);
    setTimeout(() => {
      this.shuffle();
    }, 100);
  };

  difficultyChoose(event) {
    if (this.gamemode === 0) { this.resetEndlook.classList = "ts-wrap is-center-aligned"; }
    // 難易度選擇
    const modes = {
      easy: {
        id: 'Easy 簡單',
        class: 'memory-game-easy',
        cardNum: 6,
        message: {
          '記憶力翻牌小遊戲': '切換為簡單模式。Switch to Easy Mode.',
        }
      },
      normal: {
        id: 'Normal 普通',
        class: 'memory-game-normal',
        cardNum: 12,
        message: {
          '記憶力翻牌小遊戲': '切換為普通模式。Switch to Normal Mode.',

        }
      },
      hard: {
        id: 'Hard 困難',
        class: 'memory-game-hard',
        cardNum: 16,
        message: {
          '記憶力翻牌小遊戲': '切換為困難模式。Switch to Hard Mode.',
        }
      }
    };

    //原本const mode = modes[this.id]無法正常獲取 DOM 元素的 id
    //因為 this 指的是 class 實例，而不是事件觸發的 DOM 元素。
    const currentTarget = event.currentTarget; //currentTarget 為當前事件觸發的 DOM 元素
    const eventid = currentTarget.id;
    const mode = modes[eventid];
    if (mode) {
      if (this.gamemode !== mode.cardNum) {
        this.gamemode = mode.cardNum;
        document.querySelector("#difficulty").classList = mode.class;
        this.cardNum = mode.cardNum;
        this.mathedCard = 0;
        this.resetCard();
        if (mode.message['記憶力翻牌小遊戲']) {//判斷message句子是否存在
          alert(mode.message['記憶力翻牌小遊戲']);//輸出為message後面那句
        }
      } else {
        alert("已經是" + mode.id + "模式了。");
      }
    }
  };

  lookCard() {
    // 鎖定遊戲版面
    this.lockBoard = true;
    this.hasFlippedCard = false;
    this.flip.forEach(card => card.removeEventListener('click', this.flipCard));
    // 重置第一次點擊
    const lookCardback = document.querySelectorAll(".memory-card");
    this.firstCard = null;
    // 偷看
    lookCardback.forEach(card => card.classList.add('flip'));
    setTimeout(() => {
      const lookCardback = document.querySelectorAll(".memory-card");
      lookCardback.forEach(card => card.classList.remove('flip'));
    }, 1200);
    // 偷看結束
    setTimeout(() => { this.lockBoard = false; }, 800);
    setTimeout(() => {
      this.flip.forEach(card => card.addEventListener('click', this.flipCard));
    }, 1200);
  };

  resetGame() {
    // 重置遊戲

    if (this.mathedCard === this.cardNum) {
      this.end.removeEventListener('click', this.resetGame);
      alert("重置遊戲。Game reset");
    }
    this.mathedCard = 0;
    this.resetCard();
    this.shuffle();
  }

  resetBoard() {
    // 重置遊戲變數
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  shuffle() {
    // 卡片
    const cards = document.querySelectorAll('.show');
    // 洗牌
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * this.cardNum);
      card.style.order = randomPos;
    });
  }


};
export default MemoryCardGame;