class GameManager {
    constructor() {
        this.playerName = '';
        this.startTime = null;
        this.timerInterval = null;
        this.currentPuzzle = 1;
        this.attempts = {1: 0, 2: 0, 3: 0, 4: 0};
        this.maxAttempts = 5;
        this.audioPlayCount = 0;
        this.maxAudioPlays = 3;
        this.leaderboard = this.loadLeaderboard();
        this.audioElement = null;
        this.mazeGame = null;
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

        // أحداث الحركة للمتاهة
        document.addEventListener('keydown', (e) => {
            if (this.currentPuzzle === 3 && this.mazeGame) {
                switch(e.key) {
                    case 'ArrowUp': case 'w': case 'W':
                        this.mazeGame.movePlayer('up');
                        break;
                    case 'ArrowDown': case 's': case 'S':
                        this.mazeGame.movePlayer('down');
                        break;
                    case 'ArrowLeft': case 'a': case 'A':
                        this.mazeGame.movePlayer('left');
                        break;
                    case 'ArrowRight': case 'd': case 'D':
                        this.mazeGame.movePlayer('right');
                        break;
                }
            }
        });
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
        
        if (puzzleNumber === 2) {
            this.audioPlayCount = 0;
        }
        
        const puzzleContent = document.getElementById('puzzleContent');
        const puzzles = {
            1: this.getPuzzle1Content(),
            2: this.getPuzzle2Content(),
            3: this.getPuzzle3Content(),
            4: this.getPuzzle4Content()
        };
        
        puzzleContent.innerHTML = puzzles[puzzleNumber] || '<p>اللغز غير متوفر</p>';
        
        if (puzzleNumber === 3) {
            setTimeout(() => {
                this.mazeGame = new MazeGame();
            }, 100);
        }
        
        setTimeout(() => {
            this.setupPuzzleEventListeners();
        }, 100);
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
        if (this.currentPuzzle === 1) {
            const submitBtn = document.querySelector('.puzzle-1 .submit-btn');
            const input = document.getElementById('puzzle1Answer');
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.checkAnswer(1));
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer(1);
                    }
                });
            }
        }
        
        if (this.currentPuzzle === 2) {
            const playBtn = document.getElementById('playAudioBtn');
            const stopBtn = document.getElementById('stopAudioBtn');
            const submitBtn = document.getElementById('submitPuzzle2');
            const input = document.getElementById('puzzle2Answer');
            
            if (playBtn) {
                playBtn.addEventListener('click', () => this.playAudio());
            }
            
            if (stopBtn) {
                stopBtn.addEventListener('click', () => this.stopAudio());
            }
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.checkAnswer(2));
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer(2);
                    }
                });
            }
        }
        
        if (this.currentPuzzle === 3) {
            const submitBtn = document.getElementById('submitPuzzle3');
            const input = document.getElementById('puzzle3Answer');
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.checkAnswer(3));
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer(3);
                    }
                });
            }

            // أزرار التحكم للموبايل
            this.setupMobileControls();
        }
        
        if (this.currentPuzzle === 4) {
            const submitBtn = document.querySelector('.puzzle-4 .submit-btn');
            const input = document.getElementById('puzzle4Answer');
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.checkAnswer(4));
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.checkAnswer(4);
                    }
                });
            }
        }
    }

    setupMobileControls() {
        const controlsContainer = document.getElementById('mobileControls');
        if (!controlsContainer) return;

        // إزالة أي أزرار موجودة مسبقاً
        controlsContainer.innerHTML = '';

        const directions = [
            { dir: 'up', symbol: '↑', label: 'أعلى' },
            { dir: 'left', symbol: '←', label: 'يسار' },
            { dir: 'right', symbol: '→', label: 'يمين' },
            { dir: 'down', symbol: '↓', label: 'أسفل' }
        ];

        directions.forEach(({ dir, symbol, label }) => {
            const btn = document.createElement('button');
            btn.className = 'mobile-control-btn';
            btn.innerHTML = `${symbol}<span>${label}</span>`;
            btn.addEventListener('click', () => {
                if (this.mazeGame) {
                    this.mazeGame.movePlayer(dir);
                }
            });
            controlsContainer.appendChild(btn);
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
                    <p class="hint">💡 الكلمة الصحيحة هي: good</p>
                    
                    <div class="audio-controls">
                        <button class="audio-btn" id="playAudioBtn">▶ تشغيل الصوت</button>
                        <button class="audio-btn" id="stopAudioBtn">⏹ إوقف الصوت</button>
                    </div>
                    <div class="play-count" id="playCount">عدد التشغيل: ${this.audioPlayCount}/${this.maxAudioPlays}</div>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle2Answer" placeholder="ما هي الكلمة التي سمعتها؟">
                    <button class="submit-btn" id="submitPuzzle2">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span id="attempts2">${this.attempts[2]}</span>/${this.maxAttempts}</div>
            </div>
        `;
    }

    getPuzzle3Content() {
        return `
            <div class="puzzle-3">
                <h3>🧩 اللغز الثالث: متاهة الحروف</h3>
                <div class="cipher-box">
                    <p>🎮 حرك اللاعب لجمع الحروف المخفية في المتاهة</p>
                    <p class="hint">💡 الجملة النهائية: "الحكمة ضالة المؤمن"</p>
                    
                    <div class="maze-container">
                        <div id="mazeDisplay" class="maze-display"></div>
                        <div class="maze-info">
                            <div class="collected-letters">
                                <span>الحروف المجموعة:</span>
                                <span id="collectedLetters"></span>
                            </div>
                            <div class="maze-stats">
                                <span>اللاعب: <span class="player-pos" id="playerPos">0,0</span></span>
                            </div>
                        </div>
                    </div>

                    <div id="mobileControls" class="mobile-controls"></div>
                    
                    <div class="controls-help">
                        <p>🕹️ استخدم مفاتيح الأسهم أو الأزرار أعلاه للتحرك</p>
                    </div>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle3Answer" placeholder="اكتب الجملة التي جمعتها">
                    <button class="submit-btn" id="submitPuzzle3">تحقق</button>
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

    playAudio() {
        if (this.audioPlayCount >= this.maxAudioPlays) {
            this.showMessage('❌ لقد استنفذت عدد التشغيلات المسموحة (3 مرات)');
            return;
        }

        if (!this.audioElement) {
            this.audioElement = new Audio('assets/audio/puzzle2.mp3');
            
            this.audioElement.onerror = () => {
                this.showMessage('🔊 تشغيل صوت افتراضي... الكلمة هي: good');
                this.audioElement = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
            };
        }

        this.audioElement.play().catch(error => {
            this.showMessage('🔊 الكلمة الصحيحة هي: good');
        });

        this.audioPlayCount++;
        this.updateAudioDisplay();
        this.showMessage('🔊 تشغيل الصوت... الكلمة هي "good"');
    }

    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.showMessage('⏹ تم إيقاف الصوت');
        }
    }

    updateAudioDisplay() {
        const playCountElement = document.getElementById('playCount');
        if (playCountElement) {
            playCountElement.textContent = `عدد التشغيل: ${this.audioPlayCount}/${this.maxAudioPlays}`;
        }
        
        const playBtn = document.getElementById('playAudioBtn');
        if (playBtn && this.audioPlayCount >= this.maxAudioPlays) {
            playBtn.disabled = true;
            playBtn.style.opacity = '0.5';
            playBtn.textContent = '❌ انتهت المحاولات';
        }
    }

    checkAnswer(puzzleNumber) {
        const answers = {
            1: "THE FOUNDATION OF KNOWLEDGE",
            2: "good", 
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
                this.showMessage(`❌ الجواب الصحيح هو: ${answers[puzzleNumber]}`);
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
                <span>${totalAttempts <= 8 ? '👑 ممتاز' : totalAttempts <= 12 ? '⭐ جيد جداً' : '👍 جيد'}</span>
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
        this.audioPlayCount = 0;
        this.mazeGame = null;
        this.stopTimer();
        this.showRegisterScreen();
        
        const nameInput = document.getElementById('playerName');
        if (nameInput) nameInput.value = '';
        
        this.showMessage('🔄 ابدأ تحدياً جديداً!');
    }
}

class MazeGame {
    constructor() {
        this.size = 10;
        this.playerPos = { x: 0, y: 0 };
        this.collectedLetters = [];
        this.targetLetters = "الحكمة ضالة المؤمن".split('');
        this.letterPositions = [];
        this.maze = [];
        this.init();
    }

    init() {
        this.generateMaze();
        this.placeLetters();
        this.renderMaze();
        this.updateDisplay();
    }

    generateMaze() {
        // إنشاء متاهة بسيطة
        this.maze = [];
        for (let y = 0; y < this.size; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.size; x++) {
                // جعل 70% من الخلايا طرقاً و30% جدراناً
                this.maze[y][x] = Math.random() < 0.7 ? 'path' : 'wall';
            }
        }
        
        // التأكد من أن نقطة البداية والنهاية طرق
        this.maze[0][0] = 'path';
        this.maze[this.size-1][this.size-1] = 'path';
    }

    placeLetters() {
        this.letterPositions = [];
        const usedPositions = new Set();
        
        this.targetLetters.forEach((letter, index) => {
            if (letter === ' ') return; // تخطي المسافات
            
            let pos;
            let attempts = 0;
            
            do {
                pos = {
                    x: Math.floor(Math.random() * this.size),
                    y: Math.floor(Math.random() * this.size)
                };
                attempts++;
            } while (
                (usedPositions.has(`${pos.x},${pos.y}`) || 
                 this.maze[pos.y][pos.x] !== 'path' ||
                 (pos.x === 0 && pos.y === 0)) && attempts < 50
            );
            
            if (attempts < 50) {
                usedPositions.add(`${pos.x},${pos.y}`);
                this.letterPositions.push({ ...pos, letter, collected: false });
            }
        });
    }

    renderMaze() {
        const container = document.getElementById('mazeDisplay');
        if (!container) return;

        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${this.size}, 30px)`;
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                if (this.maze[y][x] === 'wall') {
                    cell.classList.add('wall');
                    cell.textContent = '█';
                } else {
                    cell.classList.add('path');
                    
                    // التحقق من وجود لاعب
                    if (x === this.playerPos.x && y === this.playerPos.y) {
                        cell.classList.add('player');
                        cell.textContent = '😊';
                    }
                    // التحقق من وجود حرف
                    else {
                        const letterPos = this.letterPositions.find(pos => 
                            pos.x === x && pos.y === y && !pos.collected
                        );
                        if (letterPos) {
                            cell.classList.add('letter');
                            cell.textContent = letterPos.letter;
                            cell.title = `حرف: ${letterPos.letter}`;
                        } else {
                            cell.textContent = '·';
                        }
                    }
                }
                
                container.appendChild(cell);
            }
        }
    }

    movePlayer(direction) {
        const newPos = { ...this.playerPos };
        
        switch(direction) {
            case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
            case 'down': newPos.y = Math.min(this.size - 1, newPos.y + 1); break;
            case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
            case 'right': newPos.x = Math.min(this.size - 1, newPos.x + 1); break;
        }
        
        if (this.isValidMove(newPos)) {
            this.playerPos = newPos;
            this.checkLetterCollection();
            this.renderMaze();
            this.updateDisplay();
            
            if (this.checkGameComplete()) {
                this.onGameComplete();
            }
        }
    }

    isValidMove(pos) {
        return pos.x >= 0 && pos.x < this.size && 
               pos.y >= 0 && pos.y < this.size && 
               this.maze[pos.y][pos.x] === 'path';
    }

    checkLetterCollection() {
        const letterIndex = this.letterPositions.findIndex(pos => 
            pos.x === this.playerPos.x && 
            pos.y === this.playerPos.y && 
            !pos.collected
        );
        
        if (letterIndex !== -1) {
            this.letterPositions[letterIndex].collected = true;
            this.collectedLetters.push(this.letterPositions[letterIndex].letter);
            this.showLetterPopup(this.letterPositions[letterIndex].letter);
        }
    }

    showLetterPopup(letter) {
        gameManager.showMessage(`🎉 وجدت حرف: ${letter}`);
    }

    updateDisplay() {
        const collectedElement = document.getElementById('collectedLetters');
        const playerPosElement = document.getElementById('playerPos');
        
        if (collectedElement) {
            collectedElement.textContent = this.collectedLetters.join(' ') || '---';
        }
        
        if (playerPosElement) {
            playerPosElement.textContent = `${this.playerPos.x}, ${this.playerPos.y}`;
        }
    }

    checkGameComplete() {
        return this.collectedLetters.length >= this.letterPositions.length;
    }

    onGameComplete() {
        setTimeout(() => {
            gameManager.showMessage('🎊 مبروك! جمعت جميع الحروف. الجملة هي: "الحكمة ضالة المؤمن"');
        }, 500);
    }
}

const gameManager = new GameManager();
