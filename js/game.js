// محرك اللعبة الرئيسي
class GameEngine {
    constructor() {
        this.levels = [];
        this.missions = [];
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
                missions: [1, 2],
                unlocked: true
            },
            {
                id: 2,
                title: "قرصنة الويب",
                description: "اختراق تطبيقات الويب والمواقع",
                difficulty: "متوسط",
                requiredPoints: 100,
                missions: [3, 4, 5],
                unlocked: false
            },
            {
                id: 3,
                title: "اختراق الشبكات",
                description: "اختراق الشبكات والخوادم",
                difficulty: "صعب",
                requiredPoints: 250,
                missions: [6, 7, 8],
                unlocked: false
            },
            {
                id: 4,
                title: "الهندسة الاجتماعية",
                description: "استغلال العامل البشري",
                difficulty: "متقدم",
                requiredPoints: 500,
                missions: [9, 10],
                unlocked: false
            },
            {
                id: 5,
                title: "قرصنة الأنظمة",
                description: "اختراق الأنظمة المتقدمة",
                difficulty: "خبير",
                requiredPoints: 1000,
                missions: [11, 12],
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
                solution: "SomeSecret",
                hints: [
                    "جرب استخدام أمر decode مع الرسالة",
                    "الرسالة مشفرة باستخدام Base64",
                    "ابحث عن أداة فك التشفير في قائمة الأوامر"
                ],
                points: 50,
                timeLimit: 300, // 5 دقائق
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
                    "اسم الخادم هو server-01",
                    "استخدم الأمر بدون أي إضافات أخرى"
                ],
                points: 30,
                timeLimit: 180,
                requiredTools: ["scan"]
            },
            {
                id: 3,
                title: "اختراق الموقع",
                description: "اختراق موقع ويب يحتوي على معلومات حساسة",
                level: 2,
                difficulty: "متوسط",
                objective: "اختراق موقع company-x باستخدام عدة أدوات",
                solution: "hack company-x",
                hints: [
                    "ابدأ بفحص الهدف لمعرفة معلومات عنه",
                    "استخدم أدوات متعددة قبل الاختراق",
                    "الأمر النهائي هو hack"
                ],
                points: 100,
                timeLimit: 600,
                requiredTools: ["scan", "decrypt", "hack"]
            }
            // يمكن إضافة المزيد من المهام هنا
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
        this.displayMessage(level.description, 'info');

        // تحميل مهام المستوى
        this.loadMissionsForLevel(levelNumber);
    }

    loadMissionsForLevel(levelNumber) {
        const levelMissions = this.missions.filter(mission => mission.level === levelNumber);
        
        if (window.app && window.app.terminal) {
            window.app.terminal.output(`<strong>المهام المتاحة في هذا المستوى (${levelMissions.length}):</strong>`, 'info');
            
            levelMissions.forEach(mission => {
                const status = window.app.userProgress.completedMissions.includes(mission.id) ? '✅' : '🔒';
                window.app.terminal.output(`${status} ${mission.title} - ${mission.difficulty}`, 'info');
            });
        }
    }

    startMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) {
            this.displayMessage('المهمة غير موجودة!', 'error');
            return;
        }

        // التحقق من إكمال المهمة مسبقاً
        if (window.app.userProgress.completedMissions.includes(missionId)) {
            this.displayMessage('لقد أكملت هذه المهمة مسبقاً!', 'warning');
            return;
        }

        this.currentMission = mission;
        this.displayMissionBriefing(mission);
    }

    displayMissionBriefing(mission) {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('', 'info');
            window.app.terminal.output('='.repeat(50), 'info');
            window.app.terminal.output(`<strong>مهمة جديدة: ${mission.title}</strong>`, 'success');
            window.app.terminal.output('='.repeat(50), 'info');
            window.app.terminal.output(`<strong>الوصف:</strong> ${mission.description}`, 'info');
            window.app.terminal.output(`<strong>الهدف:</strong> ${mission.objective}`, 'warning');
            window.app.terminal.output(`<strong>النقاط:</strong> ${mission.points}`, 'info');
            window.app.terminal.output(`<strong>الوقت:</strong> ${mission.timeLimit} ثانية`, 'info');
            window.app.terminal.output('', 'info');
            window.app.terminal.output('اكتب "hint" للحصول على تلميح (بتكلفة نقاط)', 'info');
            window.app.terminal.output('', 'info');
        }

        // بدء مؤقت المهمة
        this.startMissionTimer(mission.timeLimit);
    }

    startMissionTimer(timeLimit) {
        let timeLeft = timeLimit;
        const timerElement = document.createElement('div');
        timerElement.id = 'mission-timer';
        timerElement.className = 'mission-timer';
        timerElement.innerHTML = `الوقت المتبقي: <span id="time-left">${timeLeft}</span> ثانية`;

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
                
                // تغيير اللون عندما يقل الوقت
                if (timeLeft <= 60) {
                    timeLeftElement.style.color = '#ff4444';
                } else if (timeLeft <= 120) {
                    timeLeftElement.style.color = '#ffaa00';
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

        // التحقق من الحل
        if (input.trim().toLowerCase() === this.currentMission.solution.toLowerCase()) {
            this.completeMission();
            return true;
        }

        // زيادة عدد المحاولات الفاشلة
        this.userStats.failedAttempts++;
        
        // تقديم تلميحات بناءً على عدد المحاولات الفاشلة
        if (this.userStats.failedAttempts % 3 === 0) {
            this.displayMessage('هل تحتاج مساعدة؟ جرب استخدام أمر "hint"', 'info');
        }

        return false;
    }

    completeMission() {
        if (!this.currentMission) return;

        const mission = this.currentMission;
        
        // تحديث تقدم المستخدم
        if (window.app && window.app.userProgress) {
            window.app.userProgress.points += mission.points;
            window.app.userProgress.completedMissions.push(mission.id);
            window.app.saveUserProgress();
            window.app.updateUserInterface();
        }

        // عرض رسالة النجاح
        this.displayMessage(`🎉 مبروك! لقد أكملت المهمة: ${mission.title}`, 'success');
        this.displayMessage(`💰 ربحت ${mission.points} نقطة!`, 'success');

        // التحقق من إلغاء قفل مستويات جديدة
        this.checkUnlockedLevels();

        // إزالة المؤقت
        const timerElement = document.getElementById('mission-timer');
        if (timerElement) timerElement.remove();

        this.currentMission = null;
        this.userStats.failedAttempts = 0;
    }

    failMission(reason) {
        if (!this.currentMission) return;

        this.displayMessage(`❌ فشلت في المهمة: ${reason}`, 'error');
        this.displayMessage('حاول مرة أخرى!', 'info');

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

    displayMissionsInTerminal() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('<strong>المهام المتاحة:</strong>', 'info');
            
            this.missions.forEach(mission => {
                const isCompleted = window.app.userProgress.completedMissions.includes(mission.id);
                const status = isCompleted ? '✅' : '🔒';
                const difficultyColor = this.getDifficultyColor(mission.difficulty);
                
                window.app.terminal.output(
                    `${status} <strong>${mission.title}</strong> - ` +
                    `<span style="color: ${difficultyColor}">${mission.difficulty}</span> - ` +
                    `${mission.points} نقطة`,
                    'info'
                );
                
                if (!isCompleted) {
                    window.app.terminal.output(`   الهدف: ${mission.objective}`, 'info');
                }
            });
            
            window.app.terminal.output('', 'info');
            window.app.terminal.output('لبدء مهمة، اكتب رقم المهمة في الطرفية', 'info');
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
            this.displayMessage('لا توجد مهمة نشطة! ابدأ مهمة أولاً.', 'error');
            return;
        }

        const mission = this.currentMission;
        const hintCost = 10;
        
        if (window.app.userProgress.hintPoints < hintCost) {
            this.displayMessage(`نقاط التلميحات غير كافية! تحتاج ${hintCost} نقطة.`, 'error');
            return;
        }

        // استخدام تلميح عشوائي
        const randomHint = mission.hints[Math.floor(Math.random() * mission.hints.length)];
        
        window.app.userProgress.hintPoints -= hintCost;
        window.app.saveUserProgress();
        
        this.displayMessage(`💡 تلميح: ${randomHint}`, 'info');
        this.displayMessage(`تم خصم ${hintCost} نقطة من رصيدك.`, 'warning');
    }

    displayMessage(message, type) {
        if (window.app && window.app.terminal) {
            window.app.terminal.output(message, type);
        }
    }
}
