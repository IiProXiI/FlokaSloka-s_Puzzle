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
        this.game = new GameEngine(); // تم تصحيح الخطأ هنا
        
        this.isInitialized = true;
        console.log('النظام مهيأ بالكامل');
    }

    // ... باقي الكود بدون تغيير ...
}

// ... باقي الكود بدون تغيير ...
