import type {Locale} from '@src/types/onyx';
import emojis from './common';
import type {Emoji, EmojisList} from './types';

type EmojiTable = Record<string, Emoji>;

type LocaleEmojis = Partial<Record<Locale, EmojisList>>;

const emojiNameTable = emojis.reduce<EmojiTable>((prev, cur) => {
    const newValue = prev;
    if (!('header' in cur) && cur.name) {
        newValue[cur.name] = cur;
    }
    return newValue;
}, {});

const emojiCodeTableWithSkinTones = emojis.reduce<EmojiTable>((prev, cur) => {
    const newValue = prev;
    if (!('header' in cur)) {
        newValue[cur.code] = cur;
    }
    if ('types' in cur && cur.types) {
        cur.types.forEach((type) => {
            newValue[type] = cur;
        });
    }
    return newValue;
}, {});

const localeEmojis: LocaleEmojis = {
    en: undefined,
    es: undefined,
};

const importEmojiLocale = (locale: Locale) => {
    if (!localeEmojis[locale]) {
        return import(`./${locale}`)
            .then((esEmojiModule) => {
                // console.log('esEmojiModule.default: ', esEmojiModule.default.default);
                console.log('esEmojiModule.default: ', Object.keys(esEmojiModule.default).length);
                console.log('esEmojiModule.default.default: ', Object.keys(esEmojiModule.default?.default).length);
                localeEmojis[locale] = esEmojiModule.default.default ? esEmojiModule.default.default : esEmojiModule.default;
            })
            .catch(() => Promise.resolve());
    }
    return Promise.resolve();
};

export default emojis;
export {emojiNameTable, emojiCodeTableWithSkinTones, localeEmojis, importEmojiLocale};
export {skinTones, categoryFrequentlyUsed} from './common';
