require('dotenv').config();
const TextLintEngine = require('textlint').TextLintEngine;
const bodyParser = require('body-parser');
const express = require('express');
const line = require('@line/bot-sdk');
const pdfmaker = require('./pdfmaker');
const { PythonShell } = require('python-shell');


const PORT = 3000;
const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};
const app = express();

const countWords = (str) => {
    const words = str.split(/\s/).length;
    const fullLength = [...str].length;
    const noSpaceLength = [...str].filter(elem => elem.match(/^(?!\s)/)).length;
    return [words, fullLength, noSpaceLength];
}

// postデータのjsonをパースする
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

line.middleware(config);
app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);

const getContent = (messageId) => {
    return client.getMessageContent(messageId)
      .then((stream) => new Promise((resolve, reject) => {
        // const writable = fs.createWriteStream(downloadPath);
        // stream.pipe(writable);
        // stream.on('end', () => resolve(downloadPath));
        stream.on('data', chunk => resolve(new Buffer(chunk).toString('base64')));
        stream.on('error', reject);
    }));
}

const handleEvent = async (event) => {
    // if (event.type !== 'message' || event.message.type !== 'text') {
    if (event.type !== 'message') {
        // メッセージじゃなかったとき
        console.log(event)
        return Promise.resolve(null);
    }
    else if(event.message.type == 'image'){
        // 画像をPDFにする
        const content = await getContent(event.message.id);
        const pyshell = new PythonShell('warp.py');
        // base64エンコードしたデータを送る
        pyshell.send(content);
        pyshell.on('message', (path) => {
            console.log(path);
        });
    }
    else if(event.message.type == 'text' && event.message.text.split('\n')[0] == 'check'){
        // 文章校正
        const req_text = event.message.text;
        const lengthArray = countWords(req_text);
        const engine = new TextLintEngine();
        const reply = await engine.executeOnText(req_text);
        const errorMessages = {
            'ja-technical-writing/sentence-length': '一つの文が100文字を超えています',
            'ja-technical-writing/max-ten': '一つの文で"、"を3つ以上使用しています',
            'ja-technical-writing/no-nfd': '濁点がおかしくなっています',
            'ja-technical-writing/no-invalid-control-character': '不要な制御文字があります',
            'ja-technical-writing/no-exclamation-question-mark': '感嘆符があります',
        }
        const messageArray =  reply[0].messages.map(v => `${v.line}行目で、${(errorMessages[v.ruleId]) ? errorMessages[v.ruleId]:v.message}。`) ;
        console.log(reply[0].messages)
        return client.replyMessage(event.replyToken, [{
            type: 'text',
            text: `単語数：${lengthArray[0]}
文字数(空白あり)：${lengthArray[1]}
文字数(空白無し)：${lengthArray[2]}`,
        }, {
            type: 'text',
            text: (reply[0].messages.length==0) ? '見ればわかる。至高の領域に近い。':messageArray.join('\n')
        }])
    }
    else if (event.message.type == 'text' && event.message.text.split('\n')[0] == 'make') {
        // 送られたテキストをPDFにする
        // メッセージを改行で配列にする
        const message = event.message.text.split('\n');
        const title = message[1];
        const sign = message[2];
        // 3個目以降は本文
        const body = message.slice(3).join('\n');
        const pdfPath = await pdfmaker.makePdf(title, sign, body);
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: pdfPath})
    }else{
        // 何もコマンドが入力されてない場合
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `すばらしい提案をしよう。
お前もレポートを書かないか？
最初の行にmake/checkと書いてテキストを送信すると、PDFの作成/文章の校正ができる。
俺と永遠に執筆し続けよう！`
        })
    }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);