class CuratorAI {
    constructor() {
        this.playerLevel = 1;
        this.hintCount = 0;
        this.totalHintsUsed = 0;
        this.consecutiveCorrect = 0;
    }

    generateResponse(answer, correctAnswer, puzzleNumber) {
        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleNumber);
        
        if (isCorrect) {
            this.playerLevel++;
            this.consecutiveCorrect++;
            this.hintCount = 0;
            
            let response = this.getSuccessResponse();
            
            // إضافة تشجيع حسب الأداء
            if (this.consecutiveCorrect >= 2) {
                response += "<br>🔥 أنت على نار! إجابات متتالية صحيحة!";
            }
            
            if (this.totalHintsUsed === 0 && this.playerLevel > 1) {
                response += "<br>🎯 ملاحظة: لم تستخدم أي تلميحات! هذا مذهل!";
            }
            
            return response + `<br><br>💡 ${puzzleSystem.puzzles[puzzleNumber].explanation}`;
            
        } else {
            this.hintCount++;
            this.totalHintsUsed++;
            this.consecutiveCorrect = 0;
            
            let response = this.getHintResponse(puzzleNumber);
            
            // تحذير بعد عدة محاولات خاطئة
            if (this.hintCount >= 3) {
                response += "<br><br>⚠️ نصيحة: حاول أخذ استراحة قصيرة ثم العودة بنظرة جديدة";
            }
            
            return response;
        }
    }

    getSuccessResponse() {
        const responses = [
            "👏 إبداع! لقد حللت اللغز ببراعة",
            "🎯 دقة متناهية! عقلك يعمل بكفاءة عالية",
            "💎 استثنائي! طريقة تفكيرك جديرة بالإعجاب",
            "🚀 مذهل! تجاوزت التوقع مرة أخرى"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHintResponse(puzzleNumber) {
        if (this.hintCount >= 5) {
            return "❌ لقد استنفذت جميع التلميحات. جرب كتابة الإجابة بطريقة مختلفة.";
        }
        
        const hint = puzzleSystem.getHint(puzzleNumber, this.hintCount - 1);
        
        const hintIntros = [
            "💡 فكرة: ",
            "🧠 زاوية تفكير: ",
            "🔍 وجهة نظر: ",
            "🎯 توجيه: ",
            "⚡ إضاءة: "
        ];
        
        const intro = hintIntros[Math.min(this.hintCount - 1, hintIntros.length - 1)];
        return intro + hint;
    }

    async typeMessage(message, element, speed = 35) {
        if (!element) return;
        
        element.innerHTML = '';
        element.classList.add('typing-animation');
        
        // تقسيم الرسالة إلى أجزاء للتحكم بالسرعة
        const parts = message.split('<br>');
        
        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
            if (partIndex > 0) {
                element.innerHTML += '<br>';
            }
            
            const part = parts[partIndex];
            for (let i = 0; i < part.length; i++) {
                element.innerHTML += part.charAt(i);
                
                // سرعة كتابة مختلفة للرموز والنص
                const charSpeed = part.charAt(i).match(/[👏🎯💎🚀💡🧠🔍🎯⚡❌⚠️🎊👑⭐]/) ? speed * 0.5 : speed;
                await this.sleep(charSpeed);
            }
        }
        
        element.classList.remove('typing-animation');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const curator = new CuratorAI();
