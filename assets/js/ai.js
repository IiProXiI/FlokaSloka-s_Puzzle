// نظام الذكاء الاصطناعي - القيّم الغامض
class CuratorAI {
    constructor() {
        this.playerLevel = 1;
        this.hintCount = 0;
        this.totalHintsUsed = 0;
        this.consecutiveCorrect = 0;
        this.playerScore = 0;
    }

    // توليد ردود ذكية بناءً على الإجابة
    generateResponse(answer, puzzleNumber) {
        const puzzle = puzzleSystem.puzzles[puzzleNumber];
        if (!puzzle) return "حدث خطأ في تحميل اللغز...";
        
        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleNumber);
        
        if (isCorrect) {
            this.playerLevel++;
            this.consecutiveCorrect++;
            this.hintCount = 0;
            this.playerScore += this.getScore(puzzleNumber);
            
            let response = this.getSuccessResponse();
            
            if (this.consecutiveCorrect >= 2) {
                response += "\n🔥 أنت على نار! إجابات متتالية صحيحة!";
            }
            
            if (this.totalHintsUsed === 0 && this.playerLevel > 1) {
                response += "\n🎯 ملاحظة: لم تستخدم أي تلميحات! هذا مذهل!";
            }
            
            response += `\n\n💡 الشرح: ${puzzle.explanation}`;
            
            return response;
            
        } else {
            this.hintCount++;
            this.totalHintsUsed++;
            this.consecutiveCorrect = 0;
            
            return this.getHintResponse(puzzleNumber);
        }
    }

    getScore(puzzleNumber) {
        let baseScore = puzzleNumber * 25;
        let hintPenalty = this.hintCount * 5;
        let streakBonus = this.consecutiveCorrect * 10;
        return Math.max(0, baseScore - hintPenalty + streakBonus);
    }

    getSuccessResponse() {
        const responses = [
            "👏 إبداع! لقد حللت اللغز ببراعة",
            "🎯 دقة متناهية! عقلك يعمل بكفاءة عالية", 
            "💎 استثنائي! طريقة تفكيرك جديرة بالإعجاب",
            "🚀 مذهل! تجاوزت التوقع مرة أخرى",
            "🧠 عبقري! حل مميز يستحق الإشادة"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHintResponse(puzzleNumber) {
        if (this.hintCount >= 5) {
            return "❌ انتهت التلميحات: لقد استخدمت جميع التلميحات المتاحة. جرب كتابة الإجابة بطريقة مختلفة.";
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

    // تأثير كتابة الرسائل - مبسط بدون وسوم HTML
    async typeMessage(message, element, speed = 35) {
        if (!element) return;
        
        // التأكد أن message هو نص بدون وسوم HTML
        if (typeof message !== 'string') {
            message = String(message);
        }
        
        // إزالة أي وسوم HTML قد تسبب مشاكل
        message = message.replace(/<[^>]*>/g, '');
        
        element.innerHTML = '';
        element.classList.add('typing-animation');
        
        for (let i = 0; i < message.length; i++) {
            element.innerHTML += message.charAt(i);
            await this.sleep(speed);
        }
        
        element.classList.remove('typing-animation');
    }

    getFinalRating() {
        const totalPossibleScore = 400;
        const percentage = (this.playerScore / totalPossibleScore) * 100;
        
        if (percentage >= 90) return { level: "👑 عبقرية فذة", color: "#FFD700" };
        if (percentage >= 75) return { level: "💎 متميز جداً", color: "#00f0ff" };
        if (percentage >= 60) return { level: "⭐ مفكر مبدع", color: "#00ff41" };
        if (percentage >= 40) return { level: "🔶 جيد جداً", color: "#ff9900" };
        return { level: "🌱 مستعد للتطور", color: "#9d00ff" };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const curator = new CuratorAI();
