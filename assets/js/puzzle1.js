// puzzle1.js
// منطق لغز 1: تهيئة اللوحة، التحقق من الرمز، وإظهار زر التالي

(function () {
  "use strict";

  // غيّر هذا إلى الرمز الصحيح للغز 1
  var CORRECT_CODE = "CHECKMATE";

  // تهيئة عناصر الصفحة وربط الأحداث
  function initPuzzle1() {
    var board = document.getElementById("puzzle1-board");
    var input = document.getElementById("puzzle1-code");
    var verifyBtn = document.getElementById("btn-verify-code");
    var msg = document.getElementById("verify-message");
    var btnNext = document.getElementById("btn-next");

    // مثال: رسم محتوى افتراضي للوحة
    if (board && !board.dataset.inited) {
      board.dataset.inited = "1";
      var p = document.createElement("p");
      p.textContent = "تخيل هنا موضع قطع الشطرنج المطلوبة لحل اللغز.";
      board.appendChild(p);
    }

    if (verifyBtn) {
      verifyBtn.addEventListener("click", function () {
        var value = (input && input.value ? input.value : "").trim();
        if (value.toUpperCase() === CORRECT_CODE) {
          if (msg) {
            msg.textContent = "صحيح! تم فتح المرحلة التالية.";
            msg.classList.remove("err");
            msg.classList.add("ok");
          }
          // تحدّث الحالة إلى solved
          try {
            var key = window.STORAGE_KEYS ? window.STORAGE_KEYS.puzzle1 : "puzzle1_status";
            localStorage.setItem(key, "solved");
          } catch (e) {}
          // إظهار زر التالي
          if (btnNext) { btnNext.style.display = "inline-block"; }
        } else {
          if (msg) {
            msg.textContent = "الرمز غير صحيح. حاول مرة أخرى.";
            msg.classList.remove("ok");
            msg.classList.add("err");
          }
          if (btnNext) { btnNext.style.display = "none"; }
        }
        // تحديث واجهة التقدّم لو رجع للرئيسية
        if (window.updateProgressUI) {
          window.updateProgressUI();
        }
      });
    }

    // الانتقال للمرحلة التالية (ضع مسار لغز 2 عندما تجهزه)
    if (btnNext) {
      btnNext.addEventListener("click", function () {
        // مؤقتاً نرجع للرئيسية لو ما فيه لغز 2
        window.goNext("index.html");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // تأكد من تهيئة التخزين العام أولاً
    if (window.initHashesIfEmpty) {
      window.initHashesIfEmpty();
    }
    initPuzzle1();
  });

})();
