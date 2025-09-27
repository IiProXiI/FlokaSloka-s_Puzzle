class GameAI {
    constructor() {
        this.playerName = '';
        this.startTime = null;
        this.endTime = null;
        this.currentPuzzle = 1;
        this.attempts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        this.hintsUsed = 0;
    }

    startTimer() {
        this.startTime = new Date();
    }

    stopTimer() {
        this.endTime = new Date();
    }

    getElapsedTime() {
        if (!this.startTime) return '00:00';
        const end = this.endTime || new Date();
        const diff = Math.floor((end - this.startTime) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // منع النسخ واللصق في الحقول الحساسة
    disableCopyPaste(element) {
        element.addEventListener('copy', (e) => e.preventDefault());
        element.addEventListener('paste', (e) => e.preventDefault());
        element.addEventListener('cut', (e) => e.preventDefault());
    }

    // تشفير بسيط للبيانات
    encrypt(data) {
        return btoa(JSON.stringify(data));
    }

    decrypt(data) {
        try {
            return JSON.parse(atob(data));
        } catch {
            return null;
        }
    }
}

const gameAI = new GameAI();
