// نظام الألغاز
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = 1;
        this.puzzles = {
            1: {
                title: "اللغز الأول: الشيفرة الرقمية",
                question: `أمامك سلسلة أرقام غامضة:<br><br>
                <div class="number-sequence">
                    <span class="number">2</span>
                    <span class="number">4</span>
                    <span class="number">8</span>
                    <span class="number">16</span>
                    <span class="number">?</span>
                </div>
                <br>ما هو الرقم التالي في هذه السلسلة؟`,
                solution: "32",
                type: "math",
                explanation: "كل رقم يساوي ضعف الرقم السابق (2×2=4, 4×2=8, 8×2=16, 16×2=32)",
                hints: [
                    "انظر إلى العلاقة بين كل رقم والرقم الذي يسبقه",
                    "جرب عملية حسابية بسيطة بين الأرقام المتتالية",
                    "ما هي العملية التي تحول 2 إلى 4؟ و 4 إلى 8؟",
                    "هل لاحظت أن كل رقم هو ضعف الرقم السابق؟",
                    "الإجابة: 32 (16 × 2 = 32)"
                ]
            },
            2: {
                title: "اللغز الثاني: الكلمات المتقاطعة",
                question: `حل هذا اللغز اللغوي:<br><br>
                <div class="word-puzzle">
                    <div>أول الشيء → _ _ ل</div>
                    <div>وسط البحر → _ و س _</div>
                    <div>آخر الليل → _ _ ر</div>
                    <br>ما هي الكلمة المشتركة؟`,
                solution: "نور",
                type: "word",
                explanation: "أول الشيء: نور، وسط البحر: نورس، آخر الليل: نور",
                hints: [
                    "ركز على الحروف المشتركة في الكلمات الثلاث",
                    "الكلمة المطلوبة تتكون من 3 أحرف",
                    "هي كلمة تعني الضوء",
                    "تبدأ بحرف النون",
                    "الإجابة: نور"
                ]
            },
            3: {
                title: "النهائي: النمط البصري",
                question: `ما هو النمط في هذه الأشكال؟<br><br>
                <div class="shapes-pattern">
                    <div class="shape">▲</div>
                    <div class="shape">▼</div>
                    <div class="shape">◆</div>
                    <div class="shape">?</div>
                </div>`,
                solution: "circle",
                type: "pattern",
                explanation: "النمط: مثلث لأعلى، مثلث لأسفل، معين، ثم دائرة (أشكال هندسية أساسية)",
                hints: [
                    "انظر إلى تتابع الأشكال الهندسية",
                    "هذه أشكال هندسية أساسية",
                    "المثلث بأوجه مختلفة، ثم معين، ثم...",
                    "ما هو الشكل الهندسي الأساسي التالي؟",
                    "الإجابة: circle"
                ]
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
            
            ${puzzleNumber === 1 ? `
            <div class="puzzle-explanation" style="margin-top: 20px; font-size: 0.9em; color: #00f0ff; opacity: 0.8;">
                💡 تلميح: الأرقام تتزايد بنمط رياضي منتظم
            </div>
            ` : ''}
        `;
    }

    // الحصول على تلميح
    getHint(puzzleNumber, hintLevel) {
        const puzzle = this.puzzles[puzzleNumber];
        if (puzzle && puzzle.hints) {
            return hintLevel < puzzle.hints.length ? puzzle.hints[hintLevel] : puzzle.hints[puzzle.hints.length - 1];
        }
        return "حاول التفكير بطريقة مختلفة...";
    }

    // التحقق من الإجابة
    checkAnswer(answer, puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return false;
        
        // جعل التحقق أكثر مرونة
        const userAnswer = answer.toLowerCase().trim();
        const correctAnswer = puzzle.solution.toLowerCase();
        
        return userAnswer === correctAnswer || 
               userAnswer === this.translateToArabic(correctAnswer) ||
               userAnswer === this.translateToEnglish(correctAnswer);
    }

    translateToArabic(word) {
        const translations = {
            '32': 'اثنان وثلاثون',
            'nur': 'نور',
            'noor': 'نور', 
            'circle': 'دائرة',
            'fibonacci': 'فيبوناتشي'
        };
        return translations[word.toLowerCase()] || word;
    }

    translateToEnglish(word) {
        const translations = {
            'اثنان وثلاثون': '32',
            'نور': 'nur',
            'دائرة': 'circle',
            'فيبوناتشي': 'fibonacci'
        };
        return translations[word] || word;
    }

    // نهاية اللعبة
    displayEnding() {
        return `
            <div class="ending-screen">
                <h2>🎉 تهانينا! لقد أكملت الرحلة 🎉</h2>
                <p>لقد أثبتت براعة استثنائية في حل الألغاز!</p>
                <p>مستواك النهائي: <span class="level">${curator.playerLevel}</span> / 3</p>
                <div class="stats">
                    <p>عدد التلميحات المستخدمة: ${curator.hintCount}</p>
                    <p>دقة الإجابات: ${Math.round((curator.playerLevel / 3) * 100)}%</p>
                </div>
                <button onclick="restartGame()">ابدأ رحلة جديدة</button>
            </div>
        `;
    }
}

const puzzleSystem = new PuzzleSystem();
