const fs = require('node:fs');
const path = require('path');

const langTemplate = {
    en: {},
    de: {},
    ru: {},
    pt: {},
    nl: {},
    fr: {},
    it: {},
    es: {},
    pl: {},
    uk: {},
    'zh-cn': {},
};
let i18npath = '../src/i18n';
let format = 'multi';
function importi18nKeys() {
    // importiere alle json dateien, die in einem bestimmten verzeichnis liegen
    const i18n = {};
    const dir = path.resolve(__dirname, '../', i18npath);

    if (format === 'multi') {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = `${dir}/${file}`;
            if (fs.statSync(filePath).isFile() && filePath.endsWith('.json')) {
                i18n[file.replace('.json', '')] = require(filePath);
            }
        }
    }
    if (format === 'single') {
        const filePath = path.resolve(__dirname, '../', i18npath);
        i18n['en'] = require(filePath);
    }
    return i18n;
}
function exporti18nKeysMultiFile(i18n) {
    const dir = path.resolve(__dirname, i18npath);
    for (const lang in i18n) {
        const json = JSON.stringify(i18n[lang], null, 4);
        const filePath = `${dir}/${lang}.json`;
        fs.writeFileSync(filePath, json);
    }
}
function exporti18nKeysSingleFile(i18n) {
    const source = i18n.en;
    const target = {};
    // schleife über source und erstelle ein neues objekt miteiner liste von objekten, die nach dem key benannt werden, welches wiederum als property jede einzelne sprache mit der jeweiligen übersetzung enthäl
    for (const key in source) {
        target[key] = {};
        for (const lang in i18n) {
            target[key][lang] = i18n[lang][key];
        }
    }
    const pathObject = path.parse(i18npath);
    pathObject.base = 'translations.json';
    const newPath = path.format(pathObject);
    const filePath = path.resolve(__dirname, '../', newPath);
    const json = JSON.stringify(target, null, 4);
    fs.writeFileSync(filePath, json);
}
function exporti18nKeys(i18n) {
    let tempI18n;
    if (!format) {
        format = 'multi';
    }
    if (format === 'multi') {
        tempI18n = exporti18nKeysMultiFile(i18n);
    }
    if (format === 'single') {
        tempI18n = exporti18nKeysSingleFile(i18n);
    }
    return tempI18n;
}
function extendLanguages(i18n) {
    return { ...langTemplate, ...i18n };
}
function createObjectFromKeys(keyNames) {
    const obj = {};
    keyNames.forEach(key => {
        if (key !== '') {
            obj[key] = '';
        }
    });
    return obj;
}
function extendLanguageKeysFromLang(i18n, lang) {
    const obj = createObjectFromKeys(Object.keys(i18n[lang]));
    for (const key in i18n) {
        i18n[key] = { ...obj, ...i18n[key] };
    }
    return i18n;
}
function isKeyEmptyInAnyLanguage(i18n, key) {
    if (key === '') {
        return false;
    }
    for (const lang in i18n) {
        if (i18n[lang][key] === '') {
            console.log(`Key ${key} is empty in ${lang}`);
            return true;
        }
    }
    return false;
}
async function fetchTranslations(word) {
    console.log(`translate ${word}`);
    const response = await fetch('https://oz7q7o4tl3.execute-api.eu-west-1.amazonaws.com/', {
        headers: {
            Referer: 'https://translator-ui.iobroker.in/',
        },
        body: JSON.stringify({ text: word, service: 'deepl', together: false }),
        method: 'POST',
    });
    const data = await response.json();
    return data;
}
async function updateEmptyKeysWithTranslation(i18n, lang) {
    for (const key in i18n[lang]) {
        if (isKeyEmptyInAnyLanguage(i18n, key)) {
            const translatedKey = await fetchTranslations(i18n[lang][key]);
            for (const k in translatedKey) {
                if (i18n[k][key] === '') {
                    i18n[k][key] = translatedKey[k];
                }
            }
        }
    }
    return i18n;
}
function deleteKeys(i18n, keys) {
    keys.forEach(key => {
        for (const lang in i18n) {
            if (lang === 'en') {
                continue;
            }
            if (i18n[lang][key] !== undefined) {
                delete i18n[lang][key];
            }
        }
    });
    return i18n;
}
function doDeleteKeys(args) {
    console.log('start delete keys');
    if (args.length > 1) {
        args[0] = args.join(',');
    }
    if (args.length > 0) {
        let keys = args[0].split(',');
        keys = keys.map(k => k.trim());
        let i18n = importi18nKeys();
        i18n = deleteKeys(i18n, keys);
        exporti18nKeys(i18n);
    }
    console.log('end delete keys');
}
function emptyKeys(i18n, keys) {
    keys.forEach(key => {
        for (const lang in i18n) {
            if (lang === 'en') {
                continue;
            }
            if (i18n[lang][key] !== undefined) {
                i18n[lang][key] = '';
            }
        }
    });
    return i18n;
}
function doEmptyKeys(args) {
    console.log('start empty keys');
    if (args.length > 1) {
        args[0] = args.join(',');
    }
    if (args.length > 0) {
        let keys = args[0].split(',');
        keys = keys.map(k => k.trim());
        let i18n = importi18nKeys();
        i18n = emptyKeys(i18n, keys);
        exporti18nKeys(i18n);
    }
    console.log('end empty keys');
}
function emptyLang(i18n, lang) {
    for (const key in i18n[lang]) {
        if (i18n[lang][key] !== undefined) {
            i18n[lang][key] = '';
        }
    }
    return i18n;
}
function doEmptyLang(args) {
    console.log('start empty lang');
    if (args.length !== 1) {
        console.log('Only one language is supported');
        return;
    }
    if (args.length > 0) {
        const lang = args[0].trim();
        if (lang === 'en') {
            console.log('empty of en not allowed');
            return;
        }
        let i18n = importi18nKeys();
        i18n = emptyLang(i18n, lang);
        exporti18nKeys(i18n);
    }
    console.log('end empty lang');
}
function doCleanKeys() {
    console.log('start clean keys');
    const i18n = importi18nKeys();
    let languages = Object.keys(i18n);
    languages = languages.filter(lang => lang !== 'en');
    for (const lang of languages) {
        for (const key in i18n[lang]) {
            if (i18n['en'][key] === undefined) {
                delete i18n[lang][key];
            }
        }
    }
    exporti18nKeys(i18n);
    console.log('end clean keys');
}
async function doTranslate() {
    console.log('start translate');
    let i18n = importi18nKeys();
    i18n = extendLanguages(i18n);
    i18n = extendLanguageKeysFromLang(i18n, 'en');
    i18n = await updateEmptyKeysWithTranslation(i18n, 'en');
    exporti18nKeys(i18n);
    console.log('end translate');
}
async function main() {
    let pos;
    const args = process.argv.slice(2);
    pos = args.indexOf('--source');
    if (pos >= 0) {
        i18npath = args[pos + 1];
        args.splice(pos, 2);
    }
    pos = args.indexOf('--format');
    if (pos >= 0) {
        format = args[pos + 1];
        args.splice(pos, 2);
    }

    if (args.length === 0) {
        doTranslate();
        return;
    }
    if (args[0] === 'deletekey') {
        args.shift();
        doDeleteKeys(args);
    }
    if (args[0] === 'emptykey') {
        args.shift();
        doEmptyKeys(args);
    }
    if (args[0] === 'emptylang') {
        args.shift();
        doEmptyLang(args);
    }
    if (args[0] === 'cleanKeys') {
        args.shift();
        doCleanKeys(args);
    }
}

main();
