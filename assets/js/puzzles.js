class PuzzleSystem {
    constructor() {
        this.puzzles = {
            1: {
                title: "اللغز الأول: شفرة القيصر المفقودة",
                type: "cipher",
                cipher: "XLI JSVQEXC ERH TVEGXMSR WXEXC", // الشفرة المشفرة
                solution: "THE FOUNDATION OF KNOWLEDGE", // الحل بعد فك الشفرة
                hint: "ابحث عن تحول 4 أحرف في الأبجدية",
                attempts: 0,
                maxAttempts: 10
            },
            2: {
                title: "اللغز الثاني: الرسالة الصوتية المشفرة", 
                type: "audio",
                audioFile: "assets/audio/puzzle2.mp3",
                solution: "الطريق إلى الحكمة يبدأ بخطوة",
                hint: "استمع جيداً للكلمات المتقطعة في الخلفية",
                playCount: 0,
                maxPlays: 5
            },
            3: {
                title: "اللغز الثالث: متاهة الحروف المبعثرة",
                type: "maze",
                solution: "الحكمة ضالة المؤمن",
                letters: ["ا", "ل", "ح", "ك", "م", "ة", " ", "ض", "ا", "ل", "ة", " ", "ا", "ل", "م", "ؤ", "م", "ن"],
                maze: this.generateMaze(),
                collectedLetters: []
            },
            4: {
                title: "اللغز الرابع: النمط المستحيل",
                type: "pattern",
                solution: "42", // إجابة فلسفية يصعب على AI تخمينها
                pattern: this.generateAntiAIPattern(),
                hint: "فكر في معنى الحياة والوجود",
                isAIProof: true
            }
        };
        this.currentPuzzle = 1;
    }

    // توليد شفرة قيصر (تحول 4 أحرف)
    caesarDecrypt(text, shift) {
        return text.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            }
            return char;
        }).join('');
    }

    // توليد متاهة عشوائية
    generateMaze() {
        const maze = [];
        const size = 15;
        
        // تهيئة المتاهة
        for (let i = 0; i < size; i++) {
            maze[i] = [];
            for (let j = 0; j < size; j++) {
                maze[i][j] = Math.random() > 0.3 ? 0 : 1; // 0: طريق, 1: حائط
            }
        }
        
        // ضمان وجود مسار
        maze[0][0] = 0; // البداية
        maze[size-1][size-1] = 2; // النهاية
        
        return maze;
    }

    // نمط مضاد للذكاء الاصطناعي
    generateAntiAIPattern() {
        return {
            question: "ما هو الرقم الذي يمثل إجابة السؤال النهائي عن الحياة والكون وكل شيء؟",
            images: ["🌌", "🤔", "🔢", "❓"],
            clues: [
                "ليس رقماً عشوائياً",
                "مذكور في أدب الخيال العلمي",
                "يتعلق بالوجود والعدم"
            ]
        };
    }

    // التحقق من الإجابات مع حماية مضادة للغش
    checkAnswer(answer, puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return false;

        // حماية مضادة للذكاء الاصطناعي للغز الرابع
        if (puzzleNumber === 4 && this.detectAIAnswer(answer)) {
            return false;
        }

        const userAnswer = this.normalizeAnswer(answer);
        const correctAnswer = this.normalizeAnswer(puzzle.solution);

        return userAnswer === correctAnswer;
    }

    detectAIAnswer(answer) {
        // كشف إجابات الذكاء الاصطناعي النموذجية
        const aiPatterns = [
            /chatgpt|gpt|ai|assistant|bot/i,
            /كبير|معقد|صعب|لا أعرف|يمكن أن يكون/,
            /\.{3,}|\.$/ // نقاط متتالية
        ];
        
        return aiPatterns.some(pattern => pattern.test(answer));
    }

    normalizeAnswer(answer) {
        return answer.toString()
            .toLowerCase()
            .trim()
            .replace(/[َُِّ٠-٩.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ');
    }

    getPuzzleDisplay(puzzleNumber) {
        const puzzle = this.puzzles[puzzleNumber];
        if (!puzzle) return this.getEndingDisplay();

        switch(puzzle.type) {
            case 'cipher':
                return this.getCipherDisplay(puzzle);
            case 'audio':
                return this.getAudioDisplay(puzzle);
            case 'maze':
                return this.getMazeDisplay(puzzle);
            case 'pattern':
                return this.getPatternDisplay(puzzle);
            default:
                return '<div>نوع اللغز غير معروف</div>';
        }
    }

    getCipherDisplay(puzzle) {
        return `
            <div class="code-breaker">
                <h3>فك شفرة القيصر</h3>
                <div class="cipher-display">${puzzle.cipher}</div>
                <p>${puzzle.hint}</p>
                
                <div class="code-inputs">
                    ${this.generateCodeInputs(26)}
                </div>
                
                <div class="attempts-tracker">
                    المحاولات: ${puzzle.attempts}/${puzzle.maxAttempts}
                </div>
                
                <button onclick="testCipherSolution()" class="btn btn-primary">تحقق من الحل</button>
            </div>
        `;
    }

    generateCodeInputs(count) {
        let inputs = '';
        for (let i = 0; i < count; i++) {
            inputs += `<input type="text" class="code-char" maxlength="1" data-index="${i}">`;
        }
        return inputs;
    }

    getAudioDisplay(puzzle) {
        return `
            <div class="audio-puzzle">
                <h3>الرسالة الصوتية المشفرة</h3>
                <div class="audio-player">
                    <p>استمع إلى الرسالة وحاول فهم الكلمات المخفية</p>
                    <audio id="puzzleAudio" src="${puzzle.audioFile}"></audio>
                    
                    <div class="audio-controls">
                        <button onclick="playAudio()" class="audio-btn">▶ تشغيل الصوت</button>
                        <button onclick="pauseAudio()" class="audio-btn">⏸ إيقاف</button>
                    </div>
                    
                    <div class="play-count">
                        عدد مرات التشغيل: ${puzzle.playCount}/${puzzle.maxPlays}
                    </div>
                </div>
                
                <input type="text" id="audioAnswer" placeholder="ما هي الرسالة التي سمعتها؟" class="text-input">
                <button onclick="checkAudioAnswer()" class="btn btn-primary">تحقق من الإجابة</button>
            </div>
        `;
    }

    getMazeDisplay(puzzle) {
        return `
            <div class="maze-puzzle">
                <h3>متاهة الحروف المبعثرة</h3>
                <p>اجمع الحروف المخفية في المتاهة لتكوين الجملة</p>
                
                <div class="maze-container" id="mazeContainer">
                    <!-- سيتم توليد المتاهة بالجافاسكريبت -->
                </div>
                
                <div class="collected-letters" id="collectedLetters"></div>
                
                <input type="text" id="mazeAnswer" placeholder="اكتب الجملة التي جمعتها" class="text-input">
                <button onclick="checkMazeAnswer()" class="btn btn-primary">تحقق</button>
            </div>
        `;
    }

    getPatternDisplay(puzzle) {
        return `
            <div class="ai-proof-puzzle">
                <h3>النمط المستحيل</h3>
                <div class="visual-riddle">
                    <p>${puzzle.pattern.question}</p>
                    <div class="pattern-images">
                        ${puzzle.pattern.images.map(img => `<span style="font-size: 3rem; margin: 10px;">${img}</span>`).join('')}
                    </div>
                    <div class="pattern-clues">
                        ${puzzle.pattern.clues.map(clue => `<div class="clue">💡 ${clue}</div>`).join('')}
                    </div>
                </div>
                
                <input type="text" id="patternAnswer" placeholder="ما هو الرقم الذي تبحث عنه؟" class="text-input">
                <button onclick="checkPatternAnswer()" class="btn btn-primary">هذا هو الجواب</button>
            </div>
        `;
    }

    getEndingDisplay() {
        return '<div>تهانينا! لقد أكملت جميع الألغاز</div>';
    }
}

const puzzleSystem = new PuzzleSystem();
