class GameManager {
    constructor() {
        this.playerName = '';
        this.startTime = null;
        this.timerInterval = null;
        this.currentPuzzle = 1;
        this.init();
    }

    init() {
        console.log('🎮 Game Manager initialized');
        this.showRegisterScreen();
        this.updateProgressSteps();
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
        
        // تحديث اسم اللاعب
        document.getElementById('currentPlayer').textContent = `اللاعب: ${name}`;
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
        this.currentPuzzle = puzzleNumber;
        this.updateProgressSteps();
        
        const puzzleContent = document.getElementById('puzzleContent');
        
        // محتوى مؤقت للألغاز
        const puzzles = {
            1: this.getPuzzle1Content(),
            2: this.getPuzzle2Content(),
            3: this.getPuzzle3Content(),
            4: this.getPuzzle4Content()
        };
        
        puzzleContent.innerHTML = puzzles[puzzleNumber] || '<p>اللغز غير متوفر</p>';
    }

    updateProgressSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            if (index + 1 <= this.currentPuzzle) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
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
                    <button onclick="gameManager.checkAnswer(1)" class="submit-btn">تحقق</button>
                </div>
                
                <div class="attempts">المحاولات: <span id="attempts1">0</span>/10</div>
            </div>
        `;
    }

    getPuzzle2Content() {
        return `
            <div class="puzzle-2">
                <h3>🎵 اللغز الثاني: الرسالة الصوتية</h3>
                <div class="audio-box">
                    <p>استمع إلى الصوت وحاول فهم الرسالة المخفية</p>
                    <div class="audio-controls">
                        <button class="audio-btn">▶ تشغيل</button>
                        <span class="play-count">عدد التشغيل: 0/5</span>
                    </div>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle2Answer" placeholder="ما هي الرسالة التي سمعتها؟">
                    <button onclick="gameManager.checkAnswer(2)" class="submit-btn">تحقق</button>
                </div>
            </div>
        `;
    }

    getPuzzle3Content() {
        return `
            <div class="puzzle-3">
                <h3>🧩 اللغز الثالث: متاهة الحروف</h3>
                <div class="maze-box">
                    <p>استخدم مفاتيح الأسهم للتحرك وجمع الحروف</p>
                    <div class="maze-placeholder">
                        🎮 المتاهة ستظهر هنا
                    </div>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle3Answer" placeholder="اكتب الجملة التي جمعتها">
                    <button onclick="gameManager.checkAnswer(3)" class="submit-btn">تحقق</button>
                </div>
            </div>
        `;
    }

    getPuzzle4Content() {
        return `
            <div class="puzzle-4">
                <h3>🚫 اللغز الرابع: التحدي النهائي</h3>
                <div class="final-puzzle">
                    <p>ما هو الرقم الذي يمثل إجابة السؤال النهائي عن الحياة والكون وكل شيء؟</p>
                    <div class="hint">💡 إجابة فلسفية مشهورة</div>
                </div>
                
                <div class="solution-input">
                    <input type="text" id="puzzle4Answer" placeholder="الإجابة النهائية...">
                    <button onclick="gameManager.checkAnswer(4)" class="submit-btn">تحقق</button>
                </div>
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
        const userAnswer = input ? input.value.trim().toUpperCase() : '';
        
        if (userAnswer === answers[puzzleNumber].toUpperCase()) {
            this.showMessage('🎉 إجابة صحيحة! تقدم إلى اللغز التالي');
            
            if (puzzleNumber < 4) {
                setTimeout(() => {
                    this.loadPuzzle(puzzleNumber + 1);
                }, 2000);
            } else {
                this.showEnding();
            }
        } else {
            this.showMessage('❌ إجابة خاطئة، حاول مرة أخرى');
        }
    }

    showMessage(text) {
        // إنشاء رسالة عائمة
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        message.textContent = text;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showEnding() {
        this.showMessage('🏆 تهانينا! لقد أكملت جميع الألغاز');
        // هنا سيتم إضافة شاشة النهاية الكاملة
    }
}

// إنشاء نسخة من المدير عند تحميل الصفحة
let gameManager;

document.addEventListener('DOMContentLoaded', function() {
    gameManager = new GameManager();
    console.log('🎯 Game ready!');
});
