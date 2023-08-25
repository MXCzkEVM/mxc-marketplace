




export const browserLangToLocaleKey = (lang: any) => {
    const mapping: any = {
        'en': 'en',      // 通用英语
        'en-US': 'en',   // 美国英语
        'en-GB': 'en',   // 英国英语
        'de': 'de',      // 通用德语
        'de-DE': 'de',   // 德国的德语
        'nl': 'nl',      // 通用荷兰语
        'nl-NL': 'nl',   // 荷兰的荷兰语
        'tr': 'tr',      // 通用土耳其语
        'tr-TR': 'tr',   // 土耳其的土耳其语
        'zh-CN': 'zh_CN',// 简体中文
        'zh-TW': 'zh_TW',// 繁体中文
        'ko': 'ko',      // 通用韩语
        'ko-KR': 'ko',   // 韩国的韩语
        'ro': 'ro',      // 通用罗马尼亚语
        'ro-RO': 'ro',   // 罗马尼亚的罗马尼亚语
        'es': 'es',      // 通用西班牙语
        'es-ES': 'es',   // 西班牙的西班牙语
        'fr': 'fr',      // 通用法语
        'fr-FR': 'fr',   // 法国的法语
        'it': 'it',      // 通用意大利语
        'it-IT': 'it',   // 意大利的意大利语
        'ja': 'ja',      // 通用日语
        'ja-JP': 'ja',   // 日本的日语
        'ru': 'ru',      // 通用俄语
        'ru-RU': 'ru',   // 俄罗斯的俄语
        'pt': 'pt',      // 通用葡萄牙语
        'pt-PT': 'pt',   // 葡萄牙的葡萄牙语
        'pt-BR': 'pt',   // 巴西的葡萄牙语
        'id': 'id',      // 通用印度尼西亚语
        'id-ID': 'id',   // 印度尼西亚的印度尼西亚语
        'vi': 'vi',      // 通用越南语
        'vi-VN': 'vi'    // 越南的越南语
    };

    return mapping[lang] || null;
};

export const locales: any = {
    en: "English",
    de: "Deutsch",
    nl: "Nederlands",
    tr: "Türkçe",
    zh_CN: "简体中文",
    zh_TW: "繁体中文",
    ko: "한국어",
    ro: "Română",
    es: "Español",
    fr: "Français",
    it: "Italiano",
    ja: "日本語",
    ru: "Русский",
    pt: "Portugués",
    id: "Indonesio",
    vi: "Tiếng Việt",
};

