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
        this.totalHintsUsed = 0;
    }

    // توليد ردود ذكية
    generateResponse(answer, correctAnswer, puzzleNumber) {
        if (this.checkAnswer(answer, correctAnswer)) {
            this.playerLevel++;
            const puzzle = puzzleSystem.puzzles[puzzleNumber];
            const response = this.getSuccessResponse() + 
                (puzzle.explanation ? `<br><br>💡 ${puzzle.explanation}` : '');
            this.hintCount = 0;
            return response;
        } else {
            this.hintCount++;
            this.totalHintsUsed++;
            return this.getHintResponse(puzzleNumber);
        }
    }

    checkAnswer(answer, correctAnswer) {
        const userAnswer = answer.toLowerCase().trim();
        const solutions = [correctAnswer.toLowerCase()];
        
        // إجابات بديلة مقبولة
        if (correctAnswer === '32') solutions.push('اثنان وثلاثون', '٢٣', '32');
        if (correctAnswer === 'nur') solutions.push('نور', 'noor');
        if (correctAnswer === 'circle') solutions.push('دائرة', 'circle');
        
        return solutions.includes(userAnswer);
    }

    getSuccessResponse() {
        const responses = [
            "👏 ممتاز! لقد وجدت الحل الصحيح.",
            "🎯 إصابة مباشرة! عقلك متقد ذكاءً.",
            "💎 براعة فائقة! الحل كان دقيقاً.",
            "🚀 مذهل! لقد تجاوزت التوقع."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getHintResponse(puzzleNumber) {
        return puzzleSystem.getHint(puzzleNumber, this.hintCount);
    }

    // تأثير كتابة الرسائل
    async typeMessage(message, element, speed = 40) {
        if (!element) return;
        
        element.innerHTML = '';
        element.classList.add('typing-animation');
        
        // إضافة تأثير كتابة لكل حرف
        for (let i = 0; i < message.length; i++) {
            element.innerHTML += message.charAt(i);
            await this.sleep(speed);
            
            // تسريع الكتابة عند المسافات
            if (message.charAt(i) === ' ') {
                await this.sleep(speed / 2);
            }
        }
        
        element.classList.remove('typing-animation');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// إنشاء نسخة من الذكاء الاصطناعي
const curator = new CuratorAI();
