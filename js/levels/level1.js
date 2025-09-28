// level1.js - المستوى الأول من اللعبة
const level1 = {
    id: 1,
    title: 'المبتدئ',
    missions: [1, 2], // معرفات المهام في هذا المستوى
    unlockConditions: {
        points: 0
    },
    onStart: function() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('مرحباً في المستوى الأول! ابدأ بفحص الهدف.', 'info');
        }
    },
    onComplete: function() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('تهانينا! لقد أكملت المستوى الأول.', 'success');
        }
    }
};

// إضافة المستوى إلى اللعبة
if (window.app && window.app.game) {
    window.app.game.levels = window.app.game.levels || [];
    window.app.game.levels.push(level1);
}
