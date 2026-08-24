import { useEffect, useRef } from 'react';

function splitCamelCase(text) {
    return text.replace(/([a-z\d])([A-Z])/g, '$1 $2');
}

export function wrapText(context, text, maxWidth, wrapCamelCase) {
    const source = wrapCamelCase ? splitCamelCase(text) : text;
    const words = source.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [''];
    const lines = [];
    let line = '';
    for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (!line || context.measureText(candidate).width <= maxWidth) line = candidate;
        else {
            lines.push(line);
            line = word;
        }
    }
    lines.push(line);
    return lines;
}

export function findTextLayout(context, text, width, height, fontFamily, fontWeight, wrapCamelCase) {
    const padding = 4;
    const availableWidth = Math.max(1, width - padding * 2);
    const availableHeight = Math.max(1, height - padding * 2);
    let best = { fontSize: 1, lineHeight: 1.2, lines: [text] };
    for (let fontSize = Math.max(1, Math.floor(availableHeight)); fontSize >= 1; fontSize--) {
        context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const lines = wrapText(context, text, availableWidth, wrapCamelCase);
        const lineHeight = fontSize * 1.2;
        const widestLine = Math.max(...lines.map(line => context.measureText(line).width));
        if (widestLine <= availableWidth && lines.length * lineHeight <= availableHeight) {
            best = { fontSize, lineHeight, lines };
            break;
        }
    }
    return best;
}

export default function TextImage({ text, width, height, backgroundColor, wrapCamelCase, style }) {
    const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null));
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(width * pixelRatio));
        canvas.height = Math.max(1, Math.round(height * pixelRatio));
        const context = canvas.getContext('2d');
        if (!context) return;
        context.scale(pixelRatio, pixelRatio);
        const computedStyle = window.getComputedStyle(canvas);
        const fontFamily = computedStyle.fontFamily || 'sans-serif';
        const fontWeight = computedStyle.fontWeight || 'normal';
        const layout = findTextLayout(context, text, width, height, fontFamily, fontWeight, wrapCamelCase);
        context.fillStyle = backgroundColor || '#000000';
        context.fillRect(0, 0, width, height);
        context.font = `${fontWeight} ${layout.fontSize}px ${fontFamily}`;
        context.fillStyle = computedStyle.color || '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const blockHeight = layout.lines.length * layout.lineHeight;
        layout.lines.forEach((line, index) => {
            context.fillText(line, width / 2, (height - blockHeight) / 2 + layout.lineHeight * (index + 0.5));
        });
    }, [backgroundColor, height, text, width, wrapCamelCase]);
    return <canvas ref={canvasRef} role="img" aria-label={text} style={{ ...style, display: 'block', width, height }} />;
}
