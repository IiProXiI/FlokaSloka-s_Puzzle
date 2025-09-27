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
            this.playerScore += this.calculateScore(puzzleNumber);
            
            let response = this.getSuccessResponse();
            
            // إضافة تشجيع حسب الأداء
            if (this.consecutiveCorrect >= 2) {
                response += "<br>🔥 أنت على نار! إجابات متتالية صحيحة!";
            }
            
            if (this.totalHintsUsed === 0 && this.playerLevel > 1) {
                response += "<br>🎯 ملاحظة: لم تستخدم أي تلميحات! هذا مذهل!";
            }
            
            // إضافة الشرح بعد الإجابة الصحيحة
            response += `<br><br>💡 <strong>الشرح:</strong> ${puzzle.explanation}`;
            
            return response;
            
        } else {
            this.hintCount++;
            this.totalHintsUsed++;
            this.consecutiveCorrect = 0;
            
            let response = this.getHintResponse(puzzleNumber);
            
            // تحذير بعد عدة محاولات خاطئة
            if (this.hintCount >= 3) {
                response += "<br><br>⚠️ <strong>نصيحة:</strong> حاول أخذ استراحة قصيرة ثم العودة بنظرة جديدة";
            }
            
            return response;
        }
    }

    // حساب النقاط بناءً على الأداء
    calculateScore(puzzleNumber) {
        let baseScore = puzzleNumber * 25; // نقاط أساسية حسب صعوبة اللغز
        let hintPenalty = this.hintCount * 5; // خصم على التلميحات
        
        // مكافأة على الإجابات المتتالية الصحيحة
        let streakBonus = this.consecutiveCorrect * 10;
        
        return Math.max(0, baseScore - hintPenalty + streakBonus);
    }

    getSuccessResponse() {
        const responses = [
            "👏 <strong>إبداع!</strong> لقد حللت اللغز ببراعة",
            "🎯 <strong>دقة متناهية!</strong> عقلك يعمل بكفاءة عالية",
            "💎 <strong>استثنائي!</strong> طريقة تفكيرك جديرة بالإعجاب",
            "🚀 <strong>مذهل!</strong> تجاوزت التوقع مرة أخرى",
            "🧠 <strong>عبقري!</strong> حل مميز يستحق الإشادة"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHintResponse(puzzleNumber) {
        if (this.hintCount >= 5) {
            return "❌ <strong>انتبه:</strong> لقد استنفذت جميع التلميحات. جرب كتابة الإجابة بطريقة مختلفة أو فكر من زاوية جديدة.";
        }
        
        const hint = puzzleSystem.getHint(puzzleNumber, this.hintCount - 1);
        
        // التأكد من أن التلميح هو نص صالح
        if (!hint || typeof hint !== 'string') {
            return "❌ <strong>خطأ:</strong> لا يمكن تحميل التلميح في الوقت الحالي. حاول مرة أخرى.";
        }
        
        const hintIntros = [
            "💡 <strong>فكرة:</strong> ",
            "🧠 <strong>زاوية تفكير:</strong> ",
            "🔍 <strong>وجهة نظر:</strong> ",
            "🎯 <strong>توجيه:</strong> ",
            "⚡ <strong>إضاءة:</strong> "
        ];
        
        const intro = hintIntros[Math.min(this.hintCount - 1, hintIntros.length - 1)];
        return intro + hint;
    }

    // تأثير كتابة الرسائل
    async typeMessage(message, element, speed = 35) {
        if (!element) return;
        
        // التأكد من أن الرسالة هي نص صالح
        if (typeof message !== 'string') {
            console.error('Message must be a string:', message);
            message = String(message || 'خطأ في عرض الرسالة');
        }
        
        element.innerHTML = '';
        element.classList.add('typing-animation');
        
        // تقسيم الرسالة إلى أجزاء للتحكم بالسرعة
        const parts = message.split('<br>');
        
        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
            if (partIndex > 0) {
                element.innerHTML += '<br>';
                await this.sleep(speed * 2);
            }
            
            const part = parts[partIndex];
            for (let i = 0; i < part.length; i++) {
                element.innerHTML += part.charAt(i);
                
                // سرعة كتابة مختلفة للرموز والنص
                const isEmoji = part.charAt(i).match(/[👏🎯💎🚀🧠💡🔍🎯⚡❌⚠️🎊👑⭐🏆🔥💡]/);
                const charSpeed = isEmoji ? speed * 0.3 : speed;
                await this.sleep(charSpeed);
            }
        }
        
        element.classList.remove('typing-animation');
    }

    // الحصول على التقييم النهائي
    getFinalRating() {
        const totalPossibleScore = 400; // 4 ألغاز × 100 نقطة
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

// إنشاء نسخة من الذكاء الاصطناعي
const curator = new CuratorAI();
