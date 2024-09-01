class Connect {

    constructor( url ){
        this.playerList = [];
        this.socket = new WebSocket( url );
        //當執行socket的open、close、message事件時，會觸發該方法
        this.socket.onopen = this.__handleSocketOpen.bind(this);
        this.socket.onclose = this.__handleSocketClose.bind(this);
        this.socket.onmessage = this.__handleWebSocketMessage.bind(this);
        //這是一空的方法負責接收到從伺服器傳來的訊息，然後做出相應的動作
        this.onJoin = () => {};
        this.onLeave = () => {};
        this.onMove = () => {};
        this.onMessage = () => {};
    }


    __handleSocketOpen () {
        this.socket.send(JSON.stringify({ context: 'userReady' }));
    }

    __handleSocketClose() {
        console.log('WebSocket 連接已經關閉');
    }

    // 這是一個接收到從伺服器傳來的訊息的方法
    // 它會先試圖將訊息轉換為 json 物件，然後根據訊息的 context 屬性，對應到不同的方法來處理訊息，
    __handleWebSocketMessage( res ) {
        try {
            const data = JSON.parse( res.data );
            const handler = {
                'move': this.onMove,
                'join': this.onJoin,
                'leave': this.onLeave,
                'message': this.onMessage
            }[ data.context ];
            if ( handler ) { handler(data);}
            else { console.error(`接收到從伺服器傳來的未知的 context: ${data.context}`); }

        } catch ( error ) {
            console.error(`伺服器傳來的訊息轉換失敗: ${ error }`);
        }
       
    }

}

export default Connect;