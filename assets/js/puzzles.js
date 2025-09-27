// نظام الألغاز
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = 1;
        this.puzzles = {
            1: {
                title: "اللغز الأول: لوحة النجوم",
                question: "انظر إلى لوحة النجوم أمامك. ما هو النمط المخفي في ترتيب الكواكب؟ 🌍🌟⭐🌕🪐",
                solution: "fibonacci",
                type: "pattern"
            },
            2: {
                title: "اللغز الثاني: المخطوطة المفقودة",
                question: "المخطوطة تحوي رموزاً قديمة. ما هو المعنى المخفي؟ 𓂀 𓂁 𓂂 𓂃 𓂄",
                solution: "pyramid",
                type: "code"
            },
            3: {
                title: "النهائي: بوابة الحضارة",
                question: "أخيراً... ما هو السر الأعظم الذي اكتشفته؟",
                solution: "knowledge",
                type: "final"
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
                <div class="puzzle-image">${puzzle.question.split(' ').pop()}</div>
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
                <h2>🎉 تهانينا! لقد أكملت الرحلة 🎉</h2>
                <p>لقد أثبتت أنك باحث حقيقي. أسرار الحضارة المفقودة أصبحت بين يديك.</p>
                <p>مستواك النهائي: ${curator.playerLevel} / 3</p>
                <button onclick="restartGame()">ابدأ رحلة جديدة</button>
            </div>
        `;
    }

    // التحقق من الإجابة
    checkAnswer(answer, puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        return answer.toLowerCase() === puzzle.solution.toLowerCase();
    }
}

const puzzleSystem = new PuzzleSystem();
