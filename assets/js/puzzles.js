// نظام الألغاز
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = 1;
        this.puzzles = {
            1: {
                title: "اللغز الأول: لوحة النجوم",
                question: "انظر إلى لوحة النجوم أمامك. ما هو النمط المخفي في ترتيب الكواكب؟",
                image: "🌍🌟⭐🌕🪐", // يمكن استبدالها بصورة حقيقية لاحقاً
                solution: "fibonacci",
                type: "pattern"
            },
            2: {
                title: "اللغز الثاني: المخطوطة المفقودة",
                question: "المخطوطة تحوي رموزاً قديمة. ما هو المعنى المخفي؟",
                solution: "pyramid",
                type: "code"
            }
        };
    }

    // عرض اللغز الحالي
    displayPuzzle(puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return this.displayEnding();
        
        return `
            <div class="puzzle-header">
                <h2>${puzzle.title}</h2>
                <div class="puzzle-image">${puzzle.image}</div>
            </div>
            
            <div class="puzzle-question">
                <p>${puzzle.question}</p>
            </div>
            
            <div class="puzzle-interaction">
                <input type="text" id="puzzleAnswer" placeholder="اكتب إجابتك هنا...">
                <button onclick="checkPuzzleAnswer()">تحقق من الإجابة</button>
                <button onclick="askForHint()">اطلب تلميحاً</button>
            </div>
            
            <div class="ai-feedback" id="aiFeedback"></div>
        `;
    }

    // نهاية اللعبة
    displayEnding() {
        return `
            <div class="ending-screen">
                <h2>تهانينا! لقد أكملت الرحلة</h2>
                <p>لقد أثبتت أنك باحث حقيقي. أسرار الحضارة المفقودة أصبحت بين يديك.</p>
                <button onclick="restartGame()">ابدأ من جديد</button>
            </div>
        `;
    }

    // التحقق من الإجابة
    checkAnswer(answer, puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        return answer.toLowerCase() === puzzle.solution;
    }
}

const puzzleSystem = new PuzzleSystem();
