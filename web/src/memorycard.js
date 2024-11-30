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
    // this.initJQueryPlugin();
  }
  // $(document).ready(function() {
  //   $.fn.jqmultilang = function (l) {
  //     $(this).html($(this).data("lang-" + l));
  //   };
  // });
  // 初始化 jQuery 插件

  // initJQueryPlugin() {
  //   $.fn.jqmultilang = function (lang) {
  //     $(this).html($(this).data("lang-" + lang));
  //   };
  // }
  // // 引入語系切換
  // English_Locale() {
  //   document.title = "Memory Card Game";
  //   for (let i = 0; i < 8; i++) {
  //     $('#LocaleReq' + String(i)).jqmultilang('en');
  //   }
  //   if (this.mathedCard === this.cardNum) {
  //     this.end.innerHTML = "Finish";
  //   }
  // };
  // Chinese_Locale() {
  //   document.title = "記憶力翻牌小遊戲";
  //   for (let i = 0; i < 8; i++) {
  //     $('#LocaleReq' + String(i)).jqmultilang('zh-tw');
  //   }
  //   if (this.mathedCard === this.cardNum) {
  //     this.end.innerHTML = "已過關";
  //   }
  // };
  // Japanese_Locale() {
  //   document.title = "メモリカードゲーム";
  //   for (let i = 0; i < 8; i++) {
  //     $('#LocaleReq' + String(i)).jqmultilang('ja');
  //   }
  //   if (this.mathedCard === this.cardNum) {
  //     this.end.innerHTML = "ゲームクリア";
  //   }
  // };


  //  // 為每張卡片添加點擊事件
  //  flip.forEach(card => card.addEventListener('click', flipCard));
  //  // 難易度的點擊事件
  //  easy.addEventListener('click', difficultyChoose);
  //  normal.addEventListener('click', difficultyChoose);
  //  hard.addEventListener('click', difficultyChoose);
  //  // 重置的點擊事件
  //  reset.addEventListener('click', resetGame);
  //  // 偷看的點擊事件
  //  look.addEventListener('click', lookCard);
  initEvents() {
    // 為每張卡片添加點擊事件
    this.flip.forEach(card => card.addEventListener('click', this.flipCard));
    // 為難易度按鈕添加點擊事件
    this.easy.addEventListener('click', this.difficultyChoose);
    this.normal.addEventListener('click', this.difficultyChoose);
    this.hard.addEventListener('click', this.difficultyChoose);
    // 為重置和偷看按鈕添加點擊事件
    this.reset.addEventListener('click', this.resetGame);
    this.look.addEventListener('click', this.lookCard);
  }
  flipCard() {
    // 翻牌
    if (this.lockBoard) return;
    if (this === this.firstCard) return;
    this.classList.add('flip');
    if (!this.hasFlippedCard) {
      // 第一次點擊
      this.hasFlippedCard = true;
      this.firstCard = this;
      return;
    }
    // 第二次點擊
    this.secondCard = this;
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
      setTimeout(() => {
        this.end.addEventListener('click', this.resetGame);
        const hide = document.querySelectorAll('.hide');
        hide.forEach(card => card.classList = 'none');
        if (document.title == "記憶力翻牌小遊戲") {
          this.end.innerHTML = "已通關";
        }
        else if (document.title == "Memory Card Game") {
          this.end.innerHTML = "Finish";
        }
        else if (document.title == "メモリカードゲーム") {
          this.end.innerHTML = "ゲームクリア";
        }
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
      resetBoard();
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

  difficultyChoose() {
    if (this.gamemode === 0) { this.resetEndlook.classList = "ts-wrap is-center-aligned"; }
    // 難易度選擇
    const modes = {
      easy: {
        id: 'easy',
        class: 'memory-game-easy',
        cardNum: 9,
        message: {
          '記憶力翻牌小遊戲': '切換為簡單模式。',
          'Memory Card Game': 'Switch to Easy Mode.',
          'メモリカードゲーム': '簡単モードに切り替え。'
        }
      },
      normal: {
        id: 'normal',
        class: 'memory-game-normal',
        cardNum: 12,
        message: {
          '記憶力翻牌小遊戲': '切換為普通模式。',
          'Memory Card Game': 'Switch to Normal Mode.',
          'メモリカードゲーム': '普通モードに切り替え。'
        }
      },
      hard: {
        id: 'hard',
        class: 'memory-game-hard',
        cardNum: 16,
        message: {
          '記憶力翻牌小遊戲': '切換為困難模式。',
          'Memory Card Game': 'Switch to Hard Mode.',
          'メモリカードゲーム': '困難モードに切り替え。'
        }
      }
    };

    const mode = modes[this.id];
    if (mode) {
      if (this.gamemode !== mode.cardNum) {
        this.gamemode = mode.cardNum;
        document.querySelector("#difficulty").classList = mode.class;
        this.cardNum = mode.cardNum;
        this.mathedCard = 0;
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
    if (document.title == "記憶力翻牌小遊戲") {
      alert("重置遊戲。");
    }
    else if (document.title == "Memory Card Game") {
      alert("Game reset.");
    }
    else if (document.title == "メモリカードゲーム") {
      alert("ゲームリセット。");
    }
    if (this.mathedCard === this.cardNum) { this.end.removeEventListener('click', this.resetGame) }
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
      let randomPos = Math.floor(Math.random() * cardNum);
      card.style.order = randomPos;
    });
  }


};
export default MemoryCardGame;