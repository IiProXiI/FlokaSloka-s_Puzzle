// نظام أدوات القرصنة
class HackingTools {
    constructor() {
        this.tools = {
            scan: {
                name: "الماسح الضوئي",
                description: "لمسح الشبكات والأنظمة",
                level: 1,
                cost: 0,
                usage: "scan [هدف]",
                cooldown: 5000
            },
            decrypt: {
                name: "فك التشفير",
                description: "لفك تشفير النصوص والبيانات",
                level: 1,
                cost: 0,
                usage: "decrypt [نص]",
                cooldown: 3000
            },
            bruteforce: {
                name: "القوة الغاشمة",
                description: "لكسر كلمات المرور",
                level: 2,
                cost: 100,
                usage: "bruteforce [خدمة]",
                cooldown: 10000
            },
            sqlmap: {
                name: "حقن SQL",
                description: "لاستغلال ثغرات قواعد البيانات",
                level: 3,
                cost: 250,
                usage: "sqlmap [هدف]",
                cooldown: 15000
            },
            phishing: {
                name: "التصيد",
                description: "لإنشاء هجمات التصيد",
                level: 4,
                cost: 500,
                usage: "phishing [هدف]",
                cooldown: 20000
            }
        };
        
        this.unlockedTools = ['scan', 'decrypt'];
        this.cooldowns = {};
    }

    unlockTool(toolName) {
        const tool = this.tools[toolName];
        if (!tool) return false;

        if (this.unlockedTools.includes(toolName)) {
            return true; // الأداة مفتوحة بالفعل
        }

        if (window.app && window.app.userProgress) {
            if (window.app.userProgress.points >= tool.cost && 
                window.app.userProgress.level >= tool.level) {
                
                this.unlockedTools.push(toolName);
                window.app.userProgress.points -= tool.cost;
                window.app.saveUserProgress();
                
                return true;
            }
        }
        
        return false;
    }

    canUseTool(toolName) {
        if (!this.unlockedTools.includes(toolName)) {
            return { canUse: false, reason: "الأداة غير مفتوحة" };
        }

        const lastUsed = this.cooldowns[toolName];
        const tool = this.tools[toolName];
        
        if (lastUsed && (Date.now() - lastUsed) < tool.cooldown) {
            const remaining = tool.cooldown - (Date.now() - lastUsed);
            return { 
                canUse: false, 
                reason: `الأداة في فترة استعادة. انتظر ${Math.ceil(remaining/1000)} ثانية` 
            };
        }

        return { canUse: true };
    }

    useTool(toolName) {
        const check = this.canUseTool(toolName);
        if (!check.canUse) {
            return { success: false, message: check.reason };
        }

        this.cooldowns[toolName] = Date.now();
        return { success: true, message: `تم استخدام ${this.tools[toolName].name}` };
    }

    getAvailableTools() {
        return this.unlockedTools.map(toolName => this.tools[toolName]);
    }

    getToolInfo(toolName) {
        return this.tools[toolName];
    }

    // محاكاة استخدام الأداة مع تقدم مرئي
    simulateToolUsage(toolName, target) {
        return new Promise((resolve) => {
            const tool = this.tools[toolName];
            if (!tool) {
                resolve({ success: false, message: "الأداة غير موجودة" });
                return;
            }

            const check = this.canUseTool(toolName);
            if (!check.canUse) {
                resolve({ success: false, message: check.reason });
                return;
            }

            this.useTool(toolName);

            // محاكاة وقت المعالجة بناءً على الأداة
            const processingTime = tool.cooldown * 0.5;
            
            setTimeout(() => {
                const result = this.generateToolResult(toolName, target);
                resolve(result);
            }, processingTime);
        });
    }

    generateToolResult(toolName, target) {
        const results = {
            scan: {
                success: true,
                data: {
                    os: "Linux Ubuntu 20.04",
                    ports: "22 (SSH), 80 (HTTP), 443 (HTTPS)",
                    services: "Apache 2.4.41, OpenSSH 8.2",
                    vulnerabilities: Math.floor(Math.random() * 3) + 1
                }
            },
            decrypt: {
                success: Math.random() > 0.2,
                decrypted: "المعلومات السرية المفكوكة"
            },
            bruteforce: {
                success: Math.random() > 0.6,
                password: Math.random() > 0.5 ? "admin123" : "password"
            }
        };

        return results[toolName] || { success: false, message: "نتيجة غير معروفة" };
    }
}
