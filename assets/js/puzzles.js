// في ملف puzzles.js، عدل دالة getHint:
getHint(puzzleNumber, hintLevel) {
    const puzzle = this.puzzles[puzzleNumber];
    if (!puzzle || !puzzle.hints) {
        return "حاول التفكير بطريقة مختلفة...";
    }
    
    // التأكد أن hintLevel رقم صحيح
    hintLevel = parseInt(hintLevel) || 0;
    
    // بعد التلميح الثالث، تبدأ التلميحات تكون أكثر تحديًا
    if (hintLevel >= 3) {
        const advancedHints = [
            "أنت قريب جداً من الحل... فكر خارج الصندوق",
            "الجواب أمامك لكنه يحتاج نظرة مختلفة وزاوية جديدة",
            "آخر تلميح: حاول كتابة الإجابة بطريقة مختلفة أو مرادفات"
        ];
        return advancedHints[Math.min(hintLevel - 3, advancedHints.length - 1)];
    }
    
    // التأكد أننا لا نتجاوز حدود المصفوفة
    if (hintLevel < puzzle.hints.length) {
        return puzzle.hints[hintLevel];
    } else {
        return puzzle.hints[puzzle.hints.length - 1];
    }
}
