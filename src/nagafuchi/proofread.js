require('dotenv').config();
const TextLintEngine = require('textlint').TextLintEngine;
const bodyParser = require('body-parser');
const express = require('express');
const line = require('@line/bot-sdk');
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

const handleEvent = async (event) => {
    const req_text = event.message.text;
    const lengthArray = countWords(req_text);
    const engine = new TextLintEngine();
    const reply = await engine.executeOnText(req_text);
    const messageArray =  reply[0].messages.map(v => `${v.line}行目に、${v.message}。`) ;

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
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

app.listen(PORT);
console.log(`Server running at ${PORT}`);