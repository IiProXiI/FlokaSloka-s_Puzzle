class HintSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
    }

    getHint(missionId) {
        const mission = this.game.missions.find(m => m.id === missionId);
        if (!mission) return null;

        // إرجاع تلميح عشوائي
        const randomIndex = Math.floor(Math.random() * mission.hints.length);
        return mission.hints[randomIndex];
    }

    // يمكن إضافة المزيد من الوظائف مثل تلميحات أكثر تحديدًا
}
