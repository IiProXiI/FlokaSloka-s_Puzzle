// نظام التأثيرات الصوتية
class SoundSystem {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.volume = 0.5;
        this.initSounds();
    }

    initSounds() {
        // إنشاء أصوات باستخدام Web Audio API
        this.sounds = {
            type: this.createTypeSound(),
            success: this.createSuccessSound(),
            error: this.createErrorSound(),
            hack: this.createHackSound(),
            scan: this.createScanSound(),
            notification: this.createNotificationSound()
        };
    }

    createTypeSound() {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        
        return { context, oscillator, gainNode };
    }

    createSuccessSound() {
        // صوت نجاح بترددات متعددة
        const context = new (window.AudioContext || window.webkitAudioContext)();
        return this.createChordSound(context, [600, 800, 1000]);
    }

    createErrorSound() {
        // صوت خطأ بتردد منخفض
        const context = new (window.AudioContext || window.webkitAudioContext)();
        return this.createChordSound(context, [300, 250, 200]);
    }

    createChordSound(context, frequencies) {
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.value = 0.1;

        const oscillators = frequencies.map(freq => {
            const oscillator = context.createOscillator();
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            oscillator.connect(gainNode);
            return oscillator;
        });

        return { context, oscillators, gainNode };
    }

    playSound(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;

        try {
            const sound = this.sounds[soundName];
            
            if (sound.oscillator) {
                // صوت مفرد
                sound.oscillator.start();
                sound.oscillator.stop(sound.context.currentTime + 0.1);
            } else if (sound.oscillators) {
                // صوت وتر
                sound.oscillators.forEach(osc => {
                    osc.start();
                    osc.stop(sound.context.currentTime + 0.3);
                });
            }
        } catch (e) {
            console.log('لا يمكن تشغيل الصوت:', e);
        }
    }

    playTypingSound() {
        if (!this.isMuted) {
            this.playSound('type');
        }
    }

    playSuccessSound() {
        this.playSound('success');
    }

    playErrorSound() {
        this.playSound('error');
    }

    playHackSound() {
        this.playSound('hack');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        // تحديث حجم الصوت لجميع الأصوات
        Object.values(this.sounds).forEach(sound => {
            if (sound.gainNode) {
                sound.gainNode.gain.value = this.volume * 0.1;
            }
        });
    }
}
