// إدارة اللعبة الرئيسية
class GameManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.init();
    }

    async init() {
        setTimeout(async () => {
            await this.showWelcomeMessage();
        }, 1000);
    }

    async showWelcomeMessage() {
        const typingElement = document.getElementById('typingText');
        if (typingElement && typingElement.innerHTML === '') {
            const welcomeMessage = "مرحباً أيها المُحلل... أرى في عينيك فضول المعرفة. هل أنت مستعد لتحدي العقل؟";
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
        
        const feedbackElement = document.getElementById('aiFeedback');
        if (feedbackElement) {
            const puzzle = puzzleSystem.puzzles[puzzleNumber];
            const welcomeMessage = puzzleNumber === 1 ? 
                "أهلاً بك في التحدي الأول. هذا لغز رياضي يتطلب تفكيراً تحليلياً..." :
                `تحدي جديد! هذه المرة: ${puzzle.title}`;
            
            await curator.typeMessage(welcomeMessage, feedbackElement);
        }
    }

    // التحقق من الإجابة
    async checkPuzzleAnswer() {
        const answerInput = document.getElementById('puzzleAnswer');
        const feedbackElement = document.getElementById('aiFeedback');
        
        if (!answerInput || !feedbackElement) return;
        
        const answer = answerInput.value;
        if (!answer) {
            await curator.typeMessage("❌ يجب أن تدخل إجابة أولاً...", feedbackElement);
            return;
        }

        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleSystem.currentPuzzle);
        const response = curator.generateResponse(answer, 
            puzzleSystem.puzzles[puzzleSystem.currentPuzzle].solution,
            puzzleSystem.currentPuzzle
        );
        
        await curator.typeMessage(response, feedbackElement);
        
        if (isCorrect) {
            // إعادة تعيين حقل الإجابة
            answerInput.value = '';
            
            setTimeout(async () => {
                puzzleSystem.currentPuzzle++;
                await this.loadPuzzle(puzzleSystem.currentPuzzle);
            }, 4000);
        }
    }

    // طلب تلميح
    async askForHint() {
        const feedbackElement = document.getElementById('aiFeedback');
        if (!feedbackElement) return;
        
        const hint = curator.getHintResponse(puzzleSystem.currentPuzzle);
        await curator.typeMessage(`💡 تلميح: ${hint}`, feedbackElement);
    }

    // إعادة اللعبة
    restartGame() {
        puzzleSystem.currentPuzzle = 1;
        curator.playerLevel = 1;
        curator.hintCount = 0;
        
        document.getElementById('puzzleScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';
        
        this.showWelcomeMessage();
    }
}

// تهيئة اللعبة
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});

// دالات عامة للاستخدام في HTML
function startJourney() {
    if (window.gameManager) {
        gameManager.startJourney();
    }
}

function checkPuzzleAnswer() {
    if (window.gameManager) {
        gameManager.checkPuzzleAnswer();
    }
}

function askForHint() {
    if (window.gameManager) {
        gameManager.askForHint();
    }
}

function restartGame() {
    if (window.gameManager) {
        gameManager.restartGame();
    }
}
