class Terminal {
    constructor() {
        this.commands = {
            'help': this.showHelp.bind(this),
            'clear': this.clear.bind(this),
            'scan': this.scan.bind(this),
            'decrypt': this.decrypt.bind(this),
            'connect': this.connect.bind(this),
            'hack': this.hack.bind(this),
            'logout': this.logout.bind(this),
            'missions': this.showMissions.bind(this),
            'tools': this.showTools.bind(this),
            'profile': this.showProfile.bind(this),
            'hint': this.showHint.bind(this)
        };
        this.outputElement = document.getElementById('terminal-output');
        this.inputElement = document.getElementById('terminal-input');
        this.auth = new Authentication(this);
    }

    initialize() {
        this.output('طرفية HACK-OS جاهزة. اكتب "help" لقائمة الأوامر.', 'info');
    }

    processCommand(input) {
        if (!input.trim()) return;

        // إضافة الأمر إلى السجل
        this.addLine(`<span class="prompt">user@hack-os:~$</span> ${input}`, 'command');

        const args = input.split(' ');
        const command = args[0].toLowerCase();
        const params = args.slice(1);

        if (this.commands[command]) {
            this.commands[command](params);
        } else {
            this.output(`أمر غير معروف: ${command}. اكتب "help" للمساعدة.`, 'error');
        }
    }

    output(text, type = 'normal') {
        this.addLine(text, type);
    }

    addLine(text, type) {
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.innerHTML = text;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    clear() {
        this.outputElement.innerHTML = '';
        this.output('تم مسح الطرفية.', 'info');
    }

    showHelp() {
        const helpText = `
الأوامر المتاحة:<br>
- <span class="command">help</span>: عرض هذه المساعدة<br>
- <span class="command">scan [هدف]</span>: فحص الهدف للحصول على معلومات<br>
- <span class="command">decrypt [نص مشفر]</span>: فك تشفير النص<br>
- <span class="command">connect [خادم]</span>: الاتصال بخادم بعيد<br>
- <span class="command">hack [هدف]</span>: اختراق الهدف (يتطلب أدوات)<br>
- <span class="command">missions</span>: عرض المهام المتاحة<br>
- <span class="command">tools</span>: عرض الأدوات المتاحة<br>
- <span class="command">profile</span>: عرض الملف الشخصي<br>
- <span class="command">hint [مهمة]</span>: طلب تلميح لمهمة (بتكلفة نقاط)<br>
- <span class="command">logout</span>: تسجيل الخروج<br>
- <span class="command">clear</span>: مسح الطرفية<br>
        `;
        this.output(helpText, 'info');
    }

    scan(params) {
        if (params.length < 1) {
            this.output('استخدام: scan [هدف]', 'error');
            return;
        }
        const target = params[0];
        this.output(`جاري فحص ${target}...`, 'info');
        // محاكاة الفحص مع تأثير التأخير
        setTimeout(() => {
            this.output(`نتيجة فحص ${target}:<br>
- نظام التشغيل: Linux 4.15.0-112-generic<br>
- البورتات المفتوحة: 22, 80, 443<br>
- الخدمات: SSH, HTTP, HTTPS<br>
- الثغرات: 2 ثغرات متوسطة`, 'success');
        }, 2000);
    }

    decrypt(params) {
        if (params.length < 1) {
            this.output('استخدام: decrypt [نص مشفر]', 'error');
            return;
        }
        const encryptedText = params[0];
        this.output(`جاري فك تشفير: ${encryptedText}...`, 'info');
        setTimeout(() => {
            const decrypted = Encryption.decrypt(encryptedText);
            if (decrypted) {
                this.output(`النص المفقوش: ${decrypted}`, 'success');
            } else {
                this.output('فشل فك التشفير. تأكد من صحة النص المشفر.', 'error');
            }
        }, 1500);
    }

    connect(params) {
        if (params.length < 1) {
            this.output('استخدام: connect [خادم]', 'error');
            return;
        }
        const server = params[0];
        this.output(`جاري الاتصال بـ ${server}...`, 'info');
        setTimeout(() => {
            this.output(`تم الاتصال بـ ${server}. جاهز للأوامر.`, 'success');
        }, 1000);
    }

    hack(params) {
        if (params.length < 1) {
            this.output('استخدام: hack [هدف]', 'error');
            return;
        }
        const target = params[0];
        this.output(`بدء اختراق ${target}...`, 'warning');
        // محاكاة عملية الاختراق
        setTimeout(() => {
            this.output(`اختراق ${target} بنجاح! تم الحصول على صلاحيات root.`, 'success');
        }, 3000);
    }

    logout() {
        this.output('جاري تسجيل الخروج...', 'info');
        setTimeout(() => {
            this.auth.logoutUser();
        }, 1000);
    }

    showMissions() {
        if (window.app && window.app.game) {
            window.app.game.displayMissions();
        } else {
            this.output('لا يمكن تحميل المهام. حاول مرة أخرى.', 'error');
        }
    }

    showTools() {
        if (window.app && window.app.game) {
            window.app.game.displayTools();
        } else {
            this.output('لا يمكن تحميل الأدوات. حاول مرة أخرى.', 'error');
        }
    }

    showProfile() {
        if (window.app && window.app.currentUser) {
            const user = window.app.currentUser;
            const progress = window.app.userProgress;
            this.output(`الملف الشخصي:<br>
- اسم المستخدم: ${user.username}<br>
- المستوى: ${progress.level}<br>
- النقاط: ${progress.points}<br>
- المهام المكتملة: ${progress.completedMissions.length}<br>
- نقاط التلميحات: ${progress.hintPoints}`, 'info');
        } else {
            this.output('يجب تسجيل الدخول أولاً.', 'error');
        }
    }

    showHint(params) {
        if (window.app && window.app.game) {
            window.app.game.requestHint(params);
        } else {
            this.output('لا يمكن طلب تلميح. حاول مرة أخرى.', 'error');
        }
    }

    // دالة للمصادقة من خلال الواجهة
    authenticateUser(username, password) {
        this.auth.loginUser(username, password);
    }

    registerUser(username, password, confirmPassword) {
        this.auth.registerUser(username, password, confirmPassword);
    }
}
