// نظام التشفير المتقدم للعبة
class AdvancedEncryption {
    constructor() {
        this.encryptionMethods = {
            base64: {
                encode: (text) => btoa(unescape(encodeURIComponent(text))),
                decode: (text) => decodeURIComponent(escape(atob(text)))
            },
            caesar: {
                encode: (text, shift = 3) => 
                    text.split('').map(char => {
                        if (char.match(/[a-z]/i)) {
                            const code = char.charCodeAt(0);
                            const base = code >= 65 && code <= 90 ? 65 : 97;
                            return String.fromCharCode(((code - base + shift) % 26) + base);
                        }
                        return char;
                    }).join(''),
                decode: (text, shift = 3) => 
                    text.split('').map(char => {
                        if (char.match(/[a-z]/i)) {
                            const code = char.charCodeAt(0);
                            const base = code >= 65 && code <= 90 ? 65 : 97;
                            return String.fromCharCode(((code - base - shift + 26) % 26) + base);
                        }
                        return char;
                    }).join('')
            },
            reverse: {
                encode: (text) => text.split('').reverse().join(''),
                decode: (text) => text.split('').reverse().join('')
            },
            hex: {
                encode: (text) => {
                    return text.split('').map(char => 
                        char.charCodeAt(0).toString(16).padStart(2, '0')
                    ).join('');
                },
                decode: (hex) => {
                    const bytes = hex.match(/.{1,2}/g);
                    return bytes ? bytes.map(byte => 
                        String.fromCharCode(parseInt(byte, 16))
                    ).join('') : '';
                }
            }
        };
    }

    // فك تشفير تلقائي بمحاولة جميع الطرق
    autoDecrypt(text) {
        const results = [];
        
        // محاولة Base64
        try {
            const base64Result = this.encryptionMethods.base64.decode(text);
            if (this.isValidText(base64Result)) {
                results.push({ method: 'Base64', result: base64Result });
            }
        } catch (e) {}
        
        // محاولة Reverse
        try {
            const reverseResult = this.encryptionMethods.reverse.decode(text);
            if (this.isValidText(reverseResult)) {
                results.push({ method: 'Reverse', result: reverseResult });
            }
        } catch (e) {}
        
        // محاولة Hex
        try {
            const hexResult = this.encryptionMethods.hex.decode(text);
            if (this.isValidText(hexResult)) {
                results.push({ method: 'Hex', result: hexResult });
            }
        } catch (e) {}
        
        // محاولة Caesar مع تحولات مختلفة
        for (let shift = 1; shift <= 25; shift++) {
            try {
                const caesarResult = this.encryptionMethods.caesar.decode(text, shift);
                if (this.isValidText(caesarResult)) {
                    results.push({ method: `Caesar Shift ${shift}`, result: caesarResult });
                }
            } catch (e) {}
        }
        
        return results;
    }

    isValidText(text) {
        // التحقق إذا كان النص يحتوي على أحرف مقروءة
        if (!text || text.length === 0) return false;
        
        const readableChars = text.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').length;
        return (readableChars / text.length) > 0.6;
    }

    // توليد شفرة عشوائية
    generateRandomCipher(text, method) {
        const methods = Object.keys(this.encryptionMethods);
        const randomMethod = method || methods[Math.floor(Math.random() * methods.length)];
        
        if (this.encryptionMethods[randomMethod]) {
            return {
                method: randomMethod,
                encrypted: this.encryptionMethods[randomMethod].encode(text),
                hint: this.getMethodHint(randomMethod)
            };
        }
        
        return null;
    }

    getMethodHint(method) {
        const hints = {
            base64: "يستخدم ترميز Base64 - يحول البيانات إلى نص ASCII",
            caesar: "شيفرة قيصر - كل حرف مُزاح بعدد ثابت",
            reverse: "عكس النص - اقرأه من اليمين لليسار",
            hex: "التمثيل الست عشري - كل بايت يمثل بقيمتين سداسيتين"
        };
        
        return hints[method] || "تشفير غير معروف";
    }

    // إنشاء تحدي تشفير للمهام
    createEncryptionChallenge(difficulty = 'easy') {
        const challenges = {
            easy: {
                text: "Hello World",
                methods: ['base64', 'reverse']
            },
            medium: {
                text: "Secret Message 123",
                methods: ['caesar', 'hex']
            },
            hard: {
                text: "Advanced Hacking Challenge",
                methods: ['base64', 'caesar', 'hex', 'reverse']
            }
        };
        
        const challenge = challenges[difficulty];
        const method = challenge.methods[Math.floor(Math.random() * challenge.methods.length)];
        
        return this.generateRandomCipher(challenge.text, method);
    }
}
