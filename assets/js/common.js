// common.js
// وظائف مشتركة: تهيئة التخزين، أزرار ابدأ/تصفير، الانتقال بين الصفحات، حالة التقدّم

(function () {
  "use strict";

  // أسماء المفاتيح في التخزين المحلي
  var STORAGE_KEYS = {
    puzzle1: "puzzle1_status" // values: locked | unlocked | solved
  };

  // تهيئة الحالة إذا كانت فارغة
  function initHashesIfEmpty() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.puzzle1)) {
        localStorage.setItem(STORAGE_KEYS.puzzle1, "locked");
      }
    } catch (e) {
      console.log("localStorage is not available");
    }
  }

  // تحديث واجهة التقدّم في الصفحة الرئيسية
  function updateProgressUI() {
    var el = document.getElementById("puzzle1-status");
    if (!el) { return; }
    var status = localStorage.getItem(STORAGE_KEYS.puzzle1) || "locked";
    if (status === "solved") {
      el.textContent = "مكتمل ✅";
    } else if (status === "unlocked") {
      el.textContent = "مفتوح ⏳";
    } else {
      el.textContent = "غير مكتمل";
    }
  }

  // انتقال للصفحات
  function goNext(path) {
    window.location.href = path;
  }

  // تصفير التقدّم
  function resetProgress() {
    try {
      localStorage.removeItem(STORAGE_KEYS.puzzle1);
      alert("تم التصفير بنجاح");
    } catch (e) {
      alert("تعذّر التصفير");
    }
    updateProgressUI();
  }

  // سماح للملفات الأخرى باستدعاء الدوال
  window.initHashesIfEmpty = initHashesIfEmpty;
  window.updateProgressUI = updateProgressUI;
  window.goNext = goNext;
  window.resetProgress = resetProgress;
  window.STORAGE_KEYS = STORAGE_KEYS;

  // تشغيل عند تحميل الصفحة
  document.addEventListener("DOMContentLoaded", function () {
    initHashesIfEmpty();

    // ربط أزرار الصفحة الرئيسية إن وجدت
    var btnStart = document.getElementById("btn-start");
    var btnReset = document.getElementById("btn-reset");

    if (btnStart) {
      btnStart.addEventListener("click", function () {
        // افتح أول لغز واعتبره unlocked
        try {
          localStorage.setItem(STORAGE_KEYS.puzzle1, "unlocked");
        } catch (e) {}
        goNext("puzzle-1-chess.html");
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", function () {
        resetProgress();
      });
    }

    // زر الرجوع من صفحات الألغاز
    var btnBackHome = document.getElementById("btn-back-home");
    if (btnBackHome) {
      btnBackHome.addEventListener("click", function () {
        goNext("index.html");
      });
    }

    updateProgressUI();
  });

})();
