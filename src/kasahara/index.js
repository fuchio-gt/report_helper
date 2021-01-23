import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as fetch from 'node-fetch';
import * as fs from 'fs';
import labelmake from "labelmake";
// const fetch = require('node-fetch');
// const fs = require('fs');

/**
 * pdfを1枚にくっつけるやつ
 */
const mergePages = async () => {
    const url1 = 'sample/sample1.pdf';
    const url2 = 'sample/sample2.pdf';
    // Load cover and content pdfs
    const cover = await PDFDocument.load(fs.readFileSync(url1));
    const content = await PDFDocument.load(fs.readFileSync(url2));

    // Create a new document
    const doc = await PDFDocument.create();

    // Add the cover to the new doc
    const [coverPage] = await doc.copyPages(cover, [0]);
    doc.addPage(coverPage);

    // Add individual content pages
    const contentPages = await doc.copyPages(content, content.getPageIndices());
    for (const page of contentPages) {
        doc.addPage(page);
    }

    // Write the PDF to a file
    fs.writeFileSync('./test.pdf', await doc.save());
}

/**
 * 文章からpdf作るやつ
 */
const makePdf = async (title, name, body) => {
    const GenShinGothic = fs.readFileSync("./GenShinGothic-Medium.ttf");
    const font = { GenShinGothic };
    const template = {
        "basePdf": { width: 210, height: 297 },
        fontName: "GenShinGothic",
        "schemas": [
            {
                "field1": {
                    "type": "text",
                    "position": {
                        "x": 20,
                        "y": 20
                    },
                    "width": 169.85,
                    "height": 15,
                    "alignment": "center",
                    "fontSize": 20,
                    "characterSpacing": 0,
                    "lineHeight": 1
                },
                "field2": {
                    "type": "text",
                    "position": {
                        "x": 20,
                        "y": 35
                    },
                    "width": 170.11,
                    "height": 9.04,
                    "alignment": "right",
                    "fontSize": 12,
                    "characterSpacing": 0,
                    "lineHeight": 1
                },
                "field3": {
                    "type": "text",
                    "position": {
                        "x": 20.11,
                        "y": 45.77
                    },
                    "width": 169.67,
                    "height": 235.59,
                    "alignment": "left",
                    "fontSize": 12,
                    "characterSpacing": 0,
                    "lineHeight": 1.4
                }
            }
        ]
    };
    const inputs = [{ field1: title, field2: name, field3: body }];
    const pdf = await labelmake({ template, inputs, font });
    // ファイルとして出力
    fs.writeFileSync('pdf-lib.pdf', pdf);
}

// mergePages();
makePdf('統計科学第1回レポート', '2018101笠原有真', '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）')