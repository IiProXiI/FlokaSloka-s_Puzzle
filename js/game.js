class GameEngine {
    constructor() {
        this.levels = [];
        this.missions = [];
        this.tools = [];
        this.currentMission = null;
        this.userStats = {
            completedMissions: [],
            failedAttempts: 0,
            totalPoints: 0,
            playTime: 0
        };
        this.loadGameData();
    }

    loadGameData() {
        // تحميل المستويات
        this.levels = [
            {
                id: 1,
                title: "المرحلة التمهيدية",
                description: "تعلم أساسيات القرصنة الأخلاقية",
                difficulty: "سهل",
                requiredPoints: 0,
                missions: [1, 2, 3],
                unlocked: true
            },
            {
                id: 2,
                title: "قرصنة الويب",
                description: "اختراق تطبيقات الويب والمواقع",
                difficulty: "متوسط",
                requiredPoints: 500,
                missions: [4, 5, 6],
                unlocked: false
            },
            {
                id: 3,
                title: "اختراق الشبكات",
                description: "اختراق الشبكات والخوادم",
                difficulty: "صعب",
                requiredPoints: 1500,
                missions: [7, 8, 9],
                unlocked: false
            },
            {
                id: 4,
                title: "الهندسة الاجتماعية",
                description: "استغلال العامل البشري",
                difficulty: "متقدم",
                requiredPoints: 3000,
                missions: [10, 11],
                unlocked: false
            },
            {
                id: 5,
                title: "قرصنة الأنظمة",
                description: "اختراق الأنظمة المتقدمة",
                difficulty: "خبير",
                requiredPoints: 5000,
                missions: [12, 13, 14],
                unlocked: false
            }
        ];

        // تحميل المهام
        this.missions = [
            {
                id: 1,
                title: "البداية: فك الشفرة",
                description: "فك تشفير رسالة سرية باستخدام Base64",
                level: 1,
                difficulty: "سهل",
                objective: "فك تشفير الرسالة: U29tZVNlY3JldA==",
                solution: "decode U29tZVNlY3JldA==",
                hints: [
                    "جرب استخدام أمر decode مع الرسالة",
                    "الرسالة مشفرة باستخدام Base64",
                    "اكتب decode ثم الرسالة المشفرة"
                ],
                reward: 50,
                timeLimit: 300,
                requiredTools: ["decode"]
            },
            {
                id: 2,
                title: "فحص الخادم",
                description: "فحص خادم ويب للعثور على معلومات",
                level: 1,
                difficulty: "سهل",
                objective: "استخدم أمر scan على server-01",
                solution: "scan server-01",
                hints: [
                    "اكتب scan متبوعاً باسم الخادم",
                    "اسم الخادم هو server-01"
                ],
                reward: 75,
                timeLimit: 180,
                requiredTools: ["scan"]
            },
            {
                id: 3,
                title: "اختراق الموقع التجريبي",
                description: "اختراق موقع ويب تجريبي للممارسة",
                level: 1,
                difficulty: "سهل",
                objective: "اختراق موقع test-web",
                solution: "hack test-web",
                hints: [
                    "استخدم أمر hack مع اسم الموقع",
                    "اسم الموقع هو test-web"
                ],
                reward: 100,
                timeLimit: 240,
                requiredTools: ["hack"]
            },
            {
                id: 4,
                title: "اختراق موقع الشركة",
                description: "اختراق موقع شركة كبيرة للحصول على بيانات",
                level: 2,
                difficulty: "متوسط",
                objective: "اختراق company-x باستخدام عدة أدوات",
                solution: "hack company-x",
                hints: [
                    "ابدأ بفحص الهدف لمعرفة معلومات عنه",
                    "استخدم أدوات متعددة قبل الاختراق"
                ],
                reward: 200,
                timeLimit: 600,
                requiredTools: ["scan", "decrypt", "hack"]
            },
            {
                id: 5,
                title: "فك تشفير قاعدة البيانات",
                description: "فك تشفير قاعدة بيانات مسروقة",
                level: 2,
                difficulty: "متوسط",
                objective: "فك تشفير database-encrypted",
                solution: "decrypt database-encrypted",
                hints: [
                    "استخدم أمر decrypt",
                    "قد تحتاج إلى تكرار المحاولة"
                ],
                reward: 150,
                timeLimit: 480,
                requiredTools: ["decrypt"]
            },
            {
                id: 6,
                title: "الاتصال بالخادم الرئيسي",
                description: "الاتصال بخادم الشركة الرئيسي",
                level: 2,
                difficulty: "متوسط",
                objective: "الاتصال بـ main-server",
                solution: "connect main-server",
                hints: [
                    "استخدم أمر connect",
                    "اسم الخادم هو main-server"
                ],
                reward: 125,
                timeLimit: 360,
                requiredTools: ["connect"]
            },
            {
                id: 7,
                title: "اختراق الشبكة الداخلية",
                description: "اختراق الشبكة الداخلية للشركة",
                level: 3,
                difficulty: "صعب",
                objective: "اختراق internal-network",
                solution: "hack internal-network",
                hints: [
                    "هذه مهمة متقدمة تتطلب تركيزاً",
                    "استخدم جميع الأدوات المتاحة"
                ],
                reward: 350,
                timeLimit: 900,
                requiredTools: ["scan", "decrypt", "connect", "hack"]
            },
            {
                id: 8,
                title: "تخطي جدار الحماية",
                description: "تخطي جدار الحماية المتقدم",
                level: 3,
                difficulty: "صعب",
                objective: "تخطي firewall-01",
                solution: "hack firewall-01",
                hints: [
                    "جدار الحماية قوي ويتطلب صبراً",
                    "جرب أساليب مختلفة"
                ],
                reward: 300,
                timeLimit: 720,
                requiredTools: ["scan", "hack"]
            },
            {
                id: 9,
                title: "سرقة البيانات الحساسة",
                description: "سرقة البيانات الحساسة من الخادم",
                level: 3,
                difficulty: "صعب",
                objective: "سرقة بيانات sensitive-data",
                solution: "decrypt sensitive-data",
                hints: [
                    "البيانات مشفرة بتقنية متقدمة",
                    "استخدم decrypt مع اسم البيانات"
                ],
                reward: 400,
                timeLimit: 840,
                requiredTools: ["decrypt"]
            },
            {
                id: 10,
                title: "هجوم التصيد",
                description: "تنفيذ هجوم تصيد احترافي",
                level: 4,
                difficulty: "متقدم",
                objective: "تنفيذ هجوم phishing-attack",
                solution: "hack phishing-attack",
                hints: [
                    "الهندسة الاجتماعية تتطلب ذكاء",
                    "استخدم hack مع اسم الهجوم"
                ],
                reward: 500,
                timeLimit: 1200,
                requiredTools: ["hack"]
            },
            {
                id: 11,
                title: "اختراق البريد الإلكتروني",
                description: "اختراق نظام البريد الإلكتروني للشركة",
                level: 4,
                difficulty: "متقدم",
                objective: "اختراق email-system",
                solution: "hack email-system",
                hints: [
                    "النظام محمي بتقنيات متقدمة",
                    "التأني مطلوب في هذه المهمة"
                ],
                reward: 450,
                timeLimit: 1080,
                requiredTools: ["scan", "hack"]
            },
            {
                id: 12,
                title: "اختراق النظام المالي",
                description: "اختراق النظام المالي للشركة",
                level: 5,
                difficulty: "خبير",
                objective: "اختراق financial-system",
                solution: "hack financial-system",
                hints: [
                    "أصعب مهمة في النظام",
                    "يتطلب مهارات متقدمة"
                ],
                reward: 750,
                timeLimit: 1800,
                requiredTools: ["scan", "decrypt", "connect", "hack"]
            },
            {
                id: 13,
                title: "تعطيل أنظمة الحماية",
                description: "تعطيل أنظمة الحماية المتقدمة",
                level: 5,
                difficulty: "خبير",
                objective: "تعطيل security-systems",
                solution: "hack security-systems",
                hints: [
                    "الأنظمة متطورة جداً",
                    "الحذر مطلوب في كل خطوة"
                ],
                reward: 800,
                timeLimit: 2000,
                requiredTools: ["scan", "hack"]
            },
            {
                id: 14,
                title: "المهمة النهائية",
                description: "المهمة الأخيرة والأصعب على الإطلاق",
                level: 5,
                difficulty: "خبير",
                objective: "اكتمال الاختراق النهائي",
                solution: "hack final-mission",
                hints: [
                    "هذه هي نهاية الرحلة",
                    "استخدم كل ما تعلمته"
                ],
                reward: 1000,
                timeLimit: 2400,
                requiredTools: ["scan", "decrypt", "connect", "hack"]
            }
        ];

        // تحميل الأدوات
        this.tools = [
            {
                id: "scan",
                name: "الماسح الضوئي الأساسي",
                description: "أداة مسح أساسية للشبكات",
                price: 0,
                level: 1,
                owned: true
            },
            {
                id: "decrypt",
                name: "فك التشفير الأساسي",
                description: "أداة فك تشفير للنصوص البسيطة",
                price: 0,
                level: 1,
                owned: true
            },
            {
                id: "advanced-scan",
                name: "الماسح المتقدم",
                description: "أداة مسح متقدمة مع تحليل أعمق",
                price: 200,
                level: 2,
                owned: false
            },
            {
                id: "advanced-decrypt",
                name: "فك التشفير المتقدم",
                description: "فك تشفير للأنظمة المعقدة",
                price: 300,
                level: 2,
                owned: false
            },
            {
                id: "stealth-mode",
                name: "وضع التخفي",
                description: "إخفاء آثار الاختراق",
                price: 500,
                level: 3,
                owned: false
            },
            {
                id: "auto-hack",
                name: "الاختراق التلقائي",
                description: "أتمتة عمليات الاختراق",
                price: 800,
                level: 4,
                owned: false
            },
            {
                id: "ultimate-tool",
                name: "الأداة النهائية",
                description: "أقوى أداة قرصنة في النظام",
                price: 1500,
                level: 5,
                owned: false
            }
        ];
    }

    loadLevel(levelNumber) {
        const level = this.levels.find(l => l.id === levelNumber);
        if (!level) return;

        if (!level.unlocked && level.requiredPoints > (window.app?.userProgress?.points || 0)) {
            this.displayMessage(`المستوى ${level.title} مقفل. تحتاج ${level.requiredPoints} نقطة لإلغاء القفل.`, 'error');
            return;
        }

        this.displayMessage(`تم تحميل المستوى: ${level.title}`, 'success');
        this.displayMessage(`الصعوبة: ${level.difficulty}`, 'info');
    }

    displayMissions() {
        const missionsList = document.getElementById('missions-list');
        if (!missionsList) return;

        missionsList.innerHTML = '';

        this.missions.forEach(mission => {
            const isCompleted = window.app?.userProgress?.completedMissions?.includes(mission.id) || false;
            const missionCard = document.createElement('div');
            missionCard.className = 'mission-card';
            missionCard.innerHTML = `
                <div class="mission-header">
                    <div class="mission-title">${mission.title}</div>
                    <div class="mission-reward">${mission.reward} 🪙</div>
                </div>
                <div class="mission-difficulty difficulty-${mission.difficulty}">${mission.difficulty}</div>
                <p>${mission.description}</p>
                <div class="mission-info">
                    <span>المستوى: ${mission.level}</span>
                    <span>الوقت: ${mission.timeLimit} ثانية</span>
                </div>
                <div class="mission-actions">
                    ${isCompleted ? 
                        '<button class="hacker-btn" disabled>مكتملة</button>' :
                        `<button class="hacker-btn" onclick="selectMission(${mission.id})">اختيار المهمة</button>`
                    }
                </div>
            `;
            missionsList.appendChild(missionCard);
        });
    }

    displayTools() {
        const toolsGrid = document.getElementById('tools-grid');
        const currentProx = document.getElementById('current-prox');
        
        if (!toolsGrid || !currentProx) return;

        toolsGrid.innerHTML = '';
        
        if (window.app && window.app.userProgress) {
            currentProx.textContent = window.app.userProgress.prox;
        }

        this.tools.forEach(tool => {
            const isOwned = window.app?.userProgress?.ownedTools?.includes(tool.id) || false;
            const canAfford = window.app?.userProgress?.prox >= tool.price;
            const canBuy = !isOwned && canAfford && window.app?.userProgress?.level >= tool.level;

            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `
                <div class="tool-icon">🔧</div>
                <h4>${tool.name}</h4>
                <p>${tool.description}</p>
                <div class="tool-info">
                    <span>المستوى: ${tool.level}</span>
                    <span class="tool-price">السعر: ${tool.price} 🪙</span>
                </div>
                <div class="tool-actions">
                    ${isOwned ? 
                        '<span class="tool-owned">مملوكة</span>' :
                        `<button class="hacker-btn ${canBuy ? '' : 'disabled'}" 
                         onclick="buyTool('${tool.id}')" 
                         ${canBuy ? '' : 'disabled'}>
                         ${canBuy ? 'شراء' : 'غير متاح'}
                        </button>`
                    }
                </div>
            `;
            toolsGrid.appendChild(toolCard);
        });
    }

    displayMissionsInTerminal() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('<strong>المهام المتاحة:</strong>', 'info');
            
            this.missions.forEach(mission => {
                const isCompleted = window.app.userProgress?.completedMissions?.includes(mission.id) || false;
                const status = isCompleted ? '✅' : '🔒';
                const difficultyColor = this.getDifficultyColor(mission.difficulty);
                
                window.app.terminal.output(
                    `${status} <strong>${mission.title}</strong> - ` +
                    `<span style="color: ${difficultyColor}">${mission.difficulty}</span> - ` +
                    `${mission.reward} 🪙`,
                    'info'
                );
            });
        }
    }

    displayToolsInTerminal() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('<strong>الأدوات المتاحة:</strong>', 'info');
            
            this.tools.forEach(tool => {
                const isOwned = window.app.userProgress?.ownedTools?.includes(tool.id) || false;
                const status = isOwned ? '✅' : '🔒';
                
                window.app.terminal.output(
                    `${status} <strong>${tool.name}</strong> - ` +
                    `${tool.description} - ` +
                    `${tool.price} 🪙`,
                    'info'
                );
            });
        }
    }

    startMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) {
            this.displayMessage('المهمة غير موجودة!', 'error');
            return;
        }

        if (window.app.userProgress?.completedMissions?.includes(missionId)) {
            this.displayMessage('لقد أكملت هذه المهمة مسبقاً!', 'warning');
            return;
        }

        this.currentMission = mission;
        this.displayMissionBriefing(mission);
        this.startMissionTimer(mission.timeLimit);
    }

    displayMissionBriefing(mission) {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('', 'info');
            window.app.terminal.output('='.repeat(50), 'info');
            window.app.terminal.output(`<strong>بدء المهمة: ${mission.title}</strong>`, 'success');
            window.app.terminal.output('='.repeat(50), 'info');
            window.app.terminal.output(`<strong>الوصف:</strong> ${mission.description}`, 'info');
            window.app.terminal.output(`<strong>الهدف:</strong> ${mission.objective}`, 'warning');
            window.app.terminal.output(`<strong>المكافأة:</strong> ${mission.reward} 🪙`, 'info');
            window.app.terminal.output(`<strong>الوقت:</strong> ${mission.timeLimit} ثانية`, 'info');
            window.app.terminal.output('', 'info');
        }
    }

    startMissionTimer(timeLimit) {
        let timeLeft = timeLimit;
        const timerElement = document.createElement('div');
        timerElement.id = 'mission-timer';
        timerElement.className = 'mission-timer';
        timerElement.innerHTML = `⏰ الوقت المتبقي: <span id="time-left">${timeLeft}</span> ثانية`;

        if (window.app && window.app.terminal) {
            const outputElement = document.getElementById('terminal-output');
            outputElement.appendChild(timerElement);
            window.app.terminal.scrollToBottom();
        }

        const timerInterval = setInterval(() => {
            timeLeft--;
            const timeLeftElement = document.getElementById('time-left');
            if (timeLeftElement) {
                timeLeftElement.textContent = timeLeft;
                
                if (timeLeft <= 60) {
                    timeLeftElement.style.color = '#ff4444';
                }
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                this.failMission('انتهى الوقت!');
                if (timerElement) timerElement.remove();
            }

            if (!this.currentMission) {
                clearInterval(timerInterval);
                if (timerElement) timerElement.remove();
            }
        }, 1000);
    }

    checkMissionSolution(input) {
        if (!this.currentMission) return false;

        if (input.trim().toLowerCase() === this.currentMission.solution.toLowerCase()) {
            this.completeMission();
            return true;
        }

        this.userStats.failedAttempts++;
        
        // تأثير على أشرطة النظام عند الخطأ
        this.applyMissionPenalty();
        
        if (this.userStats.failedAttempts % 3 === 0) {
            this.displayMessage('⚠️ خطأ! حاول مرة أخرى أو اطلب تلميحاً.', 'warning');
        }

        return false;
    }

    applyMissionPenalty() {
        if (window.app && window.app.userProgress) {
            // تقليل الأمان عند الأخطاء
            window.app.userProgress.security = Math.max(10, window.app.userProgress.security - 5);
            // تقليل الاتصال عند الأخطاء المتكررة
            if (this.userStats.failedAttempts % 5 === 0) {
                window.app.userProgress.connection = Math.max(20, window.app.userProgress.connection - 10);
            }
            // تقليل السمعة عند الفشل المتكرر
            if (this.userStats.failedAttempts % 10 === 0) {
                window.app.userProgress.reputation = Math.max(10, window.app.userProgress.reputation - 15);
            }
            
            window.app.saveUserProgress();
            window.app.updateStatusBars();
        }
    }

    completeMission() {
        if (!this.currentMission) return;

        const mission = this.currentMission;
        
        if (window.app && window.app.userProgress) {
            // منح المكافآت
            window.app.userProgress.points += mission.reward;
            window.app.userProgress.prox += mission.reward;
            window.app.userProgress.completedMissions.push(mission.id);
            
            // تحسين أشرطة النظام عند النجاح
            window.app.userProgress.security = Math.min(100, window.app.userProgress.security + 10);
            window.app.userProgress.reputation = Math.min(100, window.app.userProgress.reputation + 5);
            
            window.app.saveUserProgress();
            window.app.updateUserInterface();
        }

        this.displayMessage(`🎉 مبروك! لقد أكملت المهمة: ${mission.title}`, 'success');
        this.displayMessage(`💰 ربحت ${mission.reward} 🪙 بروكس!`, 'success');

        this.checkUnlockedLevels();

        const timerElement = document.getElementById('mission-timer');
        if (timerElement) timerElement.remove();

        this.currentMission = null;
        this.userStats.failedAttempts = 0;
    }

    failMission(reason) {
        if (!this.currentMission) return;

        this.displayMessage(`❌ فشلت في المهمة: ${reason}`, 'error');
        this.displayMessage('حاول مرة أخرى!', 'info');

        // عقوبة الفشل
        if (window.app && window.app.userProgress) {
            window.app.userProgress.security = Math.max(10, window.app.userProgress.security - 15);
            window.app.userProgress.reputation = Math.max(10, window.app.userProgress.reputation - 10);
            window.app.saveUserProgress();
            window.app.updateStatusBars();
        }

        const timerElement = document.getElementById('mission-timer');
        if (timerElement) timerElement.remove();

        this.currentMission = null;
        this.userStats.failedAttempts = 0;
    }

    checkUnlockedLevels() {
        if (!window.app || !window.app.userProgress) return;

        const userPoints = window.app.userProgress.points;
        
        this.levels.forEach(level => {
            if (!level.unlocked && userPoints >= level.requiredPoints) {
                level.unlocked = true;
                this.displayMessage(`🎊 تم إلغاء قفل المستوى: ${level.title}`, 'success');
            }
        });
    }

    buyTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) return;

        if (window.app && window.app.userProgress) {
            if (window.app.userProgress.ownedTools.includes(toolId)) {
                this.displayMessage('أنت تملك هذه الأداة مسبقاً!', 'warning');
                return;
            }

            if (window.app.userProgress.prox < tool.price) {
                this.displayMessage('رصيدك غير كافي لشراء هذه الأداة!', 'error');
                return;
            }

            if (window.app.userProgress.level < tool.level) {
                this.displayMessage(`تحتاج إلى المستوى ${tool.level} لشراء هذه الأداة!`, 'error');
                return;
            }

            // شراء الأداة
            window.app.userProgress.prox -= tool.price;
            window.app.userProgress.ownedTools.push(toolId);
            window.app.saveUserProgress();
            window.app.updateUserInterface();

            this.displayMessage(`✅ تم شراء ${tool.name} بنجاح!`, 'success');
            this.displayTools();
        }
    }

    getDifficultyColor(difficulty) {
        switch(difficulty.toLowerCase()) {
            case 'سهل': return '#00ff00';
            case 'متوسط': return '#ffff00';
            case 'صعب': return '#ffaa00';
            case 'متقدم': return '#ff4444';
            case 'خبير': return '#ff00ff';
            default: return '#ffffff';
        }
    }

    requestHint(parameters) {
        if (!this.currentMission) {
            this.displayMessage('لا توجد مهمة نشطة!', 'error');
            return;
        }

        const mission = this.currentMission;
        const randomHint = mission.hints[Math.floor(Math.random() * mission.hints.length)];
        
        this.displayMessage(`💡 تلميح: ${randomHint}`, 'info');
    }

    displayMessage(message, type) {
        if (window.app && window.app.terminal) {
            window.app.terminal.output(message, type);
        }
    }
}
