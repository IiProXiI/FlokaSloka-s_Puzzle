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
                points: 50,
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
                points: 30,
                timeLimit: 180,
                requiredTools: ["scan"]
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

        // تحميل مهام المستوى
        this.loadMissionsForLevel(levelNumber);
    }

    loadMissionsForLevel(levelNumber) {
        const levelMissions = this.missions.filter(mission => mission.level === levelNumber);
        
        if (window.app && window.app.terminal) {
            window.app.terminal.output(`<strong>المهام المتاحة في هذا المستوى (${levelMissions.length}):</strong>`, 'info');
            
            levelMissions.forEach(mission => {
                const isCompleted = window.app.userProgress?.completedMissions?.includes(mission.id) || false;
                const status = isCompleted ? '✅' : '🔒';
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

        if (window.app.userProgress?.completedMissions?.includes(missionId)) {
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
            window.app.terminal.output('', 'info');
        }

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
        
        if (this.userStats.failedAttempts % 3 === 0) {
            this.displayMessage('هل تحتاج مساعدة؟', 'info');
        }

        return false;
    }

    completeMission() {
        if (!this.currentMission) return;

        const mission = this.currentMission;
        
        if (window.app && window.app.userProgress) {
            window.app.userProgress.points += mission.points;
            window.app.userProgress.completedMissions.push(mission.id);
            window.app.saveUserProgress();
            window.app.updateUserInterface();
        }

        this.displayMessage(`🎉 مبروك! لقد أكملت المهمة: ${mission.title}`, 'success');
        this.displayMessage(`💰 ربحت ${mission.points} نقطة!`, 'success');

        this.checkUnlockedLevels();

        const timerElement = document.getElementById('mission-timer');
        if (timerElement) timerElement.remove();

        this.currentMission = null;
        this.userStats.failedAttempts = 0;
    }

    failMission(reason) {
        if (!this.currentMission) return;

        this.displayMessage(`❌ فشلت في المهمة: ${reason}`, 'error');
        
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
                const isCompleted = window.app.userProgress?.completedMissions?.includes(mission.id) || false;
                const status = isCompleted ? '✅' : '🔒';
                const difficultyColor = this.getDifficultyColor(mission.difficulty);
                
                window.app.terminal.output(
                    `${status} <strong>${mission.title}</strong> - ` +
                    `<span style="color: ${difficultyColor}">${mission.difficulty}</span> - ` +
                    `${mission.points} نقطة`,
                    'info'
                );
            });
        }
    }

    getDifficultyColor(difficulty) {
        switch(difficulty.toLowerCase()) {
            case 'سهل': return '#00ff00';
            case 'متوسط': return '#ffff00';
            case 'صعب': return '#ff4444';
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
