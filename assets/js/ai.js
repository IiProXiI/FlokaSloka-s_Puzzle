// نظام الذكاء الاصطناعي - القيّم الغامض
class CuratorAI {
    constructor() {
        this.personality = {
            mystery: 8,
            wisdom: 9,
            sarcasm: 6,
            helpfullness: 7
        };
        this.playerLevel = 1;
        this.hintCount = 0;
    }

    // توليد ردود ذكية
    generateResponse(answer, correctAnswer) {
        if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
            this.playerLevel++;
            this.hintCount = 0;
            return this.getSuccessResponse();
        } else {
            this.hintCount++;
            return this.getHintResponse();
        }
    }

    getSuccessResponse() {
        const responses = [
            "مذهل! لقد كشفت الغموض... انتقل إلى التحدي التالي.",
            "أحسنت! عقلك يستحق الإعجاب. إليك اللغز التالي.",
            "براعة فائقة! الحضارة المفقودة تنتظر اكتشافاتك.",
            "لم يسبق لأحد أن حل هذا اللغز بهذه السرعة. أنت استثنائي!"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHintResponse() {
        const hints = [
            "تلميح: انظر إلى الصورة من زاوية مختلفة...",
            "حاول التركيز على الأنماط المخفية...",
            "الطبيعة تحب التسلسلات الرياضية...",
            "فكر في فيبوناتشي... الأرقام تتزايد بطريقة معينة...",
            "1, 1, 2, 3, 5, 8... ماذا يأتي بعد؟"
        ];
        return this.hintCount < hints.length ? hints[this.hintCount] : "الإجابة هي: تسلسل فيبوناتشي";
    }

    // تأثير كتابة الرسائل
    async typeMessage(message, element, speed = 30) {
        if (!element) return;
        
        element.innerHTML = '';
        element.classList.add('typing-animation');
        
        for (let i = 0; i < message.length; i++) {
            element.innerHTML += message.charAt(i);
            await this.sleep(speed);
        }
        
        element.classList.remove('typing-animation');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// إنشاء نسخة من الذكاء الاصطناعي
const curator = new CuratorAI();
