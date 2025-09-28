// مستوى 1 - المهام التمهيدية
class Level1 {
    constructor() {
        this.missions = [
            {
                id: 1,
                title: "تعلم الأمر decode",
                description: "تعلم如何使用 أمر فك التشفير",
                objective: "استخدم decode لفك تشفير U29tZVNlY3JldA==",
                solution: "decode U29tZVNlY3JldA==",
                points: 20
            },
            {
                id: 2, 
                title: "تعلم الأمر scan",
                description: "تعلم如何使用 أمر المسح",
                objective: "استخدم scan لفحص server-01",
                solution: "scan server-01",
                points: 30
            }
        ];
    }

    init() {
        console.log("تهيئة المستوى 1");
    }
}
