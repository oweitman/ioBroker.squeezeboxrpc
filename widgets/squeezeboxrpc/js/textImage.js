'use strict';
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

/**
 * Searches for the first occurrence of a given regular expression in the
 * string from the given start position. If the regex is not found, returns -1.
 *
 * @param regex The regular expression to search for
 * @param [startpos] The position to start the search from
 * @returns The position of the first match or -1 if not found
 */
String.prototype.regexIndexOf = function (regex, startpos) {
    const indexOf = this.substring(startpos || 0).search(regex);
    return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};

/**
 * Wordwrap a given string, with options to wrap camel case words and set
 * the width of the output.
 *
 * @param str - The string to wordwrap
 * @param width - The width of the output
 * @param [opt] - Options object
 * @param [opt.wrapCamelCase] - Whether to wrap camel case words
 * @returns The wordwrapped string
 */
function wordwrap(str, width, opt) {
    opt = opt || {};
    const splitChars = [' ', '-', '\t'];
    if (opt.wrapCamelCase) {
        str = str.replace(/([a-z])([A-Z])/gm, '$1 $2');
    }
    const words = explode(str, splitChars);
    let curLineLength = 0;
    let strBuilder = '';
    for (let i = 0; i < words.length; i += 1) {
        let word = words[i];
        if (curLineLength + word.length > width) {
            if (curLineLength > 0) {
                strBuilder += '\n';
                curLineLength = 0;
            }
            while (word.Length > width) {
                strBuilder += `${word.substring(0, width - 1)}-`;
                word = word.substring(width - 1);
                strBuilder += '\n';
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

/**
 * Split a string into parts where each part is either a word or a whitespace/dash character.
 * If a whitespace/dash character occurs between two words, it is put into its own part.
 * If a whitespace/dash character occurs at the end of a word, it is put into the same part as the word.
 *
 * @param str The string to split.
 * @returns An array of string parts.
 */
function explode(str) {
    const parts = [];
    let startIndex = 0;

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

/**
 * Calculates the height metrics of the text using the specified font.
 *
 * This function creates a temporary DOM structure to measure the ascent,
 * descent, and total height of the text "Hg" rendered with the given font.
 *
 * @param font - An object representing the font, which provides a method
 *                      to get the font string.
 * @returns An object containing the ascent, descent, and total height
 *                   of the text, with properties:
 *                   - ascent: The distance from the baseline to the top of the text.
 *                   - descent: The distance from the baseline to the bottom of the text.
 *                   - height: The total height of the text.
 */
const getTextHeight = function (font) {
    const text = $('<span>Hg</span>').css({ font: font.getfont() });
    const block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

    const div = $('<div></div>');
    div.append(text, block);

    const body = $('body');
    body.append(div);
    const result = {};
    try {
        block.css({ verticalAlign: 'baseline' });
        result.ascent = block.offset().top - text.offset().top;

        block.css({ verticalAlign: 'bottom' });
        result.height = block.offset().top - text.offset().top;

        result.descent = result.height - result.ascent;
    } finally {
        div.remove();
    }
    return result;
};
/**
 * @param text - The text to measure.
 * @param font - The font to use when measuring the text.
 * @returns The width of the text.
 */
export function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font.getfont();
    const metrics = context.measureText(text);
    return metrics.width;
}

export class Font {
    /**
     * Creates a Font object for the given element.
     *
     * @param elem the element to get the font string from
     */
    constructor(elem) {
        this.span = document.createElement('span');
        const fontstr = this.getFontString(elem[0]);
        this.span.style.font = fontstr;
        this.measure = getTextHeight(this);
        this.measure.width = getTextWidth('M', this);
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
    /**
     * Returns the current font string for the font.
     *
     * @returns The current font string.
     */
    getfont() {
        return this.span.style.font;
    }
    /**
     * Set the font string for the font.
     *
     * @param fontstr the new font string
     * @returns The Font object, to allow chaining.
     */
    setfont(fontstr) {
        this.span.style.font = fontstr;
        return this;
    }
    /**
     * Increase the font size of the font by one pixel.
     *
     * @returns The Font object, to allow chaining.
     */
    incFontSize() {
        this.span.style.fontSize = `${parseInt(this.span.style.fontSize) + 1}px`;
        return this;
    }
    /**
     * Decrease the font size of the font by one pixel.
     *
     * @returns The Font object, to allow chaining.
     */
    decFontSize() {
        this.span.style.fontSize = `${parseInt(this.span.style.fontSize) - 1}px`;
        return this;
    }
    /**
     * Given an element, returns the CSS font string for that element.
     *
     * @param elem - The element to get the font string for.
     * @returns The CSS font string, or 'normal 12px sans-serif' if no font style is set.
     */
    getFontString(elem) {
        const style = window.getComputedStyle(elem);
        let elementFont = style.getPropertyValue('font');

        if (elementFont) {
            return elementFont;
        }

        const fontStyle = style.getPropertyValue('font-style');
        const fontVariant = style.getPropertyValue('font-variant');
        const fontWeight = style.getPropertyValue('font-weight');
        const fontSize = style.getPropertyValue('font-size');
        const fontFamily = style.getPropertyValue('font-family');

        elementFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`.replace(/ +/g, ' ').trim();
        return elementFont ? elementFont : 'normal 12px sans-serif';
    }
}
/**
 * Adjusts the font size to ensure that the given lines of text fit within the specified width.
 *
 * @param lines - An array of strings, each representing a line of text.
 * @param picWidth - The maximum width in pixels that the text should occupy.
 * @param font - An object representing the font, which has methods to increase and decrease font size.
 * @returns The adjusted font object with a size that fits the lines within the specified width.
 */
function getGoodFontSize(lines, picWidth, font) {
    while (true) {
        const maxWidth = getMaxPixelWidth(lines, font);
        if (maxWidth > picWidth) {
            font.decFontSize();
        } else {
            return font;
        }
    }
}
/**
 * Create a canvas with the given lines, using the given font and dimensions,
 * but using a font size which will fit the text into the canvas.
 *
 * @param lines the lines of text to be rendered
 * @param font the font to use, or a string describing it
 * @param picWidth the width of the canvas
 * @param picHeight the height of the canvas
 * @param lineHeight the line height of the text
 * @param [opt] options, as follows:
 * @param [opt.style] css style to use for the canvas
 * @param [opt.style.direction] direction of text, either 'ltr' or 'rtl'
 * @param [opt.style.textAlign] text alignment, either 'start', 'end', 'left', 'right', or 'center'
 * @param [opt.style.color] color of the text
 * @param [opt.style.backgroundcolor] background color of the canvas
 * @returns the canvas element
 */
function createCanvas(lines, font, picWidth, picHeight, lineHeight, opt) {
    opt = opt || {};
    const canvas = document.createElement('canvas');
    $('body').append(canvas);
    canvas.width = picWidth;
    canvas.height = picHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = opt.style ? opt.backgroundcolor : 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font.getfont();
    ctx.fillStyle = opt.style ? opt.style.color : 'white';
    ctx.textAlign = opt.style ? opt.style.textAlign : 'center';
    let x = 0;
    if (opt.style) {
        if (opt.style.direction == 'ltr') {
            if (opt.style.textAlign == 'start' || opt.style.textAlign == 'left') {
                x = 0;
            }
            if (opt.style.textAlign == 'end' || opt.style.textAlign == 'right') {
                x = picWidth;
            }
            if (opt.style.textAlign == 'center') {
                x = picWidth / 2;
            }
        }
        if (opt.style.direction == 'rtl') {
            if (opt.style.textAlign == 'end' || opt.style.textAlign == 'left') {
                x = 0;
            }
            if (opt.style.textAlign == 'start' || opt.style.textAlign == 'right') {
                x = picWidth;
            }
            if (opt.style.textAlign == 'center') {
                x = picWidth / 2;
            }
        }
    } else {
        x = picWidth / 2;
    }
    const y = font.getDescent() + Math.floor((picHeight - lines.length * lineHeight) / 2);
    ctx.textBaseline = 'top';
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
    }
    return canvas;
}
/**
 * Return the maximum number of characters in any line of the given array of
 * strings.
 *
 * @param lines an array of strings, each a line of text.
 * @returns the maximum number of characters in any line.
 */
function getMaxChars(lines) {
    return lines.reduce(
        function (acc, cur) {
            return Math.max(acc, cur.length);
        }.bind(this),
        0,
    );
}
/**
 * Return the maximum width in pixels of the given lines of text, using the
 * given font. The width is calculated by summing the widths of each line of
 * text.
 *
 * @param lines an array of strings, each a line of text.
 * @param font the font to use, or a string describing it.
 */
function getMaxPixelWidth(lines, font) {
    return lines.reduce(
        function (acc, cur) {
            return Math.max(acc, getTextWidth(cur.trim(), font));
        }.bind(this),
        0,
    );
}

/**
 * Create a canvas with the given text, using the given font and dimensions,
 * but using a font size which will fit the text into the canvas.
 *
 * @param text the text to be rendered
 * @param font the font to use, or a string describing it
 * @param picWidth the width of the canvas
 * @param picHeight the height of the canvas
 * @param [opt] options, as follows:
 * @param [opt.style] css style to use for the canvas
 * @param [opt.style.direction] direction of text, either 'ltr' or 'rtl'
 * @param [opt.style.textAlign] text alignment, either 'start', 'end', 'left', 'right', or 'center'
 * @param [opt.style.color] color of the text
 * @param [opt.style.backgroundcolor] background color of the canvas
 * @param [opt.wrapCamelCase] whether to wrap camel case words
 * @returns the canvas element
 */
export function createTextImage(text, font, picWidth, picHeight, opt) {
    opt = opt || {};
    font = typeof font == 'string' ? new Font(font) : font;
    const lineHeight = font.getHeight(); //getTextHeight(font).height;
    const charWidth = font.getWidth(); //getTextWidth("M", font);
    const maxChars = picWidth / charWidth;
    let maxLines = picHeight / lineHeight - 1;
    maxLines = maxLines < 0 ? 1 : maxLines;
    let lines;
    if (picHeight >= picWidth) {
        for (
            let textWidth = 1;
            (lines = wordwrap(text, textWidth, opt).split('\n')) && maxLines + 1 < lines.length;
            textWidth++
        ) {
            //count textWidth
        }
    } else {
        for (
            let textWidth = 1;
            (lines = wordwrap(text, textWidth, opt).split('\n')) && getMaxChars(lines) < maxChars && lines.length > 1;
            textWidth++
        ) {
            /* empty */
        }
    }
    const goodFont = getGoodFontSize(lines, picWidth, font);
    return createCanvas(lines, goodFont, picWidth, picHeight, lineHeight, opt);
}
