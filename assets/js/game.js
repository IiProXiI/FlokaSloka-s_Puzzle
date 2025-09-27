class GameManager {
    constructor() {
        this.playerName = '';
        this.startTime = null;
        this.timerInterval = null;
        this.currentPuzzle = 1;
        this.attempts = {1: 0, 2: 0, 3: 0, 4: 0};
        this.maxAttempts = 5;
        this.leaderboard = this.loadLeaderboard();
        this.init();
    }

    init() {
        this.showRegisterScreen();
        this.updateLeaderboard();
        this.setupEventListeners();
        console.log('🎮 نظام الألغاز جاهز!');
    }

    setupEventListeners() {
        const startButton = document.getElementById('startButton');
        const playerNameInput = document.getElementById('playerName');
        const restartButton = document.getElementById('restartButton');

        if (startButton) {
            startButton.addEventListener('click', () => this.registerPlayer());
        }

        if (playerNameInput) {
            playerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.registerPlayer();
                }
            });
        }

        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartGame());
        }
    }

    showRegisterScreen() {
        this.hideAllScreens();
        document.getElementById('registerScreen').style.display = 'block';
    }

    showPuzzleScreen() {
        this.hideAllScreens();
        document.getElementById('puzzleScreen').style.display = 'block';
    }

    showEndingScreen() {
        this.hideAllScreens();
        document.getElementById('endingScreen').style.display = 'block';
        this.showFinalStats();
    }

    hideAllScreens() {
        const screens = ['registerScreen', 'puzzleScreen', 'endingScreen'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) element.style.display = 'none';
        });
    }

    registerPlayer() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim();
        
        if (name.length < 2) {
            this.showMessage('⚠️ الرجاء إدخال اسم صحيح (حرفين على الأقل)');
            return;
        }
        
        this.playerName = name;
        this.startTime = new Date();
        this.startTimer();
        this.showPuzzleScreen();
        this.loadPuzzle(1);
        
        document.getElementById('currentPlayer').textContent = `اللاعب: ${name}`;
        this.showMessage(`🎯 مرحباً ${name}! ابدأ حل الألغاز`);
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
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
        this.currentPuzzle = puzzleNumber;
        this.updateProgressSteps();
        
        const puzzleContent = document.getElementById('puzzleContent');
        const puzzles = {
            1: this.getPuzzle1Content(),
            2: this.getPuzzle2Content(),
            3: this.getPuzzle3Content(),
            4: this.getPuzzle4Content()
        };
        
        puzzleContent.innerHTML = puzzles[puzzleNumber] || '<p>اللغز غير متوفر</p>';
        
        this.setupPuzzleEventListeners();
    }

    updateProgressSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index + 1 === this.currentPuzzle) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    setupPuzzleEventListeners() {
        const submitButtons = document.querySelectorAll('.submit-btn');
        submitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const puzzleNum = this.currentPuzzle;
                this.checkAnswer(puzzleNum);
            });
        });

        const inputs = document.querySelectorAll('.solution-input input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer(this.currentPuzzle);
                }
            });
        });
    }

    getPuzzle1Content() {
        return `
            <div class="puzzle-1">
                <h3>🔐 اللغز الأول: شفرة القيصر</h3>
                <div class="cipher-box">
                    <div class="cipher-text">XLI JSVQEXC ERH TVEGXMSR WXEXC</div>
                    <p class="hint">💡 كل حرف مُحوّل 4 مرات في الأبجدية الإنجليزية</p>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle1Answer" placeholder="اكتب الجملة بعد فك الشفرة...">
                    <button class="submit-btn">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span>${this.attempts[1]}</span>/${this.maxAttempts}</div>
            </div>
        `;
    }

    getPuzzle2Content() {
        return `
            <div class="puzzle-2">
                <h3>🎵 اللغز الثاني: الرسالة الصوتية</h3>
                <div class="cipher-box">
                    <p>🔊 استمع جيداً للكلمات المخفية في الصوت</p>
                    <p class="hint">💡 الرسالة تتكون من 5 كلمات</p>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle2Answer" placeholder="ما هي الرسالة التي سمعتها؟">
                    <button class="submit-btn">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span>${this.attempts[2]}</span>/${this.maxAttempts}</div>
            </div>
        `;
    }

    getPuzzle3Content() {
        return `
            <div class="puzzle-3">
                <h3>🧩 اللغز الثالث: متاهة الحروف</h3>
                <div class="cipher-box">
                    <p>🎮 استخدم مفاتيح الأسهم للتحرك في المتاهة</p>
                    <p class="hint">💡 اجمع الحروف لتكوين جملة مفيدة</p>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle3Answer" placeholder="اكتب الجملة التي جمعتها">
                    <button class="submit-btn">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span>${this.attempts[3]}</span>/${this.maxAttempts}</div>
            </div>
        `;
    }

    getPuzzle4Content() {
        return `
            <div class="puzzle-4">
                <h3>🚫 اللغز الرابع: التحدي النهائي</h3>
                <div class="cipher-box">
                    <p>🤔 ما هو الرقم الذي يمثل إجابة السؤال النهائي؟</p>
                    <p class="hint">💡 إجابة فلسفية مشهورة من أدب الخيال العلمي</p>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle4Answer" placeholder="الإجابة النهائية...">
                    <button class="submit-btn">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span>${this.attempts[4]}</span>/${this.maxAttempts}</div>
            </div>
        `;
    }

    checkAnswer(puzzleNumber) {
        const answers = {
            1: "THE FOUNDATION OF KNOWLEDGE",
            2: "الطريق إلى الحكمة يبدأ بخطوة", 
            3: "الحكمة ضالة المؤمن",
            4: "42"
        };
        
        const input = document.getElementById(`puzzle${puzzleNumber}Answer`);
        if (!input) return;
        
        const userAnswer = input.value.trim().toUpperCase();
        const correctAnswer = answers[puzzleNumber].toUpperCase();
        
        this.attempts[puzzleNumber]++;
        
        if (userAnswer === correctAnswer) {
            this.showMessage('🎉 إجابة صحيحة! تقدم إلى اللغز التالي');
            
            if (puzzleNumber < 4) {
                setTimeout(() => {
                    this.loadPuzzle(puzzleNumber + 1);
                }, 1500);
            } else {
                this.completeGame();
            }
        } else {
            if (this.attempts[puzzleNumber] >= this.maxAttempts) {
                this.showMessage('❌ لقد استنفذت جميع المحاولات! الجواب الصحيح: ' + answers[puzzleNumber]);
                setTimeout(() => {
                    if (puzzleNumber < 4) {
                        this.loadPuzzle(puzzleNumber + 1);
                    } else {
                        this.completeGame();
                    }
                }, 2000);
            } else {
                this.showMessage('❌ إجابة خاطئة، حاول مرة أخرى');
                this.updateAttemptsDisplay(puzzleNumber);
            }
        }
    }

    updateAttemptsDisplay(puzzleNumber) {
        const attemptsElement = document.querySelector(`.puzzle-${puzzleNumber} .attempts span`);
        if (attemptsElement) {
            attemptsElement.textContent = this.attempts[puzzleNumber];
        }
    }

    completeGame() {
        this.stopTimer();
        this.saveToLeaderboard();
        this.showEndingScreen();
    }

    showFinalStats() {
        const finalStats = document.getElementById('finalStats');
        if (!finalStats) return;
        
        const timeSpent = this.getElapsedTime();
        const totalAttempts = Object.values(this.attempts).reduce((a, b) => a + b, 0);
        
        finalStats.innerHTML = `
            <div class="stat-item">
                <span>اللاعب:</span>
                <span>${this.playerName}</span>
            </div>
            <div class="stat-item">
                <span>الوقت المستغرق:</span>
                <span>${timeSpent}</span>
            </div>
            <div class="stat-item">
                <span>إجمالي المحاولات:</span>
                <span>${totalAttempts}</span>
            </div>
            <div class="stat-item">
                <span>المستوى:</span>
                <span>${totalAttempts <= 10 ? '👑 ممتاز' : totalAttempts <= 15 ? '⭐ جيد جداً' : '👍 جيد'}</span>
            </div>
        `;
    }

    getElapsedTime() {
        if (!this.startTime) return '00:00';
        const end = new Date();
        const diff = Math.floor((end - this.startTime) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    loadLeaderboard() {
        try {
            const saved = localStorage.getItem('puzzleLeaderboard');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveToLeaderboard() {
        const playerData = {
            name: this.playerName,
            time: this.getElapsedTime(),
            timestamp: new Date().toISOString(),
            attempts: Object.values(this.attempts).reduce((a, b) => a + b, 0)
        };
        
        this.leaderboard.push(playerData);
        this.leaderboard.sort((a, b) => {
            const timeA = this.timeToSeconds(a.time);
            const timeB = this.timeToSeconds(b.time);
            return timeA - timeB;
        });
        
        this.leaderboard = this.leaderboard.slice(0, 10);
        
        try {
            localStorage.setItem('puzzleLeaderboard', JSON.stringify(this.leaderboard));
        } catch (error) {
            console.log('⚠️ لا يمكن حفظ البيانات');
        }
        
        this.updateLeaderboard();
    }

    timeToSeconds(timeStr) {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    updateLeaderboard() {
        const topPlayers = document.getElementById('topPlayers');
        if (!topPlayers) return;
        
        if (this.leaderboard.length === 0) {
            topPlayers.innerHTML = '<div class="player-rank">لا توجد نتائج سابقة</div>';
            return;
        }
        
        topPlayers.innerHTML = this.leaderboard.slice(0, 5).map((player, index) => `
            <div class="player-rank">
                <span>${index + 1}. ${player.name}</span>
                <span>${player.time}</span>
            </div>
        `).join('');
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    restartGame() {
        this.playerName = '';
        this.startTime = null;
        this.currentPuzzle = 1;
        this.attempts = {1: 0, 2: 0, 3: 0, 4: 0};
        this.stopTimer();
        this.showRegisterScreen();
        
        const nameInput = document.getElementById('playerName');
        if (nameInput) nameInput.value = '';
        
        this.showMessage('🔄 ابدأ تحدياً جديداً!');
    }
}

const gameManager = new GameManager();
