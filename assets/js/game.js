// إدارة اللعبة الرئيسية
class GameManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.init();
    }

    async init() {
        await this.showWelcomeMessage();
    }

    async showWelcomeMessage() {
        const typingElement = document.getElementById('typingText');
        const welcomeMessage = "مرحباً أيها الباحث... لطالما انتظرت وصولك. هل أنت مستعد لاختبار قدراتك؟";
        await curator.typeMessage(welcomeMessage, typingElement);
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
        
        // رسالة ترحيبية من الـ AI
        const feedbackElement = document.getElementById('aiFeedback');
        if (feedbackElement) {
            const welcomeMessage = puzzleNumber === 1 ? 
                "أهلاً بك في التحدي الأول. انظر إلى النجوم وحاول اكتشاف النمط..." :
                `تحدي جديد ينتظرك! هذه المرة: ${puzzleSystem.puzzles[puzzleNumber].title}`;
            
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
            await curator.typeMessage("يجب أن تدخل إجابة أولاً...", feedbackElement);
            return;
        }

        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleSystem.currentPuzzle);
        const response = curator.generateResponse(answer, 
            puzzleSystem.puzzles[puzzleSystem.currentPuzzle].solution
        );
        
        await curator.typeMessage(response, feedbackElement);
        
        if (isCorrect) {
            setTimeout(async () => {
                puzzleSystem.currentPuzzle++;
                await this.loadPuzzle(puzzleSystem.currentPuzzle);
            }, 3000);
        }
    }

    // طلب تلميح
    async askForHint() {
        const feedbackElement = document.getElementById('aiFeedback');
        if (!feedbackElement) return;
        
        const hint = curator.getHintResponse();
        await curator.typeMessage(hint, feedbackElement);
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
const gameManager = new GameManager();

// دالات عامة للاستخدام في HTML
function startJourney() {
    gameManager.startJourney();
}

function checkPuzzleAnswer() {
    gameManager.checkPuzzleAnswer();
}

function askForHint() {
    gameManager.askForHint();
}

function restartGame() {
    gameManager.restartGame();
}
