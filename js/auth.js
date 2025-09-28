// نظام المصادقة وإدارة المستخدمين
class Authentication {
    constructor(terminal) {
        this.terminal = terminal;
        this.users = this.loadUsers();
    }

    loadUsers() {
        const usersData = localStorage.getItem('hacking_simulator_users');
        return usersData ? JSON.parse(usersData) : {};
    }

    saveUsers() {
        localStorage.setItem('hacking_simulator_users', JSON.stringify(this.users));
    }

    registerUser(username, password, confirmPassword) {
        if (!username || !password) {
            this.terminal.output('خطأ: اسم المستخدم وكلمة المرور مطلوبان', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.terminal.output('خطأ: كلمتا المرور غير متطابقتين', 'error');
            return false;
        }

        if (this.users[username]) {
            this.terminal.output('خطأ: اسم المستخدم موجود مسبقاً', 'error');
            return false;
        }

        if (password.length < 6) {
            this.terminal.output('خطأ: كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return false;
        }

        // تشفير كلمة المرور (بشكل أساسي للتطبيق)
        const userHash = Encryption.generateHash(username + password);
        
        this.users[username] = {
            username: username,
            passwordHash: userHash,
            createdAt: new Date().toISOString(),
            level: 1,
            points: 0
        };

        this.saveUsers();
        this.terminal.output(`تم إنشاء الحساب بنجاح! مرحباً ${username}`, 'success');
        
        // تسجيل الدخول تلقائياً بعد التسجيل
        setTimeout(() => this.loginUser(username, password), 1000);
        
        return true;
    }

    loginUser(username, password) {
        if (!username || !password) {
            this.terminal.output('خطأ: اسم المستخدم وكلمة المرور مطلوبان', 'error');
            return false;
        }

        const user = this.users[username];
        const userHash = Encryption.generateHash(username + password);

        if (!user || user.passwordHash !== userHash) {
            this.terminal.output('خطأ: اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
            return false;
        }

        // حفظ حالة المستخدم الحالي
        localStorage.setItem('current_user', JSON.stringify({
            username: username,
            loginTime: new Date().toISOString()
        }));

        this.terminal.output(`تم الدخول بنجاح! مرحباً مرة أخرى ${username}`, 'success');
        
        // الانتقال إلى الواجهة الرئيسية
        setTimeout(() => {
            if (window.app) {
                window.app.currentUser = { username: username };
                window.app.loadUserProgress();
                window.app.showMainInterface();
            }
        }, 1500);

        return true;
    }

    logoutUser() {
        localStorage.removeItem('current_user');
        if (window.app) {
            window.app.currentUser = null;
            window.app.showAuthScreen();
        }
    }

    validateSession() {
        const userData = localStorage.getItem('current_user');
        if (!userData) return false;

        try {
            const user = JSON.parse(userData);
            return !!this.users[user.username];
        } catch (e) {
            return false;
        }
    }
}
