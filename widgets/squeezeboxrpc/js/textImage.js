    "use strict";
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

    String.prototype.regexIndexOf = function(regex, startpos) {
        var indexOf = this.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }

    function wordwrap(str,width,opt) {
        
        var opt = opt || {};
        var splitChars = [' ','-','\t'];
        if (opt.wrapCamelCase) str = str.replace(/([a-z])([A-Z])/gm, '$1 $2');
        var words = explode(str,splitChars);
        var curLineLength=0;
        var strBuilder ="";
        for (var i=0;i<words.length;i+=1) {
            var word = words[i];
            if (curLineLength + word.length > width ) {
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

    function explode(str, splitChars) {
        var parts = [];
        var startIndex = 0;
        while (true) {
            var index = str.regexIndexOf(/[ |\t|-]/gm,startIndex);
            if (index == -1) {
                parts.push(str.substring(startIndex));
                return parts;
            }        
            var word = str.substring(startIndex, startIndex+index - startIndex);
            var nextChar = str.substring(index, index+1)[0];
            
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

    var getTextHeight = function(font) {

      var text = $('<span>Hg</span>').css({ font: font.getfont() });
      var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

      var div = $('<div></div>');
      div.append(text, block);

      var body = $('body');
      body.append(div);

      try {

        var result = {};

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
    function getTextWidth(text, font) {
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font.getfont();
        var metrics = context.measureText(text);
        return metrics.width;
    }

    function getMaxPixelWidth(lines, font) {
        return lines.reduce(function(acc,cur){
            return Math.max(acc,getTextWidth(cur.trim(),font));
        }.bind(this),0);
    }

    class Font {
        constructor(elem) {
            this.span = document.createElement("span");
            let fontstr = this.getFontString(elem[0]);
            this.span.style.font = fontstr;
            this.measure = getTextHeight(this);
            this.measure.width =  getTextWidth("M", this);
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
            this.span.style.fontSize = parseInt(this.span.style.fontSize)+ 1 + "px"
            return this;
        }
        decFontSize() {
            this.span.style.fontSize = parseInt(this.span.style.fontSize)- 1 + "px"
            return this;
        }
        getFontString(elem) {
            let style = window.getComputedStyle(elem);
            let elementFont = style.getPropertyValue('font');

            if (elementFont)
               return elementFont;
            else {
              const fontStyle = style.getPropertyValue('font-style');
              const fontVariant = style.getPropertyValue('font-variant');
              const fontWeight = style.getPropertyValue('font-weight');
              const fontSize = style.getPropertyValue('font-size');
              const fontFamily = style.getPropertyValue('font-family');

              elementFont = (fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily).replace(/ +/g, ' ').trim();
              return elementFont;                
            }
            return elementFont ? elementFont : 'normal 12px sans-serif';        
        }
    }
    function getGoodFontSize(lines, picWidth, font) {
        while (true) {
            var maxWidth = getMaxPixelWidth(lines,font);
            if (maxWidth > picWidth) {
                font.decFontSize();
            } else {
                return font;
            }
        }
    }
    function createCanvas(lines,font,picWidth, picHeight, lineHeight,opt) {
        var opt = opt || {};
        var canvas = document.createElement("canvas");
        $('body').append(canvas);
        canvas.width = picWidth;
        canvas.height = picHeight;        
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = (opt.style) ? opt.backgroundcolor: "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = font.getfont();
        ctx.fillStyle = (opt.style) ? opt.style.color : "white";
        ctx.textAlign = (opt.style) ? opt.style.textAlign : "center";
        var x=0;
        if (opt.style) {
            if (opt.style.direction == 'ltr') {
                if (opt.style.textAlign=='start' || opt.style.textAlign=='left') {
                    x=0;
                }
                if (opt.style.textAlign=='end'  || opt.style.textAlign=='right') {
                    x=picWidth;
                }
                if (opt.style.textAlign=='center') {
                    x=picWidth/2;
                }
            }
            if (opt.style.direction == 'rtl') {
                if (opt.style.textAlign=='end' || opt.style.textAlign=='left') {
                    x=0;
                }
                if (opt.style.textAlign=='start'  || opt.style.textAlign=='right') {
                    x=picWidth;
                }
                if (opt.style.textAlign=='center') {
                    x=picWidth/2;
                }
            }
        } else {
            x=picWidth/2;
        }
        var y = font.getDescent()+Math.floor((picHeight-(lines.length*lineHeight))/2);
        ctx.textBaseline = 'top';
        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineHeight) );
        return canvas;        
    }
    function getMaxChars(lines) {
        return lines.reduce(function(acc,cur){
            return Math.max(acc,cur.length);
        }.bind(this),0);
    }    
    function getMaxPixelWidth(lines, font) {
        return lines.reduce(function(acc,cur){
            return Math.max(acc,getTextWidth(cur.trim(),font));
        }.bind(this),0);
    }
    function createTextImage(text, font, picWidth, picHeight,opt) {
        var opt = opt || {};
        var font = typeof(font) == 'string' ? new Font(font) : font;
        var lineHeight = font.getHeight(); //getTextHeight(font).height;
        var charWidth = font.getWidth(); //getTextWidth("M", font);
        var maxChars = picWidth / charWidth;
        var maxLines = (picHeight / lineHeight)-1;
        maxLines = (maxLines < 0) ? 1 : maxLines;
        var lines;
        if (picHeight >=picWidth) {
            for (var textWidth=1;(lines=wordwrap(text,textWidth,opt).split("\n")) && maxLines+1 < lines.length;textWidth++){}
        } else {
            for (var textWidth=1;(lines=wordwrap(text,textWidth,opt).split("\n")) && getMaxChars(lines) < maxChars && lines.length>1;textWidth++){}        
        }
        var goodFont = getGoodFontSize(lines,picWidth,font);        
        return createCanvas(lines,goodFont,picWidth, picHeight, lineHeight,opt);
    }
