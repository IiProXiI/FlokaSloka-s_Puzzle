class GameManager {
    constructor() {
        this.currentScreen = 'register';
        this.playerName = '';
        this.startTime = null;
        this.timerInterval = null;
        this.leaderboard = this.loadLeaderboard();
        this.init();
    }

    init() {
        this.showRegisterScreen();
        this.updateLeaderboardPreview();
    }

    showRegisterScreen() {
        document.getElementById('registerScreen').style.display = 'block';
        document.getElementById('puzzleScreen').style.display = 'none';
        document.getElementById('endingScreen').style.display = 'none';
    }

    showPuzzleScreen() {
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('puzzleScreen').style.display = 'block';
        document.getElementById('endingScreen').style.display = 'none';
    }

    showEndingScreen() {
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('puzzleScreen').style.display = 'none';
        document.getElementById('endingScreen').style.display = 'block';
    }

    registerPlayer() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim();
        
        if (name.length < 2) {
            alert('الرجاء إدخال اسم صحيح (حرفين على الأقل)');
            return;
        }
        
        this.playerName = name;
        this.startTime = new Date();
        this.startTimer();
        this.showPuzzleScreen();
        this.loadPuzzle(1);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement && this.startTime) {
            const now = new Date();
            const diff = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
            const seconds = (diff % 60).toString().padStart(2, '0');
            timerElement.textContent = `⏱️ ${minutes}:${seconds}`;
        }
    }

    loadPuzzle(puzzleNumber) {
        puzzleSystem.currentPuzzle = puzzleNumber;
        
        const puzzleContent = document.getElementById('puzzleContent');
        const puzzleNumElement = document.getElementById('currentPuzzleNum');
        const playerElement = document.getElementById('
