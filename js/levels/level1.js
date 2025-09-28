// المستوى الأول: التعلم الأساسي
class Level1 {
    constructor() {
        this.missions = [
            {
                id: 1,
                title: "البداية: فك شفرة Base64",
                description: "تعلم أساسيات فك التشفير باستخدام Base64",
                objective: "فك تشفير الرسالة: U29tZVNlY3JldA==",
                solution: "decode U29tZVNlY3JldA==",
                hints: [
                    "استخدم أمر decode مع الرسالة المشفرة",
                    "Base64 هو ترميز وليس تشفيراً",
                    "جرب: decode U29tZVNlY3JldA=="
                ],
                points: 50,
                timeLimit: 300
            },
            {
                id: 2,
                title: "فحص الخادم الأول",
                description: "تعلم如何使用 أداة المسح",
                objective: "مسح خادم server-01",
                solution: "scan server-01",
                hints: [
                    "استخدم أمر scan متبوعاً باسم الخادم",
                    "اسم الخادم هو server-01",
                    "الأمر الكامل: scan server-01"
                ],
                points: 30,
                timeLimit: 180
            }
        ];
    }

    init() {
        console.log("تم تحميل المستوى الأول: التعلم الأساسي");
        return this.missions;
    }
}
