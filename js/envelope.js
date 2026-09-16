const Envelope = {
  init() {
    this.screen = document.getElementById("envelopeScreen");
    this.trigger = document.getElementById("envelope");

    if (!this.screen || !this.trigger) {
      console.error("Envelope: required elements not found.");
      return;
    }

    this.trigger.addEventListener("click", () => this.open());

    this.trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.open();
      }
    });

    console.log("Envelope initialized successfully.");
  },

  open() {
    if (
      this.trigger.classList.contains("is-open") ||
      this.trigger.classList.contains("is-pressing")
    ) {
      return;
    }

    /* First: press the seal */
    this.trigger.classList.add("is-pressing");

    /* Then: open the envelope */
    window.setTimeout(() => {
      this.trigger.classList.remove("is-pressing");
      this.trigger.classList.add("is-open");
    }, 650);

    /* Fade to invitation after the opening animation */
    window.setTimeout(() => {
      this.screen.classList.add("is-hidden");
      document.body.classList.remove("is-locked");

      window.dispatchEvent(
        new CustomEvent("envelope:opened")
      );
    }, 4150);

    if (Music.audio && !Music.isPlaying) {
  Music.audio.play().then(() => {
    Music.isPlaying = true;
    Music.toggle.classList.add("is-playing");
    Music.toggle.classList.remove("is-hidden");
    Music.toggle.setAttribute("aria-pressed", "true");
    Music.toggle.textContent = "Ⅱ";
  }).catch(() => {
    console.log("Music needs a tap to start.");
  });
}

    /* Remove the opening screen completely */
    window.setTimeout(() => {
      this.screen.setAttribute("aria-hidden", "true");
      this.screen.style.display = "none";
    }, 5250);
  }
};