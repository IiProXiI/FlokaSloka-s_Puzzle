class GameEngine {
    constructor() {
        this.currentLevel = 1;
        this.missions = [];
        this.tools = [];
        this.loadGameData();
    }

    loadGameData() {
        this.missions = [
            {
                id: 1,
                title: 'اختراق خادم ويب',
                description: 'اخترق خادم ويب يحتوي على معلومات حساسة.',
                difficulty: 'easy',
                target: 'server01',
                requiredTools: ['scan', 'decrypt'],
                solution: 'hack server01',
                hints: [
                    'جرب فحص الهدف أولاً لمعرفة المعلومات.',
                    'استخدم أمر فك التشفير إذا وجدت أي نصوص مشفرة.',
                    'الأمر النهائي هو اختراق الهدف.'
                ]
            },
            {
                id: 2,
                title: 'كسر كلمة مرور',
                description: 'كسر كلمة مرور مسؤول النظام.',
                difficulty: 'medium',
                target: 'admin_account',
                requiredTools: ['decrypt', 'brute-force'],
                solution: 'decrypt SDBzZWNyZXQ=',
                hints: [
                    'ابحث عن كلمة المرور المشفرة.',
                    'استخدم أداة فك التشفير.',
                    'كلمة المرور المشفرة هي SDBzZWNyZXQ='
                ]
            },
            // يمكن إضافة المزيد من المهام
        ];

        this.tools = [
            { id: 'scan', name: 'الماسح', description: 'لمسح الشبكة والأنظمة', level: 1 },
            { id: 'decrypt', name: 'فك التشفير', description: 'لفك تشفير النصوص', level: 1 },
            { id: 'brute-force', name: 'هجوم القوة الغاشمة', description: 'لكسر كلمات المرور', level: 2 },
            { id: 'exploit', name: 'استغلال الثغرات', description: 'لاستغلال ثغرات النظام', level: 3 }
        ];
    }

    loadLevel(level) {
        this.currentLevel = level;
        this.displayMissions();
        this.displayTools();
    }

    displayMissions() {
        const missionsList = document.getElementById('missions-list');
        if (!missionsList) return;

        missionsList.innerHTML = '';
        const availableMissions = this.missions.filter(mission => mission.difficulty === 'easy' || this.currentLevel >= 2);

        availableMissions.forEach(mission => {
            const missionElement = document.createElement('div');
            missionElement.className = 'mission-card';
            missionElement.innerHTML = `
                <div class="mission-header">
                    <span class="mission-title">${mission.title}</span>
                    <span class="mission-difficulty difficulty-${mission.difficulty}">${mission.difficulty}</span>
                </div>
                <p>${mission.description}</p>
                <div class="mission-progress">
                    <div class="mission-progress-fill" style="width: 0%"></div>
                </div>
                <button onclick="game.startMission(${mission.id})" class="hacker-btn">بدء المهمة</button>
            `;
            missionsList.appendChild(missionElement);
        });
    }

    displayTools() {
        const toolsGrid = document.getElementById('tools-grid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = '';
        this.tools.forEach(tool => {
            if (tool.level <= this.currentLevel) {
                const toolElement = document.createElement('div');
                toolElement.className = 'tool-card';
                toolElement.innerHTML = `
                    <div class="tool-icon">⚙️</div>
                    <h4>${tool.name}</h4>
                    <p>${tool.description}</p>
                    <small>المستوى: ${tool.level}</small>
                `;
                toolsGrid.appendChild(toolElement);
            }
        });
    }

    startMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) return;

        if (window.app && window.app.terminal) {
            window.app.terminal.output(`بدأت المهمة: ${mission.title}`, 'info');
            window.app.terminal.output(`الوصف: ${mission.description}`, 'info');
            window.app.terminal.output(`الهدف: ${mission.target}`, 'info');
            window.app.terminal.output('استخدم الأوامر المناسبة لإكمال المهمة.', 'info');
        }
    }

    checkMissionSolution(missionId, command) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission && command.trim() === mission.solution) {
            this.completeMission(missionId);
            return true;
        }
        return false;
    }

    completeMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission) {
            if (window.app && window.app.terminal) {
                window.app.terminal.output(`مبروك! أكملت المهمة: ${mission.title}`, 'success');
                // منح النقاط ورفع المستوى
                window.app.userProgress.points += 100;
                window.app.userProgress.completedMissions.push(missionId);
                if (window.app.userProgress.completedMissions.length % 3 === 0) {
                    window.app.userProgress.level++;
                    window.app.terminal.output(`تهانينا! لقد ارتفعت إلى المستوى ${window.app.userProgress.level}`, 'success');
                }
                window.app.saveUserProgress();
                window.app.updateUserInterface();
            }
        }
    }

    requestHint(params) {
        if (params.length < 1) {
            if (window.app.terminal) {
                window.app.terminal.output('استخدام: hint [معرف المهمة]', 'error');
            }
            return;
        }
        const missionId = parseInt(params[0]);
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) {
            if (window.app.terminal) {
                window.app.terminal.output('المهمة غير موجودة.', 'error');
            }
            return;
        }

        const userProgress = window.app.userProgress;
        if (userProgress.hintPoints < 10) {
            if (window.app.terminal) {
                window.app.terminal.output('نقاط التلميحات غير كافية. تحتاج إلى 10 نقاط.', 'error');
            }
            return;
        }

        // خصم النقاط وإعطاء تلميح
        userProgress.hintPoints -= 10;
        window.app.saveUserProgress();

        // إعطاء تلميح عشوائي من قائمة التلميحات
        const hintIndex = Math.floor(Math.random() * mission.hints.length);
        const hint = mission.hints[hintIndex];
        if (window.app.terminal) {
            window.app.terminal.output(`تلميح: ${hint}`, 'info');
        }
    }
}

let game = new GameEngine();
