// نظام التأثيرات المرئية
class VisualEffects {
    constructor() {
        this.effects = {
            matrix: new MatrixEffect(),
            particles: new ParticleEffect(),
            glitch: new GlitchEffect()
        };
    }

    // تأثير كتابة المحرفيات (ماتريكس)
    createMatrixEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }

    // تأثير التقدم المتحرك
    createProgressAnimation(progressBar, duration = 1000) {
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            progressBar.style.width = (percentage * 100) + '%';
            
            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // تأثير اهتزاز للعناصر
    shakeElement(element, intensity = 5) {
        const originalPosition = element.style.transform;
        let shakes = 0;
        const maxShakes = 10;
        
        const shakeInterval = setInterval(() => {
            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            element.style.transform = `translate(${x}px, ${y}px)`;
            
            shakes++;
            if (shakes >= maxShakes) {
                clearInterval(shakeInterval);
                element.style.transform = originalPosition;
            }
        }, 50);
    }

    // تأثير وميض للتنبيهات
    blinkElement(element, times = 3, color = '#ff0000') {
        const originalColor = element.style.backgroundColor;
        let blinks = 0;
        
        const blinkInterval = setInterval(() => {
            if (blinks % 2 === 0) {
                element.style.backgroundColor = color;
            } else {
                element.style.backgroundColor = originalColor;
            }
            
            blinks++;
            if (blinks >= times * 2) {
                clearInterval(blinkInterval);
                element.style.backgroundColor = originalColor;
            }
        }, 300);
    }

    // إنشاء تأثير مطر من الأحرف (ماتريكس)
    createMatrixRain(canvas) {
        const ctx = canvas.getContext('2d');
        const chars = '01アイウエオABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // تهيئة المواقع
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function draw() {
            // خلفية شبه شفافة
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
    }

    // تأثير جلتش للشاشة
    createGlitchEffect() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            
            .glitch-effect {
                animation: glitch 0.3s infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

// تأثيرات محددة
class MatrixEffect {
    constructor() {
        this.canvas = null;
    }
    
    initialize() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
    }
}

class ParticleEffect {
    constructor() {
        this.particles = [];
    }
    
    createExplosion(x, y, color = '#00ff41') {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: color
            });
        }
    }
}
