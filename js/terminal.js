class Terminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentMission = null;
        this.isProcessing = false;
        this.users = this.loadUsers();
    }

    initialize() {
        console.log('تهيئة الطرفية...');
        this.setupTerminalEvents();
        this.displayWelcomeMessage();
    }

    setupTerminalEvents() {
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateHistory(-1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateHistory(1);
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    this.autoComplete(e.target);
                }
            });

            terminalInput.addEventListener('input', (e) => {
                this.resizeInput(e.target);
            });
        }
    }

    resizeInput(input) {
        input.style.width = 'auto';
        input.style.width = (input.scrollWidth + 10) + 'px';
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = -1;
            const inp = document.getElementById('terminal-input');
            if (inp) inp.value = '';
            return;
        }
        
        if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length - 1;
        }

        const inp = document.getElementById('terminal-input');
        if (inp) {
            inp.value = this.commandHistory[this.historyIndex];
            this.resizeInput(inp);
        }
    }

    autoComplete(input) {
        const commands = ['help', 'scan', 'decrypt', 'connect', 'hack', 'logout', 'missions', 
                         'tools', 'profile', 'clear', 'hint', 'decode', 'bruteforce', 'sqlmap'];
        
        const currentText = input.value.toLowerCase();
        const matches = commands.filter(cmd => cmd.startsWith(currentText));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
            this.resizeInput(input);
        } else if (matches.length > 1) {
            this.output(`الأوامر المطابقة: ${matches.join(', ')}`, 'info');
        }
    }

    displayWelcomeMessage() {
        this.output('==================================================', 'info');
        this.output('🌐 HACKING SIMULATOR PRO - نظام محاكاة القرصنة', 'success');
        this.output('==================================================', 'info');
        this.output('اكتب "help" لعرض قائمة الأوامر المتاحة', 'info');
        this.output('اكتب "missions" لعرض المهام المتاحة', 'info');
        this.output('', 'info');
    }

    processCommand(input) {
        if (this.isProcessing) {
            this.output('جاري معالجة الأمر السابق...', 'warning');
            return;
        }

        if (!input || !input.trim()) return;

        this.addToHistory(input);
        this.displayCommand(input);

        this.isProcessing = true;
        
        setTimeout(() => {
            this.executeCommand(input);
            this.isProcessing = false;
        }, 500);
    }

    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
    }

    displayCommand(command) {
        const outputElement = document.getElementById('terminal-output');
        if (!outputElement) return;

        const commandLine = document.createElement('div');
        commandLine.className = 'output-line command';
        commandLine.innerHTML = `<span class="prompt">user@hack-os:~$</span> ${this.escapeHtml(command)}`;
        outputElement.appendChild(commandLine);
        this.scrollToBottom();
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    output(text, type = 'normal') {
        const outputElement = document.getElementById('terminal-output');
        if (!outputElement) return;

        const messageLine = document.createElement('div');
        messageLine.className = `output-line ${type}`;
        
        if (typeof text === 'string') {
            // نسمح بالـ HTML المحدود من formatText
            messageLine.innerHTML = this.formatText(text);
        } else {
            messageLine.appendChild(text);
        }
        
        outputElement.appendChild(messageLine);
        this.scrollToBottom();
    }

    formatText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
    }

    scrollToBottom() {
        const outputElement = document.getElementById('terminal-output');
        if (outputElement) {
            outputElement.scrollTop = outputElement.scrollHeight;
        }
    }

    executeCommand(input) {
        const args = input.split(' ').filter(s => s !== '');
        const command = (args[0] || '').toLowerCase();
        const parameters = args.slice(1);

        switch(command) {
            case 'help': this.showHelp(); break;
            case 'scan': this.scanTarget(parameters); break;
            case 'decrypt': this.decryptText(parameters); break;
            case 'connect': this.connectToServer(parameters); break;
            case 'hack': this.hackTarget(parameters); break;
            case 'missions': this.showMissions(); break;
            case 'tools': this.showTools(); break;
            case 'profile': this.showProfile(); break;
            case 'hint': this.requestHint(parameters); break;
            case 'clear': this.clear(); break;
            case 'decode': this.decodeData(parameters); break;
            case 'bruteforce': this.bruteForce(parameters); break;
            case 'sqlmap': this.sqlInjection(parameters); break;
            case 'logout': this.logout(); break;
            default: 
                this.output(`أمر غير معروف: '${this.escapeHtml(command)}'. اكتب 'help' للحصول على المساعدة.`, 'error');
        }
    }

    showHelp() {
        const helpText = `
<strong>قائمة الأوامر المتاحة:</strong>

<strong>الأوامر الأساسية:</strong>
• <code>help</code> - عرض هذه الرسالة
• <code>clear</code> - مسح الطرفية
• <code>missions</code> - عرض المهام المتاحة
• <code>profile</code> - عرض الملف الشخصي

<strong>أوامر القرصنة:</strong>
• <code>scan [هدف]</code> - فحص الهدف للحصول على معلومات
• <code>decrypt [نص]</code> - فك تشفير النص المشفر
• <code>connect [خادم]</code> - الاتصال بخادم بعيد
• <code>hack [هدف]</code> - اختراق الهدف
• <code>decode [نص]</code> - فك ترميز النص (Base64, Hex, etc.)

<strong>أوامر المساعدة:</strong>
• <code>hint [مهمة]</code> - طلب تلميح للمهمة
• <code>tools</code> - عرض الأدوات المتاحة

<strong>أوامر النظام:</strong>
• <code>logout</code> - تسجيل الخروج
        `;
        this.output(helpText, 'info');
    }

    scanTarget(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: scan [هدف] - مثال: scan server-01', 'error');
            return;
        }

        const target = this.escapeHtml(parameters[0]);
        this.output(`جاري فحص ${target}...`, 'info');

        setTimeout(() => {
            this.output(`<strong>نتيجة فحص ${target}:</strong>`, 'success');
            this.output('• نظام التشغيل: Linux Ubuntu 20.04', 'info');
            this.output('• البورتات المفتوحة: 22 (SSH), 80 (HTTP), 443 (HTTPS)', 'info');
            this.output('• الإصدارات: Apache 2.4.41, OpenSSH 8.2', 'info');
            this.output('• الثغرات المحتملة: 2', 'warning');
        }, 1200);
    }

    decryptText(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: decrypt [نص مشفر]', 'error');
            return;
        }

        const encryptedText = parameters[0];
        this.output(`جاري فك تشفير: ${this.escapeHtml(encryptedText)}...`, 'info');

        setTimeout(() => {
            const decrypted = Encryption.decrypt(encryptedText);
            if (decrypted) {
                this.output(`<strong>تم فك التشفير:</strong> ${this.escapeHtml(decrypted)}`, 'success');
            } else {
                this.output('فشل فك التشفير', 'error');
            }
        }, 800);
    }

    connectToServer(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: connect [خادم]', 'error');
            return;
        }

        const server = this.escapeHtml(parameters[0]);
        this.output(`جاري الاتصال بـ ${server}...`, 'info');

        setTimeout(() => {
            this.output(`<strong>تم الاتصال بنجاح بـ ${server}</strong>`, 'success');
        }, 1000);
    }

    hackTarget(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: hack [هدف]', 'error');
            return;
        }

        const target = this.escapeHtml(parameters[0]);
        this.output(`بدء اختراق ${target}...`, 'warning');

        setTimeout(() => {
            this.output(`<strong>تم اختراق ${target} بنجاح!</strong>`, 'success');
        }, 1500);
    }

    showMissions() {
        if (window.app && window.app.game && typeof window.app.game.displayMissionsInTerminal === 'function') {
            window.app.game.displayMissionsInTerminal();
        } else {
            this.output('نظام المهام غير متاح حالياً', 'error');
        }
    }

    showTools() {
        if (window.app && window.app.game && typeof window.app.game.displayToolsInTerminal === 'function') {
            window.app.game.displayToolsInTerminal();
        } else {
            this.output('نظام الأدوات غير متاح حالياً', 'error');
        }
    }

    showProfile() {
        if (window.app && window.app.userProgress) {
            const progress = window.app.userProgress;
            this.output('<strong>الملف الشخصي:</strong>', 'info');
            this.output(`• المستخدم: ${this.escapeHtml(window.app.currentUser?.username || 'غير معروف')}`, 'info');
            this.output(`• المستوى: ${progress.level}`, 'info');
            this.output(`• النقاط: ${progress.points}`, 'info');
            this.output(`• البروكس: ${progress.prox} 🪙`, 'info');
            this.output(`• المهام المكتملة: ${progress.completedMissions?.length || 0}`, 'info');
        } else {
            this.output('بيانات الملف الشخصي غير متاحة', 'error');
        }
    }

    requestHint(parameters) {
        this.output('نظام التلميحات قيد التطوير...', 'info');
    }

    decodeData(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: decode [نص]', 'error');
            return;
        }

        const encodedText = parameters[0];
        this.output(`جاري فك ترميز: ${this.escapeHtml(encodedText)}...`, 'info');

        setTimeout(() => {
            try {
                const decoded = atob(encodedText);
                this.output(`<strong>تم فك الترميز (Base64):</strong> ${this.escapeHtml(decoded)}`, 'success');
            } catch (e) {
                this.output('فشل فك الترميز', 'error');
            }
        }, 700);
    }

    bruteForce(parameters) {
        this.output('أداة القوة الغاشمة قيد التطوير...', 'info');
    }

    sqlInjection(parameters) {
        this.output('أداة SQL Injection قيد التطوير...', 'info');
    }

    clearTerminal() {
        const outputElement = document.getElementById('terminal-output');
        if (outputElement) {
            outputElement.innerHTML = '';
            this.displayWelcomeMessage();
        }
    }

    clear() {
        this.clearTerminal();
    }

    logout() {
        this.output('جاري تسجيل الخروج...', 'info');
        setTimeout(() => {
            if (window.app) {
                window.app.logout();
            }
        }, 700);
    }

    // ========== دوال التسجيل والمصادقة ==========

    registerUser(username, password, confirmPassword) {
        console.log('محاولة تسجيل مستخدم جديد:', username);
        
        if (!username || !password) {
            this.output('خطأ: اسم المستخدم وكلمة المرور مطلوبان', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.output('خطأ: كلمتا المرور غير متطابقتين', 'error');
            return false;
        }

        if (this.users[username]) {
            this.output('خطأ: اسم المستخدم موجود مسبقاً', 'error');
            return false;
        }

        if (password.length < 6) {
            this.output('خطأ: كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return false;
        }

        // تسجيل المستخدم
        const userHash = this.generateHash(username + password);
        
        this.users[username] = {
            username: username,
            passwordHash: userHash,
            createdAt: new Date().toISOString(),
            level: 1,
            points: 0
        };

        this.saveUsers();
        this.output(`✅ تم إنشاء الحساب بنجاح! مرحباً ${this.escapeHtml(username)}`, 'success');
        
        // تسجيل الدخول تلقائياً
        setTimeout(() => {
            this.authenticateUser(username, password);
        }, 800);
        
        return true;
    }

    authenticateUser(username, password) {
        console.log('محاولة دخول المستخدم:', username);
        
        if (!username || !password) {
            this.output('خطأ: اسم المستخدم وكلمة المرور مطلوبان', 'error');
            return false;
        }

        const user = this.users[username];
        const userHash = this.generateHash(username + password);

        if (!user || user.passwordHash !== userHash) {
            this.output('خطأ: اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
            return false;
        }

        // حفظ جلسة المستخدم
        localStorage.setItem('current_user', JSON.stringify({
            username: username,
            loginTime: new Date().toISOString()
        }));

        this.output(`✅ تم الدخول بنجاح! مرحباً مرة أخرى ${this.escapeHtml(username)}`, 'success');
        
        // الانتقال للواجهة الرئيسية
        setTimeout(() => {
            if (window.app) {
                window.app.currentUser = { username: username };
                window.app.loadUserProgress();
                window.app.showMainInterface();
            }
        }, 900);

        return true;
    }

    loadUsers() {
        try {
            const usersData = localStorage.getItem('hacking_simulator_users');
            return usersData ? JSON.parse(usersData) : {};
        } catch (e) {
            console.error('خطأ في تحميل المستخدمين:', e);
            return {};
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('hacking_simulator_users', JSON.stringify(this.users));
        } catch (e) {
            console.error('خطأ في حفظ المستخدمين:', e);
        }
    }

    generateHash(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}
