
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const question = document.getElementById("question");
const message = document.getElementById("message");
const emoji = document.getElementById("emoji");

const mainCard = document.getElementById("mainCard");
const plannerCard = document.getElementById("plannerCard");
const finalCard = document.getElementById("finalCard");

const dateSelect = document.getElementById("dateSelect");
const timeSelect = document.getElementById("timeSelect");

const stepCounter = document.getElementById("stepCounter");
const progressFill = document.getElementById("progressFill");

let noClicks = 0;

let selectedLocation = "";
let selectedFood = "";

const messages = [
      {
            text: "مطمئنی؟ یکم بیشتر فکر کن! 🥺",
            emoji: "🥺💗"
      },
      {
            text: "ولی من فکر می‌کنم دوست داری بیای! ❤️",
            emoji: "🥹💕"
      },
      {
            text: "نکن دیگه! دلمو نشکن! 😭",
            emoji: "😭💔"
      },
      {
            text: "قول میدم بهترین دیت عمرت بشه! 🥰",
            emoji: "😍🌹"
      },
      {
            text: "فقط یه دکمه مونده که باید بزنی! 😂",
            emoji: "😏❤️"
      },
      {
            text: "دیگه نمی‌تونی نه بگی! 😈💕",
            emoji: "😈💖"
      }
];


// --------------------------------
// دکمه نه: کوچک شدن و حرکت تصادفی
// --------------------------------


noBtn.addEventListener("click", () => {

      noClicks++;

      const yesScale = Math.min(1 + noClicks * 0.35, 3);
      const noScale = Math.max(1 - noClicks * 0.15, 0);

      // بزرگ شدن دکمه بله
      yesBtn.style.transform = `scale(${yesScale})`;

      // کوچک شدن دکمه نه
      noBtn.style.transform = `scale(${noScale})`;

      // تغییر پیام
      const index = Math.min(noClicks - 1, messages.length - 1);

      message.textContent = messages[index].text;
      emoji.textContent = messages[index].emoji;

      // محاسبه محدوده کارت
      const card = mainCard;
      const cardRect = card.getBoundingClientRect();

      noBtn.style.position = "absolute";
      noBtn.style.right = "auto";
      noBtn.style.bottom = "auto";
      noBtn.style.margin = "0";

      const scale = noScale;

      const btnWidth = noBtn.offsetWidth * scale;
      const btnHeight = noBtn.offsetHeight * scale;

      const padding = 15;

      const maxX = card.clientWidth - btnWidth - padding * 2;
      const maxY = card.clientHeight - btnHeight - padding * 2;

      let randomX;
      let randomY;

      let safePosition = false;

      const yesRect = yesBtn.getBoundingClientRect();

      // انتخاب موقعیت تصادفی بدون برخورد با بله
      for (let i = 0; i < 100; i++) {

            randomX = padding + Math.random() * Math.max(0, maxX);
            randomY = padding + Math.random() * Math.max(0, maxY);

            const candidate = {
                  left: cardRect.left + randomX,
                  right: cardRect.left + randomX + btnWidth,
                  top: cardRect.top + randomY,
                  bottom: cardRect.top + randomY + btnHeight
            };

            const margin = 20;

            const overlapsYes =
                  candidate.left < yesRect.right + margin &&
                  candidate.right > yesRect.left - margin &&
                  candidate.top < yesRect.bottom + margin &&
                  candidate.bottom > yesRect.top - margin;

            if (!overlapsYes) {
                  safePosition = true;
                  break;
            }

      }

      if (safePosition) {

            noBtn.style.left = randomX + "px";
            noBtn.style.top = randomY + "px";

      }

      // حذف دکمه نه بعد از ۷ بار
      if (noClicks >= 7) {

            noBtn.style.display = "none";

            question.textContent = "خب دیگه انتخابت مشخصه! 😂❤️";

            message.textContent = "حالا فقط یه گزینه باقی مونده!";

      }

});


// --------------------------------
// دکمه بله
// --------------------------------

yesBtn.addEventListener("click", () => {

      mainCard.classList.add("hidden");

      plannerCard.classList.remove("hidden");

      generateDates();

      showStep(1);

      for (let i = 0; i < 35; i++) {

            setTimeout(createHeart, i * 100);

      }

});


// --------------------------------
// ساخت تاریخ های شمسی
// --------------------------------

function generateDates() {

      const persianDateFormatter = new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
            }
      );

      const weekdayFormatter = new Intl.DateTimeFormat(
            "fa-IR",
            {
                  weekday: "long"
            }
      );

      const today = new Date();

      today.setDate(today.getDate() + 1);

      for (let i = 0; i < 7; i++) {

            const date = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + i,
                  12
            );

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            const dateValue = `${year}-${month}-${day}`;

            const persianDate = persianDateFormatter.format(date);

            const weekday = weekdayFormatter.format(date);

            const option = document.createElement("option");

            option.value = dateValue;

            option.textContent = `${weekday} - ${persianDate}`;

            dateSelect.appendChild(option);

      }

}


// --------------------------------
// مدیریت مراحل
// --------------------------------

function showStep(stepNumber) {

      document.querySelectorAll(".step").forEach(step => {

            step.classList.remove("active");

      });

      document.getElementById(`step${stepNumber}`)
            .classList.add("active");

      stepCounter.textContent = `مرحله ${stepNumber} از ۳`;

      progressFill.style.width = `${stepNumber / 3 * 100}%`;

}


// --------------------------------
// مرحله اول: تاریخ و ساعت
// --------------------------------

document.getElementById("next1").addEventListener("click", () => {

      if (!dateSelect.value) {

            alert("اول یه تاریخ قشنگ انتخاب کن! ❤️");

            return;

      }

      if (!timeSelect.value) {

            alert("ساعت قرارمون رو هم انتخاب کن! ⏰");

            return;

      }

      showStep(2);

});


// --------------------------------
// انتخاب مکان
// --------------------------------

function setupOptions(containerId, callback) {

      const options = document.querySelectorAll(
            `#${containerId} .option`
      );

      options.forEach(option => {

            option.addEventListener("click", () => {

                  options.forEach(item => {

                        item.classList.remove("selected");

                  });

                  option.classList.add("selected");

                  callback(option.dataset.value);

            });

      });

}


setupOptions("locationOptions", value => {

      selectedLocation = value;

});


document.getElementById("next2").addEventListener("click", () => {

      if (!selectedLocation) {

            alert("اول مکان دیت رو انتخاب کن! 📍");

            return;

      }

      showStep(3);

});


// --------------------------------
// انتخاب غذا
// --------------------------------

setupOptions("foodOptions", value => {

      selectedFood = value;

});


// --------------------------------
// برگشت به مراحل قبل
// --------------------------------

document.getElementById("back2").addEventListener("click", () => {

      showStep(1);

});

document.getElementById("back3").addEventListener("click", () => {

      showStep(2);

});


// --------------------------------
// نهایی کردن برنامه دیت
// --------------------------------

document.getElementById("finishBtn").addEventListener("click", () => {

      if (!selectedFood) {

            alert("خب حالا بگو چی بخوریم! 🍕");

            return;

      }

      const selectedDate = new Date(
            dateSelect.value + "T12:00:00"
      );

      const finalDate = new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric"
            }
      ).format(selectedDate);

      const finalTime = timeSelect.options[
            timeSelect.selectedIndex
      ].textContent;

      document.getElementById("finalDate").textContent = finalDate;

      document.getElementById("finalTime").textContent = finalTime;

      document.getElementById("finalLocation").textContent =
            selectedLocation;

      document.getElementById("finalFood").textContent =
            selectedFood;

      plannerCard.classList.add("hidden");

      finalCard.classList.remove("hidden");

      for (let i = 0; i < 60; i++) {

            setTimeout(createHeart, i * 100);

      }

});


// --------------------------------
// ساخت قلب های شناور
// --------------------------------

function createHeart() {

      const heart = document.createElement("div");

      heart.classList.add("heart");

      heart.innerHTML = ["❤️", "💗", "💕", "💖", "💘"][
            Math.floor(Math.random() * 5)
      ];

      heart.style.left = Math.random() * 100 + "vw";

      heart.style.fontSize = (15 + Math.random() * 25) + "px";

      heart.style.animationDuration = (3 + Math.random() * 4) + "s";

      document.getElementById("hearts").appendChild(heart);

      setTimeout(() => {

            heart.remove();

      }, 7000);

}


// قلب های پس زمینه

setInterval(createHeart, 700);
