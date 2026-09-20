/* =========================================================
   MEHENDI EVENT PAGE
   Navigation + Countdown
   ========================================================= */

const MehandiPage = {

  /* =======================================================
     MEHENDI DATE
     CHANGE THIS LATER TO THE REAL MEHENDI DATE/TIME
     ======================================================= */

  targetDate: new Date("2026-09-22T18:30:00").getTime(),


  /* =======================================================
     INITIALIZE
     ======================================================= */

  init() {

    this.page = document.getElementById("mehandiPage");
    this.previousButton = document.getElementById("weddingPrevious");
    this.video = document.getElementById("mehandiVideo");

    this.days = document.getElementById("mehandiCountdownDays");
    this.hours = document.getElementById("mehandiCountdownHours");
    this.minutes = document.getElementById("mehandiCountdownMinutes");
    this.seconds = document.getElementById("mehandiCountdownSeconds");


    /* Check page */

    if (!this.page) {
      console.error("Mehendi: page not found.");
      return;
    }


    /* Check countdown */

    if (
      !this.days ||
      !this.hours ||
      !this.minutes ||
      !this.seconds
    ) {
      console.error("Mehendi: countdown boxes not found.");
      return;
    }


    /* Previous button */

    if (this.previousButton) {

      this.previousButton.addEventListener("click", () => {
        this.open();
      });

    }


    /* Start countdown */

    this.updateCountdown();

    this.timer = setInterval(() => {
      this.updateCountdown();
    }, 1000);


    console.log("Mehendi page initialized successfully.");

  },


  /* =======================================================
     OPEN MEHENDI PAGE
     ======================================================= */

  open() {

    if (this.page.classList.contains("is-active")) {
      return;
    }


    console.log("Opening Mehendi page...");


    this.page.classList.add("is-active");

    this.page.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add("mehandi-open");


    /* Restart video */

    if (this.video) {

      this.video.currentTime = 0;

      const playPromise = this.video.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {

          console.log(
            "Mehendi video playback waiting for browser permission."
          );

        });

      }

    }

  },


  /* =======================================================
     COUNTDOWN
     ======================================================= */

  updateCountdown() {

    const now = Date.now();

    const difference =
      this.targetDate - now;


    /* Wedding/event time reached */

    if (difference <= 0) {

      this.days.textContent = "00";
      this.hours.textContent = "00";
      this.minutes.textContent = "00";
      this.seconds.textContent = "00";

      return;

    }


    const totalSeconds =
      Math.floor(difference / 1000);


    const days =
      Math.floor(
        totalSeconds / 86400
      );


    const hours =
      Math.floor(
        (totalSeconds % 86400) / 3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );


    const seconds =
      totalSeconds % 60;


    this.days.textContent =
      String(days).padStart(2, "0");


    this.hours.textContent =
      String(hours).padStart(2, "0");


    this.minutes.textContent =
      String(minutes).padStart(2, "0");


    this.seconds.textContent =
      String(seconds).padStart(2, "0");

  }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    MehandiPage.init();
  }
);