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
                explanation: "النمط: فعل ماضي ثلاثي (كتب، قرأ، سمع) → الفعل الرابع: شاهد",
                hints: [
                    "انظر إلى نوع الكلمات وتركيبها",
                    "هذه أفعال لها نمط معين في اللغة العربية",
                    "الكلمات الثلاثة تبدأ بحروف مختلفة لكن لها هيكل متشابه",
                    "ما هو الفعل الماضي الثلاثي الذي ينتهي بنفس النمط؟",
                    "فكر في أفعال الحواس والإدراك"
                ]
            },
            2: {
                title: "اللغز الثاني: المتتالية الذكية",
                question: `حل المتتالية الرياضية:<br><br>
                <div class="sequence">
                    <div>3, 6, 18, 72, ?</div>
                </div>
                <br>ما هو الرقم التالي؟`,
                solution: "360",
                type: "math",
                explanation: "النمط: ×2, ×3, ×4, ×5 → 3×2=6, 6×3=18, 18×4=72, 72×5=360",
                hints: [
                    "ابحث عن العلاقة بين الأرقام المتتالية",
                    "لا تبحث عن جمع أو طرح، بل عملية أخرى",
                    "انظر إلى العوامل المضروبة بين كل رقم واللاحق",
                    "الأرقام: 2, 3, 4... ما العامل التالي؟",
                    "72 × 5 = ?"
                ]
            },
            3: {
                title: "اللغز الثالث: الشفرة البصرية",
                question: `فك الشفرة البصرية:<br><br>
                <div class="visual-code">
                    <div>🔺 + 🔵 = 🔷</div>
                    <div>🔵 + 🔷 = 🔶</div>
                    <div>🔷 + 🔶 = ?</div>
                </div>
                <br>ما هو الرمز الناتج؟`,
                solution: "⚫",
                type: "visual",
                explanation: "النمط: مثلث + دائرة = مربع أزرق، دائرة + مربع أزرق = مربع برتقالي، مربع أزرق + مربع برتقالي = دائرة سوداء (دمج الألوان والأنماط)",
                hints: [
                    "هذا ليس معادلة رياضية تقليدية",
                    "فكر في دمج الأشكال والألوان",
                    "🔺 (أحمر) + 🔵 (أزرق) = 🔷 (بنفسجي)",
                    "🔵 (أزرق) + 🔷 (بنفسجي) = 🔶 (برتقالي?)",
                    "النتيجة تمثل شكل نهائي من دمج السابقين"
                ]
            },
            4: {
                title: "النهائي: اللغز الفلسفي",
                question: `ما هو الشيء الذي:<br><br>
                <ul class="riddle-list">
                    <li>✧ يملكه الفقير، ويحتاجه الغني</li>
                    <li>✧ يخافه العاقل، ويبحث عنه الجاهل</li>
                    <li>✧ يزيد بالعطاء، وينقص بالاحتفاظ</li>
                </ul>`,
                solution: "المعرفة",
                type: "philosophical",
                explanation: "المعرفة يملكها الفقير (فكرياً)، يحتاجها الغني (للاستمرار)، يخافها العاقل (مسؤوليتها)، يبحث عنها الجاهل، تزيد بالعطاء (التدريس)، تنقص بالكتمان.",
                hints: [
                    "فكر في شيء غير مادي لكنه قيم",
                    "هذا الشيء يتعلق بالعقل والإدراك",
                    "له علاقة بالتعلم والفهم",
                    "كلما أعطيته للآخرين زاد عندك",
                    "يبدأ بحرف الميم"
                ]
            }
        };
    }

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
                <input type="text" id="puzzleAnswer" placeholder="اكتب إجابتك هنا...">
                <button onclick="checkPuzzleAnswer()">تحقق</button>
                <button onclick="askForHint()">تلميح (${curator.hintCount + 1}/5)</button>
            </div>
            
            <div class="ai-feedback" id="aiFeedback"></div>
            
            <div class="hint-counter">
                التلميحات المستخدمة: <span id="hintCount">${curator.hintCount}</span>/5
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
        
        // بعد التلميح الثالث، تبدأ التلميحات تكون أكثر صعوبة
        if (hintLevel >= 3) {
            const advancedHints = [
                "أنت قريب جداً... فكر خارج الصندوق",
                "الجواب أمامك لكنه يحتاج نظرة مختلفة",
                "آخر تلميح: حاول كتابة الإجابة بطريقة مختلفة"
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
            1: ['شاهد', 'شهد', 'رأى', 'راي', 'راى', 'viewed', 'saw'],
            2: ['360', '٣٦٠', 'ثلاثمائة وستون', 'ثلاثمائة وستين'],
            3: ['⚫', 'اسود', 'أسود', 'دائرة سوداء', 'black circle', 'circle black'],
            4: ['المعرفة', 'معرفة', 'علم', 'knowledge', 'knowlege']
        };
        
        const answers = acceptedAnswers[puzzleNumber] || [correctAnswer];
        return answers.includes(userAnswer);
    }

    normalizeAnswer(answer) {
        return answer.toLowerCase()
            .trim()
            .replace(/[َُِّ٠-٩]/g, '') // إزالة التشكيل والأرقام العربية
            .replace(/\s+/g, ' ');
    }

    displayEnding() {
        const score = Math.max(0, 100 - (curator.totalHintsUsed * 15));
        return `
            <div class="ending-screen">
                <h2>🎊 إنجاز استثنائي! 🎊</h2>
                <p>لقد أثبتت أنك مفكر استثنائي</p>
                
                <div class="score-card">
                    <div class="score-item">
                        <span>الألغاز المحلولة:</span>
                        <span>4/4 ✅</span>
                    </div>
                    <div class="score-item">
                        <span>التلميحات المستخدمة:</span>
                        <span>${curator.totalHintsUsed} 🧠</span>
                    </div>
                    <div class="score-item">
                        <span>نتيجتك النهائية:</span>
                        <span class="final-score">${score}%</span>
                    </div>
                </div>
                
                <div class="ending-message">
                    ${score >= 80 ? "👑 عبقرية فذة! أنت تستحق لقب سيد الألغاز" :
                      score >= 60 ? "💎 أداء متميز! عقل تحليلي رائع" :
                      "⭐ جيد جداً! مع الممارسة ستكون الأفضل"}
                </div>
                
                <button onclick="restartGame()">تحدي جديد</button>
            </div>
        `;
    }
}

const puzzleSystem = new PuzzleSystem();
