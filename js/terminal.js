// نظام الطرفية والأوامر
class Terminal {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentMission = null;
        this.isProcessing = false;
    }

    initialize() {
        this.setupTerminalEvents();
        this.displayWelcomeMessage();
    }

    setupTerminalEvents() {
        const terminalInput = document.getElementById('terminal-input');
        
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

    resizeInput(input) {
        // ضبط حجم حقل الإدخال حسب المحتوى
        input.style.width = 'auto';
        input.style.width = (input.scrollWidth + 10) + 'px';
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = -1;
            document.getElementById('terminal-input').value = '';
            return;
        }
        
        if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length - 1;
        }

        document.getElementById('terminal-input').value = this.commandHistory[this.historyIndex];
        this.resizeInput(document.getElementById('terminal-input'));
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

        if (!input.trim()) return;

        // إضافة الأمر إلى السجل
        this.addToHistory(input);
        this.displayCommand(input);

        this.isProcessing = true;
        
        // محاكاة التأخير في المعالجة
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
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line command';
        commandLine.innerHTML = `<span class="prompt">user@hack-os:~$</span> ${command}`;
        outputElement.appendChild(commandLine);
        this.scrollToBottom();
    }

    output(text, type = 'normal') {
        const outputElement = document.getElementById('terminal-output');
        const messageLine = document.createElement('div');
        messageLine.className = `output-line ${type}`;
        
        if (typeof text === 'string') {
            messageLine.innerHTML = this.formatText(text);
        } else {
            messageLine.appendChild(text);
        }
        
        outputElement.appendChild(messageLine);
        this.scrollToBottom();
    }

    formatText(text) {
        // دعم الألوان والتنسيقات الخاصة
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    }

    scrollToBottom() {
        const outputElement = document.getElementById('terminal-output');
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    executeCommand(input) {
        const args = input.split(' ');
        const command = args[0].toLowerCase();
        const parameters = args.slice(1);

        switch(command) {
            case 'help':
                this.showHelp();
                break;
            case 'scan':
                this.scanTarget(parameters);
                break;
            case 'decrypt':
                this.decryptText(parameters);
                break;
            case 'connect':
                this.connectToServer(parameters);
                break;
            case 'hack':
                this.hackTarget(parameters);
                break;
            case 'missions':
                this.showMissions();
                break;
            case 'tools':
                this.showTools();
                break;
            case 'profile':
                this.showProfile();
                break;
            case 'hint':
                this.requestHint(parameters);
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'decode':
                this.decodeData(parameters);
                break;
            case 'bruteforce':
                this.bruteForce(parameters);
                break;
            case 'sqlmap':
                this.sqlInjection(parameters);
                break;
            case 'logout':
                this.logout();
                break;
            default:
                this.output(`أمر غير معروف: '${command}'. اكتب 'help' للحصول على المساعدة.`, 'error');
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
• <code>bruteforce [خدمة]</code> - هجوم القوة الغاشمة

<strong>أوامر المساعدة:</strong>
• <code>hint [مهمة]</code> - طلب تلميح للمهمة (بتكلفة نقاط)
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

        const target = parameters[0];
        this.output(`جاري فحص ${target}...`, 'info');

        // محاكاة عملية الفحص
        setTimeout(() => {
            this.output(`<strong>نتيجة فحص ${target}:</strong>`, 'success');
            this.output('• نظام التشغيل: Linux Ubuntu 20.04', 'info');
            this.output('• البورتات المفتوحة: 22 (SSH), 80 (HTTP), 443 (HTTPS)', 'info');
            this.output('• الإصدارات: Apache 2.4.41, OpenSSH 8.2', 'info');
            this.output('• الثغرات المحتملة: 2', 'warning');
            this.output('• مستوى الصعوبة: متوسط', 'info');
        }, 2000);
    }

    decryptText(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: decrypt [نص مشفر] - مثال: decrypt SDBzZWNyZXQ=', 'error');
            return;
        }

        const encryptedText = parameters[0];
        this.output(`جاري فك تشفير: ${encryptedText}...`, 'info');

        setTimeout(() => {
            const decrypted = Encryption.decrypt(encryptedText);
            if (decrypted) {
                this.output(`<strong>تم فك التشفير:</strong> ${decrypted}`, 'success');
            } else {
                this.output('فشل فك التشفير. قد يكون النص غير صالح أو مفتاح التشفير خاطئ.', 'error');
            }
        }, 1500);
    }

    connectToServer(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: connect [عنوان الخادم] - مثال: connect 192.168.1.100', 'error');
            return;
        }

        const server = parameters[0];
        this.output(`جاري الاتصال بـ ${server}...`, 'info');

        setTimeout(() => {
            if (Math.random() > 0.3) {
                this.output(`<strong>تم الاتصال بنجاح بـ ${server}</strong>`, 'success');
                this.output('جاهز لاستقبال الأوامر...', 'info');
            } else {
                this.output(`فشل الاتصال بـ ${server}. الخادم غير متاح أو محظور.`, 'error');
            }
        }, 2000);
    }

    hackTarget(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: hack [هدف] - مثال: hack web-server', 'error');
            return;
        }

        const target = parameters[0];
        this.output(`بدء عملية اختراق ${target}...`, 'warning');

        // محاكاة عملية الاختراق مع تقدم مرئي
        const progressBar = this.createProgressBar('اختراق قيد التقدم');
        this.output(progressBar.container, 'info');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressBar.bar.style.width = '100%';
                    this.output(`<strong>تم اختراق ${target} بنجاح!</strong>`, 'success');
                    this.output('تم الحصول على صلاحيات root', 'success');
                    
                    // إزالة شريط التقدم
                    progressBar.container.remove();
                }, 500);
            } else {
                progressBar.bar.style.width = progress + '%';
                progressBar.text.textContent = `اختراق قيد التقدم: ${Math.round(progress)}%`;
            }
        }, 300);
    }

    createProgressBar(label) {
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.className = 'progress-label';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-horizontal';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        
        const textElement = document.createElement('div');
        textElement.className = 'progress-text';
        textElement.textContent = `${label}: 0%`;
        
        progressBar.appendChild(progressFill);
        container.appendChild(labelElement);
        container.appendChild(progressBar);
        container.appendChild(textElement);
        
        return {
            container: container,
            bar: progressFill,
            text: textElement
        };
    }

    showMissions() {
        if (window.app && window.app.game) {
            window.app.game.displayMissionsInTerminal();
        }
    }

    showTools() {
        const tools = [
            { name: 'الماسح الضوئي', description: 'لمسح الشبكات والأنظمة', level: 1 },
            { name: 'أداة فك التشفير', description: 'لفك تشفير النصوص والبيانات', level: 1 },
            { name: 'أداة القوة الغاشمة', description: 'لكسر كلمات المرور', level: 2 },
            { name: 'مستغِل الثغرات', description: 'لاستغلال الثغرات الأمنية', level: 3 },
            { name: 'أداة التصيد', description: 'لإنشاء هجمات التصيد', level: 4 }
        ];

        this.output('<strong>الأدوات المتاحة:</strong>', 'info');
        
        tools.forEach(tool => {
            const status = tool.level <= (window.app?.userProgress?.level || 1) ? '🔓' : '🔒';
            this.output(`${status} <strong>${tool.name}</strong> - ${tool.description} (المستوى ${tool.level})`, 'info');
        });
    }

    showProfile() {
        if (window.app && window.app.userProgress) {
            const progress = window.app.userProgress;
            this.output('<strong>الملف الشخصي:</strong>', 'info');
            this.output(`• اسم المستخدم: ${window.app.currentUser.username}`, 'info');
            this.output(`• المستوى: ${progress.level}`, 'info');
            this.output(`• النقاط: ${progress.points}`, 'info');
            this.output(`• المهام المكتملة: ${progress.completedMissions.length}`, 'info');
            this.output(`• نقاط التلميحات: ${progress.hintPoints}`, 'info');
        }
    }

    requestHint(parameters) {
        if (window.app && window.app.game) {
            window.app.game.requestHint(parameters);
        }
    }

    decodeData(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: decode [نص] - مثال: decode 48656c6c6f (Hex) أو decode U29tZVNlY3JldA== (Base64)', 'error');
            return;
        }

        const encodedText = parameters[0];
        this.output(`جاري فك ترميز: ${encodedText}...`, 'info');

        setTimeout(() => {
            // محاولة فك الترميز بعدة طرق
            let decoded = null;
            let method = '';

            // محاولة Base64
            try {
                decoded = atob(encodedText);
                method = 'Base64';
            } catch (e) {
                // محاولة Hex
                if (/^[0-9A-Fa-f]+$/.test(encodedText)) {
                    decoded = this.hexToString(encodedText);
                    method = 'Hex';
                }
            }

            if (decoded) {
                this.output(`<strong>تم فك الترميز (${method}):</strong> ${decoded}`, 'success');
            } else {
                this.output('فشل فك الترميز. التنسيق غير معروف.', 'error');
            }
        }, 1000);
    }

    hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }

    bruteForce(parameters) {
        if (parameters.length === 0) {
            this.output('استخدام: bruteforce [خدمة] - مثال: bruteforce ssh', 'error');
            return;
        }

        const service = parameters[0];
        this.output(`بدء هجوم القوة الغاشمة على ${service}...`, 'warning');

        const progressBar = this.createProgressBar('هجوم القوة الغاشمة');
        this.output(progressBar.container, 'info');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressBar.bar.style.width = '100%';
                    
                    if (Math.random() > 0.5) {
                        this.output(`<strong>نجح الهجوم على ${service}!</strong>`, 'success');
                        this.output('تم العثور على كلمة المرور: admin123', 'success');
                    } else {
                        this.output(`<strong>فشل الهجوم على ${service}</strong>`, 'error');
                        this.output('كلمة المرور قوية جداً أو الخدمة محمية', 'error');
                    }
                    
                    progressBar.container.remove();
                }, 500);
            } else {
                progressBar.bar.style.width = progress + '%';
                progressBar.text.textContent = `هجوم القوة الغاشمة: ${Math.round(progress)}%`;
            }
        }, 400);
    }

    sqlInjection(parameters) {
        this.output('جاري تحميل أداة SQLMap...', 'info');
        
        setTimeout(() => {
            this.output('<strong>SQLMap v1.6.7 جاهز</strong>', 'success');
            this.output('استخدم: sqlmap -u "http://target.com/page?id=1" --dbs', 'info');
            this.output('هذه محاكاة فقط - الأداة غير نشطة فعلياً', 'warning');
        }, 1500);
    }

    clearTerminal() {
        document.getElementById('terminal-output').innerHTML = '';
        this.displayWelcomeMessage();
    }

    logout() {
        this.output('جاري تسجيل الخروج...', 'info');
        setTimeout(() => {
            if (window.app) {
                window.app.logout();
            }
        }, 1000);
    }
}
