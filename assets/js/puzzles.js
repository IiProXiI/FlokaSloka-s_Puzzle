// نظام الألغاز المحسّن
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = 1;
        this.puzzles = {
            1: {
                title: "اللغز الأول: الشيفرة المتقاطعة",
                question: `أكمل النمط اللغوي:<br><br>
                <div class="puzzle-grid">
                    <div class="word-box">كـ تـ ـب</div>
                    <div class="word-box">قـ رـ ـأ</div>
                    <div class="word-box">سـ مـ ـع</div>
                    <div class="word-box">؟ ؟ ؟</div>
                </div>
                <br>ما هي الكلمة الرابعة التي تتبع النمط؟`,
                solution: "شاهد",
                type: "linguistic",
                explanation: "النمط: فعل ماضي ثلاثي (كتب، قرأ، سمع) → الفعل الرابع: شاهد. جميعها أفعال إدراك وحواس.",
                hints: [
                    "انظر إلى نوع الكلمات وتركيبها النحوي",
                    "هذه أفعال لها نمط معين في اللغة العربية",
                    "الكلمات الثلاثة تبدأ بحروف مختلفة لكن لها هيكل متشابه",
                    "ما هو الفعل الماضي الثلاثي الذي ينتهي بنفس النمط؟",
                    "فكر في أفعال الحواس والإدراك البشري"
                ]
            },
            2: {
                title: "اللغز الثاني: المتتالية الذكية", 
                question: `حل المتتالية الرياضية:<br><br>
                <div class="sequence">
                    <span class="number">3</span>
                    <span class="number">6</span>
                    <span class="number">18</span>
                    <span class="number">72</span>
                    <span class="number">?</span>
                </div>
                <br>ما هو الرقم التالي في هذه المتتالية؟`,
                solution: "360",
                type: "math",
                explanation: "النمط: ×2, ×3, ×4, ×5 → 3×2=6, 6×3=18, 18×4=72, 72×5=360. كل رقم يضرب برقم متسلسل.",
                hints: [
                    "ابحث عن العلاقة بين الأرقام المتتالية",
                    "لا تبحث عن جمع أو طرح، بل عملية رياضية أخرى",
                    "انظر إلى العوامل المضروبة بين كل رقم واللاحق",
                    "الأرقام: 2, 3, 4... ما العامل التالي في التسلسل؟",
                    "جرب ضرب آخر رقم في العامل التالي"
                ]
            },
            3: {
                title: "اللغز الثالث: الشفرة البصرية",
                question: `فك الشفرة البصرية:<br><br>
                <div class="visual-code">
                    <div class="code-line">🔺 + 🔵 = 🔷</div>
                    <div class="code-line">🔵 + 🔷 = 🔶</div>
                    <div class="code-line">🔷 + 🔶 = ?</div>
                </div>
                <br>ما هو الرمز الناتج عن المعادلة الثالثة؟`,
                solution: "⚫",
                type: "visual",
                explanation: "النمط: 🔺 (أحمر) + 🔵 (أزرق) = 🔷 (بنفسجي)، 🔵 (أزرق) + 🔷 (بنفسجي) = 🔶 (أحمر مزرق)، 🔷 (بنفسجي) + 🔶 (أحمر مزرق) = ⚫ (أسود - دمج جميع الألوان).",
                hints: [
                    "هذا ليس معادلة رياضية تقليدية",
                    "فكر في نظرية دمج الألوان والأشكال",
                    "🔺 تمثل لوناً أساسياً و 🔵 تمثل لوناً أساسياً آخر",
                    "نتيجة الدمج تعطي لوناً ثانوياً",
                    "النتيجة النهائية تمثل دمج جميع الألوان السابقة"
                ]
            },
            4: {
                title: "النهائي: اللغز الفلسفي",
                question: `ما هو الشيء الذي:<br><br>
                <ul class="riddle-list">
                    <li>✧ يملكه الفقير، ويحتاجه الغني</li>
                    <li>✧ يخافه العاقل، ويبحث عنه الجاهل</li>
                    <li>✧ يزيد بالعطاء، وينقص بالاحتفاظ</li>
                    <li>✧ هو كنز لا يفنى، وسلاح لا ينكسر</li>
                </ul>`,
                solution: "المعرفة",
                type: "philosophical", 
                explanation: "المعرفة يملكها الفقير (فكرياً)، يحتاجها الغني (للاستمرار)، يخافها العاقل (مسؤوليتها)، يبحث عنها الجاهل، تزيد بالعطاء (التدريس)، تنقص بالكتمان. هي كنز لا يفنى وسلاح قوي.",
                hints: [
                    "فكر في شيء غير مادي لكنه قيم ومؤثر",
                    "هذا الشيء يتعلق بالعقل والإدراك والفهم",
                    "له علاقة بالتعلم والثقافة والوعي",
                    "كلما أعطيته للآخرين زاد عندك ولم ينقص",
                    "يبدأ بحرف الميم وهو أساس التقدم والحضارة"
                ]
            }
        };
    }

    // عرض اللغز الحالي
    displayPuzzle(puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return this.displayEnding();
        
        return `
            <div class="puzzle-header">
                <h2>${puzzle.title}</h2>
                <div class="difficulty">صعوبة: ${this.getDifficultyStars(puzzleNumber)}</div>
            </div>
            
            <div class="puzzle-question">
                ${puzzle.question}
            </div>
            
            <div class="puzzle-interaction">
                <input type="text" id="puzzleAnswer" placeholder="اكتب إجابتك هنا..." autocomplete="off">
                <div class="buttons-container">
                    <button onclick="checkPuzzleAnswer()" class="submit-btn">تحقق من الإجابة</button>
                    <button onclick="askForHint()" class="hint-btn">طلب تلميح (${curator.hintCount + 1}/5)</button>
                </div>
            </div>
            
            <div class="ai-feedback" id="aiFeedback"></div>
            
            <div class="hint-counter">
                <span>التلميحات المستخدمة في هذا اللغز: </span>
                <strong id="hintCount">${curator.hintCount}</strong>/5
            </div>
            
            <div class="progress-container">
                <div class="progress-text">التقدم: اللغز ${puzzleNumber} من 4</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(puzzleNumber - 1) * 25}%"></div>
                </div>
            </div>
        `;
    }

    getDifficultyStars(puzzleNumber) {
        const stars = "★".repeat(puzzleNumber) + "☆".repeat(4 - puzzleNumber);
        return stars;
    }

    getHint(puzzleNumber, hintLevel) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle || !puzzle.hints) return "حاول التفكير بطريقة مختلفة...";
        
        // بعد التلميح الثالث، تبدأ التلميحات تكون أكثر تحديًا
        if (hintLevel >= 3) {
            const advancedHints = [
                "أنت قريب جداً من الحل... فكر خارج الصندوق",
                "الجواب أمامك لكنه يحتاج نظرة مختلفة وزاوية جديدة",
                "آخر تلميح: حاول كتابة الإجابة بطريقة مختلفة أو مرادفات"
            ];
            return advancedHints[Math.min(hintLevel - 3, advancedHints.length - 1)];
        }
        
        return hintLevel < puzzle.hints.length ? puzzle.hints[hintLevel] : puzzle.hints[puzzle.hints.length - 1];
    }

    checkAnswer(answer, puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return false;
        
        const userAnswer = this.normalizeAnswer(answer);
        const correctAnswer = this.normalizeAnswer(puzzle.solution);
        
        // قبول إجابات متعددة لكل لغز
        const acceptedAnswers = {
            1: ['شاهد', 'شهد', 'رأى', 'راي', 'راى', 'viewed', 'saw', 'see'],
            2: ['360', '٣٦٠', 'ثلاثمائة وستون', 'ثلاثمائة وستين', '360'],
            3: ['⚫', 'اسود', 'أسود', 'دائرة سوداء', 'black circle', 'circle black', 'nero'],
            4: ['المعرفة', 'معرفة', 'علم', 'knowledge', 'knowlege', 'علم']
        };
        
        const answers = acceptedAnswers[puzzleNumber] || [correctAnswer];
        return answers.includes(userAnswer);
    }

    normalizeAnswer(answer) {
        return answer.toLowerCase()
            .trim()
            .replace(/[َُِّ٠-٩]/g, '') // إزالة التشكيل والأرقام العربية
            .replace(/\s+/g, ' ')
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // إزالة علامات الترقيم
    }

    // نهاية اللعبة
    displayEnding() {
        const finalRating = curator.getFinalRating();
        const percentage = Math.round((curator.playerScore / 400) * 100);
        
        return `
            <div class="ending-screen">
                <div class="ending-header">
                    <h2>🎊 إنجاز استثنائي! 🎊</h2>
                    <div class="trophy">🏆</div>
                </div>
                
                <p>لقد أثبتت أنك مفكر استثنائي وأكملت جميع التحديات</p>
                
                <div class="score-card">
                    <div class="score-item">
                        <span>الألغاز المحلولة:</span>
                        <span class="score-value">4/4 ✅</span>
                    </div>
                    <div class="score-item">
                        <span>التلميحات المستخدمة:</span>
                        <span class="score-value">${curator.totalHintsUsed} 🧠</span>
                    </div>
                    <div class="score-item">
                        <span>النقاط الكلية:</span>
                        <span class="score-value">${curator.playerScore} نقطة</span>
                    </div>
                    <div class="score-item final-score-item">
                        <span>تقييمك النهائي:</span>
                        <span class="final-score" style="color: ${finalRating.color}">${percentage}%</span>
                    </div>
                </div>
                
                <div class="ending-message" style="border-color: ${finalRating.color}">
                    <strong>${finalRating.level}</strong>
                    <p>لقد أظهرت مهارات تحليلية رائعة وقدرة على التفكير النقدي</p>
                </div>
                
                <div class="ending-actions">
                    <button onclick="restartGame()" class="restart-btn">تحدي جديد</button>
                    <button onclick="shareResults()" class="share-btn">مشاركة النتائج</button>
                </div>
            </div>
        `;
    }
}

const puzzleSystem = new PuzzleSystem();

// دالة مشاركة النتائج
function shareResults() {
    const rating = curator.getFinalRating();
    const text = `حللت ${curator.playerLevel - 1} من 4 ألغاز في المتحف الافتراضي بنتيجة ${Math.round((curator.playerScore / 400) * 100)}%! ${rating.level}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتيجة تحدي الألغاز',
            text: text,
            url: window.location.href
        });
    } else {
        alert(text + '\n\nانسخ النص ومشاركته مع أصدقائك!');
    }
}
