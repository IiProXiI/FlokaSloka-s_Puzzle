class HackingSimulator {
    constructor() {
        this.currentUser = null;
        this.currentLevel = 1;
        this.userProgress = {};
        this.isInitialized = false;
        this.terminal = null;
        this.game = null;
    }

    async init() {
        await this.initializeSystem();
        this.setupEventListeners();
        this.showScreen('loading-screen');
        
        // محاكاة عملية التحميل
        await this.simulateBootProcess();
        
        this.checkAuthentication();
    }

    async initializeSystem() {
        // تهيئة localStorage إذا كان فارغاً
        if (!localStorage.getItem('hacking_simulator_users')) {
            localStorage.setItem('hacking_simulator_users', JSON.stringify({}));
        }
        
        if (!localStorage.getItem('hacking_simulator_progress')) {
            localStorage.setItem('hacking_simulator_progress', JSON.stringify({}));
        }

        this.terminal = new Terminal();
        this.game = new GameEngine();
        
        this.isInitialized = true;
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
            await this.delay(500);
            
            const messageElement = document.createElement('div');
            messageElement.textContent = `> ${messages[i]}`;
            messageElement.className = 'output-line';
            bootMessages.appendChild(messageElement);
            bootMessages.scrollTop = bootMessages.scrollHeight;

            progressBar.style.width = `${((i + 1) / messages.length) * 100}%`;
        }

        await this.delay(1000);
    }

    checkAuthentication() {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.loadUserProgress();
            this.showMainInterface();
        } else {
            this.showAuthScreen();
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showAuthScreen() {
        this.showScreen('auth-screen');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    }

    showMainInterface() {
        this.showScreen('main-screen');
        this.updateUserInterface();
        this.terminal.initialize();
        this.game.loadLevel(this.currentLevel);
    }

    updateUserInterface() {
        if (this.currentUser) {
            document.getElementById('username-display').textContent = this.currentUser.username;
            document.getElementById('user-level').textContent = this.currentLevel;
            document.getElementById('user-avatar').textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
    }

    loadUserProgress() {
        const progressData = JSON.parse(localStorage.getItem('hacking_simulator_progress'));
        this.userProgress = progressData[this.currentUser.username] || {
            level: 1,
            points: 0,
            completedMissions: [],
            unlockedTools: ['scan', 'decrypt'],
            hintPoints: 50
        };
        this.currentLevel = this.userProgress.level;
    }

    saveUserProgress() {
        const progressData = JSON.parse(localStorage.getItem('hacking_simulator_progress'));
        progressData[this.currentUser.username] = this.userProgress;
        localStorage.setItem('hacking_simulator_progress', JSON.stringify(progressData));
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
                
                // تحديث الحالة النشطة
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // إدخال الطرفية
        const terminalInput = document.getElementById('terminal-input');
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.terminal.processCommand(e.target.value);
                e.target.value = '';
            }
        });

        // تغيير السمة
        document.getElementById('theme-selector').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
    }

    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }

    changeTheme(theme) {
        const themeLink = document.getElementById('theme');
        themeLink.href = `css/themes/${theme}.css`;
        document.body.className = `${theme}-theme`;
    }

    logout() {
        localStorage.removeItem('current_user');
        this.currentUser = null;
        this.showAuthScreen();
    }
}

// فئات مساعدة
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

// تهيئة التطبيق عند تحميل الصفحة
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new HackingSimulator();
    app.init();
});

// الدوال العامة للاستدعاء من HTML
function showLogin() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
}

function showRegister() {
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (app.terminal) {
        app.terminal.authenticateUser(username, password);
    }
}

function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    
    if (app.terminal) {
        app.terminal.registerUser(username, password, confirmPassword);
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('matrix-theme') ? 'matrix' : 'cyberpunk';
    const newTheme = currentTheme === 'matrix' ? 'cyberpunk' : 'matrix';
    app.changeTheme(newTheme);
    document.getElementById('theme-selector').value = newTheme;
}

function clearTerminal() {
    if (app.terminal) {
        app.terminal.clear();
    }
}
