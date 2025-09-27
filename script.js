class HackingDevice {
    constructor() {
        this.currentScreen = 'boot';
        this.currentGame = null;
        this.userInput = '';
        this.score = 0;
        this.isPoweredOn = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.powerOn();
        
        // تحديث الساعة كل ثانية
        setInterval(() => this.updateClock(), 1000);
    }

    powerOn() {
        this.isPoweredOn = true;
        this.showBootScreen();
        
        // الانتقال التلقائي للقائمة الرئيسية
        setTimeout(() => {
            this.showMainMenu();
        }, 4000);
    }

    powerOff() {
        this.isPoweredOn = false;
        this.showBootScreen();
    }

    setupEventListeners() {
        // أزرار الأرقام
        document.querySelectorAll('.key.num').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleKeyPress(e.target.dataset.key);
            });
        });

        // أزرار الوظائف
        document.querySelectorAll('.key.func').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFunctionKey(e.target.dataset.key);
            });
        });

        // أزرار الملاحة
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleNavigation(e.target.dataset.action);
            });
        });

        // أحداث لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (!this.isPoweredOn) return;
            
            if (e.key >= '0' && e.key <= '9') {
                this.handleKeyPress(e.key);
            } else if (e.key === 'Enter') {
                this.handleFunctionKey('enter');
            } else if (e.key === 'Backspace') {
                this.handleFunctionKey('backspace');
            } else if (e.key === 'Escape') {
                this.handleFunctionKey('clear');
            } else if (e.key === 'ArrowUp') {
                this.handleNavigation('up');
            } else if (e.key === 'ArrowDown') {
                this.handleNavigation('down');
            } else if (e.key === 'ArrowLeft') {
                this.handleNavigation('left');
            } else if (e.key === 'ArrowRight') {
                this.handleNavigation('right');
            }
        });

        // صوت الأزرار
        this.setupSounds();
    }

    setupSounds() {
        this.keySound = document.getElementById('keySound');
        this.beepSound = document.getElementById('beepSound');
    }

    playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {}); // تجاهل الأخطاء
        }
    }

    handleKeyPress(key) {
        if (!this.isPoweredOn) return;
        
        this.playSound(this.keySound);
        
        if (this.currentGame === 'hacking') {
            this.userInput += key;
            this.updateGameDisplay();
        } else {
            // تأثيرات عامة للأزرار
            this.showMessage(`KEY PRESSED: ${key}`);
        }
    }

    handleFunctionKey(func) {
        if (!this.isPoweredOn) return;
        
        this.playSound(this.beepSound);
        
        switch(func) {
            case 'enter':
                this.handleEnter();
                break;
            case 'backspace':
                this.userInput = this.userInput.slice(0, -1);
                this.updateGameDisplay();
                break;
            case 'clear':
                this.userInput = '';
                this.updateGameDisplay();
                break;
            case 'power':
                this.powerOff();
                break;
        }
    }

    handleNavigation(action) {
        if (!this.isPoweredOn) return;
        
        this.playSound(this.keySound);
        
        // التنقل في القوائم
        const menuItems = document.querySelectorAll('.menu-item');
        let activeIndex = -1;
        
        menuItems.forEach((item, index) => {
            if (item.classList.contains('active')) {
                activeIndex = index;
            }
        });
        
        switch(action) {
            case 'up':
                if (activeIndex > 0) {
                    menuItems[activeIndex].classList.remove('active');
                    menuItems[activeIndex - 1].classList.add('active');
                }
                break;
            case 'down':
                if (activeIndex < menuItems.length - 1) {
                    menuItems[activeIndex].classList.remove('active');
                    menuItems[activeIndex + 1].classList.add('active');
                }
                break;
            case 'select':
                this.handleMenuSelect();
                break;
        }
    }

    handleEnter() {
        if (this.currentGame === 'hacking') {
            this.checkHackSolution();
        }
    }

    handleMenuSelect() {
        const activeItem = document.querySelector('.menu-item.active');
        if (activeItem) {
            const gameType = activeItem.dataset.game;
            this.startGame(gameType);
        }
    }

    showBootScreen() {
        this.currentScreen = 'boot';
        const content = `
            <div class="welcome-screen">
                <div class="hacker-text">>_ CYBER-SEC v2.1 BOOTING...</div>
                <div class="loading-bar">
                    <div class="progress"></div>
                </div>
                <div class="status">INITIALIZING HACKING MODULES...</div>
            </div>
        `;
        this.updateScreen(content);
    }

    showMainMenu() {
        this.currentScreen = 'menu';
        this.currentGame = null;
        
        const content = `
            <div class="game-screen">
                <div class="game-title">🔓 MAIN MENU</div>
                <ul class="menu-list">
                    <li class="menu-item active" data-game="hacking">🚀 HACKING GAME</li>
                    <li class="menu-item" data-game="codebreaker">🔢 CODE BREAKER</li>
                    <li class="menu-item" data-game="memory">🧠 MEMORY CHALLENGE</li>
                    <li class="menu-item" data-game="wire">🔌 WIRE SEQUENCE</li>
                    <li class="menu-item" data-game="settings">⚙️ SYSTEM SETTINGS</li>
                </ul>
            </div>
        `;
        this.updateScreen(content);
    }

    startGame(gameType) {
        this.currentGame = gameType;
        this.userInput = '';
        this.score = 0;
        
        switch(gameType) {
            case 'hacking':
                this.startHackingGame();
                break;
            case 'codebreaker':
                this.startCodeBreaker();
                break;
            case 'memory':
                this.startMemoryGame();
                break;
            case 'wire':
                this.startWireGame();
                break;
            default:
                this.showMainMenu();
        }
    }

    startHackingGame() {
        this.generateNewCode();
        
        const content = `
            <div class="game-screen hack-game">
                <div class="game-title">🔓 HACKING CHALLENGE</div>
                <div class="code-display">${this.targetCode}</div>
                <div class="input-display typing">${this.userInput}</div>
                <div class="timer">TIME: <span id="hackTimer">30</span>s</div>
                <div class="result" id="hackResult"></div>
                <div class="score">SCORE: ${this.score}</div>
            </div>
        `;
        this.updateScreen(content);
        
        this.startHackTimer();
    }

    generateNewCode() {
        this.targetCode = '';
        for (let i = 0; i < 6; i++) {
            this.targetCode += Math.floor(Math.random() * 10);
        }
    }

    startHackTimer() {
        let timeLeft = 30;
        const timerElement = document.getElementById('hackTimer');
        const timer = setInterval(() => {
            timeLeft--;
            if (timerElement) timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.showGameResult('TIME UP! MISSION FAILED');
                setTimeout(() => this.showMainMenu(), 3000);
            }
        }, 1000);
        
        this.gameTimer = timer;
    }

    updateGameDisplay() {
        const inputDisplay = document.querySelector('.input-display');
        if (inputDisplay) {
            inputDisplay.textContent = this.userInput;
            inputDisplay.classList.add('typing');
        }
    }

    checkHackSolution() {
        if (this.userInput === this.targetCode) {
            this.score += 100;
            this.showGameResult('✅ ACCESS GRANTED! +100 POINTS');
            clearInterval(this.gameTimer);
            
            setTimeout(() => {
                this.generateNewCode();
                this.userInput = '';
                this.startHackingGame();
            }, 2000);
        } else {
            this.showGameResult('❌ ACCESS DENIED! TRY AGAIN');
            this.userInput = '';
            this.updateGameDisplay();
        }
    }

    showGameResult(message) {
        const resultElement = document.getElementById('hackResult');
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.className = 'result glow';
        }
    }

    updateScreen(content) {
        const screenContent = document.getElementById('screenContent');
        if (screenContent) {
            screenContent.innerHTML = content;
        }
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timestampElement = document.getElementById('timestamp');
        if (timestampElement) {
            timestampElement.textContent = timeString;
        }
    }

    showMessage(message) {
        // يمكن إضافة رسائل عابرة هنا
        console.log(message);
    }
}

// تهيئة الجهاز عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.hackingDevice = new HackingDevice();
});

// تأثيرات إضافية
document.addEventListener('DOMContentLoaded', () => {
    // إضافة تأثير المصفوفة
    const matrixEffect = document.createElement('div');
    matrixEffect.className = 'matrix-effect';
    document.querySelector('.screen').appendChild(matrixEffect);
    
    // تأثيرات عشوائية للنص
    setInterval(() => {
        const texts = document.querySelectorAll('.hacker-text, .status');
        texts.forEach(text => {
            if (Math.random() > 0.7) {
                text.style.opacity = Math.random() > 0.5 ? '1' : '0.7';
            }
        });
    }, 1000);
});
