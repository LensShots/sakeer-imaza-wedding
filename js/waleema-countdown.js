(function () {
  "use strict";

  const WaleemaPage = {
    // TEMPORARY DATE — change this later to the real Waleema date
    targetDate: new Date("2026-09-27T12:31:00").getTime(),

    init() {

      this.isReturningToWedding = false;
      this.screen = document.getElementById("waleema-screen");

      this.video =
        document.getElementById("waleema-video") ||
        document.getElementById("waleemaVideo");

      this.controls = document.getElementById("waleemaControls");
      this.countdown = document.getElementById("waleemaCountdown");

      this.previousButton = document.getElementById("waleemaPrev");

if (this.previousButton) {
  this.previousButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    window.waleemaReturningToWedding = true;

    this.goBackToWedding();
  });


}

      this.days = document.getElementById("waleemaDays");
      this.hours = document.getElementById("waleemaHours");
      this.minutes = document.getElementById("waleemaMinutes");
      this.seconds = document.getElementById("waleemaSeconds");

      if (!this.screen) {
        console.error("Waleema: #waleema-screen not found.");
        return;
      }

      if (!this.video) {
        console.error("Waleema: video not found.");
        return;
      }

      if (
        !this.controls ||
        !this.countdown ||
        !this.days ||
        !this.hours ||
        !this.minutes ||
        !this.seconds
      ) {
        console.error("Waleema: countdown elements not found.");
        return;
      }

      // Hide countdown before the video reaches 9 seconds
      this.controls.classList.remove("visible");
      this.countdown.classList.remove("visible");

      // Start countdown calculation immediately
      this.updateCountdown();

      this.timer = setInterval(() => {
        this.updateCountdown();
      }, 1000);

      this.video.addEventListener("timeupdate", () => {
        this.checkVideoTime();
      });

      this.video.addEventListener("loadedmetadata", () => {
        this.checkVideoTime();
      });

      this.video.addEventListener("seeked", () => {
        this.checkVideoTime();
      });

      console.log("Waleema countdown initialized.");
    },

    checkVideoTime() {
      if (this.video.currentTime >= 9) {
        this.showControls();
      }
    },

    showControls() {
      this.controls.classList.add("visible");
      this.countdown.classList.add("visible");
      this.screen.classList.add("controls-visible");

      console.log("Waleema countdown visible.");
    },

  goBackToWedding() {
  if (this.isReturningToWedding) {
    return;
  }

  this.isReturningToWedding = true;
  window.waleemaReturningToWedding = true;

  const waleemaScreen = document.getElementById("waleema-screen");

  const weddingPages =
    document.getElementById("weddingPages") ||
    document.getElementById("wedding-pages") ||
    document.getElementById("weddingPage");

  if (!waleemaScreen || !weddingPages) {
    console.error("Waleema: Wedding page not found.");
    return;
  }

  /* Stop Waleema video */
  if (this.video) {
    this.video.pause();
    this.video.currentTime = 0;
  }

  /* Stop countdown timer */
  if (this.timer) {
    clearInterval(this.timer);
  }

  /* Fade out Waleema */
  waleemaScreen.classList.add("is-leaving");

  setTimeout(() => {
    /* Hide Waleema completely */
    waleemaScreen.classList.remove("is-active");
    waleemaScreen.classList.remove("controls-visible");
    waleemaScreen.style.display = "none";
    waleemaScreen.setAttribute("aria-hidden", "true");

    /* Show Wedding completely */
    weddingPages.style.display = "block";
    weddingPages.classList.add("is-active");
    weddingPages.classList.remove("wedding-leaving");
    weddingPages.style.opacity = "1";
    weddingPages.style.visibility = "visible";
    weddingPages.setAttribute("aria-hidden", "false");

    /* Remove fade class */
    waleemaScreen.classList.remove("is-leaving");

    console.log("Returned to Wedding page without reopening Waleema.");

    /*
      Remove the protection after the transition.
      This allows Wedding → Waleema to work again later.
    */
    setTimeout(() => {
      window.waleemaReturningToWedding = false;
      this.isReturningToWedding = false;
    }, 1500);

  }, 900);
},
    

    updateCountdown() {
      const difference = this.targetDate - Date.now();

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      WaleemaPage.init();
    });
  } else {
    WaleemaPage.init();
  }
})();