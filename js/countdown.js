// =====================================================
// WEDDING PAGE COUNTDOWN
// =====================================================

const WeddingPageCountdown = {
  // CHANGE THIS DATE/TIME TO YOUR WEDDING DATE
  targetDate: new Date("2026-09-23T16:00:00"),

  init() {
    this.days = document.getElementById("pageCountdownDays");
    this.hours = document.getElementById("pageCountdownHours");
    this.minutes = document.getElementById("pageCountdownMinutes");
    this.seconds = document.getElementById("pageCountdownSeconds");

    if (!this.days || !this.hours || !this.minutes || !this.seconds) {
      console.error("Wedding Page Countdown: boxes not found.");
      return;
    }

    this.update();

    this.timer = setInterval(() => {
      this.update();
    }, 1000);

    console.log("Wedding Page Countdown started.");
  },

  update() {
    const now = Date.now();
    const difference = this.targetDate - now;

    if (difference <= 0) {
      this.days.textContent = "00";
      this.hours.textContent = "00";
      this.minutes.textContent = "00";
      this.seconds.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.days.textContent = String(days).padStart(2, "0");
    this.hours.textContent = String(hours).padStart(2, "0");
    this.minutes.textContent = String(minutes).padStart(2, "0");
    this.seconds.textContent = String(seconds).padStart(2, "0");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  WeddingPageCountdown.init();
});

/* =========================================================
   MEHENDI NEXT → WEDDING PAGE
   SMOOTH FADE IN
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const mehandiPage = document.getElementById("mehandiPage");
  const mehandiNext = document.getElementById("mehandiNext");
  const weddingPage = document.getElementById("weddingPages");

  if (!mehandiPage || !mehandiNext || !weddingPage) {
    return;
  }

  mehandiNext.addEventListener("click", function () {

    /* Start Mehendi fade out */
    mehandiPage.classList.add("mehandi-leaving");

    /* Wait for fade to finish */
    setTimeout(function () {

      /* Hide Mehendi */
      mehandiPage.classList.remove("is-active");
      mehandiPage.classList.remove("mehandi-leaving");

      /* Show Wedding */
            /* Show Wedding */
      weddingPage.classList.add("is-active");
      weddingPage.classList.add("wedding-entering");

      /* Clean transition class after animation */
      setTimeout(function () {
        weddingPage.classList.remove("wedding-entering");
      }, 1200);

    }, 800);

  });

});


/* =========================================================
   WEDDING NEXT → WALEEMA PAGE
   SMOOTH FADE + VIDEO PLAY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const weddingPage = document.getElementById("weddingPages");
  const weddingNext = document.getElementById("weddingNext");
  const waleemaPage = document.getElementById("waleema-screen");

  const waleemaVideo =
    document.getElementById("waleemaVideo") ||
    document.getElementById("waleema-video");

  if (!weddingPage || !weddingNext || !waleemaPage) {
    console.error("Waleema navigation elements not found.");
    return;
  }

  let openingWaleema = false;

  weddingNext.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    /*
      If Previous was just clicked, do not reopen Waleema.
    */
    if (window.waleemaReturningToWedding) {
      return;
    }

    if (openingWaleema) {
      return;
    }

    if (waleemaPage.classList.contains("is-active")) {
      return;
    }

    openingWaleema = true;

    console.log("Wedding Next clicked — opening Waleema.");

    /* Start video from the beginning */
    if (waleemaVideo) {
      waleemaVideo.pause();
      waleemaVideo.currentTime = 0;
    }

    /* Fade Wedding page out */
    weddingPage.classList.add("wedding-leaving");

    setTimeout(function () {
      /* Hide Wedding page */
      weddingPage.classList.remove("is-active");
      weddingPage.classList.remove("wedding-leaving");

      /* Show Waleema page */
      waleemaPage.classList.add("is-active");
      waleemaPage.classList.add("waleema-entering");
      waleemaPage.setAttribute("aria-hidden", "false");

      /* Play Waleema video */
      if (waleemaVideo) {
        waleemaVideo.pause();
        waleemaVideo.currentTime = 0;
        waleemaVideo.load();

        const playPromise = waleemaVideo.play();

        if (playPromise !== undefined) {
          playPromise.catch(function (error) {
            console.error("Waleema video could not play:", error);
          });
        }
      }

      /* Finish Waleema fade-in */
setTimeout(function () {
  waleemaPage.classList.remove("waleema-entering");

  // Allow Wedding → Waleema to work again later
  openingWaleema = false;

}, 1000);

}, 800);
});
});