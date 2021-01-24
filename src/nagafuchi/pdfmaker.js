// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import * as fetch from 'node-fetch';
// import * as fs from 'fs';
// import labelmake from "labelmake";

const fs = require('fs');
const labelmake = require('labelmake');
const uuid = require('node-uuid');

/**
 * 文章からpdf作るやつ
 */
exports.makePdf = async (title, name, body) => {
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
    const output = uuid.v1()+'.pdf';
    fs.writeFileSync(output, pdf);
    return output;
}