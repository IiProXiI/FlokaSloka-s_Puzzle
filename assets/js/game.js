// إدارة اللعبة الرئيسية
class GameManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        setTimeout(async () => {
            await this.showWelcomeMessage();
            this.isInitialized = true;
        }, 800);
    }

    async showWelcomeMessage() {
        const typingElement = document.getElementById('typingText');
        if (typingElement && typingElement.innerHTML === '') {
            const welcomeMessage = "أهلاً بك أيها المُفكر... أرى في عينيك بريق الذكاء. هل أنت مستعد لتحدي يعزز قدراتك العقلية؟";
            await curator.typeMessage(welcomeMessage, typingElement);
        }
    }

    // بدء الرحلة
    async startJourney() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('puzzleScreen').style.display = 'block';
        await this.loadPuzzle(1);
    }

    // تحميل اللغز
    async loadPuzzle(puzzleNumber) {
        const puzzleContent = document.getElementById('puzzleContent');
        puzzleContent.innerHTML = puzzleSystem.displayPuzzle(puzzleNumber);
        
        // تحديث عداد التلميحات
        this.updateHintCounter();
        
        const feedbackElement = document.getElementById('aiFeedback');
        if (feedbackElement) {
            const puzzle = puzzleSystem.puzzles[puzzleNumber];
            const messages = {
                1: "أهلاً بك في التحدي الأول. هذا لغز لغوي يتطلب فهم الأنماط اللغوية...",
                2: "تحدي رياضي! المتتاليات تحتاج عقلًا تحليليًا دقيقًا...", 
                3: "اللغز الثالث: شفرة بصرية تحتاج تفكيرًا إبداعيًا...",
                4: "التحدي الأخير: لغز فلسفي يعمق التفكير..."
            };
            
            const welcomeMessage = messages[puzzleNumber] || `مرحبًا بك في اللغز ${puzzleNumber}`;
            await curator.typeMessage(welcomeMessage, feedbackElement);
        }
        
        // تركيز على حقل الإجابة
        const answerInput = document.getElementById('puzzleAnswer');
        if (answerInput) {
            setTimeout(() => answerInput.focus(), 500);
        }
    }

    // تحديث عداد التلميحات
    updateHintCounter() {
        const hintCountElement = document.getElementById('hintCount');
        if (hintCountElement) {
            hintCountElement.textContent = curator.hintCount;
        }
        
        // تحديث زر التلميح
        const hintButton = document.querySelector('.hint-btn');
        if (hintButton) {
            hintButton.textContent = `طلب تلميح (${curator.hintCount + 1}/5)`;
            
            // تعطيل الزر إذا تجاوز الحد
            if (curator.hintCount >= 5) {
                hintButton.disabled = true;
                hintButton.style.opacity = '0.6';
                hintButton.style.cursor = 'not-allowed';
            }
        }
    }

    // التحقق من الإجابة
    async checkPuzzleAnswer() {
        const answerInput = document.getElementById('puzzleAnswer');
        const feedbackElement = document.getElementById('aiFeedback');
        
        if (!answerInput || !feedbackElement) {
            console.error('عناصر الواجهة غير موجودة');
            return;
        }
        
        const answer = answerInput.value.trim();
        if (!answer) {
            await curator.typeMessage("❌ <strong>انتبه:</strong> يجب أن تدخل إجابة أولاً...", feedbackElement);
            answerInput.focus();
            return;
        }

        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleSystem.currentPuzzle);
        const response = curator.generateResponse(answer, puzzleSystem.currentPuzzle);
        
        await curator.typeMessage(response, feedbackElement);
        
        if (isCorrect) {
            // إعادة تعيين حقل الإجابة
            answerInput.value = '';
            
            setTimeout(async () => {
                puzzleSystem.currentPuzzle++;
                if (puzzleSystem.puzzles[puzzleSystem.currentPuzzle]) {
                    await this.loadPuzzle(puzzleSystem.currentPuzzle);
                } else {
                    // نهاية اللعبة
                    puzzleContent.innerHTML = puzzleSystem.displayEnding();
                }
            }, 4500);
        } else {
            // إعادة التركيز على حقل الإجابة بعد الخطأ
            setTimeout(() => answerInput.focus(), 1000);
        }
        
        // تحديث العداد بعد التحقق
        this.updateHintCounter();
    }

    // طلب تلميح
    async askForHint() {
        if (curator.hintCount >= 5) {
            const feedbackElement = document.getElementById('aiFeedback');
            if (feedbackElement) {
                await curator.typeMessage("❌ <strong>انتهت التلميحات:</strong> لقد استخدمت جميع التلميحات المتاحة. حاول حل اللغز بطريقتك الخاصة.", feedbackElement);
            }
            return;
        }
        
        const feedbackElement = document.getElementById('aiFeedback');
        if (!feedbackElement) return;
        
        const hint = curator.getHintResponse(puzzleSystem.currentPuzzle);
        await curator.typeMessage(hint, feedbackElement);
        
        // تحديث العداد بعد طلب التلميح
        this.updateHintCounter();
    }

    // إعادة اللعبة
    restartGame() {
        puzzleSystem.currentPuzzle = 1;
        curator.playerLevel = 1;
        curator.hintCount = 0;
        curator.totalHintsUsed = 0;
        curator.consecutiveCorrect = 0;
        curator.playerScore = 0;
        
        document.getElementById('puzzleScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';
        
        this.showWelcomeMessage();
    }
}

// تهيئة اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});

// دالات عامة للاستخدام في HTML
function startJourney() {
    if (window.gameManager) {
        gameManager.startJourney();
    } else {
        console.error('Game manager not initialized');
    }
}

function checkPuzzleAnswer() {
    if (window.gameManager) {
        gameManager.checkPuzzleAnswer();
    } else {
        console.error('Game manager not initialized');
    }
}

function askForHint() {
    if (window.gameManager) {
        gameManager.askForHint();
    } else {
        console.error('Game manager not initialized');
    }
}

function restartGame() {
    if (window.gameManager) {
        gameManager.restartGame();
    } else {
        console.error('Game manager not initialized');
    }
}

function shareResults() {
    if (window.puzzleSystem) {
        puzzleSystem.shareResults();
    }
}

// دعم الإدخال بالزر Enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const activeScreen = document.getElementById('puzzleScreen').style.display;
        if (activeScreen !== 'none') {
            checkPuzzleAnswer();
        }
    }
});
