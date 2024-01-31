const output = document.getElementById('output'); // 顯示語音辨識結果的元素
const start = document.getElementById('start');  // 啟動語音辨識的按鈕
const stop = document.getElementById('stop');  // 停止語音辨識的按鈕

const SpeechRecognition = window.webkitSpeechRecognition || window.
webkitSpeechRecognition;

const recognition =new SpeechRecognition();

recognition.lang='en';  // 設定識別語言為英語
// 配置識別設定
recognition.interimResults=false;
recognition.continuous=true;


start.addEventListener('click', () =>{
    recognition.start();
    console.log('recognition started');

});




recognition.onresult =(e) => {
output.textContent+=e.results[e.results.length-1][0].transcript;
console.log(e);
};