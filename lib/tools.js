/* eslint-disable jsdoc/require-returns-description */
const axios = require('axios').defaults;

/**
 * Tests whether the given variable is a real object and not an Array
 *
 * @param it The variable to test
 * @returns
 */
function isObject(it) {
    // This is necessary because:
    // typeof null === 'object'
    // typeof [] === 'object'
    // [] instanceof Object === true
    return Object.prototype.toString.call(it) === '[object Object]';
}

/**
 * Tests whether the given variable is really an Array
 *
 * @param it The variable to test
 * @returns
 */
function isArray(it) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(it);
    }
    return Object.prototype.toString.call(it) === '[object Array]';
}

/**
 * Translates text to the target language. Automatically chooses the right translation API.
 *
 * @param text The text to translate
 * @param targetLang The target languate
 * @returns
 */
async function translateText(text, targetLang) {
    if (targetLang === 'en') {
        return text;
    }
    return await translateGoogle(text, targetLang);
}

/**
 * Translates text with Google API
 *
 * @param text The text to translate
 * @param targetLang The target languate
 * @returns
 */
async function translateGoogle(text, targetLang) {
    try {
        const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8&oe=UTF-8`;
        // @ts-expect-error eslint error
        const response = await axios({ url, timeout: 15000 });
        if (isArray(response.data)) {
            // we got a valid response
            return response.data[0][0][0];
        }
        throw new Error('Invalid response for translate request');
    } catch (e) {
        throw new Error(`Could not translate to "${targetLang}": ${e}`);
    }
}

module.exports = {
    isArray,
    isObject,
    translateText,
};
