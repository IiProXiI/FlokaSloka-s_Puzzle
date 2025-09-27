// إدارة اللعبة الرئيسية
class GameManager {
    constructor() {
        this.currentScreen = 'welcome';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        // التأكد من تحميل جميع الأنظمة المطلوبة
        if (typeof puzzleSystem === 'undefined') {
            console.error('puzzleSystem not loaded');
            return;
        }
        
        if (typeof curator === 'undefined') {
            console.error('curator not loaded');
            return;
        }
        
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
        
        // التأكد من وجود النظام والألغاز
        if (!puzzleSystem || !puzzleSystem.displayPuzzle) {
            puzzleContent.innerHTML = '<p class="error">خطأ: لا يمكن تحميل نظام الألغاز</p>';
            return;
        }
        
        puzzleContent.innerHTML = puzzleSystem.displayPuzzle(puzzleNumber);
        
        // تحديث عداد التلميحات
        this.updateHintCounter();
        
        const feedbackElement = document.getElementById('aiFeedback');
        if (feedbackElement) {
            const puzzle = puzzleSystem.puzzles && puzzleSystem.puzzles[puzzleNumber];
            const messages = {
                1: "أهلاً بك في التحدي الأول. هذا لغز لغوي يتطلب فهم الأنماط اللغوية...",
                2: "تحدي رياضي! المتتاليات تحتاج عقلًا تحليليًا دقيقًا...", 
                3: "اللغز الثالث: شفرة بصرية تحتاج تفكيرًا إبداعيًا...",
                4: "التحدي الأخير: لغز فلسفي يعمق التفكير..."
            };
            
            const welcomeMessage = messages[puzzleNumber] || `مرحبًا بك في اللغز ${puzzleNumber}`;
            
            try {
                await curator.typeMessage(welcomeMessage, feedbackElement);
            } catch (error) {
                console.error('Error typing welcome message:', error);
                feedbackElement.innerHTML = welcomeMessage;
            }
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
            hintCountElement.textContent = curator.hintCount || 0;
        }
        
        // تحديث زر التلميح
        const hintButton = document.querySelector('.hint-btn');
        if (hintButton) {
            const currentHintCount = curator.hintCount || 0;
            hintButton.textContent = `طلب تلميح (${currentHintCount + 1}/5)`;
            
            // تعطيل الزر إذا تجاوز الحد
            if (currentHintCount >= 5) {
                hintButton.disabled = true;
                hintButton.style.opacity = '0.6';
                hintButton.style.cursor = 'not-allowed';
            } else {
                hintButton.disabled = false;
                hintButton.style.opacity = '1';
                hintButton.style.cursor = 'pointer';
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
        
        if (!puzzleSystem || !curator) {
            console.error('الأنظمة المطلوبة غير متوفرة');
            return;
        }
        
        const answer = answerInput.value.trim();
        if (!answer) {
            try {
                await curator.typeMessage("❌ <strong>انتبه:</strong> يجب أن تدخل إجابة أولاً...", feedbackElement);
            } catch (error) {
                console.error('Error typing message:', error);
                feedbackElement.innerHTML = "❌ <strong>انتبه:</strong> يجب أن تدخل إجابة أولاً...";
            }
            answerInput.focus();
            return;
        }

        try {
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
                        const puzzleContent = document.getElementById('puzzleContent');
                        if (puzzleContent && puzzleSystem.displayEnding) {
                            puzzleContent.innerHTML = puzzleSystem.displayEnding();
                        }
                    }
                }, 4500);
            } else {
                // إعادة التركيز على حقل الإجابة بعد الخطأ
                setTimeout(() => answerInput.focus(), 1000);
            }
            
            // تحديث العداد بعد التحقق
            this.updateHintCounter();
            
        } catch (error) {
            console.error('Error in checkPuzzleAnswer:', error);
            feedbackElement.innerHTML = "❌ حدث خطأ أثناء التحقق من الإجابة. حاول مرة أخرى.";
        }
    }

    // طلب تلميح
    async askForHint() {
        if (!curator || !puzzleSystem) {
            console.error('الأنظمة المطلوبة غير متوفرة');
            return;
        }
        
        if (curator.hintCount >= 5) {
            const feedbackElement = document.getElementById('aiFeedback');
            if (feedbackElement) {
                try {
                    await curator.typeMessage("❌ <strong>انتهت التلميحات:</strong> لقد استخدمت جميع التلميحات المتاحة. حاول حل اللغز بطريقتك الخاصة.", feedbackElement);
                } catch (error) {
                    console.error('Error typing hint limit message:', error);
                    feedbackElement.innerHTML = "❌ <strong>انتهت التلميحات:</strong> لقد استخدمت جميع التلميحات المتاحة. حاول حل اللغز بطريقتك الخاصة.";
                }
            }
            return;
        }
        
        const feedbackElement = document.getElementById('aiFeedback');
        if (!feedbackElement) return;
        
        try {
            // الحصول على التلميح باستخدام العداد الحالي
            const hint = puzzleSystem.getHint(puzzleSystem.currentPuzzle, curator.hintCount);
            
            if (!hint || typeof hint !== 'string') {
                feedbackElement.innerHTML = "❌ <strong>خطأ:</strong> لا يمكن تحميل التلميح في الوقت الحالي. حاول مرة أخرى.";
                return;
            }
            
            // زيادة عداد التلميحات بعد الحصول على التلميح
            curator.hintCount++;
            curator.totalHintsUsed++;
            
            // إنشاء رسالة التلميح مع المقدمة
            const hintIntros = [
                "💡 <strong>فكرة:</strong> ",
                "🧠 <strong>زاوية تفكير:</strong> ",
                "🔍 <strong>وجهة نظر:</strong> ",
                "🎯 <strong>توجيه:</strong> ",
                "⚡ <strong>إضاءة:</strong> "
            ];
            
            const intro = hintIntros[Math.min(curator.hintCount - 1, hintIntros.length - 1)];
            const fullHintMessage = intro + hint;
            
            await curator.typeMessage(fullHintMessage, feedbackElement);
            
            // تحديث العداد بعد طلب التلميح
            this.updateHintCounter();
            
        } catch (error) {
            console.error('Error in askForHint:', error);
            feedbackElement.innerHTML = "❌ حدث خطأ أثناء تحميل التلميح. حاول مرة أخرى.";
        }
    }

    // إعادة اللعبة
    restartGame() {
        if (!puzzleSystem || !curator) {
            console.error('لا يمكن إعادة تشغيل اللعبة - الأنظمة المطلوبة غير متوفرة');
            return;
        }
        
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
    // انتظار تحميل جميع الملفات قبل بدء اللعبة
    setTimeout(() => {
        if (typeof puzzleSystem !== 'undefined' && typeof curator !== 'undefined') {
            window.gameManager = new GameManager();
        } else {
            console.error('Required systems not loaded. Retrying...');
            setTimeout(() => {
                if (typeof puzzleSystem !== 'undefined' && typeof curator !== 'undefined') {
                    window.gameManager = new GameManager();
                } else {
                    console.error('Failed to load required systems');
                }
            }, 1000);
        }
    }, 100);
});

// دالات عامة للاستخدام في HTML
function startJourney() {
    if (window.gameManager) {
        gameManager.startJourney();
    } else {
        console.error('Game manager not initialized');
        // محاولة إعادة التهيئة
        if (typeof puzzleSystem !== 'undefined' && typeof curator !== 'undefined') {
            window.gameManager = new GameManager();
            setTimeout(() => gameManager.startJourney(), 100);
        }
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
    if (window.puzzleSystem && typeof window.puzzleSystem.shareResults === 'function') {
        puzzleSystem.shareResults();
    } else {
        console.error('Share results function not available');
    }
}

// دعم الإدخال بالزر Enter
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const puzzleScreen = document.getElementById('puzzleScreen');
        if (puzzleScreen && puzzleScreen.style.display !== 'none') {
            checkPuzzleAnswer();
        }
    }
});
