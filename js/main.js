class HackingSimulator {
    constructor() {
        this.currentUser = null;
        this.currentLevel = 1;
        this.userProgress = {};
        this.isInitialized = false;
        this.terminal = null;
        this.game = null;
        this.selectedMission = null;
    }

    async init() {
        console.log('جاري تهيئة النظام...');
        await this.initializeSystem();
        this.setupEventListeners();
        this.showScreen('loading-screen');
        
        await this.simulateBootProcess();
        this.checkAuthentication();
    }

    async initializeSystem() {
        // تهيئة localStorage
        if (!localStorage.getItem('hacking_simulator_users')) {
            localStorage.setItem('hacking_simulator_users', JSON.stringify({}));
        }
        
        if (!localStorage.getItem('hacking_simulator_progress')) {
            localStorage.setItem('hacking_simulator_progress', JSON.stringify({}));
        }

        // تهيئة الكائنات
        this.terminal = new Terminal();
        this.game = new GameEngine();
        
        this.isInitialized = true;
        console.log('النظام مهيأ بالكامل');
    }

    async simulateBootProcess() {
        const messages = [
            "جاري تحميل نواة النظام...",
            "تهيئة وحدات الأمان...",
            "تحميل واجهة الطرفية...",
            "تفعيل أدوات القرصنة...",
            "جاري التحقق من الاتصال بالشبكة...",
            "تهيئة نظام المصادقة...",
            "تحميل قاعدة البيانات...",
            "تفعيل نظام التلميحات...",
            "جاري التحقق من التحديثات...",
            "النظام جاهز للتشغيل..."
        ];

        const progressBar = document.getElementById('boot-progress');
        const bootMessages = document.getElementById('boot-messages');

        for (let i = 0; i < messages.length; i++) {
            await this.delay(300);
            
            const messageElement = document.createElement('div');
            messageElement.textContent = `> ${messages[i]}`;
            messageElement.className = 'output-line';
            bootMessages.appendChild(messageElement);
            bootMessages.scrollTop = bootMessages.scrollHeight;

            progressBar.style.width = `${((i + 1) / messages.length) * 100}%`;
        }

        await this.delay(500);
    }

    checkAuthentication() {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.loadUserProgress();
                this.showMainInterface();
                console.log('تم تحميل المستخدم:', this.currentUser.username);
            } catch (e) {
                console.error('خطأ في تحميل بيانات المستخدم:', e);
                this.showAuthScreen();
            }
        } else {
            this.showAuthScreen();
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const screenElement = document.getElementById(screenId);
        if (screenElement) {
            screenElement.classList.add('active');
        }
    }

    showAuthScreen() {
        this.showScreen('auth-screen');
        this.showLoginForm();
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.add('active');
        if (registerForm) registerForm.classList.remove('active');
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (registerForm) registerForm.classList.add('active');
        if (loginForm) loginForm.classList.remove('active');
    }

    showMainInterface() {
        this.showScreen('main-screen');
        this.updateUserInterface();
        
        if (this.terminal) {
            this.terminal.initialize();
        }
        
        if (this.game) {
            this.game.loadLevel(this.currentLevel);
            this.game.displayMissions();
            this.game.displayTools();
        }
    }

    updateUserInterface() {
        if (this.currentUser) {
            const usernameDisplay = document.getElementById('username-display');
            const userLevel = document.getElementById('user-level');
            const userAvatar = document.getElementById('user-avatar');
            const userBio = document.getElementById('user-bio');
            const userProx = document.getElementById('user-prox');
            
            if (usernameDisplay) usernameDisplay.textContent = this.currentUser.username;
            if (userLevel) userLevel.textContent = this.currentLevel;
            if (userBio) userBio.textContent = this.userProgress.bio || 'لا يوجد وصف';
            if (userProx) userProx.textContent = this.userProgress.prox || 100;

            // تحديث صورة البروفايل
            this.updateAvatarDisplay();

            // تحديث الأشرطة
            this.updateStatusBars();
        }
    }

    updateAvatarDisplay() {
        const avatarImage = document.getElementById('avatar-image');
        const avatarText = document.getElementById('avatar-text');
        const profileAvatarImage = document.getElementById('profile-avatar-image');
        const profileAvatarText = document.getElementById('profile-avatar-text');

        if (this.userProgress.avatar) {
            avatarImage.src = this.userProgress.avatar;
            avatarImage.style.display = 'block';
            avatarText.style.display = 'none';
            
            profileAvatarImage.src = this.userProgress.avatar;
            profileAvatarText.style.display = 'none';
        } else {
            avatarImage.style.display = 'none';
            avatarText.style.display = 'block';
            avatarText.textContent = this.currentUser.username.charAt(0).toUpperCase();
            
            profileAvatarImage.style.display = 'none';
            profileAvatarText.style.display = 'block';
            profileAvatarText.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
    }

    updateStatusBars() {
        const securityBar = document.getElementById('security-bar');
        const connectionBar = document.getElementById('connection-bar');
        const reputationBar = document.getElementById('reputation-bar');

        if (securityBar) securityBar.style.width = this.userProgress.security + '%';
        if (connectionBar) connectionBar.style.width = this.userProgress.connection + '%';
        if (reputationBar) reputationBar.style.width = this.userProgress.reputation + '%';
    }

    loadUserProgress() {
        try {
            const progressData = JSON.parse(localStorage.getItem('hacking_simulator_progress') || '{}');
            this.userProgress = progressData[this.currentUser.username] || {
                level: 1,
                points: 0,
                prox: 100,
                completedMissions: [],
                unlockedTools: ['scan', 'decrypt'],
                ownedTools: ['scan', 'decrypt'],
                hintPoints: 50,
                bio: 'هاكر مبتدئ',
                avatar: null,
                security: 85,
                connection: 70,
                reputation: 60
            };
            this.currentLevel = this.userProgress.level;
        } catch (e) {
            console.error('خطأ في تحميل تقدم المستخدم:', e);
            this.userProgress = {
                level: 1,
                points: 0,
                prox: 100,
                completedMissions: [],
                unlockedTools: ['scan', 'decrypt'],
                ownedTools: ['scan', 'decrypt'],
                hintPoints: 50,
                bio: 'هاكر مبتدئ',
                avatar: null,
                security: 85,
                connection: 70,
                reputation: 60
            };
        }
    }

    saveUserProgress() {
        try {
            const progressData = JSON.parse(localStorage.getItem('hacking_simulator_progress') || '{}');
            progressData[this.currentUser.username] = this.userProgress;
            localStorage.setItem('hacking_simulator_progress', JSON.stringify(progressData));
        } catch (e) {
            console.error('خطأ في حفظ تقدم المستخدم:', e);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupEventListeners() {
        // التنقل بين الأقسام
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // إدخال الطرفية
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (this.terminal) {
                        this.terminal.processCommand(e.target.value);
                        e.target.value = '';
                    }
                }
            });
        }

        // تغيير السمة
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // أحداث النماذج
        this.setupAuthEventListeners();
    }

    setupAuthEventListeners() {
        // أحداث الإدخال في النماذج
        const authInputs = document.querySelectorAll('.terminal-input');
        authInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (e.target.closest('#login-form')) {
                        handleLogin();
                    } else if (e.target.closest('#register-form')) {
                        handleRegister();
                    }
                }
            });
        });
    }

    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const sectionElement = document.getElementById(`${sectionId}-section`);
        if (sectionElement) {
            sectionElement.classList.add('active');
        }
    }

    changeTheme(theme) {
        const themeLink = document.getElementById('theme');
        if (themeLink) {
            themeLink.href = `css/themes/${theme}.css`;
            document.body.className = `${theme}-theme`;
            
            // تحديث selector السمة
            const themeSelector = document.getElementById('theme-selector');
            if (themeSelector) {
                themeSelector.value = theme;
            }
        }
    }

    logout() {
        localStorage.removeItem('current_user');
        this.currentUser = null;
        this.showAuthScreen();
        this.resetAuthForms();
    }

    resetAuthForms() {
        const inputs = document.querySelectorAll('.terminal-input');
        inputs.forEach(input => {
            input.value = '';
        });
        this.showLoginForm();
    }

    // دالة مساعدة لعرض نافذة المهمة
    showMissionModal(mission) {
        this.selectedMission = mission;
        const modal = document.getElementById('mission-modal');
        const title = document.getElementById('mission-modal-title');
        const content = document.getElementById('mission-modal-content');

        if (modal && title && content) {
            title.textContent = mission.title;
            content.innerHTML = `
                <p><strong>الوصف:</strong> ${mission.description}</p>
                <p><strong>المكافأة:</strong> ${mission.reward} 🪙 بروكس</p>
                <p><strong>الصعوبة:</strong> <span class="difficulty-${mission.difficulty}">${mission.difficulty}</span></p>
                <p><strong>الوقت المتوقع:</strong> ${mission.timeLimit} ثانية</p>
            `;
            modal.style.display = 'block';
        }
    }

    // دالة لقبول المهمة
    acceptMission() {
        if (this.selectedMission && this.game) {
            this.game.startMission(this.selectedMission.id);
            this.closeMissionModal();
        }
    }

    // دالة لإغلاق نافذة المهمة
    closeMissionModal() {
        const modal = document.getElementById('mission-modal');
        if (modal) {
            modal.style.display = 'none';
            this.selectedMission = null;
        }
    }

    // دالة لشراء أداة
    buyTool(toolId) {
        if (this.game) {
            this.game.buyTool(toolId);
        }
    }

    // دالة لتحديث البايو
    updateBio() {
        const bioInput = document.getElementById('bio-input');
        if (bioInput && bioInput.value.trim()) {
            this.userProgress.bio = bioInput.value.trim();
            this.saveUserProgress();
            this.updateUserInterface();
            bioInput.value = '';
            alert('تم تحديث البايو بنجاح!');
        }
    }

    // دالة لرفع صورة البروفايل
    uploadAvatar() {
        const avatarUpload = document.getElementById('avatar-upload');
        if (avatarUpload && avatarUpload.files.length > 0) {
            const file = avatarUpload.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.userProgress.avatar = e.target.result;
                this.saveUserProgress();
                this.updateUserInterface();
                alert('تم رفع صورة البروفايل بنجاح!');
            };
            
            reader.readAsDataURL(file);
            avatarUpload.value = '';
        }
    }
}

// فئة التشفير المساعدة
class Encryption {
    static encrypt(text, key = 'hack2024') {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return btoa(result);
    }

    static decrypt(encryptedText, key = 'hack2024') {
        try {
            const text = atob(encryptedText);
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return result;
        } catch (e) {
            return null;
        }
    }

    static generateHash(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}

// المتغير العام للتطبيق
let app = null;

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    app = new HackingSimulator();
    app.init().catch(error => {
        console.error('خطأ في تهيئة التطبيق:', error);
    });
});

// ================= دوال الاستدعاء من HTML =================

function showLogin() {
    if (app) {
        app.showLoginForm();
    }
}

function showRegister() {
    if (app) {
        app.showRegisterForm();
    }
}

function handleLogin() {
    const username = document.getElementById('login-username')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!username || !password) {
        alert('يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
    }
    
    if (app && app.terminal) {
        app.terminal.authenticateUser(username, password);
    } else {
        alert('النظام غير مهيأ بعد، يرجى الانتظار...');
    }
}

function handleRegister() {
    const username = document.getElementById('reg-username')?.value;
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm')?.value;
    
    if (!username || !password || !confirmPassword) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('كلمتا المرور غير متطابقتين');
        return;
    }
    
    if (app && app.terminal) {
        app.terminal.registerUser(username, password, confirmPassword);
    } else {
        alert('النظام غير مهيأ بعد، يرجى الانتظار...');
    }
}

function toggleTheme() {
    if (app) {
        const currentTheme = document.body.classList.contains('matrix-theme') ? 'matrix' : 'cyberpunk';
        const newTheme = currentTheme === 'matrix' ? 'cyberpunk' : 'matrix';
        app.changeTheme(newTheme);
    }
}

function clearTerminal() {
    if (app && app.terminal) {
        app.terminal.clear();
    }
}

function changeTheme(theme) {
    if (app) {
        app.changeTheme(theme);
    }
}

function logout() {
    if (app) {
        app.logout();
    }
}

function closeMissionModal() {
    if (app) {
        app.closeMissionModal();
    }
}

function acceptMission() {
    if (app) {
        app.acceptMission();
    }
}

function updateBio() {
    if (app) {
        app.updateBio();
    }
}

function uploadAvatar() {
    if (app) {
        app.uploadAvatar();
    }
}

// دالة لاختيار مهمة
function selectMission(missionId) {
    if (app && app.game) {
        const mission = app.game.missions.find(m => m.id === missionId);
        if (mission) {
            app.showMissionModal(mission);
        }
    }
}

// دالة لشراء أداة
function buyTool(toolId) {
    if (app) {
        app.buyTool(toolId);
    }
}
