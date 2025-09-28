// level2.js - المستوى الثاني
const level2 = {
    id: 2,
    title: 'المتوسط',
    missions: [3, 4],
    unlockConditions: {
        points: 200
    },
    onStart: function() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('المستوى الثاني: تحديات أكثر صعوبة!', 'warning');
        }
    },
    onComplete: function() {
        if (window.app && window.app.terminal) {
            window.app.terminal.output('مذهل! أنت تتقدم بسرعة.', 'success');
        }
    }
};

if (window.app && window.app.game) {
    window.app.game.levels.push(level2);
}
