const { PythonShell } = require('python-shell');
const fs = require('fs');

const img2pdf = async (img_base64) => {
    const pyshell = new PythonShell('warp.py');
    // base64エンコードしたデータを送る
    pyshell.send(img_base64);
    pyshell.on('message', (path) => {
        console.log(path);
    });
}
fs.readFile('sample/sample.jpg', 'base64', (err, img_base64) => {
    if (err) throw err;
    img2pdf(img_base64);
});