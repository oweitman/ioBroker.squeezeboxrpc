"use strict";
/* globals $,window,document */
/*
    var fontStyle = '12px "Courier New", monospace'
    var lineHeight = 15

    var picWidth = 50;
    var picHeight = 50;
    var test1 = "Squeeze Work";
    var test2 = "SqueezeWork";
    var test3 = "aaa- aaa - aaa     aaa aaa";
    $('body').append(createTextImage(test1,fontStyle,picWidth,picHeight));
    */

String.prototype.regexIndexOf = function (regex, startpos) {
    const indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

function wordwrap(str, width, opt) {

    opt = opt || {};
    const splitChars = [" ", "-", "\t"];
    if (opt.wrapCamelCase) str = str.replace(/([a-z])([A-Z])/gm, "$1 $2");
    const words = explode(str, splitChars);
    let curLineLength = 0;
    let strBuilder = "";
    for (let i = 0; i < words.length; i += 1) {
        let word = words[i];
        if (curLineLength + word.length > width) {
            if (curLineLength > 0) {
                strBuilder += "\n";
                curLineLength = 0;
            }
            while (word.Length > width) {
                strBuilder += word.substring(0, width - 1) + "-";
                word = word.substring(width - 1);
                strBuilder += "\n";
            }
            word = word.trimStart();
        }
        if (curLineLength == 0 && /^\s+$/.test(word)) {
            word = word.trimStart();
        }
        strBuilder += word;
        curLineLength += word.length;
    }
    return strBuilder;
}

function explode(str) {
    const parts = [];
    let startIndex = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const index = str.regexIndexOf(/[ |\t|-]/gm, startIndex);
        if (index == -1) {
            parts.push(str.substring(startIndex));
            return parts;
        }
        const word = str.substring(startIndex, startIndex + index - startIndex);
        const nextChar = str.substring(index, index + 1)[0];

        // Dashes and the likes should stick to the word occuring before it. Whitespace doesn't have to.
        if (/^\s+$/.test(nextChar)) {
            parts.push(word);
            parts.push(nextChar);
        } else {
            parts.push(word + nextChar);
        }
        startIndex = index + 1;
    }
}

const getTextHeight = function (font) {

    const text = $("<span>Hg</span>").css({ font: font.getfont() });
    const block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

    const div = $("<div></div>");
    div.append(text, block);

    const body = $("body");
    body.append(div);
    const result = {};
    try {

        block.css({ verticalAlign: "baseline" });
        result.ascent = block.offset().top - text.offset().top;

        block.css({ verticalAlign: "bottom" });
        result.height = block.offset().top - text.offset().top;

        result.descent = result.height - result.ascent;

    } finally {
        div.remove();
    }
    return result;
};
function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font.getfont();
    const metrics = context.measureText(text);
    return metrics.width;
}



class Font {
    constructor(elem) {
        this.span = document.createElement("span");
        const fontstr = this.getFontString(elem[0]);
        this.span.style.font = fontstr;
        this.measure = getTextHeight(this);
        this.measure.width = getTextWidth("M", this);
    }
    getAscent() {
        return this.measure.ascent;
    }
    getDescent() {
        return this.measure.descent;
    }
    getWidth() {
        return this.measure.width;
    }
    getHeight() {
        return this.measure.height;
    }
    getfont() {
        return this.span.style.font;
    }
    setfont(fontstr) {
        this.span.style.font = fontstr;
        return this;
    }
    incFontSize() {
        this.span.style.fontSize = parseInt(this.span.style.fontSize) + 1 + "px";
        return this;
    }
    decFontSize() {
        this.span.style.fontSize = parseInt(this.span.style.fontSize) - 1 + "px";
        return this;
    }
    getFontString(elem) {
        const style = window.getComputedStyle(elem);
        let elementFont = style.getPropertyValue("font");

        if (elementFont)
            return elementFont;
        else {
            const fontStyle = style.getPropertyValue("font-style");
            const fontVariant = style.getPropertyValue("font-variant");
            const fontWeight = style.getPropertyValue("font-weight");
            const fontSize = style.getPropertyValue("font-size");
            const fontFamily = style.getPropertyValue("font-family");

            elementFont = (fontStyle + " " + fontVariant + " " + fontWeight + " " + fontSize + " " + fontFamily).replace(/ +/g, " ").trim();
            return elementFont ? elementFont : "normal 12px sans-serif";
        }
    }
}
function getGoodFontSize(lines, picWidth, font) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const maxWidth = getMaxPixelWidth(lines, font);
        if (maxWidth > picWidth) {
            font.decFontSize();
        } else {
            return font;
        }
    }
}
function createCanvas(lines, font, picWidth, picHeight, lineHeight, opt) {
    opt = opt || {};
    const canvas = document.createElement("canvas");
    $("body").append(canvas);
    canvas.width = picWidth;
    canvas.height = picHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = (opt.style) ? opt.backgroundcolor : "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font.getfont();
    ctx.fillStyle = (opt.style) ? opt.style.color : "white";
    ctx.textAlign = (opt.style) ? opt.style.textAlign : "center";
    let x = 0;
    if (opt.style) {
        if (opt.style.direction == "ltr") {
            if (opt.style.textAlign == "start" || opt.style.textAlign == "left") {
                x = 0;
            }
            if (opt.style.textAlign == "end" || opt.style.textAlign == "right") {
                x = picWidth;
            }
            if (opt.style.textAlign == "center") {
                x = picWidth / 2;
            }
        }
        if (opt.style.direction == "rtl") {
            if (opt.style.textAlign == "end" || opt.style.textAlign == "left") {
                x = 0;
            }
            if (opt.style.textAlign == "start" || opt.style.textAlign == "right") {
                x = picWidth;
            }
            if (opt.style.textAlign == "center") {
                x = picWidth / 2;
            }
        }
    } else {
        x = picWidth / 2;
    }
    const y = font.getDescent() + Math.floor((picHeight - (lines.length * lineHeight)) / 2);
    ctx.textBaseline = "top";
    for (let i = 0; i < lines.length; i++)
        ctx.fillText(lines[i], x, y + (i * lineHeight));
    return canvas;
}
function getMaxChars(lines) {
    return lines.reduce(function (acc, cur) {
        return Math.max(acc, cur.length);
    }.bind(this), 0);
}
function getMaxPixelWidth(lines, font) {
    return lines.reduce(function (acc, cur) {
        return Math.max(acc, getTextWidth(cur.trim(), font));
    }.bind(this), 0);
}
// eslint-disable-next-line no-unused-vars
function createTextImage(text, font, picWidth, picHeight, opt) {
    opt = opt || {};
    font = typeof (font) == "string" ? new Font(font) : font;
    const lineHeight = font.getHeight(); //getTextHeight(font).height;
    const charWidth = font.getWidth(); //getTextWidth("M", font);
    const maxChars = picWidth / charWidth;
    let maxLines = (picHeight / lineHeight) - 1;
    maxLines = (maxLines < 0) ? 1 : maxLines;
    let lines;
    if (picHeight >= picWidth) {
        // eslint-disable-next-line no-empty
        for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && maxLines + 1 < lines.length; textWidth++) { }
    } else {
        for (let textWidth = 1; (lines = wordwrap(text, textWidth, opt).split("\n")) && getMaxChars(lines) < maxChars && lines.length > 1; textWidth++) { /* empty */ }
    }
    const goodFont = getGoodFontSize(lines, picWidth, font);
    return createCanvas(lines, goodFont, picWidth, picHeight, lineHeight, opt);
}
