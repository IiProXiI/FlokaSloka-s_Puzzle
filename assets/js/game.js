// إدارة اللعبة الرئيسية
class GameManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // سنجعل الأزرار تفاعلية
    }

    // بدء الرحلة
    startJourney() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('puzzleScreen').style.display = 'block';
        this.loadPuzzle(1);
    }

    // تحميل اللغز
    async loadPuzzle(puzzleNumber) {
        const puzzleContent = document.getElementById('puzzleContent');
        puzzleContent.innerHTML = puzzleSystem.displayPuzzle(puzzleNumber);
        
        // رسالة ترحيبية من الـ AI
        const welcomeMessage = "أهلاً بك في التحدي الأول. انظر إلى النجوم وحاول اكتشاف النمط...";
        await curator.typeMessage(welcomeMessage, document.getElementById('aiFeedback'));
    }

    // التحقق من الإجابة
    async checkPuzzleAnswer() {
        const answer = document.getElementById('puzzleAnswer').value;
        const isCorrect = puzzleSystem.checkAnswer(answer, puzzleSystem.currentPuzzle);
        
        const feedbackElement = document.getElementById('aiFeedback');
        const response = curator.generateResponse(answer, 
            puzzleSystem.puzzles[puzzleSystem.currentPuzzle].solution, 
            'pattern'
        );
        
        await curator.typeMessage(response, feedbackElement);
        
        if (isCorrect) {
            setTimeout(() => {
                puzzleSystem.currentPuzzle++;
                this.loadPuzzle(puzzleSystem.currentPuzzle);
            }, 3000);
        }
    }

    // طلب تلميح
    async askForHint() {
        const feedbackElement = document.getElementById('aiFeedback');
        const hint = curator.getHintResponse();
        await curator.typeMessage(hint, feedbackElement);
    }

    // إعادة اللعبة
    restartGame() {
        puzzleSystem.currentPuzzle = 1;
        this.currentScreen = 'welcome';
        document.getElementById('puzzleScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';
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
