const Countable = require('countable');
const TextLintEngine = require('textlint').TextLintEngine;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// postデータのjsonをパースする
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// localhost:3000を開ける
app.listen(3000, () => {
    console.log('Running at Port 3000...');
});

app.post('/api/textlint', (req, res, next) => {
    const req_text = req.body.text;
    const engine = new TextLintEngine();
    engine.executeOnText(req_text).then(results => {
        Countable.count(req_text, counter => res.json({
            detail: counter,
            messages: results[0].messages
        }));
    });
});

// その他のリクエストに対する404エラー
app.use((req, res) => {
    res.sendStatus(404);
});