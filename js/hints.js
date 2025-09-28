// نظام التلميحات الذكي
class HintSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.hintHistory = [];
        this.adaptiveDifficulty = true;
    }

    generateHint(mission, attemptCount) {
        // تسجيل طلب التلميح
        this.hintHistory.push({
            missionId: mission.id,
            timestamp: new Date().toISOString(),
            attemptCount: attemptCount
        });

        // تحديد مستوى التلميح بناءً على عدد المحاولات
        let hintLevel = this.calculateHintLevel(attemptCount);
        
        // اختيار التلميح المناسب
        const hint = this.selectAppropriateHint(mission, hintLevel);
        
        return {
            hint: hint,
            cost: this.calculateHintCost(hintLevel),
            level: hintLevel
        };
    }

    calculateHintLevel(attemptCount) {
        if (!this.adaptiveDifficulty) return 1;

        if (attemptCount >= 5) return 3; // تلميح مباشر
        if (attemptCount >= 3) return 2; // تلميح متوسط
        return 1; // تلميح خفيف
    }

    selectAppropriateHint(mission, level) {
        const hints = mission.hints;
        
        if (level === 1) {
            // تلميح خفيف - توجيه عام
            return hints[0] || "فكر في الأدوات التي تعلمتها سابقاً";
        } else if (level === 2) {
            // تلميح متوسط - أكثر تحديداً
            return hints[1] || hints[0] || "راجع الهدف الرئيسي للمهمة";
        } else {
            // تلميح مباشر - يقرب من الحل
            return hints[2] || hints[1] || hints[0] || "جرب نهجاً مختلفاً";
        }
    }

    calculateHintCost(level) {
        // تكلفة التلميح تزداد مع كل طلب
        const baseCost = 10;
        const missionHints = this.hintHistory.filter(h => 
            h.missionId === this.game.currentMission?.id
        ).length;
        
        return baseCost * level + (missionHints * 5);
    }

    getProgressiveHint(mission) {
        const missionHints = this.hintHistory.filter(h => h.missionId === mission.id);
        const hintCount = missionHints.length;

        if (hintCount === 0) {
            return {
                hint: "ابدأ بتحليل الهدف بعناية",
                cost: 10,
                isDirect: false
            };
        } else if (hintCount === 1) {
            return {
                hint: "جرب استخدام أدوات المسح أولاً",
                cost: 15,
                isDirect: false
            };
        } else {
            return {
                hint: `الحل يتضمن: ${mission.solution.split(' ')[0]}`,
                cost: 25,
                isDirect: true
            };
        }
    }

    shouldOfferHint(mission, timeSpent, attempts) {
        // تقديم تلميح تلقائي إذا استغرق المستخدم وقتاً طويلاً
        if (timeSpent > mission.timeLimit * 0.7) {
            return true;
        }

        // تقديم تلميح بعد عدد معين من المحاولات الفاشلة
        if (attempts >= 3) {
            return true;
        }

        return false;
    }

    createHintModal(hintData) {
        const modal = document.createElement('div');
        modal.className = 'hint-modal';
        modal.innerHTML = `
            <div class="hint-content">
                <h3>💡 تلميح للمساعدة</h3>
                <p>${hintData.hint}</p>
                <div class="hint-cost">التكلفة: ${hintData.cost} نقطة</div>
                <div class="hint-actions">
                    <button class="hint-accept">قبول التلميح</button>
                    <button class="hint-decline">رفض</button>
                </div>
            </div>
        `;

        // إضافة النمط
        const style = document.createElement('style');
        style.textContent = `
            .hint-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .hint-content {
                background: #001100;
                border: 2px solid #00ff41;
                padding: 20px;
                border-radius: 10px;
                max-width: 400px;
                text-align: center;
            }
            .hint-cost {
                color: #ffaa00;
                margin: 10px 0;
            }
            .hint-actions button {
                margin: 5px;
                padding: 10px 20px;
                background: #003300;
                border: 1px solid #00ff41;
                color: #00ff41;
                cursor: pointer;
            }
            .hint-actions button:hover {
                background: #00ff41;
                color: #000;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // إضافة معالجات الأحداث
        modal.querySelector('.hint-accept').addEventListener('click', () => {
            if (window.app.userProgress.hintPoints >= hintData.cost) {
                window.app.userProgress.hintPoints -= hintData.cost;
                window.app.saveUserProgress();
                
                if (window.app.terminal) {
                    window.app.terminal.output(`💡 تلميح: ${hintData.hint}`, 'info');
                }
                
                modal.remove();
                style.remove();
            } else {
                alert('نقاط التلميحات غير كافية!');
            }
        });

        modal.querySelector('.hint-decline').addEventListener('click', () => {
            modal.remove();
            style.remove();
        });
    }

    // تحليل أنماط اللاعب لتقديم تلميحات مخصصة
    analyzePlayerPatterns() {
        const recentHints = this.hintHistory.slice(-10);
        const missionPatterns = {};

        recentHints.forEach(hint => {
            if (!missionPatterns[hint.missionId]) {
                missionPatterns[hint.missionId] = {
                    count: 0,
                    averageAttempts: 0
                };
            }
            
            missionPatterns[hint.missionId].count++;
            missionPatterns[hint.missionId].averageAttempts = 
                (missionPatterns[hint.missionId].averageAttempts + hint.attemptCount) / 2;
        });

        return missionPatterns;
    }

    // تقديم تلميحات استباقية بناءً على أنماط اللاعب
    getProactiveHint() {
        const patterns = this.analyzePlayerPatterns();
        const currentMission = this.game.currentMission;

        if (!currentMission) return null;

        const missionPattern = patterns[currentMission.id];
        if (missionPattern && missionPattern.averageAttempts > 2) {
            return this.generateHint(currentMission, missionPattern.averageAttempts);
        }

        return null;
    }
}
